import React, { useEffect, useState } from "react";
import Mostpopulardomain from "./mostpopulardomain";
import ListofMostpopulardomain from "./listofmostpopulardomain";
import Tweet from "./Tweet";

function TweetsContainer() {
  const [tweets, setTweets] = useState([]);
  const [isLoad, setIsLoad] = useState(1);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    // fetch("http://localhost:3000/tweets", {
    //   method: "GET",
    //   credentials: "include",
    //   headers: {
    //     Accept: "application/json",
    //     "Content-Type": "application/json",
    //     "Access-Control-Allow-Credentials": true,
    //   },
    // }).then(
    fetch("http://localhost:3000/tweetswithurl", {
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
          "Tweetwithurl------------------",
          responseJson,
          responseJson[0],
          typeof responseJson
        );
        //   responseJson[0].tweets.map((tweet) => {
        responseJson.map((tweet) => {
          // console.log("Tweet--0000", tweet);
          // console.log("Tweet--0000", tweet.entities.urls[0].expanded_url);
          var url = tweet.user.profile_image_url;
          var img_url = url.replace("_normal", "");
          const newtweet = {
            tweet_time: tweet.created_at,
            text: tweet.text,
            retweet_count: tweet.retweet_count,
            from: tweet.user.name,
            screen_name: tweet.user.screen_name,
            img_url: img_url,
            expanded_url: tweet.entities.urls[0].expanded_url,
          };
          return setTweets((tweets) => [...tweets, newtweet]);
        });
        setLoad(true);
        //   console.log(tweet.text, tweet);
      })
      .catch((error) => {
        console.log(error);
      });
    // );
  }, []);

  const refresh = () => {
    console.log("refreshing");
    setIsLoad((isLoad) => {
      return isLoad + 1;
    });
  };

  //   console.log("tweets", tweets);
  return (
    <div className="containers">
      <div>
        {/* <button onClick={refresh}>refresh</button> */}
        <div className="heading">Tweets</div>
        <div className="tweets-container containers-borders">
          {/* <div> */}
          {tweets.length !== 0 ? (
            tweets.map((tweet, index) => {
              return <Tweet key={index} tweet={tweet} />;
            })
          ) : (
            <div className="loading">Loading...</div>
          )}
          {/* </div> */}
        </div>
      </div>
      {load ? (
        <>
          <ListofMostpopulardomain load={load} />
          <Mostpopulardomain load={load} />
        </>
      ) : null}
    </div>
  );
}

export default TweetsContainer;
