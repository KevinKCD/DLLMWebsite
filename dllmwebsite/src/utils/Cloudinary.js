export const uploadToCloudinary = async (file, folder = "") => {
  if (!file) return null;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "thumbnail_preset");
  if (folder) formData.append("folder", folder);

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/df602ad8b/image/upload",
    { method: "POST", body: formData }
  );

  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.secure_url;
};