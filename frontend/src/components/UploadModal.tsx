import { useState, type ChangeEvent, type DragEvent, type FormEvent } from 'react';

interface UploadModalProps {
  onClose: () => void;
  onUpload: (items: { file: File; title: string }[]) => Promise<void>;
}

interface FileEntry {
  file: File;
  title: string;
  previewUrl: string;
}

const UploadModal = ({ onClose, onUpload }: UploadModalProps) => {
  const [entries, setEntries] = useState<FileEntry[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const addFiles = (fileList: FileList | File[]) => {
    const files = Array.from(fileList).filter((file) => file.type.startsWith('image/'));
    const newEntries = files.map((file) => ({
      file,
      title: file.name.replace(/\.[^/.]+$/, ''),
      previewUrl: URL.createObjectURL(file),
    }));
    setEntries((prev) => [...prev, ...newEntries]);
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(e.target.files);
    e.target.value = '';
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
  };

  const handleTitleChange = (index: number, title: string) => {
    setEntries((prev) => prev.map((entry, i) => (i === index ? { ...entry, title } : entry)));
  };

  const handleRemoveEntry = (index: number) => {
    setEntries((prev) => {
      URL.revokeObjectURL(prev[index].previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!entries.length) {
      setError('Select at least one image');
      return;
    }
    if (entries.some((entry) => !entry.title.trim())) {
      setError('Every image needs a title');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await onUpload(entries.map(({ file, title }) => ({ file, title })));
      onClose();
    } catch (err) {
      console.error('Upload failed', err);
      setError('Upload failed — please try again');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="upload-modal-overlay" onClick={onClose}>
      <form className="upload-modal-card" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <div className="upload-modal-header">
          <h2>Upload Images</h2>
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
          className={`upload-dropzone ${isDragging ? 'is-dragging' : ''}`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <input type="file" accept="image/*" multiple onChange={handleFileSelect} hidden />
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 16V4M12 4L7 9M12 4L17 9M4 16V18a2 2 0 002 2h12a2 2 0 002-2v-2"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="upload-dropzone-title">Drop images here or click to browse</span>
          <span className="upload-dropzone-hint">JPG, PNG, WEBP, AVIF — up to 20 images</span>
        </label>

        {entries.length > 0 && (
          <div className="upload-entry-grid">
            {entries.map((entry, index) => (
              <div className="upload-entry-card" key={entry.previewUrl}>
                <div className="upload-entry-thumb">
                  <img src={entry.previewUrl} alt={entry.title} />
                  <button
                    type="button"
                    className="upload-entry-remove"
                    onClick={() => handleRemoveEntry(index)}
                    aria-label="Remove image"
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
                </div>
                <input
                  className="upload-entry-title"
                  value={entry.title}
                  onChange={(e) => handleTitleChange(index, e.target.value)}
                  placeholder="Image title"
                />
              </div>
            ))}
          </div>
        )}

        <div className="upload-modal-actions">
          <span className="upload-modal-count">
            {entries.length ? `${entries.length} image${entries.length > 1 ? 's' : ''} selected` : ''}
          </span>
          <div className="upload-modal-buttons">
            <button type="button" className="upload-btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="upload-btn-primary" disabled={submitting}>
              {submitting ? 'Uploading…' : `Upload${entries.length ? ` (${entries.length})` : ''}`}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UploadModal;