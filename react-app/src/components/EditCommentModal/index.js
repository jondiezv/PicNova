import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { editComment } from "../../store/comments";
// import "./EditCommentModal.css";

function EditCommentModal({ commentId, initialComment, closeModal }) {
  const dispatch = useDispatch();
  const [editedComment, setEditedComment] = useState(initialComment);
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = async () => {
    setIsEditing(true);

    await dispatch(editComment(commentId, editedComment));

    setIsEditing(false);
    closeModal();
  };

  const handleCancelClick = () => {
    closeModal();
  };

  return (
    <div className="edit-comment-modal">
      <h3>Edit Your Comment</h3>
      <textarea
        rows="4"
        cols="50"
        value={editedComment}
        onChange={(e) => setEditedComment(e.target.value)}
      />
      <div className="modal-buttons">
        <button
          onClick={handleEdit}
          className={`save ${isEditing ? "disabled" : ""}`}
          disabled={isEditing}
        >
          {isEditing ? "Saving..." : "Save"}
        </button>
        <button onClick={handleCancelClick} className="cancel">
          Cancel
        </button>
      </div>
    </div>
  );
}

export default EditCommentModal;
