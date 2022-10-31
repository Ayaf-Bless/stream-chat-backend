import cloudinary, { UploadApiResponse, UploadApiErrorResponse } from "cloudinary";

interface UploadParamInterface {
  file: string;
  public_id?: string;
  overwrite?: boolean;
  invalidate: boolean;
}

export function uploads({
  file,
  invalidate,
  overwrite,
  public_id
}: UploadParamInterface): Promise<UploadApiResponse | UploadApiErrorResponse | undefined> {
  return new Promise((resolve) => {
    cloudinary.v2.uploader.upload(
      file,
      {
        public_id,
        overwrite,
        invalidate
      },
      (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
        if (error) resolve(error);
        resolve(result);
      }
    );
  });
}
