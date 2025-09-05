
export const fileToBase64 = (file: File): Promise<{ mimeType: string; data: string }> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const mimeType = result.split(',')[0].split(':')[1].split(';')[0];
      const data = result.split(',')[1];
      if (mimeType && data) {
        resolve({ mimeType, data });
      } else {
        reject(new Error("Failed to parse file data."));
      }
    };
    reader.onerror = (error) => reject(error);
  });
