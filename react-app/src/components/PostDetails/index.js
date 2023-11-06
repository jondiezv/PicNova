import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { getPostById } from "../../store/posts";
import { getCommentsByPostId, createComment } from "../../store/comments";
import DeletePostModal from "../DeletePostModal";
import { useModal } from "../../context/Modal";
import EditCommentModal from "../EditCommentModal";

const maxCommentLength = 80;

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

  const handleCommentSubmit = () => {
    if (commentText.trim() !== "" && commentText.length <= maxCommentLength) {
      dispatch(createComment(id, commentText));
      setCommentText("");
      setCommentLength(0);
    }
  };

  const handleCommentEdit = (commentId) => {
    const commentToEdit = comments.find((comment) => comment.id === commentId);

    if (commentToEdit) {
      setModalContent(
        <EditCommentModal
          commentId={commentId}
          initialComment={commentToEdit.comment}
          closeModal={() => setModalContent(null)}
        />
      );
    }
  };

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
                <li key={comment.id}>
                  <span className="commenter-username">
                    {comment.username ? `${comment.username}: ` : ""}
                  </span>
                  {comment.comment}
                  {isUserLoggedIn && comment.user_id === user?.id && (
                    <button onClick={() => handleCommentEdit(comment.id)}>
                      Edit
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {isUserLoggedIn && (
            <div>
              <input
                type="text"
                placeholder="Enter your comment"
                value={commentText}
                onChange={(e) => {
                  setCommentText(e.target.value);
                  setCommentLength(e.target.value.length);
                }}
              />
              <p>
                Characters remaining: {maxCommentLength - commentLength}
                {commentLength > maxCommentLength && (
                  <span style={{ color: "red" }}>
                    &nbsp;Character limit exceeded
                  </span>
                )}
              </p>
              <button onClick={handleCommentSubmit}>Submit Comment</button>
            </div>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default PostDetails;
