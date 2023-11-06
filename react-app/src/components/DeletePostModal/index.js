import React from "react";
import { useDispatch } from "react-redux";
import { deletePost } from "../../store/posts";
import "./DeletePostModal.css";

function DeletePostModal({ postId, closeModal }) {
  const dispatch = useDispatch();

  const handleDelete = () => {
    dispatch(deletePost(postId));
    closeModal();
  };

  const handleCancelClick = () => {
    closeModal();
  };

  return (
    <div className="delete-post-modal">
      <h3>Are you sure you want to delete this post?</h3>
      <div className="modal-buttons">
        <button onClick={handleDelete} className="yes">
          Yes, banish it
        </button>
        <button onClick={handleCancelClick} className="no">
          No! I clicked by mistake
        </button>
      </div>
    </div>
  );
}

export default DeletePostModal;
