const {
    generateSingleFilePresignedUrl,
    initiateMultipartUpload,
    getPresignedUrlForPart,
    completeMultipartUpload,
  } = require('../config/videoUploadConfig');

  const { VideoUpload } = require('../models');


  // Controller for single file upload
    const singleFileUpload = async (req, res) => {
        try {
        const { fileName, contentType } = req.body;
        const fileKey = `uploads/videos/${fileName}`;
        const signedUrl = await generateSingleFilePresignedUrl(fileKey, contentType);
        res.status(200).json({ signedUrl, fileKey });
        } catch (error) {
        console.error('Error generating presigned URL for single file upload:', error);
        res.status(500).json({ message: 'Error generating presigned URL for single file upload' });
        }
    };
  
  
  // Controller to handle multipart upload initiation
  const initiateUpload = async (req, res) => {
    try {
      const { fileName, contentType } = req.body;
      const fileKey = `uploads/videos/${fileName}`;
      const uploadId = await initiateMultipartUpload(fileKey, contentType);
      res.status(200).json({ uploadId, fileKey });
    } catch (error) {
      console.error('Error initiating multipart upload:', error);
      res.status(500).json({ message: 'Error initiating multipart upload' });
    }
  };
  
  // Controller to generate a presigned URL for a part
  const getPresignedUrl = async (req, res) => {
    try {
      const { fileKey, uploadId, partNumber, contentType } = req.body;
      const signedUrl = await getPresignedUrlForPart(fileKey, uploadId, partNumber, contentType);
      res.status(200).json({ signedUrl });
    } catch (error) {
      console.error('Error generating presigned URL:', error);
      res.status(500).json({ message: 'Error generating presigned URL' });
    }
  };
  
  // Controller to complete the multipart upload
  const completeUpload = async (req, res) => {
    try {
      const { fileKey, uploadId, parts } = req.body;
      const fileUrl = await completeMultipartUpload(fileKey, uploadId, parts);
      res.status(200).json({ fileUrl });
    } catch (error) {
      console.error('Error completing multipart upload:', error);
      res.status(500).json({ message: 'Error completing multipart upload' });
    }
  };

  // Save file details after upload
  const saveFileDetails = async (req, res) => {
    try {
      const { fileKey, userId, userClientJobInterviewAttemptId, fileSize } = req.body;
  
      const bucketName = process.env.NODE_ENV === 'production'
        ? process.env.S3_VIDEO_BUCKET_NAME_PROD
        : process.env.S3_VIDEO_BUCKET_NAME_DEV;
  
      // Construct the file URL
      const fileUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
  
      // Create a record in the VideoUploads table
      const savedRecord = await VideoUpload.create({
        user_id: userId,
        user_client_job_interview_attempt_id: userClientJobInterviewAttemptId,
        file_url: fileUrl,
        file_size: fileSize,
        // compression_status defaults to 'Uncompressed'
        // created_at and updated_at default to NOW
      }, {
        returning: ['id', 'user_id', 'user_client_job_interview_attempt_id', 'file_url', 'file_size', 'compression_status', 'created_at', 'updated_at'], // Exclude 'interview_id'
      });
  
      res.status(200).json({ message: 'File details saved successfully', data: savedRecord });
    } catch (error) {
      console.error('Error saving file details:', error);
      res.status(500).json({ message: 'Error saving file details' });
    }
  };

  // Controller to fetch all video uploads
  const getAllVideoUploads = async (req, res) => {
    try {
      const videoUploads = await VideoUpload.findAll({
        attributes: [
          'id',
          'user_id',
          'user_client_job_interview_attempt_id',
          'file_url',
          'file_size',
          'compression_status',
          'created_at',
          'updated_at',
        ],
      }

      );
      return res.status(200).json(videoUploads);
    } catch (error) {
      console.error('Error fetching all video uploads:', error);
      return res.status(500).json({ message: 'Error fetching video uploads', error });
    }
  };

  // Controller to fetch a video upload by ID
  const getVideoUploadById = async (req, res) => {
    const { id } = req.params;
    try {
      const videoUpload = await VideoUpload.findByPk(id,{
        attributes: [
          'id',
          'user_id',
          'user_client_job_interview_attempt_id',
          'file_url',
          'file_size',
          'compression_status',
          'created_at',
          'updated_at',
        ],
      }

      );
      if (!videoUpload) {
        return res.status(404).json({ message: 'Video upload not found' });
      }
      return res.status(200).json(videoUpload);
    } catch (error) {
      console.error('Error fetching video upload by ID:', error);
      return res.status(500).json({ message: 'Error fetching video upload', error });
    }
  };

  // Controller to fetch video uploads by userClientJobInterviewAttemptId
  const getVideoUploadByAttemptId = async (req, res) => {
    const { attemptId } = req.params;
    try {
      const videoUploads = await VideoUpload.findAll({
        where: { user_client_job_interview_attempt_id: attemptId },
        attributes: [
          'id',
          'user_id',
          'user_client_job_interview_attempt_id',
          'file_url',
          'file_size',
          'compression_status',
          'created_at',
          'updated_at',
        ],

      });

      if (!videoUploads || videoUploads.length === 0) {
        return res.status(404).json({ message: 'No video uploads found for the given attempt ID' });
      }

      return res.status(200).json(videoUploads);
    } catch (error) {
      console.error('Error fetching video uploads by attempt ID:', error);
      return res.status(500).json({ message: 'Error fetching video uploads', error });
    }
  };
  
  module.exports = {
    singleFileUpload,
    initiateUpload,
    getPresignedUrl,
    completeUpload,
    saveFileDetails,
    getAllVideoUploads,
    getVideoUploadById,
    getVideoUploadByAttemptId
  };
  