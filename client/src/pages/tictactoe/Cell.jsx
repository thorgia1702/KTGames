import React from "react";

export default function Cell({ value, onClick, className }) {
  return (
    <div className={`game-cell ${className}`} onClick={onClick}>
      {value}
    </div>
  );
}
