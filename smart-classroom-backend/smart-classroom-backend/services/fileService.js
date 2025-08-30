/**
 * File Service
 * Handles file uploads, storage, and management with AWS S3 integration
 */

const AWS = require('aws-sdk');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const { FILE_SIZE_LIMITS, ALLOWED_FILE_TYPES } = require('../utils/constants');

class FileService {
  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION || 'us-east-1'
    });
    
    this.bucketName = process.env.AWS_S3_BUCKET || 'scms-files';
    this.localStoragePath = process.env.LOCAL_STORAGE_PATH || 'uploads';
    this.useS3 = process.env.USE_S3 === 'true';
  }

  /**
   * Configure multer for file uploads
   */
  configureMulter(options = {}) {
    const storage = multer.memoryStorage(); // Store in memory for processing

    const fileFilter = (req, file, cb) => {
      const allowedTypes = options.allowedTypes || ALLOWED_FILE_TYPES.DOCUMENTS;
      const fileExtension = path.extname(file.originalname).toLowerCase().slice(1);
      
      if (allowedTypes.includes(fileExtension)) {
        cb(null, true);
      } else {
        cb(new Error(`File type .${fileExtension} is not allowed`), false);
      }
    };

    const limits = {
      fileSize: options.maxFileSize || FILE_SIZE_LIMITS.DEFAULT,
      files: options.maxFiles || 10
    };

    return multer({
      storage,
      fileFilter,
      limits
    });
  }

  /**
   * Upload single file
   */
  async uploadFile(file, options = {}) {
    try {
      const {
        folder = 'general',
        generateThumbnail = false,
        compress = false
      } = options;

      // Generate unique filename
      const fileExtension = path.extname(file.originalname);
      const fileName = `${uuidv4()}${fileExtension}`;
      const filePath = `${folder}/${fileName}`;

      let processedBuffer = file.buffer;

      // Process image files
      if (this.isImageFile(file.mimetype)) {
        if (compress) {
          processedBuffer = await this.compressImage(file.buffer, file.mimetype);
        }

        if (generateThumbnail) {
          await this.generateThumbnail(file.buffer, folder, fileName);
        }
      }

      let fileUrl;
      
      if (this.useS3) {
        fileUrl = await this.uploadToS3(processedBuffer, filePath, file.mimetype);
      } else {
        fileUrl = await this.uploadToLocal(processedBuffer, filePath);
      }

      return {
        originalName: file.originalname,
        fileName,
        fileUrl,
        fileSize: processedBuffer.length,
        mimeType: file.mimetype,
        uploadDate: new Date()
      };
    } catch (error) {
      console.error('File upload error:', error);
      throw new Error(`File upload failed: ${error.message}`);
    }
  }

  /**
   * Upload multiple files
   */
  async uploadFiles(files, options = {}) {
    const uploadPromises = files.map(file => this.uploadFile(file, options));
    return await Promise.all(uploadPromises);
  }

  /**
   * Upload file to AWS S3
   */
  async uploadToS3(buffer, filePath, mimeType) {
    const params = {
      Bucket: this.bucketName,
      Key: filePath,
      Body: buffer,
      ContentType: mimeType,
      ACL: 'public-read'
    };

    const result = await this.s3.upload(params).promise();
    return result.Location;
  }

  /**
   * Upload file to local storage
   */
  async uploadToLocal(buffer, filePath) {
    const fullPath = path.join(this.localStoragePath, filePath);
    const directory = path.dirname(fullPath);

    // Ensure directory exists
    await fs.mkdir(directory, { recursive: true });

    // Write file
    await fs.writeFile(fullPath, buffer);

    return `/uploads/${filePath}`;
  }

  /**
   * Delete file
   */
  async deleteFile(fileUrl) {
    try {
      if (this.useS3 && fileUrl.includes('amazonaws.com')) {
        // Extract key from S3 URL
        const urlParts = fileUrl.split('/');
        const key = urlParts.slice(-2).join('/'); // Get folder/filename
        
        await this.s3.deleteObject({
          Bucket: this.bucketName,
          Key: key
        }).promise();
      } else {
        // Delete from local storage
        const localPath = path.join(process.cwd(), 'public', fileUrl);
        await fs.unlink(localPath);
      }
    } catch (error) {
      console.error('File deletion error:', error);
      // Don't throw error for file deletion failures
    }
  }

  /**
   * Delete multiple files
   */
  async deleteFiles(fileUrls) {
    const deletePromises = fileUrls.map(url => this.deleteFile(url));
    await Promise.allSettled(deletePromises);
  }

  /**
   * Compress image
   */
  async compressImage(buffer, mimeType) {
    let sharpInstance = sharp(buffer);

    // Resize if too large
    const metadata = await sharpInstance.metadata();
    if (metadata.width > 1920 || metadata.height > 1080) {
      sharpInstance = sharpInstance.resize(1920, 1080, {
        fit: 'inside',
        withoutEnlargement: true
      });
    }

    // Compress based on format
    if (mimeType === 'image/jpeg') {
      return await sharpInstance.jpeg({ quality: 85 }).toBuffer();
    } else if (mimeType === 'image/png') {
      return await sharpInstance.png({ compressionLevel: 8 }).toBuffer();
    } else if (mimeType === 'image/webp') {
      return await sharpInstance.webp({ quality: 85 }).toBuffer();
    }

    return buffer;
  }

  /**
   * Generate thumbnail
   */
  async generateThumbnail(buffer, folder, fileName) {
    try {
      const thumbnailBuffer = await sharp(buffer)
        .resize(300, 300, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .jpeg({ quality: 80 })
        .toBuffer();

      const thumbnailName = `thumb_${fileName}`;
      const thumbnailPath = `${folder}/thumbnails/${thumbnailName}`;

      if (this.useS3) {
        await this.uploadToS3(thumbnailBuffer, thumbnailPath, 'image/jpeg');
      } else {
        await this.uploadToLocal(thumbnailBuffer, thumbnailPath);
      }

      return thumbnailPath;
    } catch (error) {
      console.error('Thumbnail generation error:', error);
      // Don't fail the upload if thumbnail generation fails
    }
  }

  /**
   * Get file info
   */
  async getFileInfo(fileUrl) {
    try {
      if (this.useS3 && fileUrl.includes('amazonaws.com')) {
        const urlParts = fileUrl.split('/');
        const key = urlParts.slice(-2).join('/');
        
        const headResult = await this.s3.headObject({
          Bucket: this.bucketName,
          Key: key
        }).promise();

        return {
          size: headResult.ContentLength,
          lastModified: headResult.LastModified,
          contentType: headResult.ContentType
        };
      } else {
        const localPath = path.join(process.cwd(), 'public', fileUrl);
        const stats = await fs.stat(localPath);
        
        return {
          size: stats.size,
          lastModified: stats.mtime,
          contentType: this.getMimeType(path.extname(localPath))
        };
      }
    } catch (error) {
      throw new Error(`Failed to get file info: ${error.message}`);
    }
  }

  /**
   * Generate signed URL for temporary access (S3 only)
   */
  async getSignedUrl(fileUrl, expiresIn = 3600) {
    if (!this.useS3) {
      return fileUrl; // Local files don't need signed URLs
    }

    try {
      const urlParts = fileUrl.split('/');
      const key = urlParts.slice(-2).join('/');

      return await this.s3.getSignedUrlPromise('getObject', {
        Bucket: this.bucketName,
        Key: key,
        Expires: expiresIn
      });
    } catch (error) {
      throw new Error(`Failed to generate signed URL: ${error.message}`);
    }
  }

  /**
   * Scan file for viruses (placeholder for integration with antivirus service)
   */
  async scanFile(buffer) {
    // Integrate with antivirus service like ClamAV or VirusTotal
    // For now, return clean status
    return {
      clean: true,
      threats: []
    };
  }

  /**
   * Extract metadata from file
   */
  async extractMetadata(file) {
    const metadata = {
      originalName: file.originalname,
      size: file.size,
      mimeType: file.mimetype,
      extension: path.extname(file.originalname).toLowerCase()
    };

    // Extract additional metadata for images
    if (this.isImageFile(file.mimetype)) {
      try {
        const imageMetadata = await sharp(file.buffer).metadata();
        metadata.dimensions = {
          width: imageMetadata.width,
          height: imageMetadata.height
        };
        metadata.format = imageMetadata.format;
      } catch (error) {
        console.error('Image metadata extraction error:', error);
      }
    }

    return metadata;
  }

  /**
   * Utility functions
   */
  isImageFile(mimeType) {
    return mimeType.startsWith('image/');
  }

  isVideoFile(mimeType) {
    return mimeType.startsWith('video/');
  }

  isAudioFile(mimeType) {
    return mimeType.startsWith('audio/');
  }

  isDocumentFile(mimeType) {
    const documentTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'text/rtf'
    ];
    return documentTypes.includes(mimeType);
  }

  getMimeType(extension) {
    const mimeTypes = {
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.txt': 'text/plain',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.mp4': 'video/mp4',
      '.mp3': 'audio/mpeg'
    };
    return mimeTypes[extension] || 'application/octet-stream';
  }

  /**
   * Get storage usage statistics
   */
  async getStorageStats() {
    try {
      if (this.useS3) {
        // Get S3 bucket size (this is an approximation)
        const objects = await this.s3.listObjects({
          Bucket: this.bucketName
        }).promise();

        const totalSize = objects.Contents.reduce((sum, obj) => sum + obj.Size, 0);
        const fileCount = objects.Contents.length;

        return {
          totalSize,
          fileCount,
          averageFileSize: fileCount > 0 ? totalSize / fileCount : 0
        };
      } else {
        // Calculate local storage usage
        return await this.calculateLocalStorageUsage(this.localStoragePath);
      }
    } catch (error) {
      console.error('Storage stats error:', error);
      return { totalSize: 0, fileCount: 0, averageFileSize: 0 };
    }
  }

  async calculateLocalStorageUsage(dirPath) {
    let totalSize = 0;
    let fileCount = 0;

    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        
        if (entry.isDirectory()) {
          const subStats = await this.calculateLocalStorageUsage(fullPath);
          totalSize += subStats.totalSize;
          fileCount += subStats.fileCount;
        } else {
          const stats = await fs.stat(fullPath);
          totalSize += stats.size;
          fileCount++;
        }
      }
    } catch (error) {
      // Directory might not exist
    }

    return {
      totalSize,
      fileCount,
      averageFileSize: fileCount > 0 ? totalSize / fileCount : 0
    };
  }
}

module.exports = new FileService();
