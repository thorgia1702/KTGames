import React from "react";
import Bingo_cell from "./Bingo_cell";

export default function Bingo_board({ cells, onCellClick }) {
  // Check if 'cells' is not undefined and is an array before mapping
  return (
    <div className="bingo-game-board">
      {Array.isArray(cells) ? (
        cells.map((cell, index) => (
          <Bingo_cell
            key={index}
            value={cell.number}
            onClick={() => onCellClick(index)}
            marked={cell.marked}
          />
        ))
      ) : (
        <p>Loading board...</p> // You can style this message or add a spinner, etc.
      )}
    </div>
  );
}
