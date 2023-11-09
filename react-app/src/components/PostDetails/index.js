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

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "numeric", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

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
  const [isCommentPosting, setIsPostingComment] = useState(false);
  const [commentDate, setCommentDate] = useState("Loading...");

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
      setIsPostingComment(true);
      setCommentDate("Posting comment...");
      try {
        const newComment = await dispatch(createComment(id, commentText));
        if (newComment) {
          setCommentText("");
          setCommentLength(0);
          dispatch(getCommentsByPostId(id));
        }
      } catch (error) {
        console.error("Failed to post comment:", error);
      } finally {
        setIsPostingComment(false);
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
        <>
          <span className="post-details-username">
            Posted by {currentPost.username} at{" "}
            {formatDate(currentPost.created_at)}
          </span>
          <h2 className="post-details-title">{currentPost.title}</h2>
          <p className="post-details-description">{currentPost.description}</p>
          <div className="post-details-image-container">
            {currentPost.image_urls?.map((imageUrl) => (
              <img key={imageUrl} src={imageUrl} alt="Post" />
            ))}
          </div>
          {isCurrentUserPost && (
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
              closeModal={handleCancelClick}
            />
          )}
          <div className="post-details-comments-container">
            <h3 className="post-details-comments-title">Comments</h3>
            <div className="post-details-comments-list">
              {comments.map((comment) => (
                <div key={comment.id} className="post-details-comment-item">
                  <span className="post-details-comment-username">
                    {comment.username ? ` ${comment.username} ` : ""}•{" "}
                    {comment.created_at
                      ? formatDate(comment.created_at)
                      : "Posting..."}
                  </span>
                  <span className="post-details-comment-text">
                    {comment.comment}
                  </span>
                  {user?.id === comment.user_id && (
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
              {isCommentPosting && (
                <div className="post-details-comment-item">
                  Posting comment...
                </div>
              )}
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
                    Too many characters! You won't be able to submit this
                    comment.
                  </span>
                )}
              </p>
              <button
                className="comment-submit-btn"
                onClick={handleCommentSubmit}
                disabled={commentLength > maxCommentLength || isCommentPosting}
              >
                Submit Comment
              </button>
            </div>
          )}
        </>
      ) : (
        <p>Loading...</p>
      )}
      {showDeleteCommentModal && (
        <DeleteCommentModal
          commentId={commentToDeleteId}
          closeModal={() => setShowDeleteCommentModal(false)}
          onSuccessDelete={() => dispatch(getCommentsByPostId(id))}
        />
      )}
    </div>
  );
};

export default PostDetails;
