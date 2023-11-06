const GET_COMMENTS_BY_POST_ID = "comments/GET_COMMENTS_BY_POST_ID";
const CREATE_COMMENT = "comments/CREATE_COMMENT";
const EDIT_COMMENT = "comments/EDIT_COMMENT";

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
    const data = await response.json();
    dispatch(editCommentAction(data));
  } catch (error) {
    console.error("Error editing comment:", error);
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
      const editedCommentIndex = state.commentsByPostId.findIndex(
        (comment) => comment.id === action.payload.id
      );
      if (editedCommentIndex !== -1) {
        const updatedComments = [...state.commentsByPostId];
        updatedComments[editedCommentIndex] = action.payload;
        return {
          ...state,
          commentsByPostId: updatedComments,
        };
      }
      return state;
    default:
      return state;
  }
};

export default commentsReducer;
