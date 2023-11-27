import React from "react";
import "./tictactoe.css";

export default function Tic_tac_toe() {
  const navigate = (path) => {
    window.location.href = path;
  };

  return (
    <div>
      <h1>Tic Tac Toe</h1>
      <div className="btn-ctn">
        <button
          className="navbutton"
          id="tic-tac-toe"
          onClick={() => navigate("/tic-tac-toe-offline")}
        >
          Play Local
        </button>
        <button
          className="navbutton"
          id="tic-tac-toe-online"
          onClick={() => navigate("/tic-tac-toe-online")}
        >
          Play Online
        </button>
      </div>
    </div>
  );
}
