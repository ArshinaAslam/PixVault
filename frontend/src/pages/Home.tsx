import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { useAppSelector } from "../hooks/useAppSelector";
import { useImages } from "../hooks/useImages";
import { useToast } from "../hooks/useToast";
import UploadModal from "../components/UploadModal";
import EditModal from "../components/EditModal";
import ConfirmDialog from "../components/ConfirmDialog";
import Toast from "../components/Toast";
import SortableImageCard from "../components/SortableImageCard";
import type { ImageItem } from "../features/images/image.types";
import ReorderModal from "../components/ReorderModal";


const Home = () => {
  const { user } = useAppSelector((state) => state.auth);
  const {
    images,
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
  } = useImages();
  const { toast, showToast, hideToast } = useToast();

  const [showUpload, setShowUpload] = useState(false);
  const [editingImage, setEditingImage] = useState<ImageItem | null>(null);
  const [deletingImage, setDeletingImage] = useState<ImageItem | null>(null);
  const [savingOrder, setSavingOrder] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const handleUpload = async (items: { file: File; title: string }[]) => {
    await upload(items);
    showToast("Images uploaded successfully");
  };

  const handleSaveEdit = async (imageId: string, file: File | null, title: string) => {
    if (file) {
      await replaceImage(imageId, file, title);
    } else {
      await updateTitle(imageId, title);
    }
    showToast("Image updated successfully");
  };

  const handleCancelOrder = () => {
  cancelOrder();
};

  const handleConfirmDelete = async () => {
    if (!deletingImage) return;
    await remove(deletingImage._id);
    setDeletingImage(null);
    showToast("Image deleted successfully");
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = images.findIndex((img) => img._id === active.id);
    const newIndex = images.findIndex((img) => img._id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    reorderLocally(oldIndex, newIndex);
  };

  const handleSaveOrder = async () => {
    setSavingOrder(true);
    try {
      await saveOrder();
      showToast("Order saved successfully");
    } catch (err) {
      console.error("Failed to save order", err);
      showToast("Failed to save order");
    } finally {
      setSavingOrder(false);
    }
  };

  return (
    <div className="home-content">
      <div className="home-header">
        <h1>Welcome back{user?.email ? `, ${user.email.split("@")[0]}` : ""}</h1>
        <button className="primary-btn" onClick={() => setShowUpload(true)}>
          + Upload Images
        </button>
      </div>

      {error && <p className="error-banner">{error}</p>}

      {loading ? (
        <p className="board-loading">Loading your uploads…</p>
      ) : images.length === 0 ? (
        <p className="chart-empty">No images uploaded yet — start by uploading your first image.</p>
      ) : (
        <>
          {orderDirty && (
  <ReorderModal saving={savingOrder} onSave={handleSaveOrder} onCancel={handleCancelOrder} />
)}

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={images.map((img) => img._id)} strategy={rectSortingStrategy}>
              <div className="task-grid">
                {images.map((image) => (
                  <SortableImageCard
                    key={image._id}
                    image={image}
                    onEdit={() => setEditingImage(image)}
                    onDelete={() => setDeletingImage(image)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {totalPages > 1 && (
            <div className="pagination">
              <button onClick={() => goToPage(page - 1)} disabled={page === 1}>
                Previous
              </button>
              <span className="pagination-info">
                Page {page} of {totalPages}
              </span>
              <button onClick={() => goToPage(page + 1)} disabled={page === totalPages}>
                Next
              </button>
            </div>
          )}
        </>
      )}

      {showUpload && <UploadModal onClose={() => setShowUpload(false)} onUpload={handleUpload} />}

      {editingImage && (
        <EditModal image={editingImage} onClose={() => setEditingImage(null)} onSave={handleSaveEdit} />
      )}

      {deletingImage && (
        <ConfirmDialog
          title="Delete image"
          message={`Are you sure you want to delete "${deletingImage.title}"? This can't be undone.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeletingImage(null)}
        />
      )}

      <Toast message={toast.message} visible={toast.visible} onClose={hideToast} />
    </div>
  );
};

export default Home;