export interface ImageItem {
  _id: string;
  imageUrl: string;
  title: string;
  order: number;
  createdAt: string;
}

export interface UploadFileWithTitle {
  file: File;
  title: string;
}