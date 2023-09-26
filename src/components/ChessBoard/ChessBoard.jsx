import React from "react";
import Piece from "../Piece/Piece";
import { Divider, Grid, Typography } from "@mui/material";
import { useState, useEffect } from "react";

import _ from "lodash";

import PawnPromotionModal from "../PawnPromotionModal/PawnPromotionModal";

// to do:
// test pawn promotion to check

const ChessBoard = () => {
  const [boardState, setBoardState] = useState({
    board: {
      11: { piece: "rook", player: "white", firstMove: false },
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
      76: { piece: "pawn", player: "white" },
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
  const [promotionBoardState, setPromotionBoardState] = useState({});
  const [promotionSquare, setPromotionSquare] = useState(null);
  const [inCheckStatus, setInCheckStatus] = useState(false);
  const [checkmate, setCheckmate] = useState(false);

  console.log("board state", boardState);
  console.log("inCheckStatus", inCheckStatus);
  console.log("checkmate status", checkmate);

  useEffect(() => {
    // console.log("Board state updated:", boardState);
  }, [boardState.validMoves,]);

  const makeMove = async (square) => {
    // Create a copy of the boardState object
    let previousBoardState = { ...boardState };

    // Remove the key from the copied boardState object
    const previousPieceSquare = boardState.validMoves.pieceSquare;
    delete previousBoardState.board[previousPieceSquare];

    let updatedBoardState = {
      ...previousBoardState,
      currentPlayer: previousBoardState.currentPlayer === "white" ? "black" : "white",
    };
    updatedBoardState.board[square] = boardState.validMoves.piece;
    updatedBoardState.validMoves.possibleMoves = [];
    updatedBoardState.validMoves.possibleCaptures = [];

    // the piece - yes
    console.log("piece making the move?", updatedBoardState.board[square]);
    // the square it is now on
    console.log("square after the move is made?", square);

    // change first move property to false on the first move
    if (updatedBoardState.board[square].hasOwnProperty("firstMove")) {
      updatedBoardState.board[square].firstMove = false;
    }

    // check for pawn promotion
    if (updatedBoardState.board[square].piece === "pawn" && (square[1] == 8 || square[1] == 1)) {
      console.log("promoting pawn")
      promotePawn(updatedBoardState, square);
    } else {
      console.log("not promoting pawn")
      const clonedBoardState = _.cloneDeep(updatedBoardState);
      // check if the game is over
      const isThisCheckmate = isGameOver(square, updatedBoardState.board[square], clonedBoardState);
      console.log("is this checkmate val", isThisCheckmate);

      if (isThisCheckmate) {
        console.log("game over chump");
        setBoardState(updatedBoardState);
        setCheckmate(true);
      } else if (isThisMoveACheck(square, updatedBoardState.board[square], updatedBoardState) && !inCheckStatus) {
        // save check status to generate valid moves for escaping check
        setInCheckStatus(true);
        setBoardState(updatedBoardState);
        console.log("major major we have a check");
      } else {
        setInCheckStatus(false);
        setBoardState(updatedBoardState);
      }
    }
  };

  const isGameOver = (squareCausingCheck, pieceCausingCheck, updatedBoardState) => {
    let isGameOver = true;
    let possibleMoves;
  
    // get all moves
    for (let position in updatedBoardState.board) {
      if (updatedBoardState.board[position].player === updatedBoardState.currentPlayer) {
        possibleMoves = getPieceMoves(position, updatedBoardState.board[position], updatedBoardState);
  
        console.log("all possible moves", possibleMoves);
  
        // check if piece can be captured, make sure piece is not protected
        if (
          possibleMoves?.captures &&
          possibleMoves.captures.includes(squareCausingCheck) &&
          !isPieceProtected(squareCausingCheck, updatedBoardState)
        ) {
          console.log("piece can be captured");
          isGameOver = false;
          break;
        }
  
        // check if move can block check
        if (possibleMoves?.moves) {
          for (let move of possibleMoves.moves) {
            // Create test board state modeling the move as made
            let testBoardState = _.cloneDeep(updatedBoardState);
            // Remove the previous square
            delete testBoardState.board[position];
            // Add the new move
            testBoardState.board[move] = possibleMoves.piece;
            // Use test board state to see if it blocks check
            if (!amIStillInCheck(testBoardState, updatedBoardState.currentPlayer, true)) {
              console.log("check can be blocked");
              isGameOver = false;
              break;
            }
          }
        }
        possibleMoves = {};
      }
    }
  
    return isGameOver;
  };
  

  const isPieceProtected = (square, updatedBoardState) => {
    let isPieceProtected = false;
    let possibleMoves;

    console.log("board in is piece protected", updatedBoardState);

    // get all moves
    for (let position in updatedBoardState.board) {
      if (updatedBoardState.board[position].player !== updatedBoardState.currentPlayer) {
        // am i trying to make sure the king is not protected?
        // chanded to !== king 9/24, seems to fix the is piece protected functionality
        // if (updatedBoardState.board[position].piece !== "king") {
        possibleMoves = getPieceMoves(position, updatedBoardState.board[position], updatedBoardState);
        // }

        console.log("possible moves", possibleMoves);

        // check if piece is protected
        if (possibleMoves?.selfCaptures && possibleMoves.selfCaptures.includes(square)) {
          console.log("piece cannot be captured");
          isPieceProtected = true;
          break;
        }
        possibleMoves = {};
      }
    }

    return isPieceProtected;
  };

  const getKingPosition = (boardState, player) => {
    for (let key in boardState.board) {
      if (boardState.board[key].piece === "king" && boardState.board[key].player !== player) {
        return key;
      }
    }
  };

  const getPieceMoves = (square, pieceObj, boardState) => {
    // console.log("square", square);
    // console.log(pieceObj)
    let possibleMoves;
    switch (pieceObj.piece) {
      case "queen":
        let queenMoves = getQueenMoves(square, pieceObj, boardState);

        // added piece to make sense of moves being created, may need to remove it
        possibleMoves = {
          ...queenMoves,
          piece: pieceObj,
        };
        break;
      case "rook":
        let rookMoves = getRookMoves(square, pieceObj, boardState);

        possibleMoves = {
          ...rookMoves,
          piece: pieceObj,
        };
        break;
      case "knight":
        let knightMoves = getKnightMoves(square, pieceObj, boardState);

        knightMoves.moves = knightMoves.moves.filter((move) => move[1] !== "9");

        possibleMoves = {
          ...knightMoves,
          piece: pieceObj,
        };
        break;
      case "bishop":
        let bishopMoves = getBishopMoves(square, pieceObj, boardState);

        possibleMoves = {
          ...bishopMoves,
          piece: pieceObj,
        };
        break;
      case "pawn":
        let pawnMoves = getPawnMoves(square, pieceObj.player, boardState);

        possibleMoves = {
          ...pawnMoves,
          piece: pieceObj,
        };
        break;
      case "king":
        let kingMoves = getKingMoves(square, pieceObj, pieceObj.player, boardState);

        possibleMoves = {
          ...kingMoves,
          piece: pieceObj,
        };
        break;
    }

    return possibleMoves;
  };

  const isThisMoveACheck = (square, piece, updatedBoardState) => {
    let nextMoves = [];

    // use board state or updated board state ??
    switch (piece.piece) {
      case "queen":
        nextMoves = getQueenMoves(square, piece, updatedBoardState);
        break;
      case "rook":
        nextMoves = getRookMoves(square, piece, updatedBoardState);
        break;
      case "knight":
        nextMoves = getKnightMoves(square, piece, updatedBoardState);
        break;
      case "bishop":
        nextMoves = getBishopMoves(square, piece, updatedBoardState);
        break;
      case "pawn":
        nextMoves = getPawnMoves(square, piece.player, updatedBoardState);
        break;
    }

    console.log("next moves", nextMoves);

    // find position of opponent king - refactor to function
    let kingPosition = getKingPosition(updatedBoardState, piece.player);

    console.log("king position", kingPosition);

    if (nextMoves.captures && nextMoves.captures.includes(kingPosition)) {
      return true;
    } else {
      return false;
    }
  };

  const amIStillInCheck = (updatedBoardState, currentPlayer, isRecursive = false) => {
    // Find the position of the current player's king
    const kingPosition = getKingPosition(updatedBoardState, getOpponent(currentPlayer));

    console.log("king position", kingPosition);

    // Get all possible moves for the opponent
    const opponentMoves = getAllPossibleMovesForPlayer(getOpponent(currentPlayer), updatedBoardState, true);

    console.log("opponent moves", opponentMoves);

    // Check if the opponent can capture the king
    if (opponentMoves.includes(kingPosition)) {
      return true;
    }

    return false;
  };

  const getAllPossibleMovesForPlayer = (currentPlayer, boardState, isCheckingForCheck = false) => {
    const allPossibleMoves = [];

    // Iterate through the board to find pieces of the current player
    for (const square in boardState.board) {
      const piece = boardState.board[square];

      // Check if the piece belongs to the current player
      if (piece.player === currentPlayer) {
        console.log("current player", currentPlayer);
        // Use the piece-specific move function to get its moves
        const pieceMoves = getPieceMoves(square, piece, boardState, isCheckingForCheck);

        // Add the moves to the list of all possible moves
        allPossibleMoves.push(...pieceMoves.moves, ...pieceMoves.captures);
      }
    }
    return allPossibleMoves;
  };

  const getOpponent = (currentPlayer) => {
    return currentPlayer === "white" ? "black" : "white";
  };

  const getPawnMoves = (square, player, boardState, isCheckingForCheck = false) => {
    const col = square[0];
    const row = square[1];
    const moves = [];
    const captures = [];
    const selfCaptures = [];

    if (player === "white") {
      // Check for valid move
      if (!boardState.board.hasOwnProperty(col + (Number(row) + 1))) {
        const targetSquare1 = col + (Number(row) + 1);
        const tempBoardState1 = _.cloneDeep(boardState);

        // Apply the move to the temporary board state
        tempBoardState1.board[targetSquare1] = { type: "pawn", player: "white" };
        delete tempBoardState1.board[square]; // Remove the pawn from its original position

        if (!isCheckingForCheck || !amIStillInCheck(tempBoardState1, boardState.currentPlayer, true)) {
          moves.push(targetSquare1);
        }

        if (!boardState.board.hasOwnProperty(col + (Number(row) + 2)) && row == 2) {
          const targetSquare2 = col + (Number(row) + 2);
          const tempBoardState2 = _.cloneDeep(boardState);

          // Apply the move to the temporary board state
          tempBoardState2.board[targetSquare2] = { type: "pawn", player: "white" };
          delete tempBoardState2.board[square]; // Remove the pawn from its original position

          if (!isCheckingForCheck || !amIStillInCheck(tempBoardState2, boardState.currentPlayer, true)) {
            moves.push(targetSquare2);
          }
        }
      }

      // Check for valid capture in front of the pawn
      if (boardState.board.hasOwnProperty(Number(`${Number(col) + 1}` + `${Number(row) + 1}`))) {
        if (boardState.board[Number(`${Number(col) + 1}` + `${Number(row) + 1}`)].player !== "white") {
          const targetSquareCapture1 = `${Number(col) + 1}` + `${Number(row) + 1}`;
          const tempBoardStateCapture1 = _.cloneDeep(boardState);

          // Apply the capture to the temporary board state
          delete tempBoardStateCapture1.board[square];

          if (!isCheckingForCheck || !amIStillInCheck(tempBoardStateCapture1, boardState.currentPlayer, true)) {
            captures.push(targetSquareCapture1);
          }
        } else {
          selfCaptures.push(`${Number(col) + 1}` + `${Number(row) + 1}`);
        }
      }

      if (boardState.board.hasOwnProperty(Number(`${Number(col) - 1}` + `${Number(row) + 1}`))) {
        if (boardState.board[Number(`${Number(col) - 1}` + `${Number(row) + 1}`)].player !== "white") {
          const targetSquareCapture2 = `${Number(col) - 1}` + `${Number(row) + 1}`;
          const tempBoardStateCapture2 = _.cloneDeep(boardState);

          // Apply the capture to the temporary board state
          delete tempBoardStateCapture2.board[square];

          if (!isCheckingForCheck || !amIStillInCheck(tempBoardStateCapture2, boardState.currentPlayer, true)) {
            captures.push(targetSquareCapture2);
          }
        } else {
          selfCaptures.push(`${Number(col) - 1}` + `${Number(row) + 1}`);
        }
      }
    }

    if (player === "black") {
      // Check for valid move
      if (!boardState.board.hasOwnProperty(col + (Number(row) - 1))) {
        const targetSquare1 = col + (Number(row) - 1);
        const tempBoardState1 = _.cloneDeep(boardState);

        // Apply the move to the temporary board state
        tempBoardState1.board[targetSquare1] = { type: "pawn", player: "black" };
        delete tempBoardState1.board[square]; // Remove the pawn from its original position

        if (!isCheckingForCheck || !amIStillInCheck(tempBoardState1, boardState.currentPlayer, true)) {
          moves.push(targetSquare1);
        }

        if (!boardState.board.hasOwnProperty(col + (Number(row) - 2)) && row == 7) {
          const targetSquare2 = col + (Number(row) - 2);
          const tempBoardState2 = _.cloneDeep(boardState);

          // Apply the move to the temporary board state
          tempBoardState2.board[targetSquare2] = { type: "pawn", player: "black" };
          delete tempBoardState2.board[square]; // Remove the pawn from its original position

          if (!isCheckingForCheck || !amIStillInCheck(tempBoardState2, boardState.currentPlayer, true)) {
            moves.push(targetSquare2);
          }
        }
      }

      // Check for valid capture in front of the pawn
      if (boardState.board.hasOwnProperty(Number(`${Number(col) + 1}` + `${Number(row) - 1}`))) {
        if (boardState.board[Number(`${Number(col) + 1}` + `${Number(row) - 1}`)].player !== "black") {
          const targetSquareCapture1 = `${Number(col) + 1}` + `${Number(row) - 1}`;
          const tempBoardStateCapture1 = _.cloneDeep(boardState);

          // Apply the capture to the temporary board state
          delete tempBoardStateCapture1.board[square];

          if (!isCheckingForCheck || !amIStillInCheck(tempBoardStateCapture1, boardState.currentPlayer, true)) {
            captures.push(targetSquareCapture1);
          }
        } else {
          selfCaptures.push(`${Number(col) + 1}` + `${Number(row) - 1}`);
        }
      }

      if (boardState.board.hasOwnProperty(Number(`${Number(col) - 1}` + `${Number(row) - 1}`))) {
        if (boardState.board[Number(`${Number(col) - 1}` + `${Number(row) - 1}`)].player !== "black") {
          const targetSquareCapture2 = `${Number(col) - 1}` + `${Number(row) - 1}`;
          const tempBoardStateCapture2 = _.cloneDeep(boardState);

          // Apply the capture to the temporary board state
          delete tempBoardStateCapture2.board[square];

          if (!isCheckingForCheck || !amIStillInCheck(tempBoardStateCapture2, boardState.currentPlayer, true)) {
            captures.push(targetSquareCapture2);
          }
        } else {
          selfCaptures.push(`${Number(col) - 1}` + `${Number(row) - 1}`);
        }
      }
    }

    return { moves, captures, selfCaptures };
  };

  const getRookMoves = (square, piece, boardState, isCheckingForCheck = false) => {
    const col = square[0];
    const row = square[1];
    const moves = [];
    const captures = [];
    const selfCaptures = [];

    // Define the possible directions a rook can move
    const directions = [
      { col: 0, row: 1 }, // Up
      { col: 0, row: -1 }, // Down
      { col: 1, row: 0 }, // Right
      { col: -1, row: 0 }, // Left
    ];

    // Calculate potential moves for each direction
    directions.forEach((direction) => {
      for (let i = 1; i <= 8; i++) {
        const nextCol = Number(col) + direction.col * i;
        const nextRow = Number(row) + direction.row * i;
        const nextSquare = `${nextCol}${nextRow}`;

        if (nextCol < 1 || nextCol > 8 || nextRow < 1 || nextRow > 8) {
          break;
        }

        const tempBoardState = _.cloneDeep(boardState);

        // Apply the move to the temporary board state
        tempBoardState.board[nextSquare] = piece;
        delete tempBoardState.board[square]; // Remove the piece from its original position

        if (boardState.board.hasOwnProperty(nextSquare)) {
          if (boardState.board[nextSquare].player === piece.player) {
            selfCaptures.push(nextSquare);
            break;
          } else {
            if (!isCheckingForCheck || !amIStillInCheck(tempBoardState, boardState.currentPlayer, true)) {
              captures.push(nextSquare);
            }
          }
          break; // Stop checking in this direction after capturing an opponent's piece
        } else {
          if (!isCheckingForCheck || !amIStillInCheck(tempBoardState, boardState.currentPlayer, true)) {
            moves.push(nextSquare);
          }
        }
      }
    });

    return { moves, captures, selfCaptures };
  };

  const getBishopMoves = (square, piece, boardState, isCheckingForCheck = false) => {
    const col = square[0];
    const row = square[1];
    const moves = [];
    const captures = [];
    const selfCaptures = [];

    // Define the possible directions a bishop can move
    const directions = [
      { col: 1, row: 1 }, // Up-right
      { col: -1, row: 1 }, // Up-left
      { col: -1, row: -1 }, // Down-left
      { col: 1, row: -1 }, // Down-right
    ];

    // Calculate potential moves for each direction
    directions.forEach((direction) => {
      for (let i = 1; i <= 8; i++) {
        const nextCol = Number(col) + direction.col * i;
        const nextRow = Number(row) + direction.row * i;
        const nextSquare = `${nextCol}${nextRow}`;

        if (nextCol < 1 || nextCol > 8 || nextRow < 1 || nextRow > 8) {
          break;
        }

        const tempBoardState = _.cloneDeep(boardState);

        // Apply the move to the temporary board state
        tempBoardState.board[nextSquare] = piece;
        delete tempBoardState.board[square]; // Remove the piece from its original position

        if (boardState.board.hasOwnProperty(nextSquare)) {
          if (boardState.board[nextSquare].player === piece.player) {
            selfCaptures.push(nextSquare);
            break;
          } else {
            if (!isCheckingForCheck || !amIStillInCheck(tempBoardState, boardState.currentPlayer, true)) {
              captures.push(nextSquare);
            }
          }
          break; // Stop checking in this direction after capturing an opponent's piece
        } else {
          if (!isCheckingForCheck || !amIStillInCheck(tempBoardState, boardState.currentPlayer, true)) {
            moves.push(nextSquare);
          }
        }
      }
    });

    return { moves, captures, selfCaptures };
  };

  const getKnightMoves = (square, piece, boardState, isCheckingForCheck = false) => {
    const col = square[0];
    const row = square[1];
    const moves = [];
    const captures = [];
    const selfCaptures = [];
    const potentialMoves = [];

    // Moves up
    potentialMoves.push(`${Number(col) + 1}${Number(row) + 2}`);
    potentialMoves.push(`${Number(col) - 1}${Number(row) + 2}`);
    potentialMoves.push(`${Number(col) + 2}${Number(row) + 1}`);
    potentialMoves.push(`${Number(col) - 2}${Number(row) + 1}`);

    // Moves down
    potentialMoves.push(`${Number(col) - 1}${Number(row) - 2}`);
    potentialMoves.push(`${Number(col) + 1}${Number(row) - 2}`);
    potentialMoves.push(`${Number(col) - 2}${Number(row) - 1}`);
    potentialMoves.push(`${Number(col) + 2}${Number(row) - 1}`);

    const validMoves = potentialMoves.filter((move) => Number(move) >= 10 && Number(move) <= 88 && !move.includes("0"));

    for (let move of validMoves) {
      const tempBoardState = _.cloneDeep(boardState);

      // Apply the move to the temporary board state
      tempBoardState.board[move] = piece;
      delete tempBoardState.board[square]; // Remove the piece from its original position

      if (boardState.board.hasOwnProperty(move) && boardState.board[move].player !== piece.player) {
        if (!isCheckingForCheck || !amIStillInCheck(tempBoardState, boardState.currentPlayer, true)) {
          captures.push(move);
        }
      } else if (!boardState.board.hasOwnProperty(move)) {
        if (!isCheckingForCheck || !amIStillInCheck(tempBoardState, boardState.currentPlayer, true)) {
          moves.push(move);
        }
      } else {
        selfCaptures.push(move);
      }
    }

    return { moves, captures, selfCaptures };
  };

  const getQueenMoves = (square, piece, boardState, isCheckingForCheck = false) => {
    const diagonalMoves = getBishopMoves(square, piece, boardState, isCheckingForCheck);
    const horizontalAndVerticalMoves = getRookMoves(square, piece, boardState, isCheckingForCheck);
    const moves = [...diagonalMoves.moves, ...horizontalAndVerticalMoves.moves];
    const captures = [...diagonalMoves.captures, ...horizontalAndVerticalMoves.captures];
    const selfCaptures = [...diagonalMoves.selfCaptures, ...horizontalAndVerticalMoves.selfCaptures];

    return { moves, captures, selfCaptures };
  };

  const getKingMoves = (square, piece, color, boardState, isCheckingForCheck = false) => {
    const col = square[0];
    const row = square[1];
    const moves = [];
    const captures = [];
    const castle = [];
    const potentialMoves = [];
    const selfCaptures = [];

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
      (move) => Number(move) >= 10 && Number(move) <= 88 && !move.includes("0") && !move.includes("9")
    );

    for (let move of validMoves) {
      const tempBoardState = _.cloneDeep(boardState);

      tempBoardState.board[move] = piece;
      delete tempBoardState.board[square];

      if (boardState.board.hasOwnProperty(move) && boardState.board[move].player !== piece.player) {
        // Check if capturing would put the king in check
        if (!isCheckingForCheck || !amIStillInCheck(tempBoardState, boardState.currentPlayer, true)) {
          captures.push(move);
        }
      } else if (!boardState.board.hasOwnProperty(move)) {
        // Check if moving would put the king in check
        if (!isCheckingForCheck || !amIStillInCheck(tempBoardState, boardState.currentPlayer, true)) {
          moves.push(move);
        }
      } else {
        selfCaptures.push(move);
      }
    }

    // castle logic
    if (color === "white" && !inCheckStatus) {
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
    } else if (color === "black" && !inCheckStatus) {
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

    return { moves, captures, castle, selfCaptures };
  };

  const selectPromotionPiece = (piece, square, promotionBoardState) => {
    console.log(piece);
    console.log(square);
    console.log(promotionBoardState);

    // Update the copy of board state
    delete promotionBoardState.board[Number(square)];
    promotionBoardState.board[Number(square)] = piece;

    console.log("!!!!! promotionBoardState before setting new state", promotionBoardState);

    const clonedBoardState = _.cloneDeep(promotionBoardState);

    // check if the game is over
    const isThisCheckmate = isGameOver(square, clonedBoardState.board[square], clonedBoardState);

    if (isThisCheckmate) {
      console.log("game over chump");
      setBoardState(clonedBoardState);
      setCheckmate(true);
    } else if (isThisMoveACheck(square, clonedBoardState.board[square], promotionBoardState) && !inCheckStatus) {
      setInCheckStatus(true);
      setBoardState(clonedBoardState);
      console.log("major major we have a check");
    } else {
      setInCheckStatus(false);
      setBoardState(clonedBoardState);
    }
    // setBoardState(promotionBoardState);
    setPromotionBoardState({});
    setPromotionSquare(null);
    setOpen(false);
  };

  const promotePawn = (updatedBoardState, square) => {
    setPromotionBoardState(updatedBoardState);
    setPromotionSquare(square);
    // Open the modal and wait for user interaction
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
          currentPlayer: previousBoardState.currentPlayer === "white" ? "black" : "white",
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
          currentPlayer: previousBoardState.currentPlayer === "white" ? "black" : "white",
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
          currentPlayer: previousBoardState.currentPlayer === "white" ? "black" : "white",
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
          currentPlayer: previousBoardState.currentPlayer === "white" ? "black" : "white",
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
        promotePawn={promotePawn}
        getPawnMoves={getPawnMoves}
        getBishopMoves={getBishopMoves}
        getKnightMoves={getKnightMoves}
        getRookMoves={getRookMoves}
        getQueenMoves={getQueenMoves}
        getKingMoves={getKingMoves}
        setInCheckStatus={setInCheckStatus}
        isGameOver={isGameOver}
        isThisMoveACheck={isThisMoveACheck}
        inCheckStatus={inCheckStatus}
        setCheckmate={setCheckmate}
        checkmate={checkmate}
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
          <Grid container item key={row} className={`board-row ${index % 2 === 0 ? "light" : "dark"}-row`}>
            {renderRow(row)}
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <div style={{ width: "484px" }}>
      {inCheckStatus && (
        <Typography variant="h5" textAlign="center">
          Check!
        </Typography>
      )}
      {checkmate && (
        <Typography variant="h5" textAlign="center">
          Checkmate! {getOpponent(boardState.currentPlayer)} wins!
        </Typography>
      )}
      {renderBoard()}
      <PawnPromotionModal
        boardState={boardState}
        selectPromotionPiece={selectPromotionPiece}
        open={open}
        promotionBoardState={promotionBoardState}
        promotionSquare={promotionSquare}
      />
    </div>
  );
};

export default ChessBoard;
