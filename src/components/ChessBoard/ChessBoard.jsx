import React from "react";
import Piece from "../Piece/Piece";
import { Divider, Grid, Typography } from "@mui/material";
import { useState, useEffect } from "react";

import PawnPromotionModal from "../PawnPromotionModal/PawnPromotionModal";

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
    validMoves: {
      piece: "",
      pieceSquare: "",
      possibleMoves: [],
      possibleCaptures: [],
      possibleCastles: [],
    },
  });
  const [open, setOpen] = useState(false);
  const [promotionSquare, setPromotionSquare] = useState(null);
  const [inCheckStatus, setInCheckStatus] = useState(false);

  console.log(boardState);

  useEffect(() => {
    // console.log("Board state updated:", boardState);
  }, [boardState.validMoves]);

  const makeMove = (square) => {
    // Create a copy of the boardState object
    let previousBoardState = { ...boardState };

    // Remove the key from the copied boardState object
    const previousPieceSquare = boardState.validMoves.pieceSquare;
    delete previousBoardState.board[previousPieceSquare];

    let updatedBoardState = {
      ...previousBoardState,
      currentPlayer:
        previousBoardState.currentPlayer === "white" ? "black" : "white",
    };
    updatedBoardState.board[square] = boardState.validMoves.piece;

    // the piece - yes
    console.log("piece making the move?", updatedBoardState.board[square]);
    // the square it is now on 
    console.log("square after move is made?", square);

    // change first move property to false on first move
    if (updatedBoardState.board[square].hasOwnProperty("firstMove")) {
      updatedBoardState.board[square].firstMove = false;
    }

    // check for pawn promotion
    if (
      updatedBoardState.board[square].piece === "pawn" &&
      (square[1] == 8 || square[1] == 1)
    ) {
      promotePawn(updatedBoardState, square);
      // setBoardState(updatedBoardState);
    } else {
      // check for check
      if (isThisMoveACheck(square, updatedBoardState.board[square], updatedBoardState)) {
        console.log("major major we have a check")

        if (isGameOver(square, updatedBoardState.board[square], updatedBoardState)) {

        }
        setInCheckStatus(true);
      }

      if (isGameOver(square, updatedBoardState.board[square], updatedBoardState)) {

      }

      updatedBoardState.validMoves.possibleMoves = [];
      updatedBoardState.validMoves.possibleCaptures = [];
      setBoardState(updatedBoardState);
    }
  };

  const isGameOver = (squareCausingCheck, pieceCausingCheck, updatedBoardState) => {
    let isGameOver = false;
    console.log("piece in is game over", pieceCausingCheck)
    console.log("board state in isgameover", updatedBoardState)
    console.log("square cuasing check", squareCausingCheck)
    let possibleMoves;

    // get all moves
    for (let position in updatedBoardState.board) {
      if (updatedBoardState.board[position].player === updatedBoardState.currentPlayer) {
          switch(updatedBoardState.board[position].piece) {
            case "queen":
              // console.log("current position to find moves", position);
              // console.log("current piece to find moves", updatedBoardState.board[position].piece)
              let queenMoves = getQueenMoves(position, updatedBoardState.board[position]);

              // console.log(queenMoves)
              possibleMoves = {...queenMoves, piece: updatedBoardState.board[position]};
              break;
            case "rook":
              let rookMoves = getRookMoves(position, updatedBoardState.board[position]);
              
              // console.log(rookMoves)
              possibleMoves = {...rookMoves, piece: updatedBoardState.board[position]};
              break;
            case "knight":
              let knightMoves = getKnightMoves(position, updatedBoardState.board[position]);

              // console.log(knightMoves);
              possibleMoves = {...knightMoves, piece: updatedBoardState.board[position]};
              break;
            case "bishop":
              let bishopMoves = getBishopMoves(position, updatedBoardState.board[position]);

              // console.log(bishopMoves);
              possibleMoves = {...bishopMoves, piece: updatedBoardState.board[position]};
              break;
            case "pawn":
              let pawnMoves = getPawnMoves(position, updatedBoardState.board[position].player);

              // console.log(pawnMoves);
              possibleMoves = {...pawnMoves, piece: updatedBoardState.board[position]};
              break;
          }

          console.log("possible moves", possibleMoves)
          
          if (possibleMoves.captures && possibleMoves.captures.includes(squareCausingCheck)) {
            console.log("piece can be captured");
            isGameOver = false;
            break;
          } else {
            possibleMoves = {}
          }
      }

      // console.log(possibleMoves)
    }

    return isGameOver;
  }

  const isThisMoveACheck = (square, piece, updatedBoardState) => {
    let nextMoves = [];

    switch (piece.piece) {
      case "queen":
        nextMoves = getQueenMoves(square, piece);
        break;
      case "rook":
        nextMoves = getRookMoves(square, piece);
        break;
      case "knight":
        nextMoves = getKnightMoves(square, piece);
        break;
      case "bishop":
        nextMoves = getBishopMoves(square, piece);
        break;
      case "pawn":
        nextMoves = getPawnMoves(square, piece.player);
        break;
    }

    console.log("next moves", nextMoves);

    // find position of opponent king
    let kingPosition;
    for (let key in updatedBoardState.board) {
      if (updatedBoardState.board[key].piece === "king" && updatedBoardState.board[key].player !== piece.player) {
        kingPosition = key;
      }
    }

    console.log("king position", kingPosition)

    if (nextMoves.captures.includes(kingPosition)) {
      return true;
    } else {
      return false;
    }
  };

  const getPawnMoves = (square, player) => {
    const col = square[0];
    const row = square[1];
    const moves = [];
    const captures = [];

    if (player === "white") {
      //check for valid move
      if (!boardState.board.hasOwnProperty(col + (Number(row) + 1))) {
        moves.push(col + (Number(row) + 1));
        if (
          !boardState.board.hasOwnProperty(col + (Number(row) + 2)) &&
          row == 2
        ) {
          moves.push(col + (Number(row) + 2));
        }
      }
      // check for valid capture
      if (
        boardState.board.hasOwnProperty(
          Number(`${Number(col) + 1}` + `${Number(row) + 1}`)
        ) &&
        boardState.board[Number(`${Number(col) + 1}` + `${Number(row) + 1}`)]
          .player != "white"
      ) {
        captures.push(`${Number(col) + 1}` + `${Number(row) + 1}`);
      }
      if (
        boardState.board.hasOwnProperty(
          Number(`${Number(col) - 1}` + `${Number(row) + 1}`)
        ) &&
        boardState.board[Number(`${Number(col) - 1}` + `${Number(row) + 1}`)]
          .player != "white"
      ) {
        captures.push(`${Number(col) - 1}` + `${Number(row) + 1}`);
      }
    }
    if (player === "black") {
      if (!boardState.board.hasOwnProperty(col + (Number(row) - 1))) {
        moves.push(col + (Number(row) - 1));
        if (
          !boardState.board.hasOwnProperty(col + (Number(row) - 2)) &&
          row == 7
        ) {
          moves.push(col + (Number(row) - 2));
        }
      }
      // check for valid capture
      if (
        boardState.board.hasOwnProperty(
          Number(`${Number(col) + 1}` + `${Number(row) - 1}`)
        ) &&
        boardState.board[Number(`${Number(col) + 1}` + `${Number(row) - 1}`)]
          .player != "black"
      ) {
        captures.push(`${Number(col) + 1}` + `${Number(row) - 1}`);
      }
      if (
        boardState.board.hasOwnProperty(
          Number(`${Number(col) - 1}` + `${Number(row) - 1}`)
        ) &&
        boardState.board[Number(`${Number(col) - 1}` + `${Number(row) - 1}`)]
          .player != "black"
      ) {
        captures.push(`${Number(col) - 1}` + `${Number(row) - 1}`);
      }
    }
    return { moves, captures };
  };

  const getRookMoves = (square, piece) => {
    const col = square[0];
    const row = square[1];
    const moves = [];
    const captures = [];

    // Find valid moves and captures moving forward
    for (let i = Number(row) + 1; i <= 8; i++) {
      if (
        boardState.board.hasOwnProperty(col + i) &&
        boardState.board[col + i].player === piece.player
      ) {
        break;
      }
      if (
        boardState.board.hasOwnProperty(col + i) &&
        boardState.board[col + i].player !== piece.player
      ) {
        captures.push(col + i);
        break;
      }
      moves.push(col + i);
    }

    //find valid moves and captures moving back
    for (let i = Number(row) - 1; i >= 1; i--) {
      if (
        boardState.board.hasOwnProperty(col + i) &&
        boardState.board[col + i].player === piece.player
      ) {
        break;
      }
      if (
        boardState.board.hasOwnProperty(col + i) &&
        boardState.board[col + i].player !== piece.player
      ) {
        captures.push(col + i);
        break;
      }
      moves.push(col + i);
    }

    // Find valid moves and captures moving right
    for (let i = Number(col) + 1; i <= 8; i++) {
      // console.log(i + row);
      if (
        boardState.board.hasOwnProperty(i + row) &&
        boardState.board[i + row].player === piece.player
      ) {
        break;
      }
      if (
        boardState.board.hasOwnProperty(i + row) &&
        boardState.board[i + row].player !== piece.player
      ) {
        captures.push(i + row);
        break;
      }
      moves.push(i + row);
    }

    // Find valid moves and captures moving left
    for (let i = Number(col) - 1; i >= 1; i--) {
      // console.log(i + row);
      if (
        boardState.board.hasOwnProperty(i + row) &&
        boardState.board[i + row].player === piece.player
      ) {
        break;
      }
      if (
        boardState.board.hasOwnProperty(i + row) &&
        boardState.board[i + row].player !== piece.player
      ) {
        captures.push(i + row);
        break;
      }
      moves.push(i + row);
    }

    return { moves, captures };
  };

  const getBishopMoves = (square, piece) => {
    const col = square[0];
    const row = square[1];
    const moves = [];
    const captures = [];

    // Find valid moves and captures moving up/right
    for (let i = 1; i <= 8; i++) {
      const nextCol = Number(col) + i;
      const nextRow = Number(row) + i;
      const nextSquare = `${nextCol}${nextRow}`;

      if (nextCol > 8 || nextRow > 8) {
        break;
      }

      if (boardState.board.hasOwnProperty(nextSquare)) {
        if (boardState.board[nextSquare].player === piece.player) {
          break;
        } else {
          captures.push(nextSquare);
          break;
        }
      } else {
        moves.push(nextSquare);
      }
    }

    // Find valid moves and captures moving up/left
    for (let i = 1; i <= 8; i++) {
      const nextCol = Number(col) - i;
      const nextRow = Number(row) + i;
      const nextSquare = `${nextCol}${nextRow}`;

      if (nextCol < 1 || nextRow > 8) {
        break;
      }

      if (boardState.board.hasOwnProperty(nextSquare)) {
        if (boardState.board[nextSquare].player === piece.player) {
          break;
        } else {
          captures.push(nextSquare);
          break;
        }
      } else {
        moves.push(nextSquare);
      }
    }

    // Find valid moves and captures moving down/left
    for (let i = 1; i <= 8; i++) {
      const nextCol = Number(col) - i;
      const nextRow = Number(row) - i;
      const nextSquare = `${nextCol}${nextRow}`;

      if (nextCol < 1 || nextRow < 1) {
        break;
      }

      if (boardState.board.hasOwnProperty(nextSquare)) {
        if (boardState.board[nextSquare].player === piece.player) {
          break;
        } else {
          captures.push(nextSquare);
          break;
        }
      } else {
        moves.push(nextSquare);
      }
    }

    // Find valid moves and captures moving down/right
    for (let i = 1; i <= 8; i++) {
      const nextCol = Number(col) + i;
      const nextRow = Number(row) - i;
      const nextSquare = `${nextCol}${nextRow}`;

      if (nextCol > 8 || nextRow < 1) {
        break;
      }

      if (boardState.board.hasOwnProperty(nextSquare)) {
        if (boardState.board[nextSquare].player === piece.player) {
          break;
        } else {
          captures.push(nextSquare);
          break;
        }
      } else {
        moves.push(nextSquare);
      }
    }

    return { moves, captures };
  };

  const getKnightMoves = (square, piece) => {
    const col = square[0];
    const row = square[1];
    const moves = [];
    const captures = [];
    const potentialMoves = [];

    //moves up
    potentialMoves.push(`${Number(col) + 1}${Number(row) + 2}`);
    potentialMoves.push(`${Number(col) - 1}${Number(row) + 2}`);
    potentialMoves.push(`${Number(col) + 2}${Number(row) + 1}`);
    potentialMoves.push(`${Number(col) - 2}${Number(row) + 1}`);
    //moves down
    potentialMoves.push(`${Number(col) - 1}${Number(row) - 2}`);
    potentialMoves.push(`${Number(col) + 1}${Number(row) - 2}`);
    potentialMoves.push(`${Number(col) - 2}${Number(row) - 1}`);
    potentialMoves.push(`${Number(col) + 2}${Number(row) - 1}`);

    const validMoves = potentialMoves.filter(
      (move) => Number(move) >= 10 && Number(move) <= 88 && !move.includes("0")
    );

    for (let move of validMoves) {
      if (
        boardState.board.hasOwnProperty(move) &&
        boardState.board[move].player !== piece.player
      ) {
        captures.push(move);
      } else if (!boardState.board.hasOwnProperty(move)) {
        moves.push(move);
      }
    }

    return { moves, captures };
  };

  const getQueenMoves = (square, piece) => {
    const diagonalMoves = getBishopMoves(square, piece);
    const horizontalAndVerticalMoves = getRookMoves(square, piece);
    const moves = [...diagonalMoves.moves, ...horizontalAndVerticalMoves.moves];
    const captures = [
      ...diagonalMoves.captures,
      ...horizontalAndVerticalMoves.captures,
    ];

    return { moves, captures };
  };

  const getKingMoves = (square, piece, color) => {
    const col = square[0];
    const row = square[1];
    const moves = [];
    const captures = [];
    const castle = [];
    const potentialMoves = [];

    // console.log(boardState.board['81'].firstMove);

    potentialMoves.push(col + `${Number(row) + 1}`);
    potentialMoves.push(col + `${Number(row) - 1}`);
    potentialMoves.push(`${Number(col) + 1}` + row);
    potentialMoves.push(`${Number(col) - 1}` + row);
    potentialMoves.push(`${Number(col) + 1}` + `${Number(row) + 1}`);
    potentialMoves.push(`${Number(col) + 1}` + `${Number(row) - 1}`);
    potentialMoves.push(`${Number(col) - 1}` + `${Number(row) + 1}`);
    potentialMoves.push(`${Number(col) - 1}` + `${Number(row) - 1}`);

    const validMoves = potentialMoves.filter(
      (move) => Number(move) >= 10 && Number(move) <= 88 && !move.includes("0")
    );

    for (let move of validMoves) {
      if (
        boardState.board.hasOwnProperty(move) &&
        boardState.board[move].player !== piece.player
      ) {
        captures.push(move);
      } else if (!boardState.board.hasOwnProperty(move)) {
        moves.push(move);
      }
    }

    if (color === "white") {
      // check for possible castle right and left
      if (
        !boardState.board.hasOwnProperty(`${Number(col) + 1}` + row) &&
        !boardState.board.hasOwnProperty(`${Number(col) + 2}` + row) &&
        piece.firstMove === true &&
        boardState.board["81"].firstMove === true
      ) {
        castle.push(`${Number(col) + 2}` + row);
      }
      if (
        !boardState.board.hasOwnProperty(`${Number(col) - 1}` + row) &&
        !boardState.board.hasOwnProperty(`${Number(col) - 2}` + row) &&
        !boardState.board.hasOwnProperty(`${Number(col) - 3}` + row) &&
        piece.firstMove === true &&
        boardState.board["11"].firstMove === true
      ) {
        castle.push(`${Number(col) - 2}` + row);
      }
    } else if (color === "black") {
      if (
        !boardState.board.hasOwnProperty(`${Number(col) + 1}` + row) &&
        !boardState.board.hasOwnProperty(`${Number(col) + 2}` + row) &&
        piece.firstMove === true &&
        boardState.board["88"].firstMove === true
      ) {
        castle.push(`${Number(col) + 2}` + row);
      }
      if (
        !boardState.board.hasOwnProperty(`${Number(col) - 1}` + row) &&
        !boardState.board.hasOwnProperty(`${Number(col) - 2}` + row) &&
        !boardState.board.hasOwnProperty(`${Number(col) - 3}` + row) &&
        piece.firstMove === true &&
        boardState.board["18"].firstMove === true
      ) {
        castle.push(`${Number(col) - 2}` + row);
      }
    }

    console.log(castle);
    return { moves, captures, castle };
  };

  const selectPromotionPiece = (piece) => {
    // Update the board state with the promoted piece
    const updatedBoardState = {
      ...boardState,
      currentPlayer: boardState.currentPlayer === "white" ? "black" : "white",
    };
    updatedBoardState.board[promotionSquare] = piece;

    setBoardState(updatedBoardState);
    setOpen(false);
    setPromotionSquare(null);
  };

  const promotePawn = (updatedBoardState, square) => {
    console.log(square);
    setPromotionSquare(square);
    setOpen(true);
  };

  const handleCastle = (square) => {
    let previousBoardState = { ...boardState };
    switch (square) {
      case "71":
        delete previousBoardState.board["51"];
        delete previousBoardState.board["81"];
        const updatedBoardState = {
          ...previousBoardState,
          currentPlayer:
            previousBoardState.currentPlayer === "white" ? "black" : "white",
        };
        updatedBoardState.board["71"] = {
          piece: "king",
          player: "white",
          firstMove: false,
        };
        updatedBoardState.board["61"] = {
          piece: "rook",
          player: "white",
          firstMove: false,
        };
        updatedBoardState.validMoves.possibleMoves = [];
        updatedBoardState.validMoves.possibleCaptures = [];
        updatedBoardState.validMoves.possibleCastles = [];
        setBoardState(updatedBoardState);
        break;
      case "31":
        delete previousBoardState.board["51"];
        delete previousBoardState.board["11"];
        const updatedBoardState1 = {
          ...previousBoardState,
          currentPlayer:
            previousBoardState.currentPlayer === "white" ? "black" : "white",
        };
        updatedBoardState1.board["31"] = {
          piece: "king",
          player: "white",
          firstMove: false,
        };
        updatedBoardState1.board["41"] = {
          piece: "rook",
          player: "white",
          firstMove: false,
        };
        updatedBoardState1.validMoves.possibleMoves = [];
        updatedBoardState1.validMoves.possibleCaptures = [];
        updatedBoardState1.validMoves.possibleCastles = [];
        setBoardState(updatedBoardState1);
        break;
      case "78":
        delete previousBoardState.board["58"];
        delete previousBoardState.board["88"];
        const updatedBoardState2 = {
          ...previousBoardState,
          currentPlayer:
            previousBoardState.currentPlayer === "white" ? "black" : "white",
        };
        updatedBoardState2.board["78"] = {
          piece: "king",
          player: "black",
          firstMove: false,
        };
        updatedBoardState2.board["68"] = {
          piece: "rook",
          player: "black",
          firstMove: false,
        };
        updatedBoardState2.validMoves.possibleMoves = [];
        updatedBoardState2.validMoves.possibleCaptures = [];
        updatedBoardState2.validMoves.possibleCastles = [];
        setBoardState(updatedBoardState2);
        break;
      case "38":
        delete previousBoardState.board["58"];
        delete previousBoardState.board["18"];
        const updatedBoardState3 = {
          ...previousBoardState,
          currentPlayer:
            previousBoardState.currentPlayer === "white" ? "black" : "white",
        };
        updatedBoardState3.board["38"] = {
          piece: "king",
          player: "black",
          firstMove: false,
        };
        updatedBoardState3.board["48"] = {
          piece: "rook",
          player: "black",
          firstMove: false,
        };
        updatedBoardState3.validMoves.possibleMoves = [];
        updatedBoardState3.validMoves.possibleCaptures = [];
        updatedBoardState3.validMoves.possibleCastles = [];
        setBoardState(updatedBoardState3);
        break;
    }
  };

  const renderSquare = (square, isDark) => {
    const piece = boardState.board[square];
    const isValidMove = boardState.validMoves.possibleMoves.includes(square);
    const isValidCapture =
      boardState.validMoves.possibleCaptures.includes(square);
    const isValidCastle =
      boardState.validMoves.possibleCastles.includes(square);

    // Check if the square is empty
    if (!piece) {
      return (
        <>
          {isValidMove ? (
            <div
              className={`square ${isDark ? "dark" : "light"}-square ${square}`}
              onClick={() => makeMove(square)}
            >
              <div className="valid-move-dot" />
            </div>
          ) : (
            <div
              className={`square ${isDark ? "dark" : "light"}-square ${square}`}
            >
              {isValidCastle && (
                <div
                  className="valid-capture-ring"
                  onClick={() => handleCastle(square)}
                />
              )}
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
        promotePawn={promotePawn}
        getPawnMoves={getPawnMoves}
        getBishopMoves={getBishopMoves}
        getKnightMoves={getKnightMoves}
        getRookMoves={getRookMoves}
        getQueenMoves={getQueenMoves}
        getKingMoves={getKingMoves}
      />
    );
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
          <Grid
            container
            item
            key={row}
            className={`board-row ${index % 2 === 0 ? "light" : "dark"}-row`}
          >
            {renderRow(row)}
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <div style={{ width: "484px" }}>
      {inCheckStatus && <Typography variant="h5" textAlign="center">Check!</Typography>}
      {renderBoard()}
      <PawnPromotionModal
        boardState={boardState}
        selectPromotionPiece={selectPromotionPiece}
        open={open}
      />
    </div>
  );
};

export default ChessBoard;
