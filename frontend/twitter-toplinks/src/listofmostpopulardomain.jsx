import React, { useState, useEffect } from "react";

function ListofMostpopulardomain({ load }) {
  const [listofdomains, setListofdomains] = useState([]);

  useEffect(() => {
    setListofdomains([]);
    fetch(process.env.BACKEND_URL+"listofpopulardomains", {
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
          "Domain------------------",
          responseJson,
          typeof responseJson
        );
        responseJson.map((domain) => {
          //   console.log("Tweet--0000", tweet);
          const newdomain = {
            domain_name: domain._id,
            count: domain.count,
          };
          return setListofdomains((listofdomains) => [
            ...listofdomains,
            newdomain,
          ]);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, [load]);
  return (
    <div>
      <div className="heading">Most Popular List</div>
      <div className="listofmostpopulardomains-container containers-borders">
        {listofdomains.map((domain, index) => {
          return (
            <div key={index} className="domains">
              {domain.domain_name} -{" "}
              <span style={{ fontSize: "25px" }}>{domain.count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ListofMostpopulardomain;
