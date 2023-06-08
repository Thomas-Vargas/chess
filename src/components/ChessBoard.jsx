import React from "react";
import Piece from "./Piece";
import { Grid } from "@mui/material";
import { useState, useEffect } from "react";

const ChessBoard = () => {
  const [boardState, setBoardState] = useState({
    board: {
      11: { piece: "rook", player: "white" },
      21: { piece: "knight", player: "white" },
      31: { piece: "bishop", player: "white" },
      41: { piece: "queen", player: "white" },
      51: { piece: "king", player: "white" },
      61: { piece: "bishop", player: "white" },
      71: { piece: "knight", player: "white" },
      81: { piece: "rook", player: "white" },
      12: { piece: "pawn", player: "white" },
      22: { piece: "pawn", player: "white" },
      32: { piece: "pawn", player: "white" },
      42: { piece: "pawn", player: "white" },
      52: { piece: "pawn", player: "white" },
      62: { piece: "pawn", player: "white" },
      72: { piece: "pawn", player: "white" },
      82: { piece: "pawn", player: "white" },
      18: { piece: "rook", player: "black" },
      28: { piece: "knight", player: "black" },
      38: { piece: "bishop", player: "black" },
      48: { piece: "queen", player: "black" },
      58: { piece: "king", player: "black" },
      68: { piece: "bishop", player: "black" },
      78: { piece: "knight", player: "black" },
      88: { piece: "rook", player: "black" },
      17: { piece: "pawn", player: "black" },
      27: { piece: "pawn", player: "black" },
      37: { piece: "pawn", player: "black" },
      47: { piece: "pawn", player: "black" },
      57: { piece: "pawn", player: "black" },
      67: { piece: "pawn", player: "black" },
      77: { piece: "pawn", player: "black" },
      87: { piece: "pawn", player: "black" },
    },
    currentPlayer: "white",
    validMoves: {piece: "", pieceSquare: '', possibleMoves: []}
  })

  useEffect(() => {
    console.log("Board state updated:", boardState);
  }, [boardState.validMoves]);

  const makeMove = (square) => {
    // Create a copy of the boardState object
    let previousBoardState = { ...boardState };
  
    // Remove the key from the copied boardState object
    const previousPieceSquare = boardState.validMoves.pieceSquare;
    delete previousBoardState.board[previousPieceSquare];

    const updatedBoardState = {...previousBoardState, currentPlayer: previousBoardState.currentPlayer === "white" ? "black" : "white"};
    updatedBoardState.board[square] = boardState.validMoves.piece;
    updatedBoardState.validMoves.possibleMoves = [];
    setBoardState(updatedBoardState);
  };

  const renderSquare = (square, isDark) => {
    const piece = boardState.board[square];
    const isValidMove = boardState.validMoves.possibleMoves.includes(square);

    // Check if the square is empty
    if (!piece) {
      return (
        <>
          {isValidMove ? (
            <div className={`square ${isDark ? "dark" : "light"}-square ${square}`} onClick={() => makeMove(square)}>
              <div className="valid-move-dot" />
            </div>
          ) : (
            <div className={`square ${isDark ? "dark" : "light"}-square ${square}`} />
          )}
        </>
      );
    }

    // Render the Piece component and pass the necessary props
    return (
      <Piece 
        piece={piece} 
        color={piece.player} 
        className={`${isDark ? "dark" : "light"}-square`} 
        square={square}
        boardState={boardState}
        setBoardState={setBoardState}
      />)
  };

  const renderRow = (row) => {
    const rowSquares = ["1", "2", "3", "4", "5", "6", "7", "8"];
    return rowSquares.map((col, index) => {
      const square = `${col}${row}`;
      const isDark = (index + row) % 2 !== 0;
      return <div key={square}>{renderSquare(square, isDark)}</div>;
    });
  };

  const renderBoard = () => {
    const rows = [8, 7, 6, 5, 4, 3, 2, 1];
    return (
      <Grid container direction="column" className="chess-board">
        {rows.map((row, index) => (
          <Grid container item key={row} className={`board-row ${index % 2 === 0 ? "light" : "dark"}-row`}>
            {renderRow(row)}
          </Grid>
        ))}
      </Grid>
    );
  };

  return <div style={{ width: "484px" }}>{renderBoard()}</div>;
};

export default ChessBoard;
