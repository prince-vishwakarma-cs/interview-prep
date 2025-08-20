const DeleteAlertContent = ({ content, onDelete }) => {
  return (
    <div className="w-full max-w-md p-6 sm:p-8 rounded-2xl bg-card-bg">
      <h3 className="text-lg font-semibold text-primary-text">
        Confirm Deletion
      </h3>

      <p className="text-sm text-secondary-text mt-2 mb-6">
        {content ||
          "Are you sure you want to delete this item? This action cannot be undone."}
      </p>

      <div className="flex justify-end gap-3 mt-4">
        <button
          type="button"
          className="px-6 py-2 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors"
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default DeleteAlertContent;
