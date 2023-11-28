import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getUserPosts } from "../../store/posts";
import { Link } from "react-router-dom";

const Profile = () => {
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
      <div className="user-details">
        <h2>{userId}'s Posts</h2>
      </div>
      <div className="posts-tab">
        <h3>Posts</h3>
        <div className="user-posts">
          {userPosts.map((post) => (
            <Link to={`/post/${post.id}`} key={post.id}>
              {" "}
              <div className="post-item">
                <h4>{post.title}</h4>
                {post.image_urls.map((url, index) => (
                  <img key={index} src={url} alt={post.description} />
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
