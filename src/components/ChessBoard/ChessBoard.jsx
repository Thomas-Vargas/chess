import React from "react";
import Piece from "../Piece/Piece";
import { Divider, Grid, Typography } from "@mui/material";
import { useState, useEffect } from "react";

import _ from "lodash";

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
      currentPlayer: previousBoardState.currentPlayer === "white" ? "black" : "white",
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
    if (updatedBoardState.board[square].piece === "pawn" && (square[1] == 8 || square[1] == 1)) {
      promotePawn(updatedBoardState, square);
      // setBoardState(updatedBoardState);
    } else {
      // check for check
      if (isThisMoveACheck(square, updatedBoardState.board[square], updatedBoardState)) {
        console.log("major major we have a check");

        const clonedBoardState = _.cloneDeep(updatedBoardState);
        // check if game is over
        if (isGameOver(square, updatedBoardState.board[square], clonedBoardState)) {
          console.log("game over chump");
        } else {
          console.log("the show goes on");
        }

        // save check status to generate valid moves for escaping check
        setInCheckStatus(true);
      }

      // only for testing, remove later
      // if (isGameOver(square, updatedBoardState.board[square], clonedBoardState)) {
      // }

      updatedBoardState.validMoves.possibleMoves = [];
      updatedBoardState.validMoves.possibleCaptures = [];

      // update board state with new move
      setBoardState(updatedBoardState);
    }
  };

  const isGameOver = (squareCausingCheck, pieceCausingCheck, updatedBoardState) => {
    let isGameOver = true;
    // console.log("piece in is game over", pieceCausingCheck);
    // console.log("board state in isgameover", updatedBoardState);
    // console.log("square cuasing check", squareCausingCheck);
    let possibleMoves;

    // get all moves
    for (let position in updatedBoardState.board) {
      if (updatedBoardState.board[position].player === updatedBoardState.currentPlayer) {
        possibleMoves = getPieceMoves(position, updatedBoardState.board[position], updatedBoardState);

        console.log("possible moves", possibleMoves);

        // check if piece can be captured
        if (possibleMoves?.captures && possibleMoves.captures.includes(squareCausingCheck)) {
          console.log("piece can be captured");
          isGameOver = false;
          break;
        }

        // check if move can block check
        if (possibleMoves?.moves) {
          for (let move of possibleMoves.moves) {
            let previousSquare = position;
            // console.log("piece making the move", possibleMoves.piece);
            // console.log("possible move to avoid mate", move);
            // console.log("previous square", previousSquare);

            // create test board state modeling the move as made
            let previousBoardState = _.cloneDeep(updatedBoardState);
            //remove previous square
            delete previousBoardState.board[previousSquare];
            // add new move
            let testBoardState = {
              ...previousBoardState,
              currentPlayer: previousBoardState.currentPlayer === "white" ? "black" : "white",
            };
            testBoardState.board[move] = possibleMoves.piece;

            // console.log("new board state with test move:", testBoardState);

            // use test board state to see if it blocks check
            // find legal moves for piece that made the check
            // check if it can still capture the king
            const checkPieceMoves = getPieceMoves(squareCausingCheck, pieceCausingCheck, testBoardState);

            // get correct king
            const kingPosition = getKingPosition(testBoardState, pieceCausingCheck.player);

            // console.log("king position", kingPosition);
            // console.log("checkPieceMoves:", checkPieceMoves);

            if (!checkPieceMoves.captures.includes(kingPosition)) {
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

  const isPieceProtected = (square, piece, updatedBoardState) => {
    let isPieceProtected = false;
    let possibleMoves;

        // get all moves
        for (let position in updatedBoardState.board) {
          if (updatedBoardState.board[position].player === updatedBoardState.currentPlayer) {
            possibleMoves = getPieceMoves(position, updatedBoardState.board[position], updatedBoardState);
    
            console.log("possible moves", possibleMoves);
    
            // check if piece can be captured
            if (possibleMoves?.captures && possibleMoves.captures.includes(square)) {
              console.log("piece can be captured");
              isGameOver = false;
              break;
            }
    
            // check if move can block check
            if (possibleMoves?.moves) {
              for (let move of possibleMoves.moves) {
                let previousSquare = position;
                // console.log("piece making the move", possibleMoves.piece);
                // console.log("possible move to avoid mate", move);
                // console.log("previous square", previousSquare);
    
                // create test board state modeling the move as made
                let previousBoardState = _.cloneDeep(updatedBoardState);
                //remove previous square
                delete previousBoardState.board[previousSquare];
                // add new move
                let testBoardState = {
                  ...previousBoardState,
                  currentPlayer: previousBoardState.currentPlayer === "white" ? "black" : "white",
                };
                testBoardState.board[move] = possibleMoves.piece;
    
                // console.log("new board state with test move:", testBoardState);
    
                // use test board state to see if it blocks check
                // find legal moves for piece that made the check
                // check if it can still capture the king
                const checkPieceMoves = getPieceMoves(square, piece, testBoardState);
    
                // console.log("king position", kingPosition);
                // console.log("checkPieceMoves:", checkPieceMoves);
    
                // if (!checkPieceMoves.captures.includes(kingPosition)) {
                //   isGameOver = false;
                //   break;
                // }
              }
            }
            possibleMoves = {};
          }
        }
    
        return isGameOver;
  }

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

        console.log(knightMoves);
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

  const getPawnMoves = (square, player, boardState) => {
    const col = square[0];
    const row = square[1];
    const moves = [];
    const captures = [];
    const selfCaptures = [];
  
    if (player === "white") {
      // Check for valid move
      if (!boardState.board.hasOwnProperty(col + (Number(row) + 1))) {
        moves.push(col + (Number(row) + 1));
        if (!boardState.board.hasOwnProperty(col + (Number(row) + 2)) && row == 2) {
          moves.push(col + (Number(row) + 2));
        }
      }
  
      // Check for valid capture in front of the pawn
      if (
        boardState.board.hasOwnProperty(Number(`${Number(col) + 1}` + `${Number(row) + 1}`))
      ) {
        if (boardState.board[Number(`${Number(col) + 1}` + `${Number(row) + 1}`)].player !== "white") {
          captures.push(`${Number(col) + 1}` + `${Number(row) + 1}`);
        } else {
          selfCaptures.push(`${Number(col) + 1}` + `${Number(row) + 1}`);
        }
      }
  
      if (
        boardState.board.hasOwnProperty(Number(`${Number(col) - 1}` + `${Number(row) + 1}`))
      ) {
        if (boardState.board[Number(`${Number(col) - 1}` + `${Number(row) + 1}`)].player !== "white") {
          captures.push(`${Number(col) - 1}` + `${Number(row) + 1}`);
        } else {
          selfCaptures.push(`${Number(col) - 1}` + `${Number(row) + 1}`);
        }
      }
    }
  
    if (player === "black") {
      // Check for valid move
      if (!boardState.board.hasOwnProperty(col + (Number(row) - 1))) {
        moves.push(col + (Number(row) - 1));
        if (!boardState.board.hasOwnProperty(col + (Number(row) - 2)) && row == 7) {
          moves.push(col + (Number(row) - 2));
        }
      }
  
      // Check for valid capture in front of the pawn
      if (
        boardState.board.hasOwnProperty(Number(`${Number(col) + 1}` + `${Number(row) - 1}`))
      ) {
        if (boardState.board[Number(`${Number(col) + 1}` + `${Number(row) - 1}`)].player !== "black") {
          captures.push(`${Number(col) + 1}` + `${Number(row) - 1}`);
        } else {
          selfCaptures.push(`${Number(col) + 1}` + `${Number(row) - 1}`);
        }
      }
  
      if (
        boardState.board.hasOwnProperty(Number(`${Number(col) - 1}` + `${Number(row) - 1}`))
      ) {
        if (boardState.board[Number(`${Number(col) - 1}` + `${Number(row) - 1}`)].player !== "black") {
          captures.push(`${Number(col) - 1}` + `${Number(row) - 1}`);
        } else {
          selfCaptures.push(`${Number(col) - 1}` + `${Number(row) - 1}`);
        }
      }
    }
  
    return { moves, captures, selfCaptures };
  };

  const getRookMoves = (square, piece, boardState) => {
    const col = square[0];
    const row = square[1];
    const moves = [];
    const captures = [];
    const selfCaptures = [];
  
    // Find valid moves and captures moving forward
    for (let i = Number(row) + 1; i <= 8; i++) {
      const targetSquare = col + i;
      if (boardState.board.hasOwnProperty(targetSquare)) {
        if (boardState.board[targetSquare].player === piece.player) {
          selfCaptures.push(targetSquare);
          break;
        } else {
          captures.push(targetSquare);
          break;
        }
      }
      moves.push(targetSquare);
    }
  
    // Find valid moves and captures moving back
    for (let i = Number(row) - 1; i >= 1; i--) {
      const targetSquare = col + i;
      if (boardState.board.hasOwnProperty(targetSquare)) {
        if (boardState.board[targetSquare].player === piece.player) {
          selfCaptures.push(targetSquare);
          break;
        } else {
          captures.push(targetSquare);
          break;
        }
      }
      moves.push(targetSquare);
    }
  
    // Find valid moves and captures moving right
    for (let i = Number(col) + 1; i <= 8; i++) {
      const targetSquare = i + row;
      if (boardState.board.hasOwnProperty(targetSquare)) {
        if (boardState.board[targetSquare].player === piece.player) {
          selfCaptures.push(targetSquare);
          break;
        } else {
          captures.push(targetSquare);
          break;
        }
      }
      moves.push(targetSquare);
    }
  
    // Find valid moves and captures moving left
    for (let i = Number(col) - 1; i >= 1; i--) {
      const targetSquare = i + row;
      if (boardState.board.hasOwnProperty(targetSquare)) {
        if (boardState.board[targetSquare].player === piece.player) {
          selfCaptures.push(targetSquare);
          break;
        } else {
          captures.push(targetSquare);
          break;
        }
      }
      moves.push(targetSquare);
    }
  
    return { moves, captures, selfCaptures };
  };

  const getBishopMoves = (square, piece, boardState) => {
    const col = square[0];
    const row = square[1];
    const moves = [];
    const captures = [];
    const selfCaptures = [];

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
          selfCaptures.push(nextSquare);
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
          selfCaptures.push(nextSquare);
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
          selfCaptures.push(nextSquare);
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
          selfCaptures.push(nextSquare);
          break;
        } else {
          captures.push(nextSquare);
          break;
        }
      } else {
        moves.push(nextSquare);
      }
    }

    return { moves, captures, selfCaptures };
  };

  const getKnightMoves = (square, piece, boardState) => {
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
      if (boardState.board.hasOwnProperty(move) && boardState.board[move].player !== piece.player) {
        captures.push(move);
      } else if (!boardState.board.hasOwnProperty(move)) {
        moves.push(move);
      } else {
        selfCaptures.push(move);
      }
    }
  
    return { moves, captures, selfCaptures };
  }; 

  const getQueenMoves = (square, piece, boardState) => {
    const diagonalMoves = getBishopMoves(square, piece, boardState);
    const horizontalAndVerticalMoves = getRookMoves(square, piece, boardState);
    const moves = [...diagonalMoves.moves, ...horizontalAndVerticalMoves.moves];
    const captures = [...diagonalMoves.captures, ...horizontalAndVerticalMoves.captures];
    const selfCaptures = [...diagonalMoves.selfCaptures, ...horizontalAndVerticalMoves.selfCaptures];

    return { moves, captures, selfCaptures };
  };

  const getKingMoves = (square, piece, color, boardState) => {
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

    const validMoves = potentialMoves.filter((move) => Number(move) >= 10 && Number(move) <= 88 && !move.includes("0"));

    for (let move of validMoves) {
      if (boardState.board.hasOwnProperty(move) && boardState.board[move].player !== piece.player) {
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
            <div className={`square ${isDark ? "dark" : "light"}-square ${square}`}>{isValidCastle && <div className="valid-capture-ring" onClick={() => handleCastle(square)} />}</div>
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
      {renderBoard()}
      <PawnPromotionModal boardState={boardState} selectPromotionPiece={selectPromotionPiece} open={open} />
    </div>
  );
};

export default ChessBoard;
