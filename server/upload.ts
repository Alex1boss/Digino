import path from 'path';
import { Request, Response, NextFunction } from 'express';
import fileUpload from 'express-fileupload';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure file upload middleware
export const configureFileUpload = () => {
  return fileUpload({
    createParentPath: true,
    limits: { 
      fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    abortOnLimit: true,
    useTempFiles: true,
    tempFileDir: path.join(__dirname, '../data/temp'),
    safeFileNames: true,
    preserveExtension: true
  });
};

// Ensure upload directories exist
export const ensureUploadDirs = () => {
  const dirs = [
    path.join(__dirname, '../data/uploads/products'),
    path.join(__dirname, '../data/uploads/avatars'),
    path.join(__dirname, '../data/temp')
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

// File upload handler for product images
export const handleProductImageUpload = async (req: Request, res: Response) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'No files were uploaded' 
      });
    }
    
    const uploadedFile = req.files.file;
    const files = Array.isArray(uploadedFile) ? uploadedFile : [uploadedFile];
    
    const uploadResults = await Promise.all(
      files.map(async (file) => {
        // Create a unique filename using timestamp and original name
        const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
        const uploadPath = path.join(__dirname, '../data/uploads/products', fileName);
        
        // Move the file to the upload directory
        await file.mv(uploadPath);
        
        return {
          originalName: file.name,
          fileName: fileName,
          size: file.size,
          mimetype: file.mimetype,
          // URL to access the file
          url: `/uploads/products/${fileName}`
        };
      })
    );
    
    return res.status(200).json({
      success: true,
      files: uploadResults
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to upload file'
    });
  }
};

// File upload handler for user avatars
export const handleAvatarUpload = async (req: Request, res: Response) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'No avatar image was uploaded' 
      });
    }
    
    const avatar = req.files.avatar;
    
    if (Array.isArray(avatar)) {
      return res.status(400).json({
        success: false,
        message: 'Only one avatar image can be uploaded'
      });
    }
    
    // Validate file type
    if (!avatar.mimetype.startsWith('image/')) {
      return res.status(400).json({
        success: false,
        message: 'Only image files are allowed for avatars'
      });
    }
    
    // Create a unique filename
    const fileName = `${Date.now()}-${avatar.name.replace(/\s+/g, '-')}`;
    const uploadPath = path.join(__dirname, '../data/uploads/avatars', fileName);
    
    // Move the file to the upload directory
    await avatar.mv(uploadPath);
    
    return res.status(200).json({
      success: true,
      avatar: {
        originalName: avatar.name,
        fileName: fileName,
        size: avatar.size,
        mimetype: avatar.mimetype,
        url: `/uploads/avatars/${fileName}`
      }
    });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to upload avatar'
    });
  }
};

// Express middleware to serve uploaded files
export const serveUploads = (req: Request, res: Response, next: NextFunction) => {
  // Check if the request is for an uploaded file
  if (req.path.startsWith('/uploads/')) {
    const filePath = path.join(__dirname, '..', req.path);
    
    // Check if file exists
    if (fs.existsSync(filePath)) {
      return res.sendFile(filePath);
    } else {
      return res.status(404).json({ message: 'File not found' });
    }
  }
  
  next();
};