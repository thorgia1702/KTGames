import React from "react";
import Bingo_cell from "./Bingo_cell";

export default function Bingo_board(props) {
  
  return (
    <div className="game-board">
      {props.cells.map((item, index) => (
        <Bingo_cell
          key={index}
          value={item}
          onClick={() => props.onClick(index)}
          className="Called-cell"
        ></Bingo_cell>
      ))}
    </div>
  );
}
