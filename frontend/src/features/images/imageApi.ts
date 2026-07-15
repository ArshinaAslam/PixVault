import axiosInstance from "../../api/axiosInstance";
import type { ImageItem } from "./image.types";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}


interface PaginatedImages {
  images: ImageItem[];
  total: number;
  page: number;
  totalPages: number;
}

export const getMyUploadsApi = async (page: number, limit: number): Promise<PaginatedImages> => {
  const res = await axiosInstance.get<ApiResponse<PaginatedImages>>(
    `/images/my-uploads?page=${page}&limit=${limit}`
  );
  return res.data.data;
};

export const uploadImagesApi = async (
  items: { file: File; title: string }[]
): Promise<ImageItem[]> => {
  const formData = new FormData();
  items.forEach(({ file }) => formData.append("images", file));
  formData.append("titles", JSON.stringify(items.map((i) => i.title)));

  const res = await axiosInstance.post<ApiResponse<ImageItem[]>>("/images/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
};



export const updateImageApi = async (imageId: string, title: string): Promise<ImageItem> => {
  const res = await axiosInstance.patch<ApiResponse<ImageItem>>(`/images/${imageId}`, { title });
  return res.data.data;
};

export const replaceImageApi = async (
  imageId: string,
  file: File,
  title?: string
): Promise<ImageItem> => {
  const formData = new FormData();
  formData.append("image", file);
  if (title) formData.append("title", title);

  const res = await axiosInstance.put<ApiResponse<ImageItem>>(
    `/images/${imageId}/replace`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return res.data.data;
};

export const deleteImageApi = async (imageId: string): Promise<void> => {
  await axiosInstance.delete(`/images/${imageId}`);
};

export const reorderImagesApi = async (
  order: { imageId: string; order: number }[]
): Promise<void> => {
  await axiosInstance.patch("/images/reorder", { order });
};