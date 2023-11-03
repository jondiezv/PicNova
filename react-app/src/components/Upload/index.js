import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createPost } from "../../store/posts";
import { useHistory } from "react-router-dom";

const Upload = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [isMounted, setIsMounted] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
    hidden: false,
  });

  useEffect(() => {
    return () => {
      setIsMounted(false);
    };
  }, []);

  const handleChange = (e) => {
    const { name, type, value, checked, files } = e.target;
    if (type === "file") {
      setFormData({
        ...formData,
        [name]: files[0],
      });
    } else if (type === "checkbox") {
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

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("image", formData.image);
    formDataToSend.append("hidden", formData.hidden);

    try {
      const actionResult = await dispatch(createPost(formDataToSend));
      console.log("ActionResult:", actionResult);

      const newPost = actionResult;

      if (isMounted && newPost && newPost.id) {
        history.push(`/post/${newPost.id}`);
        setFormData({
          title: "",
          description: "",
          image: null,
          hidden: false,
        });
      } else if (isMounted) {
        console.error("The post ID was not returned after creation.");
      }
    } catch (error) {
      if (isMounted) {
        console.error("Failed to create post:", error);
      }
    }
  };

  return (
    <div>
      <h2>Upload a New Post</h2>
      <form encType="multipart/form-data" onSubmit={handleSubmit}>
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
          <label>Image:</label>
          <input
            type="file"
            name="image"
            accept="image/*"
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
          <button type="submit">Upload</button>
        </div>
      </form>
    </div>
  );
};

export default Upload;
