import React, { useEffect, useState } from "react";
import Header from "./header";
import TweetsContainer from "./TweetsContainer";

function Home() {
  const [user, setUser] = useState({
    userInfo: [],
    error: null,
    authenticated: false,
    img_url: "",
  });
  const handleNotAuthenticated = () => {
    setUser({ authenticated: false });
  };
  // const [username, setUsername] = useState("");

  useEffect(() => {
    fetch(process.env.BACKEND_URL + "/auth/login/success", {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
      },
    })
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          return response.json();
        }
        throw new Error("failed to authenticate user");
      })
      .then((responseJson) => {
        console.log(
          responseJson,
          responseJson.user,
          responseJson.user.photos[0].value
        );
        // setUsername(responseJson.user.displayName);
        const newuser = {
          authenticated: true,
          userInfo: responseJson.user,
          img_url: responseJson.user.photos[0].value,
        };
        setUser(newuser);
      })
      .catch((error) => {
        console.log(error);
        setUser({
          authenticated: false,
          error: "Failed to authenticate user",
        });
      });
  }, []);

  return (
    <div className="home1">
      <Header
        authenticated={user.authenticated}
        img_url={user.img_url}
        handleNotAuthenticated={handleNotAuthenticated}
      />
      <div>
        {!user.authenticated ? (
          <div className="welcome-container">
            <h1>Welcome!</h1>
          </div>
        ) : (
          <div className="welcome-container">
            <div className="welcome-msg">
              Welcome <b>{user.userInfo.displayName}!</b>
            </div>
          </div>
        )}
      </div>
      {user.authenticated ? (
        <div className="">
          <TweetsContainer />
        </div>
      ) : null}
    </div>
  );
}
export default Home;
