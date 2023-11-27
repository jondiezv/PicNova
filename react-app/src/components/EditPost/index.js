import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { getPostById, editPost } from "../../store/posts";
import "./EditPost.css";

const EditPost = (props) => {
  const postId = props.match.params.id;
  console.log("Post ID from props:", postId);
  console.log("Post ID from URL:", postId);
  const post = useSelector((state) =>
    state.posts.allPosts.find((p) => p.id === parseInt(postId))
  );
  const dispatch = useDispatch();
  const history = useHistory();
  const [isMounted, setIsMounted] = useState(true);
  const [formData, setFormData] = useState({
    title: post?.title || "",
    description: post?.description || "",
    hidden: post?.hidden || false,
  });

  useEffect(() => {
    if (postId && !post) {
      dispatch(getPostById(postId));
    }
    return () => {
      setIsMounted(false);
    };
  }, [postId, post, dispatch]);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const actionResult = await dispatch(editPost(postId, formData));

    if (isMounted) {
      history.push(`/post/${postId}`);

      setFormData({
        title: "",
        description: "",
        hidden: false,
      });
    } else {
      console.error("The post ID was not returned after update.");
    }
  };
  return (
    <div className="edit-post-container">
      <h2 className="edit-post-title">Edit Post</h2>
      <form className="edit-post-form" onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>
            Hidden:
            <input
              type="checkbox"
              name="hidden"
              checked={formData.hidden}
              onChange={handleChange}
            />
          </label>
        </div>
        <div>
          <button type="submit" className="upload-btn">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPost;
