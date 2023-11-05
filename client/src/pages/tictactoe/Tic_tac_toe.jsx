import React from "react";
import "./tictactoe.css";

export default function Tic_tac_toe() {
  return (
    <div>
      <h1>Tic Tac Toe</h1>
      <div className="btn-ctn">
        <a href="/tic-tac-toe-offline">
          <button className="navbutton" id="tic-tac-toe">Play Local</button>
        </a>
        <a href="/tic-tac-toe-online">
          <button className="navbutton" id="tic-tac-toe">Play Online</button>
        </a>
      </div>
    </div>
  );
}
