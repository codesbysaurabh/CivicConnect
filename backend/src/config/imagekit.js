import ImageKit from 'imagekit';
import { env } from './env.js';

export const imagekit = new ImageKit({
  publicKey: env.imagekit.publicKey,
  privateKey: env.imagekit.privateKey,
  urlEndpoint: env.imagekit.urlEndpoint,
});

/** Upload an image buffer; returns { url, thumbnailUrl, fileId }. */
export async function uploadImage({ buffer, fileName, tags = [] }) {
  const res = await imagekit.upload({
    file: buffer,
    fileName,
    folder: env.imagekit.folder,
    useUniqueFileName: true,
    tags,
  });
  return { url: res.url, thumbnailUrl: res.thumbnailUrl, fileId: res.fileId };
}

export async function deleteImage(fileId) {
  if (!fileId) return;
  try {
    await imagekit.deleteFile(fileId);
  } catch (err) {
    console.warn('ImageKit delete failed:', err.message);
  }
}
