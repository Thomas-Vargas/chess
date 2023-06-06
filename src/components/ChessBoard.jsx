import React from "react";
import Piece from "./Piece";
import { Grid } from "@mui/material";
import { useState } from "react";

const ChessBoard = () => {
  const boardState = {
    board: {
      a1: { piece: "rook", player: "white" },
      b1: { piece: "knight", player: "white" },
      c1: { piece: "bishop", player: "white" },
      d1: { piece: "queen", player: "white" },
      e1: { piece: "king", player: "white" },
      f1: { piece: "bishop", player: "white" },
      g1: { piece: "knight", player: "white" },
      h1: { piece: "rook", player: "white" },
      a2: { piece: "pawn", player: "white" },
      b2: { piece: "pawn", player: "white" },
      c2: { piece: "pawn", player: "white" },
      d2: { piece: "pawn", player: "white" },
      e2: { piece: "pawn", player: "white" },
      f2: { piece: "pawn", player: "white" },
      g2: { piece: "pawn", player: "white" },
      h2: { piece: "pawn", player: "white" },
      a8: { piece: "rook", player: "black" },
      b8: { piece: "knight", player: "black" },
      c8: { piece: "bishop", player: "black" },
      d8: { piece: "queen", player: "black" },
      e8: { piece: "king", player: "black" },
      f8: { piece: "bishop", player: "black" },
      g8: { piece: "knight", player: "black" },
      h8: { piece: "rook", player: "black" },
      a7: { piece: "pawn", player: "black" },
      b7: { piece: "pawn", player: "black" },
      c7: { piece: "pawn", player: "black" },
      d7: { piece: "pawn", player: "black" },
      e7: { piece: "pawn", player: "black" },
      f7: { piece: "pawn", player: "black" },
      g7: { piece: "pawn", player: "black" },
      h7: { piece: "pawn", player: "black" },
    },
    currentPlayer: "black",
  };

  const renderSquare = (square, isDark) => {
    const piece = boardState.board[square];
    // Check if the square is empty
    if (!piece) {
      return <div className={`square ${isDark ? "dark" : "light"}-square`} />;
    }
    // Render the Piece component and pass the necessary props
    return (
      <Piece 
        piece={piece} 
        color={piece.player} 
        className={`${isDark ? "dark" : "light"}-square`} 
        square={square}
        boardState={boardState}
      />)
  };

  const renderRow = (row) => {
    const rowSquares = ["a", "b", "c", "d", "e", "f", "g", "h"];
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
