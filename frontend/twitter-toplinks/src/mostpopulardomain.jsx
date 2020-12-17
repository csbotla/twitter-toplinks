import React, { useState, useEffect } from "react";

function Mostpopulardomain({ load }) {
  const [mostpopulardomain, setmostpopulardomain] = useState({});
  useEffect(() => {
    fetch("http://localhost:3000/mostpopulardomain", {
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
          "Tweet------------------",
          responseJson,
          typeof responseJson
        );
        const mostpopulardomain = {
          twitterid: responseJson._id,
          count: responseJson.count,
        };
        setmostpopulardomain(mostpopulardomain);
        //   console.log(tweet.text, tweet);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [load]);
  return (
    <div>
      <div className="heading">Most Popular Domain</div>
      <div className="mostpopulardomain-container containers-borders">
        <div className="id">{mostpopulardomain.twitterid}</div>
        <div className="count">{mostpopulardomain.count}</div>
      </div>
    </div>
  );
}

export default Mostpopulardomain;
