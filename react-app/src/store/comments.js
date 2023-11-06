const GET_COMMENTS_BY_POST_ID = "comments/GET_COMMENTS_BY_POST_ID";

const getCommentsByPostIdAction = (comments) => ({
  type: GET_COMMENTS_BY_POST_ID,
  payload: comments,
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
    default:
      return state;
  }
};

export default commentsReducer;
