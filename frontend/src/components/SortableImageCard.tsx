import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ImageItem } from "../features/images/image.types";

interface SortableImageCardProps {
  image: ImageItem;
  onEdit: () => void;
  onDelete: () => void;
}

const SortableImageCard = ({ image, onEdit, onDelete }: SortableImageCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: image._id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div className="task-grid-card" ref={setNodeRef} style={style}>
      <div className="drag-handle" {...attributes} {...listeners}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="5" cy="4" r="1.3" fill="currentColor" />
          <circle cx="11" cy="4" r="1.3" fill="currentColor" />
          <circle cx="5" cy="8" r="1.3" fill="currentColor" />
          <circle cx="11" cy="8" r="1.3" fill="currentColor" />
          <circle cx="5" cy="12" r="1.3" fill="currentColor" />
          <circle cx="11" cy="12" r="1.3" fill="currentColor" />
        </svg>
      </div>

      <img
        src={image.imageUrl}
        alt={image.title}
        style={{ width: "100%", borderRadius: "10px", aspectRatio: "1", objectFit: "cover" }}
      />
      <p className="task-grid-card-title">{image.title}</p>
      <div className="task-grid-card-actions">
        <button onClick={onEdit}>Edit</button>
        <button onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
};

export default SortableImageCard;