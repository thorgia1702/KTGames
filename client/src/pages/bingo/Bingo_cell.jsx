import React from "react";

export default function Bingo_cell({ value, onClick, className }) {
  return (
    <div className={`game-cell ${className}`} onClick={onClick}>
      {value}
    </div>
  );
}
