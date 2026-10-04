import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const BUCKET_NAME = 'product-images';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export interface UploadResult {
  url: string;
  path: string;
}

export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  if (!file) {
    return { valid: false, error: 'No file selected.' };
  }

  if (!ALLOWED_TYPES.includes(file.type.toLowerCase())) {
    return {
      valid: false,
      error: 'Invalid file type. Only JPG, JPEG, PNG, and WEBP formats are allowed.',
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: 'File size exceeds maximum limit of 5MB.',
    };
  }

  return { valid: true };
};

export const uploadProductImage = async (
  file: File,
  productId: string = 'temp'
): Promise<UploadResult> => {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error || 'Image validation failed');
  }

  // If Supabase is not fully configured with live credentials, fallback to object URL / Base64 for instant demo
  if (!isSupabaseConfigured()) {
    console.warn('Supabase credentials not configured. Using temporary object URL for uploaded image.');
    const objectUrl = URL.createObjectURL(file);
    return {
      url: objectUrl,
      path: `products/${productId}/${file.name}`,
    };
  }

  const fileExt = file.name.split('.').pop()?.toLowerCase() || 'webp';
  const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const filePath = `products/${productId}/${Date.now()}_${cleanName}`;

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
      contentType: file.type || 'image/webp',
    });

  if (error) {
    console.error('Supabase storage upload error:', error);
    // Fallback if bucket doesn't exist yet or storage permission denied
    const objectUrl = URL.createObjectURL(file);
    return {
      url: objectUrl,
      path: filePath,
    };
  }

  const { data: publicUrlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(data.path);

  return {
    url: publicUrlData.publicUrl,
    path: data.path,
  };
};

export const deleteProductImage = async (imagePathOrUrl: string): Promise<boolean> => {
  if (!isSupabaseConfigured() || !imagePathOrUrl) {
    return true;
  }

  try {
    let filePath = imagePathOrUrl;
    if (imagePathOrUrl.includes(BUCKET_NAME)) {
      const parts = imagePathOrUrl.split(`${BUCKET_NAME}/`);
      if (parts.length > 1) {
        filePath = parts[1];
      }
    }

    const { error } = await supabase.storage.from(BUCKET_NAME).remove([filePath]);
    if (error) {
      console.error('Error deleting image from storage:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to delete storage image:', err);
    return false;
  }
};

export interface CMSHeroUploadResult {
  url: string;
  path: string;
  name: string;
  dimensions: string;
  sizeFormatted: string;
}

export const validateCMSHeroImage = (file: File): { valid: boolean; error?: string } => {
  if (!file) {
    return { valid: false, error: 'No file selected.' };
  }

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type.toLowerCase())) {
    return {
      valid: false,
      error: 'Unsupported file format. Please upload a JPG, JPEG, PNG, or WEBP image.',
    };
  }

  const MAX_HERO_SIZE = 10 * 1024 * 1024; // 10MB
  if (file.size > MAX_HERO_SIZE) {
    return {
      valid: false,
      error: 'File size exceeds maximum limit of 10MB.',
    };
  }

  return { valid: true };
};

export const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(objectUrl);
    };
    img.onerror = () => {
      resolve({ width: 1920, height: 1080 });
      URL.revokeObjectURL(objectUrl);
    };
    img.src = objectUrl;
  });
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

export const uploadHeroBannerImage = async (file: File): Promise<CMSHeroUploadResult> => {
  const validation = validateCMSHeroImage(file);
  if (!validation.valid) {
    throw new Error(validation.error || 'Image validation failed');
  }

  const { width, height } = await getImageDimensions(file);
  const sizeFormatted = formatFileSize(file.size);
  const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const path = `cms/homepage/hero/${Date.now()}_${cleanName}`;

  if (!isSupabaseConfigured()) {
    const objectUrl = URL.createObjectURL(file);
    return {
      url: objectUrl,
      path,
      name: file.name,
      dimensions: `${width} × ${height}`,
      sizeFormatted,
    };
  }

  const CMS_BUCKET = 'cms';

  try {
    const { data, error } = await supabase.storage
      .from(CMS_BUCKET)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type || 'image/webp',
      });

    if (error) {
      console.warn('CMS bucket upload error, attempting product-images bucket fallback:', error);
      const { data: fallbackData, error: fallbackErr } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type || 'image/webp',
        });

      if (fallbackErr) {
        throw fallbackErr;
      }

      const { data: publicUrlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(fallbackData.path);

      return {
        url: publicUrlData.publicUrl,
        path: fallbackData.path,
        name: file.name,
        dimensions: `${width} × ${height}`,
        sizeFormatted,
      };
    }

    const { data: publicUrlData } = supabase.storage
      .from(CMS_BUCKET)
      .getPublicUrl(data.path);

    return {
      url: publicUrlData.publicUrl,
      path: data.path,
      name: file.name,
      dimensions: `${width} × ${height}`,
      sizeFormatted,
    };
  } catch (err) {
    console.error('Storage upload failed, returning object URL fallback:', err);
    const objectUrl = URL.createObjectURL(file);
    return {
      url: objectUrl,
      path,
      name: file.name,
      dimensions: `${width} × ${height}`,
      sizeFormatted,
    };
  }
};

export const deleteHeroBannerImage = async (imagePathOrUrl?: string): Promise<boolean> => {
  if (!imagePathOrUrl || imagePathOrUrl.startsWith('blob:') || imagePathOrUrl.startsWith('data:') || imagePathOrUrl.startsWith('/images/')) {
    return true;
  }
  if (!isSupabaseConfigured()) {
    return true;
  }

  try {
    let filePath = imagePathOrUrl;
    if (imagePathOrUrl.includes('cms/')) {
      const parts = imagePathOrUrl.split('cms/');
      if (parts.length > 1) {
        filePath = 'cms/' + parts[1];
      }
    } else if (imagePathOrUrl.includes('product-images/')) {
      const parts = imagePathOrUrl.split('product-images/');
      if (parts.length > 1) {
        filePath = parts[1];
      }
    }

    const { error: cmsErr } = await supabase.storage.from('cms').remove([filePath]);
    if (cmsErr) {
      await supabase.storage.from(BUCKET_NAME).remove([filePath]);
    }
    return true;
  } catch (err) {
    console.warn('[Storage] Warning deleting hero banner image:', err);
    return false;
  }
};

