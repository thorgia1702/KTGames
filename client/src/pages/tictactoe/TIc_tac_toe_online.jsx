import React, { useState, useEffect } from "react";
import "../pages.css";
import Board from "./Board";
import "./tictactoe.css";
import { Button, Modal, message } from "antd";
import { Link } from "react-router-dom";
import { useSocket } from "../../helpers/socket.io/index";
import { calculateWinner } from "../../game_logics";
import { useSelector } from "react-redux";

export default function Tic_tac_toe_online() {
  const { appSocket } = useSocket();
  const [board, setBoard] = useState(Array(100).fill(null));
  const [isPlayerX, setIsPlayerX] = useState(false);
  const [isWinnerModalVisible, setIsWinnerModalVisible] = useState(false);
  const [roomId, setRoomId] = useState(null);
  const [opponentName, setOpponentName] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const winner = calculateWinner(board);

  const [isConnected, setIsConnected] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState("X"); // Track the current player's turn

  const handleConnectPlayers = () => {
    appSocket.emit("joinRoom", roomId, currentUser.username);
    setIsConnected(true);
  };

  useEffect(() => {
    appSocket.on("gameUpdate", (updatedBoard) => {
      setBoard(updatedBoard);
      if (calculateWinner(updatedBoard)) {
        setIsWinnerModalVisible(true);
      } else {
        // Update the current player's turn based on the number of "X" and "O" symbols
        const xCount = updatedBoard.filter((cell) => cell === "✖").length;
        const oCount = updatedBoard.filter((cell) => cell === "○").length;
        if (xCount === oCount) {
          setCurrentPlayer("X");
        } else {
          setCurrentPlayer("○");
        }
      }
    });

    appSocket.on("startGame", (opponent) => {
      setOpponentName(opponent.find((name) => name !== currentUser.username));
      const index = opponent.indexOf(currentUser.username);
      setIsPlayerX(index === 0);
    });

    appSocket.on("playerDisconnected", () => {
      setIsConnected(false);
      setOpponentName(null);
      setBoard(Array(100).fill(null));
      setIsWinnerModalVisible(false);
      setIsPlayerX(false);
      setCurrentPlayer("X");
    });

    return () => {
      appSocket.off("gameUpdate");
      appSocket.off("startGame");
    };
  }, [appSocket, currentUser]);

  const handleClick = (index) => {
    const boardCopy = [...board];
    if (winner || !isConnected) {
      return;
    }
    if (boardCopy[index]) {
      return;
    }

    const symbol = isPlayerX ? "✖" : "○";
    boardCopy[index] = symbol;
    appSocket.emit("move", { roomId, board: boardCopy });
  };

  return (
    <div>
      <h1>Tic Tac Toe</h1>

      {isConnected ? (
        <div>
          {opponentName ? (
            <div>
              <p>Opponent: {opponentName}</p>
              <p>You play as: {isPlayerX ? "X" : "○"}</p>
              <p>Who's Turn: {currentPlayer}</p>
              <div className="game-container">
                <Board cells={board} onClick={handleClick}></Board>
              </div>
            </div>
          ) : (
            <p>Waiting for opponent...</p>
          )}
        </div>
      ) : (
        <button
          className="connect-button"
          onClick={handleConnectPlayers}
          disabled={isConnected}
        >
          Connect Players
        </button>
      )}

      <Modal
        title="Winner"
        centered
        open={isWinnerModalVisible}
        onOk={() => setIsWinnerModalVisible(false)}
        onCancel={() => setIsWinnerModalVisible(false)}
        footer={[]}
      >
        <p>Winner is {winner}</p>
        <Link to={"/tic-tac-toe"}>
          <Button>New match</Button>
        </Link>
        <Link to={"/"}>
          <Button>Home</Button>
        </Link>
      </Modal>
    </div>
  );
}
