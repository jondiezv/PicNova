import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getPostById } from "../../store/posts";

const PostDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const currentPost = useSelector((state) => state.posts.currentPost);

  useEffect(() => {
    dispatch(getPostById(id));
  }, [dispatch, id]);

  return (
    <div>
      {currentPost ? (
        <div>
          <h2>{currentPost.title}</h2>
          <p>{currentPost.description}</p>
          <div>
            {currentPost.image_urls.map((imageUrl) => (
              <img key={imageUrl} src={imageUrl} alt="Post Image" />
            ))}
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default PostDetails;
