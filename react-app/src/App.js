import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage";
import { authenticate } from "./store/session";
import Navigation from "./components/Navigation";
import LandingPage from "./components/Landing";
import PostDetails from "./components/PostDetails";
import Upload from "./components/Upload";
import EditPost from "./components/EditPost";
import ProfilePosts from "./components/ProfilePosts";
import ProfileFavorites from "./components/ProfileFavorites";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(authenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route path="/login">
            <LoginFormPage />
          </Route>
          <Route path="/signup">
            <SignupFormPage />
          </Route>
          <Route path="/upload">
            <Upload />
          </Route>
          <Route path="/posts/:userId">
            <ProfilePosts />
          </Route>
          <Route path="/favorites/:userId">
            <ProfileFavorites />
          </Route>
          <Route
            path="/post/:id/edit"
            render={(routeProps) => <EditPost {...routeProps} />}
          />
          <Route exact path="/post/:id(\d+)">
            <PostDetails />
          </Route>
          <Route path="/">
            <LandingPage />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
