export const fileFilterGao = (
  req: Express.Request,
  file: Express.Multer.File,
  callBack: (e: Error | null, b: boolean) => void,
) => {
  const isFileImage = file.mimetype.includes('image');
  if (!isFileImage) {
    return callBack(null, false);
  }

  console.log('fileFilterGao', file);
  return callBack(null, true);
};
