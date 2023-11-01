import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getAllPosts } from "../../store/posts";

const LandingPage = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.allPosts);

  useEffect(() => {
    dispatch(getAllPosts());
  }, [dispatch]);

  return (
    <div>
      <div>
        <h2>Most Recent</h2>
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              <h3>{post.title}</h3>
              <p>{post.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LandingPage;
