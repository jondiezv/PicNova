import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { getPostById } from "../../store/posts";
import DeletePostModal from "../DeletePostModal";
import { useModal } from "../../context/Modal";

const PostDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const currentPost = useSelector((state) => state.posts.currentPost);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { closeModal, setModalContent } = useModal();
  const history = useHistory();

  useEffect(() => {
    dispatch(getPostById(id));
  }, [dispatch, id]);

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleCancelClick = () => {
    setShowDeleteModal(false);
    setModalContent(null);
  };

  const handlePostDeletion = () => {
    setTimeout(() => {
      history.push("/");
    }, 1000);
  };

  return (
    <div>
      {currentPost ? (
        <div>
          <h2>{currentPost.title}</h2>
          <p>{currentPost.description}</p>
          <div>
            {currentPost.image_urls.map((imageUrl) => (
              <img key={imageUrl} src={imageUrl} alt="Post Image" />
            ))}
          </div>
          <button onClick={handleDeleteClick}>Delete Post</button>
          {showDeleteModal && (
            <DeletePostModal
              postId={currentPost.id}
              closeModal={() => {
                handleCancelClick();
                handlePostDeletion();
              }}
            />
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default PostDetails;
