const GET_ALL_POSTS = "posts/GET_ALL_POSTS";
const GET_POST_BY_ID = "posts/GET_POST_BY_ID";
const CREATE_POST = "posts/CREATE_POST";
const DELETE_POST = "posts/DELETE_POST";
const EDIT_POST = "posts/EDIT_POST";
const GET_USER_POSTS = "posts/GET_USER_POSTS";
const ADD_TO_FAVORITES = "posts/ADD_TO_FAVORITES";

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

const editPostAction = (post) => ({
  type: EDIT_POST,
  payload: post,
});

const getUserPostsAction = (posts) => ({
  type: GET_USER_POSTS,
  payload: posts,
});

const addToFavoritesAction = () => ({
  type: ADD_TO_FAVORITES,
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

export const editPost = (postId, formData) => async (dispatch) => {
  try {
    const response = await fetch(`/api/posts/${postId}/edit`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    if (!response.ok) throw response;
    const data = await response.json();
    dispatch(editPostAction(data));
    console.log("Post edited successfully");
  } catch (error) {
    console.error("Error editing post:", error);
  }
};

export const getUserPosts = (user) => async (dispatch) => {
  try {
    const response = await fetch(`/api/posts/user/${user.id}`);
    if (!response.ok) throw response;
    const data = await response.json();
    dispatch(getUserPostsAction(data));
  } catch (error) {
    console.error("Error getting user-specific posts:", error);
  }
};

export const addToFavorites = (postId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/posts/${postId}/add_to_favorites`, {
      method: "POST",
    });
    if (!response.ok) throw response;
    dispatch(addToFavoritesAction());
    console.log("Post added to favorites successfully");
  } catch (error) {
    console.error("Error adding post to favorites:", error);
  }
};

const initialState = {
  allPosts: [],
  currentPost: null,
  createdPost: null,
  deletedPost: null,
  userPosts: [],
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
    case EDIT_POST:
      return {
        ...state,
        allPosts: state.allPosts.map((post) =>
          post.id === action.payload.id ? action.payload : post
        ),
        currentPost: action.payload,
      };
    case GET_USER_POSTS:
      return {
        ...state,
        userPosts: action.payload,
      };
    case ADD_TO_FAVORITES:
      const updatedUserFavorites = [...state.userFavorites, action.payload];
      return {
        ...state,
        userFavorites: updatedUserFavorites,
      };
    default:
      return state;
  }
};

export default postsReducer;
