const MAX_BYTES = 1_800_000;

export function readImageFileAsDataUrl(file, maxWidth = 1400) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith("image/")) {
      reject(new Error("יש לבחור קובץ תמונה"));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("לא ניתן לקרוא את הקובץ"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("תמונה לא תקינה"));
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("לא ניתן לעבד את התמונה"));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);

        let quality = 0.88;
        let dataUrl = canvas.toDataURL("image/jpeg", quality);
        while (dataUrl.length > MAX_BYTES && quality > 0.45) {
          quality -= 0.08;
          dataUrl = canvas.toDataURL("image/jpeg", quality);
        }

        if (dataUrl.length > MAX_BYTES) {
          reject(new Error("התמונה גדולה מדי. נסו תמונה קטנה יותר."));
          return;
        }

        resolve(dataUrl);
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
