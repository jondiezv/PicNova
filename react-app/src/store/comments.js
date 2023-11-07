const GET_COMMENTS_BY_POST_ID = "comments/GET_COMMENTS_BY_POST_ID";
const CREATE_COMMENT = "comments/CREATE_COMMENT";
const EDIT_COMMENT = "comments/EDIT_COMMENT";
const DELETE_COMMENT = "comments/DELETE_COMMENT";

const getCommentsByPostIdAction = (comments) => ({
  type: GET_COMMENTS_BY_POST_ID,
  payload: comments,
});

const createCommentAction = (comment) => ({
  type: CREATE_COMMENT,
  payload: comment,
});

const editCommentAction = (comment) => ({
  type: EDIT_COMMENT,
  payload: comment,
});

const deleteCommentAction = (commentId) => ({
  type: DELETE_COMMENT,
  payload: commentId,
});

export const getCommentsByPostId = (postId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/posts/${postId}/comments`);
    if (!response.ok) throw response;
    const data = await response.json();
    dispatch(getCommentsByPostIdAction(data));
  } catch (error) {
    console.error("Error getting comments by post ID:", error);
  }
};

export const createComment = (postId, commentText) => async (dispatch) => {
  try {
    const response = await fetch(`/api/comments/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        post_id: postId,
        comment: commentText,
      }),
    });
    if (!response.ok) throw response;
    const data = await response.json();
    dispatch(createCommentAction(data));
    return data;
  } catch (error) {
    console.error("Error creating comment:", error);
    throw error;
  }
};

export const editComment = (commentId, commentText) => async (dispatch) => {
  try {
    const response = await fetch(`/api/comments/edit/${commentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        comment: commentText,
      }),
    });
    if (!response.ok) throw response;
    const editedComment = await response.json();
    dispatch(editCommentAction(editedComment));
    return editedComment;
  } catch (error) {
    console.error("Error editing comment:", error);
    throw error;
  }
};

export const deleteComment = (commentId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/comments/delete/${commentId}`, {
      method: "DELETE",
    });
    if (!response.ok) throw response;
    dispatch(deleteCommentAction(commentId));
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
};

const initialState = {
  commentsByPostId: [],
};

const commentsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_COMMENTS_BY_POST_ID:
      return {
        ...state,
        commentsByPostId: action.payload,
      };
    case CREATE_COMMENT:
      return {
        ...state,
        commentsByPostId: [...state.commentsByPostId, action.payload],
      };
    case EDIT_COMMENT:
      return {
        ...state,
        commentsByPostId: state.commentsByPostId.map((comment) =>
          comment.id === action.payload.id ? action.payload : comment
        ),
      };
    case DELETE_COMMENT:
      return {
        ...state,
        commentsByPostId: state.commentsByPostId.filter(
          (comment) => comment.id !== action.payload
        ),
      };
    default:
      return state;
  }
};

export default commentsReducer;
