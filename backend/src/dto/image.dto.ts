export interface ImageResponseDto {
  _id: string;
  imageUrl: string;
  title: string;
  order: number;
  createdAt: Date;
}

export interface UpdateImageDto {
  title?: string;
}

export interface ReorderImageDto {
  imageId: string;
  order: number;
}


export interface ReorderImageDto {
  imageId: string;
  order: number;
}
