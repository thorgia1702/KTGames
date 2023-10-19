import React from "react";

export default function Tic_tac_toe() {
  return (
    <div>
      <a href="/tic-tac-toe-offline">
        <button className="navbutton">Play Local</button>
      </a>
      <a href="/tic-tac-toe-online">
        <button className="navbutton">Play Online</button>
      </a>
    </div>
  );
}
