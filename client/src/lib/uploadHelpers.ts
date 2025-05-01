// Function to upload product images
export async function uploadProductImages(files: File[]): Promise<{ url: string }[]> {
  try {
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload/product-image', {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header, let the browser set it with boundary
      });
      
      if (!response.ok) {
        throw new Error(`Failed to upload image: ${response.statusText}`);
      }
      
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Failed to upload image');
      }
      
      return result.files[0];
    });
    
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error uploading product images:', error);
    throw error;
  }
}

// Function to upload user avatar
export async function uploadAvatar(file: File): Promise<{ url: string }> {
  try {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await fetch('/api/upload/avatar', {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header, let the browser set it with boundary
    });
    
    if (!response.ok) {
      throw new Error(`Failed to upload avatar: ${response.statusText}`);
    }
    
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || 'Failed to upload avatar');
    }
    
    return result.avatar;
  } catch (error) {
    console.error('Error uploading avatar:', error);
    throw error;
  }
}

// Function to handle image compression before upload (optional)
export async function compressImage(file: File, maxWidthOrHeight: number = 1200): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Calculate new dimensions while maintaining aspect ratio
        if (width > height && width > maxWidthOrHeight) {
          height = Math.round(height * maxWidthOrHeight / width);
          width = maxWidthOrHeight;
        } else if (height > maxWidthOrHeight) {
          width = Math.round(width * maxWidthOrHeight / height);
          height = maxWidthOrHeight;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Convert to file
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Failed to compress image'));
            return;
          }
          
          const compressedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now()
          });
          
          resolve(compressedFile);
        }, 'image/jpeg', 0.85); // 85% quality
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image for compression'));
      };
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file for compression'));
    };
  });
}