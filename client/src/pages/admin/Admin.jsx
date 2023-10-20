import React, { useEffect } from "react";
import { useSocket } from "../../helpers/socket.io";

export default function admin() {
  const roomId = 123;
  const { appSocket } = useSocket();

  const logging = (data) => {
    console.log(data);
  };
  useEffect(() => {
    appSocket.on(`roomid:${roomId}`, logging);
    return () => appSocket.off(`roomid:${roomId}`);
  }, [logging]);
  return <div>admin</div>;
}
