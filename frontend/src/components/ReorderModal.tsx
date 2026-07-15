interface ReorderModalProps {
  saving: boolean;
  onSave: () => void;
  onCancel: () => void;
}

const ReorderModal = ({ saving, onSave, onCancel }: ReorderModalProps) => {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h2>Save new order?</h2>
        <p className="confirm-message">
          You've rearranged your images. Save this order, or cancel to keep the original arrangement.
        </p>
        <div className="modal-actions">
          <button type="button" onClick={onCancel} disabled={saving}>
            Cancel
          </button>
          <button type="button" className="primary-btn" onClick={onSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save Order'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReorderModal;