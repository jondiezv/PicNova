import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createPost } from "../../store/posts";
import { useHistory } from "react-router-dom";
import "./Upload.css";

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
  const [filename, setFilename] = useState("");

  const [errors, setErrors] = useState({
    title: "",
    description: "",
    image: "",
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
      setFilename(files[0] ? files[0].name : "");
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

    setErrors({
      title: "",
      description: "",
      image: "",
    });

    let isValid = true;
    if (!formData.title) {
      setErrors((prevErrors) => {
        return {
          ...prevErrors,
          title: "Write a title",
        };
      });
      isValid = false;
    }
    if (!formData.description) {
      setErrors((prevErrors) => {
        return {
          ...prevErrors,
          description: "Write a description",
        };
      });
      isValid = false;
    }
    if (!formData.image) {
      setErrors((prevErrors) => {
        return {
          ...prevErrors,
          image: "Select an image",
        };
      });
      isValid = false;
    }

    if (isValid) {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("image", formData.image);
      formDataToSend.append("hidden", formData.hidden);

      try {
        const actionResult = await dispatch(createPost(formDataToSend));

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
        console.error("Failed to create post:", error);
      }
    } else {
    }
  };

  return (
    <div className="upload-container">
      <form
        className="upload-form"
        encType="multipart/form-data"
        onSubmit={handleSubmit}
      >
        <h2>Upload a New Post</h2>

        <div className="drop-zone">
          <input
            id="file-input"
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
          />
          <label htmlFor="file-input" style={{ cursor: "pointer" }}>
            <div>{filename || "Select image to upload"}</div>
          </label>
          {errors.image && <p className="error">{errors.image}</p>}
        </div>

        <div>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
          {errors.title && <p className="error">{errors.title}</p>}
        </div>

        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
          {errors.description && <p className="error">{errors.description}</p>}
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
            Upload
          </button>
        </div>
      </form>
    </div>
  );
};

export default Upload;
