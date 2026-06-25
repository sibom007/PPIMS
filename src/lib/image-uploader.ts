export const uploadImage = async (file: File | null) => {
  if (!file) {
    return;
  }
  const authRes = await fetch("/api/imagekit-auth");
  const auth = await authRes.json();

  const formData = new FormData();

  formData.append("file", file);
  formData.append("fileName", file.name);
  formData.append("publicKey", auth.publicKey);
  formData.append("signature", auth.signature);
  formData.append("expire", auth.expire);
  formData.append("token", auth.token);

  const response = await fetch(
    "https://upload.imagekit.io/api/v1/files/upload",
    {
      method: "POST",
      body: formData,
    },
  );

  const result = await response.json();

  return result.url;
};
