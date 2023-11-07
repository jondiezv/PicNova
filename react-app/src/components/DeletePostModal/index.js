import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { deletePost } from "../../store/posts";
import { useHistory } from "react-router-dom";
import "./DeletePostModal.css";

function DeletePostModal({ postId, closeModal }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await dispatch(deletePost(postId));
    closeModal();
    setTimeout(() => {
      history.push("/");
    }, 1000);
  };

  const handleCancelClick = () => {
    closeModal();
  };

  return (
    <div className="delete-post-modal">
      <h3>Are you sure you want to delete this post?</h3>
      <div className="modal-buttons">
        <button
          onClick={handleDelete}
          className={`yes ${isDeleting ? "disabled" : ""}`}
          disabled={isDeleting}
        >
          {isDeleting ? "Bye bye post!" : "Yes, banish it"}
        </button>
        <button onClick={handleCancelClick} className="no">
          No! I clicked by mistake
        </button>
      </div>
    </div>
  );
}

export default DeletePostModal;
