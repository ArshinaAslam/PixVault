import { useState, type ChangeEvent, type DragEvent, type FormEvent } from "react";
import type { ImageItem } from "../features/images/image.types";

interface EditModalProps {
  image: ImageItem;
  onClose: () => void;
  onSave: (imageId: string, file: File | null, title: string) => Promise<void>;
}

const EditModal = ({ image, onClose, onSave }: EditModalProps) => {
  const [title, setTitle] = useState(image.title);
  const [newFile, setNewFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(image.imageUrl);
  const [isDragging, setIsDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setNewFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
    e.target.value = "";
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0]);
  };

  const handleRemovePreview = () => {
    setNewFile(null);
    setPreviewUrl(image.imageUrl); // revert to original
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await onSave(image._id, newFile, title.trim());
      onClose();
    } catch (err) {
      console.error("Update failed", err);
      setError("Update failed — please try again");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="upload-modal-overlay" onClick={onClose}>
      <form className="upload-modal-card" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <div className="upload-modal-header">
          <h2>Edit Image</h2>
          <button type="button" className="upload-modal-close" onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M1 1L17 17M17 1L1 17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {error && <p className="error-banner">{error}</p>}

        <label
          className={`upload-dropzone ${isDragging ? "is-dragging" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <input type="file" accept="image/*" onChange={handleFileSelect} hidden />
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 16V4M12 4L7 9M12 4L17 9M4 16V18a2 2 0 002 2h12a2 2 0 002-2v-2"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="upload-dropzone-title">Drop a new image to replace, or click to browse</span>
          <span className="upload-dropzone-hint">Leave unchanged to keep the current image</span>
        </label>

        <div className="upload-entry-grid">
          <div className="upload-entry-card">
            <div className="upload-entry-thumb">
              <img src={previewUrl} alt={title} />
              {newFile && (
                <button
                  type="button"
                  className="upload-entry-remove"
                  onClick={handleRemovePreview}
                  aria-label="Revert to original image"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M1 1L11 11M11 1L1 11"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              )}
            </div>
            <input
              className="upload-entry-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Image title"
            />
          </div>
        </div>

        <div className="upload-modal-actions">
          <span className="upload-modal-count">{newFile ? "New image selected" : ""}</span>
          <div className="upload-modal-buttons">
            <button type="button" className="upload-btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="upload-btn-primary" disabled={submitting}>
              {submitting ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditModal;