import React, { useState, useEffect } from "react";
import "../pages.css";
import Board from "./Board";
import "./tictactoe.css";
import { Button, Modal } from "antd";
import { Link } from "react-router-dom";
import { useSocket } from "../../helpers/socket.io/index";
import { calculateWinner_tictactoe } from "../../game_logics";
import { useDispatch, useSelector } from "react-redux";
import {
  updateUserSuccess,
  updateUserFailure,
  updateUserStart,
} from "../../redux/user/userSlice";
import Searching from "../../images/loop2.gif";

export default function Tic_tac_toe_online() {
  const [isGameOver, setIsGameOver] = useState(false);
  const { appSocket } = useSocket();
  const [board, setBoard] = useState(Array(100).fill(null));
  const [isPlayerX, setIsPlayerX] = useState(false);
  const [isWinnerModalVisible, setIsWinnerModalVisible] = useState(false);
  const [isDraw, setIsDraw] = useState(false);
  const [roomId, setRoomId] = useState(null);
  const [opponentId, setOpponentId] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const winner = calculateWinner_tictactoe(board);
  const dispatch = useDispatch();
  const [isConnected, setIsConnected] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    avatar: "",
    trophy: 0,
    ktpoint: 0,
    phone: 1234567890,
    role: "",
    password: "",
    status: "",
  });

  const handleConnectPlayers = () => {
    appSocket.emit("findGameTicTacToe", currentUser._id);
    setIsConnected(true);
  };

  useEffect(() => {
    setIsGameOver(false);
    appSocket.on("gameUpdate", (updatedBoard) => {
      setBoard(updatedBoard);

      // Check for a draw
      if (updatedBoard.every((cell) => cell !== null)) {
        setIsDraw(true);
        setIsGameOver(true);
      } else if (calculateWinner_tictactoe(updatedBoard)) {
        setIsWinnerModalVisible(true);
        setIsGameOver(true);
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

    appSocket.on("startGame", async (data) => {
      const { roomId, players, gameType } = data;
      if (gameType !== "tic-tac-toe") return;

      const opponentId = players.find(
        (playerId) => playerId !== currentUser._id
      );
      setOpponentId(opponentId);
      try {
        const res = await fetch(`/api/user/get/${opponentId}`);
        const opponentData = await res.json(); // Rename to avoid confusion with 'data'
        if (opponentData.success === false) {
          console.log(opponentData.message);
          return;
        }
        setFormData(opponentData);
      } catch (error) {
        console.error("Error fetching opponent name:", error);
      }

      // Here, use 'players.indexOf' instead of 'opponent.indexOf'
      const index = players.indexOf(currentUser._id);
      setIsPlayerX(index === 0);
    });

    appSocket.on("playerDisconnected", () => {
      if (!isGameOver) {
        Modal.info({
          title: "Player Disconnected",
          centered: true,
          content: "Your opponent has disconnected. The game will end now.",
        });
      }
      setIsConnected(false);
      setOpponentId(null);
      setBoard(Array(100).fill(null));
      setIsWinnerModalVisible(false);
      setIsPlayerX(false);
      setCurrentPlayer("X");
      setIsGameOver(true);
    });

    return () => {
      appSocket.off("gameUpdate");
      appSocket.off("startGame");
      appSocket.off("playerDisconnected");
    };
  }, [appSocket, currentUser, isGameOver]);

  useEffect(() => {
    if (winner || isDraw) {
      setIsGameOver(true);
    }
  }, [winner, isDraw]);

  const handleClick = (index) => {
    const boardCopy = [...board];
    if (winner || !isConnected || boardCopy[index]) {
      return;
    }

    const isCurrentPlayerTurn =
      (isPlayerX && currentPlayer === "X") ||
      (!isPlayerX && currentPlayer === "○");
    if (!isConnected || !isCurrentPlayerTurn) {
      return;
    }

    const symbol = isPlayerX ? "✖" : "○";
    boardCopy[index] = symbol;
    appSocket.emit("move", { roomId, board: boardCopy });

    const winningSymbol = calculateWinner_tictactoe(boardCopy);

    if (winningSymbol === "✖" || winningSymbol === "○") {
      const newKtPoints = currentUser.ktpoint + 10;
      const newTrophies = currentUser.trophy + 1;

      fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ktpoint: newKtPoints,
          trophy: newTrophies,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success === false) {
            dispatch(updateUserFailure(data.message));
          } else {
            dispatch(updateUserSuccess(data));
            setIsWinnerModalVisible(true);
          }
        })
        .catch((error) => {
          dispatch(updateUserFailure(error.message));
        });
    }
  };

  const handleNewMatchClick = () => {
    window.location.reload();
  };

  return (
    <div>
      <h1>Tic Tac Toe Online</h1>

      {isConnected ? (
        <div>
          {opponentId ? (
            <div className="game-in4-ctn">
              <div>
                <p className="game-in4">Your opponent: {formData.username}</p>
                <p className="game-in4">You play as: {isPlayerX ? "X" : "○"}</p>
              </div>
              <div className="game-container">
                <p className="game-in4">Who's Turn: {currentPlayer}</p>
                <Board cells={board} onClick={handleClick}></Board>
              </div>
            </div>
          ) : (
            <div className="waiting-ctn">
              <p className="waiting">Waiting for opponent...</p>
              <img
                className="waiting"
                id="img"
                src={Searching}
                alt="tictactoe"
                height={300}
                width={300}
              />
            </div>
          )}
        </div>
      ) : (
        <button
          className="navbutton"
          id="tic-tac-toe-online"
          onClick={handleConnectPlayers}
          disabled={isConnected}
        >
          Connect Players
        </button>
      )}

      <Modal
        title={isDraw ? "Draw" : "Winner"}
        centered
        open={isWinnerModalVisible || isDraw}
        onOk={() => setIsWinnerModalVisible(false)}
        onCancel={() => setIsWinnerModalVisible(false)}
        footer={[]}
      >
        {isDraw ? <p>It's a draw!</p> : <p>Winner is {winner}</p>}
        <Button onClick={handleNewMatchClick}>New match</Button>
        <Link to={"/"}>
          <Button>Home</Button>
        </Link>
      </Modal>
    </div>
  );
}
