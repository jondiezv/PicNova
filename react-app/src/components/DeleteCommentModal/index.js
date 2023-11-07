import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { deleteComment } from "../../store/comments";
import "./DeleteCommentModal.css";

function DeleteCommentModal({ commentId, closeModal, onSuccessDelete }) {
  const dispatch = useDispatch();
  const [isDeleting, setIsDeleting] = useState(false);

  const isMounted = useRef(true);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await dispatch(deleteComment(commentId));
      if (isMounted.current) {
        onSuccessDelete();
      }
    } catch (error) {
      if (isMounted.current) {
      }
    } finally {
      if (isMounted.current) {
        setIsDeleting(false);
        closeModal();
      }
    }
  };

  const handleCancelClick = () => {
    closeModal();
  };

  return (
    <div className="delete-comment-modal">
      <h3>Are you sure you want to delete this comment?</h3>
      <div className="modal-buttons">
        <button
          onClick={handleDelete}
          className={`delete ${isDeleting ? "disabled" : ""}`}
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Yes"}
        </button>
        <button onClick={handleCancelClick} className="cancel">
          Cancel
        </button>
      </div>
    </div>
  );
}

export default DeleteCommentModal;
