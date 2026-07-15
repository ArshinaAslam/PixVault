import { useState, useEffect, useCallback } from "react";
import type { ImageItem } from "../features/images/image.types";
import {
  getMyUploadsApi,
  uploadImagesApi,
  updateImageApi,
  deleteImageApi,
  replaceImageApi,
  reorderImagesApi,
} from "../features/images/imageApi";
import { arrayMove } from "@dnd-kit/sortable";

const IMAGES_PER_PAGE = 3;

export const useImages = () => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [localImages, setLocalImages] = useState<ImageItem[]>([]);
const [orderDirty, setOrderDirty] = useState(false);

useEffect(() => {
  setLocalImages(images);
  setOrderDirty(false);
}, [images]);



const reorderLocally = (fromIndex: number, toIndex: number) => {
  setLocalImages((prev) => arrayMove(prev, fromIndex, toIndex));
  setOrderDirty(true);
};

const saveOrder = async () => {
  const orderPayload = localImages.map((img, index) => ({
    imageId: img._id,
    order: index,
  }));
  await reorderImagesApi(orderPayload);
  setOrderDirty(false);
  await fetchImages(page);
};

  const fetchImages = useCallback(async (targetPage: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyUploadsApi(targetPage, IMAGES_PER_PAGE);
      setImages(data.images);
      setTotalPages(data.totalPages);
      setPage(data.page);
    } catch (err) {
      console.error("Failed to fetch images", err);
      setError("Could not load your uploads");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages(1);
  }, [fetchImages]);

  const goToPage = (targetPage: number) => {
    fetchImages(targetPage);
  };

  const upload = async (items: { file: File; title: string }[]) => {
    await uploadImagesApi(items);
    await fetchImages(1); 
  };

  const updateTitle = async (imageId: string, title: string) => {
    const updated = await updateImageApi(imageId, title);
    setImages((prev) => prev.map((img) => (img._id === imageId ? updated : img)));
  };

  const replaceImage = async (imageId: string, file: File, title?: string) => {
    const updated = await replaceImageApi(imageId, file, title);
    setImages((prev) => prev.map((img) => (img._id === imageId ? updated : img)));
  };

  const remove = async (imageId: string) => {
    await deleteImageApi(imageId);
   
    if (images.length === 1 && page > 1) {
      await fetchImages(page - 1);
    } else {
      await fetchImages(page);
    }
  };

  const cancelOrder = () => {
  setLocalImages(images);
  setOrderDirty(false);
};

  return {
  images: localImages,
  page,
  totalPages,
  loading,
  error,
  upload,
  updateTitle,
  replaceImage,
  remove,
  cancelOrder,
  goToPage,
  reorderLocally,
  saveOrder,
  orderDirty,
};
};