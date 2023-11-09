import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { getPostById } from "../../store/posts";
import { getCommentsByPostId, createComment } from "../../store/comments";
import DeletePostModal from "../DeletePostModal";
import { useModal } from "../../context/Modal";
import EditCommentModal from "../EditCommentModal";
import DeleteCommentModal from "../DeleteCommentModal";
import "./PostDetails.css";

const maxCommentLength = 200;
const PostDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const currentPost = useSelector((state) => state.posts.currentPost);
  const comments = useSelector((state) => state.comments.commentsByPostId);
  const user = useSelector((state) => state.session.user);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { closeModal, setModalContent } = useModal();
  const history = useHistory();

  const [commentText, setCommentText] = useState("");
  const [commentLength, setCommentLength] = useState(0);
  const [showDeleteCommentModal, setShowDeleteCommentModal] = useState(false);
  const [commentToDeleteId, setCommentToDeleteId] = useState(null);

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

  const handleCommentSubmit = async () => {
    if (commentText.trim() !== "" && commentText.length <= maxCommentLength) {
      const newComment = await dispatch(createComment(id, commentText));
      if (newComment) {
        setCommentText("");
        setCommentLength(0);
        dispatch(getCommentsByPostId(id));
      }
    }
  };

  const handleDeleteCommentClick = (commentId) => {
    setCommentToDeleteId(commentId);
    setShowDeleteCommentModal(true);
  };

  const handleCommentEdit = (commentId) => {
    const commentToEdit = comments.find((comment) => comment.id === commentId);

    if (commentToEdit) {
      setModalContent(
        <EditCommentModal
          postId={id}
          commentId={commentId}
          initialComment={commentToEdit.comment}
          closeModal={() => setModalContent(null)}
          onSuccessEdit={() => {
            closeModal();
            dispatch(getCommentsByPostId(id));
          }}
        />
      );
    }
  };

  return (
    <div className="post-details-container">
      {currentPost ? (
        <div>
          <span className="post-details-username">
            Posted by {currentPost.username}
          </span>{" "}
          <h2 className="post-details-title">{currentPost.title}</h2>
          <p className="post-details-description">{currentPost.description}</p>
          <div className="post-details-image-container">
            {currentPost.image_urls?.map((imageUrl) => (
              <img key={imageUrl} src={imageUrl} alt="Post" />
            ))}
          </div>
          {isCurrentUserPost && isUserLoggedIn && (
            <>
              <button
                className="post-details-delete-btn"
                onClick={handleDeleteClick}
              >
                Delete Post
              </button>
              <button
                className="post-details-edit-btn"
                onClick={handleEditClick}
              >
                Edit Post
              </button>
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
          <div className="post-details-comments-container">
            <h3 className="post-details-comments-title">Comments</h3>
            <div className="post-details-comments-list">
              {comments.map((comment) => (
                <div key={comment.id} className="post-details-comment-item">
                  <span className="post-details-comment-username">
                    {comment.username ? `${comment.username}: ` : ""}
                  </span>
                  <span className="post-details-comment-text">
                    {comment.comment}
                  </span>
                  {isUserLoggedIn && comment.user_id === user?.id && (
                    <div className="post-details-comment-actions">
                      <button
                        className="post-details-comment-edit-btn"
                        onClick={() => handleCommentEdit(comment.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="post-details-comment-delete-btn"
                        onClick={() => handleDeleteCommentClick(comment.id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          {isUserLoggedIn && (
            <div className="comment-form">
              <textarea
                className="comment-textarea"
                placeholder="Enter your comment"
                value={commentText}
                onChange={(e) => {
                  setCommentText(e.target.value);
                  setCommentLength(e.target.value.length);
                }}
              />
              <p className="comment-char-count">
                Characters remaining: {maxCommentLength - commentLength}
                {commentLength > maxCommentLength && (
                  <span className="comment-char-overlimit">
                    &nbsp;Too many characters! You won't be able to submit this
                    comment
                  </span>
                )}
              </p>
              <button
                className="comment-submit-btn"
                onClick={handleCommentSubmit}
              >
                Submit Comment
              </button>
            </div>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
      {showDeleteCommentModal && (
        <DeleteCommentModal
          commentId={commentToDeleteId}
          closeModal={() => {
            setShowDeleteCommentModal(false);
            setCommentToDeleteId(null);
          }}
          onSuccessDelete={() => {
            dispatch(getCommentsByPostId(id));
          }}
        />
      )}
    </div>
  );
};

export default PostDetails;
