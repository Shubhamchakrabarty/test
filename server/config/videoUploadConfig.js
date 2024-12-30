const { s3 } = require('./s3Config');
const {
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  PutObjectCommand,
} = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const bucketName = process.env.NODE_ENV === 'production' ? process.env.S3_VIDEO_BUCKET_NAME_PROD : process.env.S3_VIDEO_BUCKET_NAME_DEV;


// Function to generate presigned URL for single file upload
const generateSingleFilePresignedUrl = async (fileKey, contentType) => {
    try {
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: fileKey,
        ContentType: contentType,
      });
      const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
      return signedUrl;
    } catch (error) {
      console.error('Error generating presigned URL for single file:', error);
      throw error;
    }
  };

// Function to initiate multipart upload
const initiateMultipartUpload = async (fileKey, contentType) => {
  try {
    const command = new CreateMultipartUploadCommand({
      Bucket: bucketName,
      Key: fileKey,
      ContentType: contentType,
    });
    const response = await s3.send(command);
    return response.UploadId; // Return the upload ID
  } catch (error) {
    console.error('Error initiating multipart upload:', error);
    throw error;
  }
};

// Function to generate presigned URL for a part
const getPresignedUrlForPart = async (fileKey, uploadId, partNumber, contentType) => {
  try {
    const command = new UploadPartCommand({
      Bucket: bucketName,
      Key: fileKey,
      UploadId: uploadId,
      PartNumber: partNumber,
      ContentType: contentType,
    });
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
    return signedUrl; // Return the presigned URL
  } catch (error) {
    console.error('Error generating presigned URL for part:', error);
    throw error;
  }
};

// Function to complete multipart upload
const completeMultipartUpload = async (fileKey, uploadId, parts) => {
  try {
    const command = new CompleteMultipartUploadCommand({
      Bucket: bucketName,
      Key: fileKey,
      UploadId: uploadId,
      MultipartUpload: { Parts: parts },
    });
    const response = await s3.send(command);
    return response.Location; // Return the final file URL
  } catch (error) {
    console.error('Error completing multipart upload:', error);
    throw error;
  }
};

// Export the functions for reuse
module.exports = {
  generateSingleFilePresignedUrl,
  initiateMultipartUpload,
  getPresignedUrlForPart,
  completeMultipartUpload,
};
