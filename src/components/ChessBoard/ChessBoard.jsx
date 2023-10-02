import React from "react";
import Piece from "../Piece/Piece";
import { Divider, Grid, Typography, Button, Stack, Box } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";

import _, { endsWith, random } from "lodash";

import PawnPromotionModal from "../PawnPromotionModal/PawnPromotionModal";

// to do:
// automate non player moves in puzzle mode
const ChessBoard = () => {
  const [boardState, setBoardState] = useState({
    board: {
      // base setup
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

      //test for draw
      // 47: { piece: "queen", player: "white" },
      // 16: { piece: "king", player: "white", firstMove: true },

      // 18: { piece: "king", player: "black", firstMove: true },
    },
    currentPlayer: "white",
    validMoves: {
      piece: "",
      pieceSquare: "",
      possibleMoves: [],
      possibleCaptures: [],
      possibleCastles: [],
    },
    lastMove: null,
    fen: false,
    puzzleMoves: [],
  });
  const [currentPuzzle, setCurrentPuzzle] = useState(null);
  const [open, setOpen] = useState(false);
  const [promotionBoardState, setPromotionBoardState] = useState({});
  const [promotionSquare, setPromotionSquare] = useState(null);
  const [inCheckStatus, setInCheckStatus] = useState(false);
  const [checkmate, setCheckmate] = useState(false);
  const [draw, setDraw] = useState(false);
  const [puzzleIncorrect, setPuzzleIncorrect] = useState(false);
  const [puzzleFinished, setPuzzleFinished] = useState(false);
  const [mode, setMode] = useState("chess");
  const [tenRandomPuzzles, setTenRandomPuzzles] = useState(null);

  console.log("board state", boardState);
  console.log("inCheckStatus", inCheckStatus);
  console.log("checkmate status", checkmate);
  console.log("current puzzle:", currentPuzzle);
  console.log("ten random puzzles in state", tenRandomPuzzles);

  useEffect(() => {
    // re-render page when validmoves updates.
    if (currentPuzzle === null && mode === "puzzle") {
      // getSinglePuzzle();
      setCurrentPuzzle({
        puzzleid: "HxxIU",
        fen: "2r2rk1/3nqp1p/p3p1p1/np1p4/3P4/P1NBP3/1PQ2PPP/2R2RK1 w - - 0 18",
        rating: 1683,
        ratingdeviation: 74,
        moves: ["c3d5", "e6d5", "c2c8", "f8c8"],
        themes: ["advantage", "hangingPiece", "middlegame", "short"],
      });
    }

    if (mode === "chess" && currentPuzzle) {
      setCurrentPuzzle(null);
      setBoardState({
        board: {
          // base setup
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
        lastMove: null,
        fen: false,
        puzzleMoves: [],
      });
    }

    if (currentPuzzle && !boardState.fen & (mode === "puzzle")) {
      let fenBoardState = fenToBoardState(currentPuzzle.fen);

      console.log("fen board state", fenBoardState);
      setTimeout(() => {
        startPuzzle(currentPuzzle, fenBoardState);
      }, 500);
    }

    if (!tenRandomPuzzles) {
      getTenPuzzles();
    }
  }, [boardState.validMoves, currentPuzzle, mode, tenRandomPuzzles]);

  // old - rapid api request
  const getSinglePuzzle = () => {
    const config = {
      headers: {
        "X-RapidAPI-Key": "",
        "X-RapidAPI-Host": "chess-puzzles.p.rapidapi.com",
      },
      params: { id: "HxxIU" },
    };
    axios
      .get(`https://chess-puzzles.p.rapidapi.com/`, config)
      .then((result) => {
        console.log("result in getSinglePuzzle", result.data);
        setCurrentPuzzle(result.data.puzzles[0]);
      })
      .catch((error) => {
        console.log("error in getSinglePuzzle", error);
      });
  };

  const generateRandomPuzzleID = () => {
    // Generate a random decimal between 0 (inclusive) and 1 (exclusive)
    const randomDecimal = Math.random();

    // Scale and shift the random decimal to fit the range [1, 103628]
    const randomNumber = Math.floor(randomDecimal * 103628) + 1;

    return randomNumber;
  }

  const getTenPuzzles = async () => {
    const randomIDs = [];
    const maxAttempts = 100;

    while (randomIDs.length < 10 && randomIDs.length < maxAttempts) {
      let id = generateRandomPuzzleID();

      // Check if the generated ID is not already in the array
      if (!randomIDs.includes(id)) {
        randomIDs.push(id);
      }
    }
    try {
      const promises = randomIDs.map(id =>
        axios.get(`http://localhost:5000/api/chessPuzzles/puzzleById/${id}`)
      );
  
      const results = await Promise.all(promises);
  
      const randomPuzzles = results.map(result => result.data);
  
      console.log("ten random puzzles ids:", randomIDs);
      console.log("ten random puzzles", randomPuzzles);
  
      setTenRandomPuzzles(randomPuzzles);
    } catch (error) {
      console.log("Error in getTenPuzzles", error);
    }
  };

  const isPuzzleMoveCorrect = (correctPuzzleMoves, currentPuzzleMoves) => {
    console.log(correctPuzzleMoves, currentPuzzleMoves);

    if (JSON.stringify(correctPuzzleMoves) === JSON.stringify(currentPuzzleMoves)) {
      setPuzzleFinished(true);
      alert("puzzle complete! you go!");
      return;
    }

    let numberOfMoves = currentPuzzleMoves.length;
    let shortenedCorrectPuzzleMoves = correctPuzzleMoves.slice(0, numberOfMoves);

    console.log("moves comparison", shortenedCorrectPuzzleMoves, currentPuzzleMoves);

    if (JSON.stringify(shortenedCorrectPuzzleMoves) === JSON.stringify(currentPuzzleMoves)) {
      return true;
    } else {
      console.log("not equal");
      setPuzzleIncorrect(true);
      alert("failed puzzle");
      return false;
    }
  };

  // conversion function
  const sanToBoardStateMove = (sanSquare1, sanSquare2, fenBoardState) => {
    let startSquare = getColumnNumOrChar(sanSquare1[0]) + `${sanSquare1[1]}`;
    let endSquare = getColumnNumOrChar(sanSquare2[0]) + `${sanSquare2[1]}`;
    let capture = false;

    console.log("start square for finding piece", startSquare);
    console.log("board state in sanToBoardStateMove", fenBoardState);

    let piece = fenBoardState.board[startSquare];

    if (fenBoardState.board[endSquare]) {
      capture = true;
    }

    let validMoves = getPieceMoves(startSquare, piece, fenBoardState);

    let boardStateWithValidMoves = {
      ...fenBoardState,
      validMoves: {
        pieceSquare: startSquare,
        possibleMoves: validMoves.moves,
        possibleCaptures: validMoves.captures,
        enPassantCapture: validMoves.enPassantCapture,
        piece,
        possibleCastles: validMoves.castle ? validMoves.possibleCastles : [],
      },
    };

    console.log(startSquare, endSquare, piece, capture, validMoves, boardStateWithValidMoves);
    if (capture) {
      delete boardStateWithValidMoves.board[endSquare];
    }

    makeMove(endSquare, boardStateWithValidMoves);
  };

  const fenToBoardState = (fen) => {
    const fenBoardState = {
      board: {},
      currentPlayer: "white",
      validMoves: {
        piece: "",
        pieceSquare: "",
        possibleMoves: [],
        possibleCaptures: [],
        possibleCastles: [],
      },
      lastMove: null,
      fen: true,
    };

    const [position, turn, castling, enPassant, halfMove, fullMove] = fen.split(" ");

    // Update the current player based on the turn information
    fenBoardState.currentPlayer = turn === "w" ? "white" : "black";

    const rows = position.split("/");
    let rank = 8; // start from the top rank

    rows.forEach((row) => {
      let file = 1; // files are 1-indexed
      row.split("").forEach((char) => {
        if (isNaN(char)) {
          const player = char === char.toUpperCase() ? "white" : "black";
          const piece = char.toLowerCase();

          if (piece !== "p") {
            const pieceName = getPieceName(piece);
            const square = getSquare(file, rank);
            fenBoardState.board[square] = { piece: pieceName, player };
          } else {
            // Handle pawn separately
            const square = getSquare(file, rank);
            fenBoardState.board[square] = { piece: "pawn", player };
          }
          file++;
        } else {
          file += parseInt(char, 10);
        }
      });
      rank--; // Move to the next rank
    });

    setBoardState(fenBoardState);

    return fenBoardState;
  };

  const internalMoveToSan = (square1, square2) => {
    const startSquare = getColumnNumOrChar(square1[0]) + square1[1];
    const endSquare = getColumnNumOrChar(square2[0]) + square2[1];

    return startSquare + endSquare;
  };

  const startPuzzle = (currentPuzzle, fenBoardState) => {
    let startSquare = currentPuzzle.moves[0].substring(0, 2);
    let endSquare = currentPuzzle.moves[0].substring(2, 4);

    // console.log(startSquare, endSquare)
    sanToBoardStateMove(startSquare, endSquare, fenBoardState);
  };

  const getColumnNumOrChar = (char) => {
    switch (char) {
      case "a":
        return 1;
      case "b":
        return 2;
      case "c":
        return 3;
      case "d":
        return 4;
      case "e":
        return 5;
      case "f":
        return 6;
      case "g":
        return 7;
      case "h":
        return 8;
      case "1":
        return "a";
      case "2":
        return "b";
      case "3":
        return "c";
      case "4":
        return "d";
      case "5":
        return "e";
      case "6":
        return "f";
      case "7":
        return "g";
      default:
        return "h";
    }
  };

  const getPieceName = (piece) => {
    switch (piece) {
      case "r":
        return "rook";
      case "n":
        return "knight";
      case "b":
        return "bishop";
      case "q":
        return "queen";
      case "k":
        return "king";
      default:
        return "pawn";
    }
  };

  const getSquare = (file, rank) => {
    return rank + file * 10;
  };

  const makeMove = async (square, boardState) => {
    // Create a copy of the boardState object
    let previousBoardState = { ...boardState };
    if (!previousBoardState.enPassantCapture && previousBoardState.validMoves.enPassantCapture?.squareToMoveTo !== square) {
      // Remove the key from the copied boardState object
      const previousPieceSquare = boardState.validMoves.pieceSquare;
      delete previousBoardState.board[previousPieceSquare];

      let updatedBoardState = {
        ...previousBoardState,
        currentPlayer: previousBoardState.currentPlayer === "white" ? "black" : "white",
      };

      if (mode === "puzzle") {
        let sanMove = internalMoveToSan(previousPieceSquare, square);
        if (!updatedBoardState.puzzleMoves) {
          updatedBoardState.puzzleMoves = [];
        }
        updatedBoardState.puzzleMoves = [...updatedBoardState.puzzleMoves, sanMove];
      }

      if (boardState.validMoves.piece.piece === "pawn" && Math.abs(parseInt(square[1]) - parseInt(previousPieceSquare[1])) === 2) {
        // Set the last move for en passant captures
        updatedBoardState.lastMove = {
          sourceSquare: previousPieceSquare,
          destinationSquare: square,
        };
      } else {
        updatedBoardState.lastMove = null;
      }

      updatedBoardState.board[square] = boardState.validMoves.piece;
      updatedBoardState.validMoves.possibleMoves = [];
      updatedBoardState.validMoves.possibleCaptures = [];
      updatedBoardState.validMoves.piece = "";
      updatedBoardState.validMoves.pieceSquare = "";

      // the piece - yes
      console.log("piece making the move?", updatedBoardState.board[square]);
      // the square it is now on
      console.log("square after the move is made?", square);

      // change first move property to false on the first move
      if (updatedBoardState.board[square].hasOwnProperty("firstMove")) {
        updatedBoardState.board[square].firstMove = false;
      }

      let isGameADrawResult = isGameADraw(updatedBoardState);

      // check for pawn promotion
      if (updatedBoardState.board[square].piece === "pawn" && (square[1] == 8 || square[1] == 1)) {
        // move cause pawn promotion
        promotePawn(updatedBoardState, square);
      } else {
        if (isThisMoveACheck(square, updatedBoardState.board[square], updatedBoardState) && !inCheckStatus) {
          const clonedBoardState = _.cloneDeep(updatedBoardState);
          // check if the game is over
          const isThisCheckmate = isGameOver(square, updatedBoardState.board[square], clonedBoardState);
          if (isThisCheckmate) {
            // move causing checkmate
            if (mode === "puzzle") {
              isPuzzleMoveCorrect(currentPuzzle.moves, updatedBoardState.puzzleMoves);
            }

            console.log("game over chump");
            setBoardState(updatedBoardState);
            setCheckmate(true);
          } else {
            // move cause check
            if (mode === "puzzle") {
              isPuzzleMoveCorrect(currentPuzzle.moves, updatedBoardState.puzzleMoves);
            }
            setInCheckStatus(true);
            setBoardState(updatedBoardState);
            console.log("major major we have a check");
          }
        } else if (isGameADrawResult.draw) {
          // move causing draw - no need to check if valid puzzle move because i am assuming no puzzle will result in a draw
          console.log("game is a draw", isGameADrawResult);
          setInCheckStatus(false);
          setDraw(true);
          setBoardState(updatedBoardState);
        } else {
          // normal move
          if (mode === "puzzle") {
            isPuzzleMoveCorrect(currentPuzzle.moves, updatedBoardState.puzzleMoves);
          }
          setInCheckStatus(false);
          setBoardState(updatedBoardState);
        }
      }
    } else {
      // handle en passant move
      // Remove the key from the copied boardState object
      const previousPieceSquare = boardState.validMoves.enPassantCapture.pieceSquareToCapture;
      delete previousBoardState.board[previousPieceSquare];
      delete previousBoardState.board[boardState.validMoves.pieceSquare];

      let updatedBoardState = {
        ...previousBoardState,
        currentPlayer: previousBoardState.currentPlayer === "white" ? "black" : "white",
      };

      // handle san move conversion
      if (mode === "puzzle") {
        let sanMove = internalMoveToSan(previousPieceSquare, square);
        if (!updatedBoardState.puzzleMoves) {
          updatedBoardState.puzzleMoves = [];
        }
        updatedBoardState.puzzleMoves = [...updatedBoardState.puzzleMoves, sanMove];
      }

      updatedBoardState.lastMove = null;
      updatedBoardState.board[square] = boardState.validMoves.piece;
      updatedBoardState.validMoves.possibleMoves = [];
      updatedBoardState.validMoves.possibleCaptures = [];
      updatedBoardState.validMoves.piece = "";
      updatedBoardState.validMoves.pieceSquare = "";

      let isGameADrawResult = isGameADraw(updatedBoardState);

      // check for pawn promotion
      if (updatedBoardState.board[square].piece === "pawn" && (square[1] == 8 || square[1] == 1)) {
        promotePawn(updatedBoardState, square);
      } else {
        if (isThisMoveACheck(square, updatedBoardState.board[square], updatedBoardState) && !inCheckStatus) {
          const clonedBoardState = _.cloneDeep(updatedBoardState);
          // check if the game is over
          const isThisCheckmate = isGameOver(square, updatedBoardState.board[square], clonedBoardState);
          if (isThisCheckmate) {
            if (mode === "puzzle") {
              isPuzzleMoveCorrect(currentPuzzle.moves, updatedBoardState.puzzleMoves);
            }
            console.log("game over chump");
            setBoardState(updatedBoardState);
            setCheckmate(true);
          } else {
            if (mode === "puzzle") {
              isPuzzleMoveCorrect(currentPuzzle.moves, updatedBoardState.puzzleMoves);
            }
            setInCheckStatus(true);
            setBoardState(updatedBoardState);
            console.log("major major we have a check");
          }
        } else if (isGameADrawResult.draw) {
          console.log("game is a draw", isGameADrawResult);
          setInCheckStatus(false);
          setDraw(true);
          setBoardState(updatedBoardState);
        } else {
          if (mode === "puzzle") {
            isPuzzleMoveCorrect(currentPuzzle.moves, updatedBoardState.puzzleMoves);
          }
          setInCheckStatus(false);
          setBoardState(updatedBoardState);
        }
      }
    }
  };

  const isGameOver = (squareCausingCheck, piece, updatedBoardState) => {
    let isGameOver = true;
    let possibleMoves;

    console.log("in isgameover");

    console.log("updated board state before for loop", updatedBoardState);

    // get all moves
    for (let position in updatedBoardState.board) {
      console.log(position);
      if (updatedBoardState.board[position].player === updatedBoardState.currentPlayer) {
        possibleMoves = getPieceMoves(position, updatedBoardState.board[position], updatedBoardState);

        console.log("all possible moves", possibleMoves);

        // check if piece can be captured, make sure piece is not protected
        if (possibleMoves?.captures && possibleMoves.captures.includes(squareCausingCheck) && !isPieceProtected(squareCausingCheck, updatedBoardState)) {
          console.log("piece can be captured by this position", position);
          isGameOver = false;
          break;
        } else {
          console.log("piece cant be captured, here is the position", position);
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
      } else {
        console.log("updated board state curr player", updatedBoardState.currentPlayer);
      }
    }

    return isGameOver;
  };

  const isGameADraw = (updatedBoardState) => {
    let isDraw = true;
    let insufficientMaterial = true;
    const availableMoves = getAllPossibleMovesForPlayer(updatedBoardState.currentPlayer, updatedBoardState, true);

    if (availableMoves.length > 0) {
      isDraw = false;
    }

    // Check for insufficient material (only kings left)
    const piecesOnBoard = Object.values(updatedBoardState.board);
    const nonKingPieces = piecesOnBoard.filter((piece) => piece.piece !== "king");

    if (nonKingPieces.length > 0) {
      insufficientMaterial = false;
    }

    let result = {
      draw: isDraw || insufficientMaterial,
      insufficientMaterial: insufficientMaterial,
    };

    return result;
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

  const isEnPassantPossible = (square, boardState) => {
    let possibleEnPassantSquares = [];
    possibleEnPassantSquares.push(Number(square[0]) + 1 + `${square[1]}`);
    possibleEnPassantSquares.push(Number(square[0]) - 1 + `${square[1]}`);

    console.log("possible en passant squares", possibleEnPassantSquares);
    if (possibleEnPassantSquares.includes(boardState.lastMove.destinationSquare)) {
      let result = {
        result: true,
        pieceSquareToCapture: possibleEnPassantSquares.find((square) => square === boardState.lastMove.destinationSquare),
        squareToMoveTo: boardState.currentPlayer === "white" ? `${Number(boardState.lastMove.destinationSquare) + 1}` : `${Number(boardState.lastMove.destinationSquare) - 1}`,
      };
      return result;
    } else {
      return { result: false };
    }
  };

  const getKingPosition = (boardState, player) => {
    for (let key in boardState.board) {
      if (boardState.board[key].piece === "king" && boardState.board[key].player !== player) {
        return key;
      }
    }
  };

  const getPieceMoves = (square, pieceObj, boardState, isCheckingForCheck = false) => {
    // console.log("square", square);
    // console.log(pieceObj)
    let possibleMoves;
    switch (pieceObj.piece) {
      case "queen":
        let queenMoves = getQueenMoves(square, pieceObj, boardState, isCheckingForCheck);

        // added piece to make sense of moves being created, may need to remove it
        possibleMoves = {
          ...queenMoves,
          piece: pieceObj,
        };
        break;
      case "rook":
        let rookMoves = getRookMoves(square, pieceObj, boardState, isCheckingForCheck);

        possibleMoves = {
          ...rookMoves,
          piece: pieceObj,
        };
        break;
      case "knight":
        let knightMoves = getKnightMoves(square, pieceObj, boardState, isCheckingForCheck);

        knightMoves.moves = knightMoves.moves.filter((move) => move[1] !== "9");

        possibleMoves = {
          ...knightMoves,
          piece: pieceObj,
        };
        break;
      case "bishop":
        let bishopMoves = getBishopMoves(square, pieceObj, boardState, isCheckingForCheck);

        possibleMoves = {
          ...bishopMoves,
          piece: pieceObj,
        };
        break;
      case "pawn":
        let pawnMoves = getPawnMoves(square, pieceObj.player, boardState, isCheckingForCheck);

        possibleMoves = {
          ...pawnMoves,
          piece: pieceObj,
        };
        break;
      case "king":
        let kingMoves = getKingMoves(square, pieceObj, pieceObj.player, boardState, isCheckingForCheck);

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
    // console.log("checking if player still in check");
    // Find the position of the current player's king
    const kingPosition = getKingPosition(updatedBoardState, getOpponent(currentPlayer));

    // console.log("king position", kingPosition);

    // Get all possible moves for the opponent
    const opponentMoves = getAllPossibleMovesForPlayer(getOpponent(currentPlayer), updatedBoardState);
    // console.log("opponent moves", getOpponent(currentPlayer) ,opponentMoves);

    // console.log("opponent moves", opponentMoves);

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
        // console.log("current player", currentPlayer);
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
    let enPassantCapture;

    if (player === "white") {
      // Check for valid move
      if (!boardState.board.hasOwnProperty(col + (Number(row) + 1))) {
        const targetSquare1 = col + (Number(row) + 1);
        const tempBoardState1 = _.cloneDeep(boardState);

        // Apply the move to the temporary board state
        tempBoardState1.board[targetSquare1] = {
          type: "pawn",
          player: "white",
        };
        delete tempBoardState1.board[square]; // Remove the pawn from its original position

        if (!isCheckingForCheck || !amIStillInCheck(tempBoardState1, boardState.currentPlayer, true)) {
          moves.push(targetSquare1);
        }

        if (!boardState.board.hasOwnProperty(col + (Number(row) + 2)) && row == 2) {
          const targetSquare2 = col + (Number(row) + 2);
          const tempBoardState2 = _.cloneDeep(boardState);

          // Apply the move to the temporary board state
          tempBoardState2.board[targetSquare2] = {
            type: "pawn",
            player: "white",
          };
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
        tempBoardState1.board[targetSquare1] = {
          type: "pawn",
          player: "black",
        };
        delete tempBoardState1.board[square]; // Remove the pawn from its original position

        if (!isCheckingForCheck || !amIStillInCheck(tempBoardState1, boardState.currentPlayer, true)) {
          moves.push(targetSquare1);
        }

        if (!boardState.board.hasOwnProperty(col + (Number(row) - 2)) && row == 7) {
          const targetSquare2 = col + (Number(row) - 2);
          const tempBoardState2 = _.cloneDeep(boardState);

          // Apply the move to the temporary board state
          tempBoardState2.board[targetSquare2] = {
            type: "pawn",
            player: "black",
          };
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
          delete tempBoardStateCapture1.board[targetSquareCapture1];
          tempBoardStateCapture1.board[targetSquareCapture1] = {
            type: "pawn",
            player: "black",
          };

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
          delete tempBoardStateCapture2.board[targetSquareCapture2];
          tempBoardStateCapture2.board[targetSquareCapture2] = {
            type: "pawn",
            player: "black",
          };

          if (!isCheckingForCheck || !amIStillInCheck(tempBoardStateCapture2, boardState.currentPlayer, true)) {
            captures.push(targetSquareCapture2);
          }
        } else {
          selfCaptures.push(`${Number(col) - 1}` + `${Number(row) - 1}`);
        }
      }
    }

    let isEnPassantPossibleResult;

    if (boardState.lastMove) {
      isEnPassantPossibleResult = isEnPassantPossible(square, boardState);
    }

    if (boardState.lastMove && isEnPassantPossibleResult.result) {
      console.log("en passant possible", isEnPassantPossibleResult);
      enPassantCapture = isEnPassantPossibleResult;
    } else {
      // console.log("en passant not possible");
      enPassantCapture = null;
    }

    return { moves, captures, selfCaptures, enPassantCapture };
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

    const validMoves = potentialMoves.filter((move) => Number(move) >= 10 && Number(move) <= 88 && !move.includes("0") && !move.includes("9"));

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

    let sanMove = internalMoveToSan(promotionBoardState.validMoves.pieceSquare, square);
    if (!promotionBoardState.puzzleMoves) {
      promotionBoardState.puzzleMoves = [];
    }
    promotionBoardState.puzzleMoves = [...promotionBoardState.puzzleMoves, sanMove];

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
    const isValidEnPassant = boardState.validMoves.enPassantCapture?.squareToMoveTo === square;

    // Check if the square is empty
    if (!piece) {
      return (
        <>
          {isValidMove || isValidEnPassant ? (
            <Box className={`square ${isDark ? "dark" : "light"}-square ${square}`} onClick={() => makeMove(square, boardState)}>
              <Box className="valid-move-dot" />
            </Box>
          ) : (
            <Box className={`square ${isDark ? "dark" : "light"}-square ${square}`}>{isValidCastle && <Box className="valid-capture-ring" onClick={() => handleCastle(square)} />}</Box>
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
        isGameADraw={isGameADraw}
        setDraw={setDraw}
        internalMoveToSan={internalMoveToSan}
        isPuzzleMoveCorrect={isPuzzleMoveCorrect}
        currentPuzzle={currentPuzzle}
        mode={mode}
      />
    );
  };

  const renderRow = (row) => {
    const rowSquares = ["1", "2", "3", "4", "5", "6", "7", "8"];
    return rowSquares.map((col, index) => {
      const square = `${col}${row}`;
      const isDark = (index + row) % 2 !== 0;
      return <Box key={square}>{renderSquare(square, isDark)}</Box>;
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
      {draw && (
        <Typography variant="h5" textAlign="center">
          Draw!
        </Typography>
      )}
      <Stack direction="row" gap={3} mb={3}>
        <Button variant="contained" onClick={() => startPuzzle(currentPuzzle, boardState)}>
          First Move
        </Button>

        <Button variant="contained" onClick={() => setMode("puzzle")}>
          Puzzle Mode
        </Button>

        <Button variant="contained" onClick={() => setMode("chess")}>
          Chess Mode
        </Button>
      </Stack>
      {renderBoard()}
      <PawnPromotionModal boardState={boardState} selectPromotionPiece={selectPromotionPiece} open={open} promotionBoardState={promotionBoardState} promotionSquare={promotionSquare} />
    </div>
  );
};

export default ChessBoard;
