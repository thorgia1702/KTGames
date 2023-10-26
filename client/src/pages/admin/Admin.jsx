import React, { useEffect } from "react";
import { useSocket } from "../../helpers/socket.io";
import { Link } from "react-router-dom";

export default function admin() {
  return (
    <div>
      <Link to="/users">
        <button>Users</button>
      </Link>
      <Link to="/items">
        <button>Items</button>
      </Link>
    </div>
  );
}
