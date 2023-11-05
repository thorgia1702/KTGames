import React from "react";

export default function Bingo_cell({ value, onClick, marked }) {
  const cellClass = marked ? 'game-cell marked' : 'game-cell';
  return (
    <div className={cellClass} onClick={onClick}>
      {value}
    </div>
  );
}
