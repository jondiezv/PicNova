const GET_ALL_POSTS = "posts/GET_ALL_POSTS";
const GET_POST_BY_ID = "posts/GET_POST_BY_ID";

const getAllPostsAction = (posts) => ({
  type: GET_ALL_POSTS,
  payload: posts,
});

const getPostByIdAction = (post) => ({
  type: GET_POST_BY_ID,
  payload: post,
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

export const getPostById = (postId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/posts/${postId}`);
    if (!response.ok) throw response;
    const data = await response.json();
    dispatch(getPostByIdAction(data));
  } catch (error) {
    console.error("Error getting post by ID:", error);
  }
};

const initialState = {
  allPosts: [],
  currentPost: null,
};

const postsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_POSTS:
      return {
        ...state,
        allPosts: action.payload,
      };
    case GET_POST_BY_ID:
      return {
        ...state,
        currentPost: action.payload,
      };
    default:
      return state;
  }
};

export default postsReducer;
