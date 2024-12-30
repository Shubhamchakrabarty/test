const { Queue } = require('bullmq');
const IORedis = require('ioredis');
const { classifyCvText, cvScreeningCheck } = require('../services/generativeAIService');
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const {s3} = require('../config/s3Config');
const PDFExtract = require('pdf.js-extract').PDFExtract;
const { CvUploadUserJob, ClientJobScreeningRequirement, UserJob } = require('../models');

// Setup Redis connection
const connection = new IORedis({
  host: '127.0.0.1',
  port: 6379,
});

// Initialize the queue
const parseCvQueue = new Queue('parseCvQueue', { connection });

// Function to add jobs to the queue
const addParseCvJob = (jobData) => {
  return parseCvQueue.add('parseCv', jobData);
};

const getFileContent = async (fileUrl) => {
  const bucketName = process.env.NODE_ENV === 'production' ? process.env.S3_CV_BUCKET_NAME_PROD : process.env.S3_CV_BUCKET_NAME_DEV;
  const key = decodeURIComponent(fileUrl.split('/').pop());
  console.log(`Fetching file from S3 bucket: ${bucketName}, key: ${key}`);
  const params = {
    Bucket: bucketName,
    Key: key,
  };

  const command = new GetObjectCommand(params);
  const response = await s3.send(command);

  const chunks = [];
  for await (const chunk of response.Body) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
};

const extractTextFromPdf = async (pdfBuffer) => {
  const pdfExtract = new PDFExtract();
  const options = {}; // You can specify options here if needed
  return new Promise((resolve, reject) => {
    pdfExtract.extractBuffer(pdfBuffer, options, (err, data) => {
      if (err) return reject(err);
      let textContent = '';
      data.pages.forEach(page => {
        page.content.forEach(item => {
          textContent += item.str + ' ';
        });
        textContent += '\n';
      });
      resolve(textContent);
    });
  });
};

// Function to process the job
const processParseCv = async (jobData) => {
  const { user_id, job_id, file_url } = jobData;
  try {
    const fileContentBuffer = await getFileContent(file_url);
    console.log('CV File Content fetched');

    const extractedText = await extractTextFromPdf(fileContentBuffer);
    console.log('Extracted CV Text Content:', extractedText);
    
    const clientJobScreeningRequirements = await ClientJobScreeningRequirement.findOne({
      where: { job_id }
    });

    // Classify the CV text into sections
    let classifiedData;
    try {
      classifiedData = await classifyCvText(extractedText, 'full_cv_v2');
      // console.log('Classified CV Data:', classifiedData);
    } catch (error) {
      console.error('Error classifying CV text:', error);
      throw error; // Stop processing if classification fails
    }

    // Evaluate the CV and store the result if CV upload is required
    if(clientJobScreeningRequirements.cvUploadRequired) {
      let cvScreeningCheckData;
      let status;
      try {
        cvScreeningCheckData = await cvScreeningCheck(clientJobScreeningRequirements.cvScreeningInstructions, JSON.stringify(classifiedData));
        let score, satisfiedInstructionsCount = 0, totalInstructionsCount = 0;
        cvScreeningCheckData.job_requirements_status.forEach(requirement => {
          totalInstructionsCount++;
          if(requirement.satisfied) satisfiedInstructionsCount++;
        })
        score = satisfiedInstructionsCount / totalInstructionsCount;

        if(score === 1) {
          status = 'CV Matched';
        } else if(score === 0) {
          status = 'CV Not Matched';
        } else {
          status = 'CV Partially Matched'; 
        }
        // Update the status of user job to indicate CV match
        await UserJob.update({ status }, { where: { user_id, job_id } });

        // Update the cv_assessment_system to store the cv screening evaluation
        await CvUploadUserJob.update({ cv_assessment_system: JSON.stringify(cvScreeningCheckData) }, { where: { user_id, job_id } });

        console.log('CV Screening Check:', JSON.stringify(cvScreeningCheckData));
      } catch (error) {
        console.error('Error checking CV for requirements:', error);
      }
    }

    // Save classified data in parsed_cv field in CvUploadUserJob model
    try {
      await CvUploadUserJob.update({ parsed_cv: JSON.stringify(classifiedData) }, { where: { user_id, job_id } });
      console.log('Classified CV data saved successfully');
    } catch (error) {
      console.error('Error saving classified CV data:', error);
    }
    console.log('CV processing complete');
  } catch (error) {
    console.error('Error processing CV:', error);
  }
};

module.exports = { addParseCvJob, processParseCv };