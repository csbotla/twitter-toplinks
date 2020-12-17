import React from "react";

export default function Header({ authenticated, img_url }) {
  // const [authenticated, setAuthenticated] = useState(false);
  const handleSignInClick = () => {
    window.open("/auth/twitter", "_self");
  };

  const handleLogoutClick = () => {
    window.open(process.env.BACKEND_URL + "/logout", "_self");
    // handleNotAuthenticated();
  };
  return (
    <div className="header">
      <div>Twitter Top Links</div>
      {img_url ? <img src={img_url} /> : null}
      <ul className="menu">
        {authenticated ? (
          <li onClick={handleLogoutClick}>Logout</li>
        ) : (
          <li onClick={handleSignInClick}>Login</li>
        )}
      </ul>
    </div>
  );
}
