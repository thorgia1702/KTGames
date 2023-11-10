import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Usermanage from "../../images/user-manage.png";
import Itemmanage from "../../images/item-manage.png";

export default function admin() {
  return (
    <div>
      <h1>Welcome to KTGames Management site</h1>
      <hr></hr>
      <h2>Management pages</h2>
      <div className="grid-container">
        <div>
          <a href="/users">
            <img
              className="game"
              src={Usermanage}
              alt="user-manage"
              height={300}
              width={300}
            />
            <p>Manage user</p>
          </a>
        </div>
        <div>
          <a href="/items">
            <img
              className="game"
              src={Itemmanage}
              alt="item-manage"
              height={300}
              width={300}
            />
            <p>Manage item</p>
          </a>
        </div>
      </div>
    </div>
  );
}
