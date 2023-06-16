import React from "react";
import Piece from "./Piece";
import { Grid } from "@mui/material";
import { useState, useEffect } from "react";

const ChessBoard = () => {
  const [boardState, setBoardState] = useState({
    board: {
      11: { piece: "rook", player: "white", firstMove: true },
      21: { piece: "knight", player: "white" },
      31: { piece: "bishop", player: "white" },
      41: { piece: "queen", player: "white" },
      51: { piece: "king", player: "white", firstMove: true },
      61: { piece: "bishop", player: "white" },
      71: { piece: "knight", player: "white" },
      81: { piece: "rook", player: "white", firstMove: true },
      12: { piece: "pawn", player: "white" },
      22: { piece: "pawn", player: "white" },
      32: { piece: "pawn", player: "white" },
      42: { piece: "pawn", player: "white" },
      52: { piece: "pawn", player: "white" },
      62: { piece: "pawn", player: "white" },
      72: { piece: "pawn", player: "white" },
      82: { piece: "pawn", player: "white" },
      18: { piece: "rook", player: "black", firstMove: true },
      28: { piece: "knight", player: "black" },
      38: { piece: "bishop", player: "black" },
      48: { piece: "queen", player: "black" },
      58: { piece: "king", player: "black", firstMove: true },
      68: { piece: "bishop", player: "black" },
      78: { piece: "knight", player: "black" },
      88: { piece: "rook", player: "black", firstMove: true },
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
    validMoves: {piece: "", pieceSquare: "", possibleMoves: [], possibleCaptures: [], possibleCastles: []}
  })

  useEffect(() => {
    // console.log("Board state updated:", boardState);
  }, [boardState.validMoves]);

  const makeMove = (square) => {
    // Create a copy of the boardState object
    let previousBoardState = { ...boardState };
  
    // Remove the key from the copied boardState object
    const previousPieceSquare = boardState.validMoves.pieceSquare;
    delete previousBoardState.board[previousPieceSquare];

    const updatedBoardState = {...previousBoardState, currentPlayer: previousBoardState.currentPlayer === "white" ? "black" : "white"};
    updatedBoardState.board[square] = boardState.validMoves.piece;
    
    // change first move property to false on first move
    if (updatedBoardState.board[square].hasOwnProperty('firstMove')) {
      updatedBoardState.board[square].firstMove = false;
    }

    updatedBoardState.validMoves.possibleMoves = [];
    updatedBoardState.validMoves.possibleCaptures = [];
    setBoardState(updatedBoardState);
  };

  const handleCastle = (square) => {
    let previousBoardState = { ...boardState };
    switch(square) {
      case '71':
        delete previousBoardState.board['51'];
        delete previousBoardState.board['81'];
        const updatedBoardState = {
          ...previousBoardState,
          currentPlayer:
          previousBoardState.currentPlayer === "white" ? "black" : "white",
        };
        updatedBoardState.board['71'] = { piece: "king", player: "white", firstMove: false };
        updatedBoardState.board['61'] = { piece: "rook", player: "white", firstMove: false };
        updatedBoardState.validMoves.possibleMoves = [];
        updatedBoardState.validMoves.possibleCaptures = [];
        updatedBoardState.validMoves.possibleCastles = [];
        setBoardState(updatedBoardState);
        break;
      case '31': 
        delete previousBoardState.board['51'];
        delete previousBoardState.board['11'];
        const updatedBoardState1 = {
          ...previousBoardState,
          currentPlayer:
          previousBoardState.currentPlayer === "white" ? "black" : "white",
        };
        updatedBoardState1.board['31'] = { piece: "king", player: "white", firstMove: false };
        updatedBoardState1.board['41'] = { piece: "rook", player: "white", firstMove: false };
        updatedBoardState1.validMoves.possibleMoves = [];
        updatedBoardState1.validMoves.possibleCaptures = [];
        updatedBoardState1.validMoves.possibleCastles = [];
        setBoardState(updatedBoardState1);
        break;
      case '78':
        delete previousBoardState.board['58'];
        delete previousBoardState.board['88'];
        const updatedBoardState2 = {
          ...previousBoardState,
          currentPlayer:
          previousBoardState.currentPlayer === "white" ? "black" : "white",
        };
        updatedBoardState2.board['78'] = { piece: "king", player: "black", firstMove: false };
        updatedBoardState2.board['68'] = { piece: "rook", player: "black", firstMove: false };
        updatedBoardState2.validMoves.possibleMoves = [];
        updatedBoardState2.validMoves.possibleCaptures = [];
        updatedBoardState2.validMoves.possibleCastles = [];
        setBoardState(updatedBoardState2);
        break;
      case '38':
        delete previousBoardState.board['58'];
        delete previousBoardState.board['18'];
        const updatedBoardState3 = {
          ...previousBoardState,
          currentPlayer:
          previousBoardState.currentPlayer === "white" ? "black" : "white",
        };
        updatedBoardState3.board['38'] = { piece: "king", player: "black", firstMove: false };
        updatedBoardState3.board['48'] = { piece: "rook", player: "black", firstMove: false };
        updatedBoardState3.validMoves.possibleMoves = [];
        updatedBoardState3.validMoves.possibleCaptures = [];
        updatedBoardState3.validMoves.possibleCastles = [];
        setBoardState(updatedBoardState3);
        break;
    }
  }

  const renderSquare = (square, isDark) => {
    const piece = boardState.board[square];
    const isValidMove = boardState.validMoves.possibleMoves.includes(square);
    const isValidCapture = boardState.validMoves.possibleCaptures.includes(square);
    const isValidCastle = boardState.validMoves.possibleCastles.includes(square);

    // Check if the square is empty
    if (!piece) {
      return (
        <>
          {isValidMove ? (
            <div className={`square ${isDark ? "dark" : "light"}-square ${square}`} onClick={() => makeMove(square)}>
              <div className="valid-move-dot" />
            </div>
          ) : (
            <div className={`square ${isDark ? "dark" : "light"}-square ${square}`}>
              {isValidCastle && <div className="valid-capture-ring" onClick={() => handleCastle(square)} />}
            </div>
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
        isValidCapture={isValidCapture}
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
