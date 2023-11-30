import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllPosts } from "../../store/posts";
import { getAllComments } from "../../store/comments";
import "./Landing.css";

const LandingPage = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.allPosts);
  const comments = useSelector((state) => state.comments.allComments);

  useEffect(() => {
    dispatch(getAllPosts());
    dispatch(getAllComments());
  }, [dispatch]);

  const getCommentCount = (postId) => {
    const postComments = comments.filter(
      (comment) => comment.post_id === postId
    );
    return postComments.length;
  };

  return (
    <div>
      <div>
        <h2>Most Recent</h2>
        <div className="landing-cards-container">
          {posts.map((post) => (
            <li key={post.id} className="card">
              <Link to={`/post/${post.id}`}>
                {post.image_urls.length > 0 && (
                  <img src={post.image_urls[0]} alt="Post Image" />
                )}
                <div className="post-title-card">{post.title}</div>
                <p>{getCommentCount(post.id)} Comment(s)</p>
              </Link>
            </li>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
