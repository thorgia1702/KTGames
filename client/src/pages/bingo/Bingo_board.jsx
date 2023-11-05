import React from "react";
import Bingo_cell from "./Bingo_cell";

export default function Bingo_board(props) {
  return (
    <div className="bingo-game-board">
      {props.cells.map((cell, index) => (
        <Bingo_cell
          key={index}
          value={cell.number}
          onClick={() => props.onCellClick(index)}
          marked={cell.marked}
        />
      ))}
    </div>
  );
}
