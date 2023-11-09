import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { editComment } from "../../store/comments";
import "./EditcommentModal.css";

function EditCommentModal({
  postId,
  commentId,
  initialComment,
  closeModal,
  onSuccessEdit,
}) {
  const dispatch = useDispatch();
  const [editedComment, setEditedComment] = useState(initialComment);
  const [isEditing, setIsEditing] = useState(false);
  const [isEmptyComment, setIsEmptyComment] = useState(false);

  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleEdit = async () => {
    setIsEditing(true);

    if (editedComment.trim() === "") {
      setIsEmptyComment(true);
      setIsEditing(false);
      return;
    }

    try {
      const result = await dispatch(editComment(commentId, editedComment));
      if (result && isMounted.current) {
        onSuccessEdit(result);
      }
    } catch (error) {
      if (isMounted.current) {
        console.error("Failed to edit comment:", error);
      }
    } finally {
      if (isMounted.current) {
        setIsEditing(false);
        closeModal();
      }
    }
  };

  const handleCancelClick = () => {
    closeModal();
  };

  return (
    <div className="edit-comment-modal">
      <h3>Edit Your Comment</h3>
      <textarea
        className="edit-comment-txt"
        rows="4"
        cols="50"
        value={editedComment}
        onChange={(e) => {
          setEditedComment(e.target.value);
          setIsEmptyComment(false);
        }}
      />
      {isEmptyComment && (
        <p className="validation-error">Comment must not be empty.</p>
      )}
      <div className="modal-buttons">
        <button
          onClick={handleEdit}
          className={`save ${isEditing || isEmptyComment ? "disabled" : ""}`}
          disabled={isEditing || isEmptyComment}
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
