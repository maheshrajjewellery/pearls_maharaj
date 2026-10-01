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
