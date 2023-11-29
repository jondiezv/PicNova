import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getUserPosts } from "../../store/posts";
import { Link } from "react-router-dom";
import "./ProfilePosts.css";

const ProfilePosts = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const userPosts = useSelector((state) => state.posts.userPosts);

  useEffect(() => {
    if (userId) {
      dispatch(getUserPosts({ id: userId }));
    }
  }, [dispatch, userId]);

  return (
    <div className="user-profile">
      <div className="posts-tab">
        <div className="posts-link">Posts</div>
        <ul className="card-grid">
          {userPosts.map((post) => (
            <li key={post.id} className="card">
              <Link to={`/post/${post.id}`} className="card-link">
                <img
                  src={post.image_urls[0]}
                  alt={post.description}
                  className="card-img"
                />
                <div className="card-info">
                  <h3 className="card-title">{post.title}</h3>
                  <p className="card-privacy">
                    {post.hidden ? "Private" : "Public"}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProfilePosts;
