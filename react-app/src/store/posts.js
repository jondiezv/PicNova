const GET_ALL_POSTS = "posts/GET_ALL_POSTS";
const GET_POST_BY_ID = "posts/GET_POST_BY_ID";
const CREATE_POST = "posts/CREATE_POST";
const DELETE_POST = "posts/DELETE_POST";

const getAllPostsAction = (posts) => ({
  type: GET_ALL_POSTS,
  payload: posts,
});

const getPostByIdAction = (post) => ({
  type: GET_POST_BY_ID,
  payload: post,
});

const createPostAction = (post) => ({
  type: CREATE_POST,
  payload: post,
});

const deletePostAction = () => ({
  type: DELETE_POST,
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

export const createPost = (formData) => async (dispatch) => {
  try {
    const response = await fetch("/api/posts/create", {
      method: "POST",
      body: formData,
    });
    if (!response.ok) throw response;
    const data = await response.json();
    dispatch(createPostAction(data));
    return data;
  } catch (error) {
    console.error("Error creating a post:", error);
    throw error;
  }
};

export const deletePost = (postId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/posts/${postId}`, {
      method: "DELETE",
    });
    if (!response.ok) throw response;
    dispatch(deletePostAction());
    console.log("Post deleted successfully");
  } catch (error) {
    console.error("Error deleting post:", error);
  }
};

const initialState = {
  allPosts: [],
  currentPost: null,
  createdPost: null,
  deletedPost: null,
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
    case CREATE_POST:
      return {
        ...state,
        createdPost: action.payload,
      };
    default:
      return state;
  }
};

export default postsReducer;
