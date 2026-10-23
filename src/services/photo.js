/**
 * Shrinks a captured photo data URL so a whole complaint document stays well
 * under the 256 KiB per-document cap of the db capability.
 * Resolves the input unchanged if it is not a data URL, or null if decoding fails.
 */
export function compressPhoto(dataUrl, maxDim = 640, quality = 0.6) {
  return new Promise((resolve) => {
    if (!dataUrl || !dataUrl.startsWith("data:")) { resolve(dataUrl); return; }
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > height && width > maxDim) {
        height = Math.round(height * (maxDim / width));
        width = maxDim;
      } else if (height > maxDim) {
        width = Math.round(width * (maxDim / height));
        height = maxDim;
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d").drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => resolve(null);
    img.src = dataUrl;
  });
}
