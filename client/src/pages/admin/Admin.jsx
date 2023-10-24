import React, { useEffect } from "react";
import { useSocket } from "../../helpers/socket.io";
import { Link } from "react-router-dom";

export default function admin() {
  // const roomId = 123;
  // const { appSocket } = useSocket();

  // const logging = (data) => {
  //   console.log(data);
  // };
  // useEffect(() => {
  //   appSocket.on(`roomid:${roomId}`, logging);
  //   return () => appSocket.off(`roomid:${roomId}`);
  // }, [logging]);
  return <div>
    <Link to='/users'><button>Users</button></Link>
    <Link to='/items'><button>Items</button></Link>
  </div>;
}
