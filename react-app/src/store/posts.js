const GET_ALL_POSTS = "posts/GET_ALL_POSTS";

const getAllPostsAction = (posts) => ({
  type: GET_ALL_POSTS,
  payload: posts,
});

export const getAllPosts = () => async (dispatch) => {
  try {
    const response = await fetch("/api/posts");
    if (!response.ok) throw response;
    const data = await response.json();
    dispatch(getAllPostsAction(data));
  } catch (error) {
    console.error("Error getting all posts:", error);
  }
};

const initialState = {
  allPosts: [],
};

const postsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_POSTS:
      return {
        ...state,
        allPosts: action.payload,
      };
    default:
      return state;
  }
};

export default postsReducer;
