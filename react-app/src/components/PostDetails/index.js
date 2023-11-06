import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { getPostById } from "../../store/posts";
import { getCommentsByPostId } from "../../store/comments";
import DeletePostModal from "../DeletePostModal";
import { useModal } from "../../context/Modal";

const PostDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const currentPost = useSelector((state) => state.posts.currentPost);
  const comments = useSelector((state) => state.comments.commentsByPostId);
  const user = useSelector((state) => state.session.user);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { closeModal, setModalContent } = useModal();
  const history = useHistory();

  useEffect(() => {
    dispatch(getPostById(id));
    dispatch(getCommentsByPostId(id));
  }, [dispatch, id]);

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleEditClick = () => {
    history.push(`/post/${id}/edit`);
  };

  const handleCancelClick = () => {
    setShowDeleteModal(false);
    setModalContent(null);
  };

  const isUserLoggedIn = !!user;
  const isCurrentUserPost = isUserLoggedIn && currentPost?.user_id === user?.id;

  useEffect(() => {
    console.log("currentPost:", currentPost);
    console.log("comments:", comments);
  }, [currentPost, comments]);

  return (
    <div>
      {currentPost ? (
        <div>
          <h2>{currentPost.title}</h2>
          <p>{currentPost.description}</p>
          <div>
            {currentPost.image_urls?.map((imageUrl) => (
              <img key={imageUrl} src={imageUrl} alt="Post Image" />
            ))}
          </div>
          {isCurrentUserPost && isUserLoggedIn && (
            <>
              <button onClick={handleDeleteClick}>Delete Post</button>
              <button onClick={handleEditClick}>Edit</button>{" "}
            </>
          )}
          {showDeleteModal && (
            <DeletePostModal
              postId={currentPost.id}
              closeModal={() => {
                handleCancelClick();
              }}
            />
          )}

          <div>
            <h3>Comments</h3>
            <ul>
              {comments.map((comment) => (
                <li key={comment.id}>{comment.comment}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default PostDetails;
