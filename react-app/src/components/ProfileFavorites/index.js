import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getUserFavorites } from "../../store/posts";
import { Link } from "react-router-dom";

const ProfileFavorites = () => {
  const { userId } = useParams();
  console.log("User ID:", userId);
  const dispatch = useDispatch();
  const userFavorites = useSelector((state) => state.posts.userFavorites);

  useEffect(() => {
    if (userId) {
      dispatch(getUserFavorites(userId));
    }
  }, [dispatch, userId]);

  console.log("User Favorites:", userFavorites);

  return (
    <div className="user-profile">
      <div className="posts-tab">
        <div className="posts-link">Favorites</div>
        <ul className="landing-cards-container">
          {userFavorites.map((favorite) => (
            <li key={favorite.post_id} className="card">
              <Link to={`/post/${favorite.post_id}`} className="card-link">
                {favorite.image_urls && favorite.image_urls.length > 0 && (
                  <img
                    src={favorite.image_urls[0]}
                    alt={favorite.description}
                    className="card-img"
                  />
                )}
                <div className="post-title-card">{favorite.title}</div>{" "}
                <p className="card-privacy">
                  {favorite.hidden ? "Private" : "Public"}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProfileFavorites;
