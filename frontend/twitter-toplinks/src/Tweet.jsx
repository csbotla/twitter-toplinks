import React from "react";
// import tweet from "../../../models/tweet";

function Tweet({ tweet }) {
  return (
    <div className="tweet">
      <div className="img-container">
        <img src={tweet.img_url} title={tweet.from} />
      </div>
      <div className="text-container">
        <span className="username">
          <b>{tweet.from}</b>
        </span>
        <span className="username">@{tweet.screen_name}</span>

        <div className="text">
          <p>{tweet.text}</p>
          <a href={tweet.expanded_url} target="_blank">
            {tweet.expanded_url.length > 50
              ? tweet.expanded_url.substring(0, 50 - 3) + "..."
              : tweet.expanded_url}
          </a>
        </div>
        <div className="">{tweet.tweet_time}</div>
      </div>
    </div>
  );
}

export default Tweet;
