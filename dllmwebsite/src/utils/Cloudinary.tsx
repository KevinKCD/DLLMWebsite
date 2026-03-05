export const uploadToCloudinary = async (
  file: File,
  folder: string = ''
): Promise<string> => {
  if (!file) return '';

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'thumbnail_preset');
  if (folder) formData.append('folder', folder);

  const res = await fetch(
    'https://api.cloudinary.com/v1_1/df602ad8b/image/upload',
    { method: 'POST', body: formData }
  );

  const data = await res.json();
  if (data.error) throw new Error(data.error.message as string);
  return data.secure_url as string;
};