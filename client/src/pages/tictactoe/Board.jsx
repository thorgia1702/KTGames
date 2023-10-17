import React from "react";
import Cell from "./Cell";

export default function Board(props) {
  return (
    <div className="game-board">
      {props.cells.map((item, index) => (
        <Cell
          key={index}
          value={item}
          onClick={() => props.onClick(index)}
          className={item === '✖' ? 'is-x' : item === '○' ?'is-o' : ''}
        ></Cell>
      ))}
    </div>
  );
}
