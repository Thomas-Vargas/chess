import { useState, useEffect, forwardRef } from "react";
import { Divider, Grid, Typography, Button, Stack, Box, Paper, Fade } from "@mui/material";
import { useAuth } from "../AuthProvider/AuthProvider";
import useUserData from "../../utils/userData";
import axios from "axios";

import _, { endsWith, random, sample } from "lodash";

import PawnPromotionModal from "../PawnPromotionModal/PawnPromotionModal";
import Piece from "../Piece/Piece";

import { supabaseClient } from "../../config/supabaseClient";
import { getPawnMoves } from "../../chessUtils/PieceUtils/pawnMoves";
import { getBishopMoves } from "../../chessUtils/PieceUtils/bishopMoves";
import { getKnightMoves } from "../../chessUtils/PieceUtils/knightMoves";
import { getRookMoves } from "../../chessUtils/PieceUtils/rookMoves";
import { getQueenMoves } from "../../chessUtils/PieceUtils/queenMoves";
import { getKingMoves } from "../../chessUtils/PieceUtils/kingMoves";
import { getPieceMoves } from "../../chessUtils/PieceUtils/pieceMoves";
import { amIStillInCheck, isThisMoveACheck, isPieceProtected } from "../../chessUtils/CheckUtils/checkUtils";
import { isGameADraw, isGameOver } from "../../chessUtils/GameResultUtils/gameResultUtils";
import { getAllPossibleMovesForPlayer } from "../../chessUtils/PlayerUtils/playerUtils";
import { getOpponent } from "../../chessUtils/PlayerUtils/playerUtils";
import { handleCastle } from "../../chessUtils/PieceUtils/kingMoves";
import {
  fenToBoardState,
  sanToBoardStateMove,
  internalMoveToSan,
  startPuzzle,
  startNextPuzzle,
  isPuzzleMoveCorrect,
} from "../../chessUtils/PuzzleUtils/puzzleUtils";

const ChessBoard = forwardRef(
  (
    {
      sampleMode,
      modeToSet,
      puzzlesInEloRange,
      updateAllUserPuzzleData,
      getPuzzlesWithinEloRange,
      fade,
      currentPuzzle,
      setCurrentPuzzle,
      boardOrientation,
      setBoardOrientation,
    },
    ref
  ) => {
    const [boardState, setBoardState] = useState({
      board: {
        // base setup
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

        // for testing revealed attack check
        // 11: { piece: "rook", player: "white", firstMove: false },
        // 21: { piece: "knight", player: "white" },
        // 31: { piece: "bishop", player: "white" },
        // 14: { piece: "queen", player: "white" },
        // 51: { piece: "king", player: "white", firstMove: true },
        // 25: { piece: "bishop", player: "white" },
        // 71: { piece: "knight", player: "white" },
        // 81: { piece: "rook", player: "white", firstMove: true },
        // 12: { piece: "pawn", player: "white" },
        // 22: { piece: "pawn", player: "white" },
        // 32: { piece: "pawn", player: "white" },
        // 42: { piece: "pawn", player: "white" },
        // 52: { piece: "pawn", player: "white" },
        // 62: { piece: "pawn", player: "white" },
        // 72: { piece: "pawn", player: "white" },
        // 82: { piece: "pawn", player: "white" },
        // 18: { piece: "rook", player: "black", firstMove: true },
        // 28: { piece: "knight", player: "black" },
        // 38: { piece: "bishop", player: "black" },
        // 48: { piece: "queen", player: "black" },
        // 58: { piece: "king", player: "black", firstMove: true },
        // 68: { piece: "bishop", player: "black" },
        // 78: { piece: "knight", player: "black" },
        // 88: { piece: "rook", player: "black", firstMove: true },
        // 17: { piece: "pawn", player: "black" },
        // 27: { piece: "pawn", player: "black" },
        // 37: { piece: "pawn", player: "black" },
        // 46: { piece: "pawn", player: "black" },
        // 57: { piece: "pawn", player: "black" },
        // 67: { piece: "pawn", player: "black" },
        // 77: { piece: "pawn", player: "black" },
        // 87: { piece: "pawn", player: "black" },

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
        enPassantCapture: {},
      },
      lastMove: null,
      fen: false,
      puzzleMoves: [],
    });
    const [open, setOpen] = useState(false);
    const [promotionBoardState, setPromotionBoardState] = useState({});
    const [promotionSquare, setPromotionSquare] = useState(null);
    const [promotionPreviousSquare, setPromotionPreviousSquare] = useState(null);
    const [inCheckStatus, setInCheckStatus] = useState(false);
    const [checkmate, setCheckmate] = useState(false);
    const [draw, setDraw] = useState(false);
    const [puzzleIncorrect, setPuzzleIncorrect] = useState(false);
    const [puzzleCorrect, setPuzzleCorrect] = useState(false);
    const [mode, setMode] = useState("");
    const [randomPuzzles, setRandomPuzzles] = useState(null);

    const { user } = useAuth();
    const userData = useUserData(user?.id);

    console.log("board state", boardState);
    // console.log("inCheckStatus", inCheckStatus);
    console.log("checkmate status", checkmate);
    console.log("current puzzle:", currentPuzzle);
    // console.log("random puzzles in state", randomPuzzles);
    console.log("current mode", mode);
    // console.log("puzzles in elo range in chessboard", puzzlesInEloRange);

    useEffect(() => {
      if (modeToSet) {
        setMode(modeToSet);
      }

      if (currentPuzzle === null && mode === "puzzle" && randomPuzzles !== null) {
        setCurrentPuzzle(randomPuzzles[0]);
      }

      // reset board state in chess mode
      if (mode === "chess" && currentPuzzle) {
        setCurrentPuzzle(null);
        setBoardState({
          board: {
            // base setup
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
            enPassantCapture: {},
          },
          lastMove: null,
          fen: false,
          puzzleMoves: [],
        });
      }

      // page load logic for landing page sample puzzles
      if (currentPuzzle && !boardState.fen && mode === "puzzle") {
        // reset check and checkmate
        setCheckmate(false);
        setInCheckStatus(false);

        console.log("useffect setting fen board state and starting puzzle has triggered");
        let fenBoardState = fenToBoardState(currentPuzzle.FEN, setBoardState);

        setBoardOrientation(fenBoardState.currentPlayer === "white" ? "black" : "white");

        console.log("fen board state", fenBoardState);
        setTimeout(() => {
          startPuzzle(currentPuzzle, fenBoardState, mode, makeMove);
        }, 1000);
      }

      // if coming from puzzle page, set
      if (puzzlesInEloRange && randomPuzzles === null && currentPuzzle === null) {
        setRandomPuzzles(puzzlesInEloRange);
        setCurrentPuzzle(puzzlesInEloRange[0]);
      }
    }, [boardState.validMoves, currentPuzzle, mode, randomPuzzles, boardState.fen, sampleMode, puzzlesInEloRange]);

    // handles all moves not including captures, unless in puzzle mode
    const makeMove = async (square, boardState, currentPuzzle, promotionSanMove, mode) => {
      // Create a copy of the boardState object
      let previousBoardState = { ...boardState };
      if (
        !previousBoardState.enPassantCapture &&
        previousBoardState.validMoves.enPassantCapture?.squareToMoveTo !== square
      ) {
        // Remove the key from the copied boardState object
        const previousPieceSquare = boardState.validMoves.pieceSquare;
        delete previousBoardState.board[previousPieceSquare];

        let updatedBoardState = {
          ...previousBoardState,
          currentPlayer: previousBoardState.currentPlayer === "white" ? "black" : "white",
        };

        if (mode === "puzzle") {
          let sanMove;
          if (promotionSanMove) {
            sanMove = promotionSanMove;
          } else {
            sanMove = internalMoveToSan(previousPieceSquare, square);
          }

          if (!updatedBoardState.puzzleMoves) {
            updatedBoardState.puzzleMoves = [];
          }
          updatedBoardState.puzzleMoves = [...updatedBoardState.puzzleMoves, sanMove];
        }

        if (
          boardState.validMoves.piece.piece === "pawn" &&
          Math.abs(parseInt(square[1]) - parseInt(previousPieceSquare[1])) === 2
        ) {
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
        updatedBoardState.validMoves.possibleCastles = [];
        // updatedBoardState.validMoves.pieceSquare = "";

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
              let puzzleResult;
              // move causing checkmate
              if (mode === "puzzle") {
                puzzleResult = isPuzzleMoveCorrect(
                  currentPuzzle.moves,
                  updatedBoardState.puzzleMoves,
                  sampleMode,
                  currentPuzzle,
                  setCurrentPuzzle,
                  setPuzzleCorrect,
                  setPuzzleIncorrect,
                  updateAllUserPuzzleData,
                  randomPuzzles,
                  setRandomPuzzles,
                  getPuzzlesWithinEloRange
                );
              }

              if (puzzleResult === false || puzzleResult === "finished") {
                setTimeout(() => {
                  updatedBoardState.fen = false;
                  updatedBoardState.puzzleMoves = [];
                }, 1000);
              }

              console.log("game over chump");
              setBoardState(updatedBoardState);
              setCheckmate(true);

              if (puzzleResult === true && updatedBoardState.puzzleMoves.length % 2 === 0) {
                setTimeout(() => {
                  let startSquare = currentPuzzle.moves[updatedBoardState.puzzleMoves.length].substring(0, 2);
                  let endSquare = currentPuzzle.moves[updatedBoardState.puzzleMoves.length].substring(2, 4);
                  sanToBoardStateMove(startSquare, endSquare, updatedBoardState, currentPuzzle, "", mode, makeMove);
                }, 1000);
              }
            } else {
              // move cause check
              let puzzleResult;
              if (mode === "puzzle") {
                puzzleResult = isPuzzleMoveCorrect(
                  currentPuzzle.moves,
                  updatedBoardState.puzzleMoves,
                  sampleMode,
                  currentPuzzle,
                  setCurrentPuzzle,
                  setPuzzleCorrect,
                  setPuzzleIncorrect,
                  updateAllUserPuzzleData,
                  randomPuzzles,
                  setRandomPuzzles,
                  getPuzzlesWithinEloRange
                );
              }

              if (puzzleResult === false || puzzleResult === "finished") {
                setTimeout(() => {
                  updatedBoardState.fen = false;
                  updatedBoardState.puzzleMoves = [];
                }, 1000);
              }

              setInCheckStatus(true);
              setBoardState(updatedBoardState);
              console.log("major major we have a check");

              if (puzzleResult === true && updatedBoardState.puzzleMoves.length % 2 === 0) {
                setTimeout(() => {
                  let startSquare = currentPuzzle.moves[updatedBoardState.puzzleMoves.length].substring(0, 2);
                  let endSquare = currentPuzzle.moves[updatedBoardState.puzzleMoves.length].substring(2, 4);
                  sanToBoardStateMove(startSquare, endSquare, updatedBoardState, currentPuzzle, "", mode, makeMove);
                }, 1000);
              }
            }
          } else if (isGameADrawResult.draw) {
            // move causing draw - no need to check if valid puzzle move because i am assuming no puzzle will result in a draw
            console.log("game is a draw", isGameADrawResult);
            setInCheckStatus(false);
            setDraw(true);
            setBoardState(updatedBoardState);
          } else {
            // normal move
            let puzzleResult;
            if (mode === "puzzle") {
              console.log("current puzzle moves", currentPuzzle.moves);
              console.log("board state puzzle moves", updatedBoardState.puzzleMoves);
              puzzleResult = isPuzzleMoveCorrect(
                currentPuzzle.moves,
                updatedBoardState.puzzleMoves,
                sampleMode,
                currentPuzzle,
                setCurrentPuzzle,
                setPuzzleCorrect,
                setPuzzleIncorrect,
                updateAllUserPuzzleData,
                randomPuzzles,
                setRandomPuzzles,
                getPuzzlesWithinEloRange
              );
            }
            if (puzzleResult === false || puzzleResult === "finished") {
              setTimeout(() => {
                updatedBoardState.fen = false;
                updatedBoardState.puzzleMoves = [];
              }, 1000);
            }
            setInCheckStatus(false);
            setBoardState(updatedBoardState);

            // check if even number of puzzle moves - which means next move should be automated
            // only need to check makeMove because sanToBoardState does not call capturePiece
            if (puzzleResult === true && updatedBoardState.puzzleMoves.length % 2 === 0) {
              console.log("odd puzzlemoves length");
              setTimeout(() => {
                let startSquare = currentPuzzle.moves[updatedBoardState.puzzleMoves.length].substring(0, 2);
                let endSquare = currentPuzzle.moves[updatedBoardState.puzzleMoves.length].substring(2, 4);
                sanToBoardStateMove(startSquare, endSquare, updatedBoardState, currentPuzzle, "", mode, makeMove);
              }, 1000);
            }
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
              let puzzleResult;
              if (mode === "puzzle") {
                puzzleResult = isPuzzleMoveCorrect(
                  currentPuzzle.moves,
                  updatedBoardState.puzzleMoves,
                  sampleMode,
                  currentPuzzle,
                  setCurrentPuzzle,
                  setPuzzleCorrect,
                  setPuzzleIncorrect,
                  updateAllUserPuzzleData,
                  randomPuzzles,
                  setRandomPuzzles,
                  getPuzzlesWithinEloRange
                );
              }

              if (puzzleResult === false || puzzleResult === "finished") {
                setTimeout(() => {
                  updatedBoardState.fen = false;
                  updatedBoardState.puzzleMoves = [];
                }, 1000);
              }

              console.log("game over chump");
              setBoardState(updatedBoardState);
              setCheckmate(true);

              if (puzzleResult === true && updatedBoardState.puzzleMoves.length % 2 === 0) {
                setTimeout(() => {
                  let startSquare = currentPuzzle.moves[updatedBoardState.puzzleMoves.length].substring(0, 2);
                  let endSquare = currentPuzzle.moves[updatedBoardState.puzzleMoves.length].substring(2, 4);
                  sanToBoardStateMove(startSquare, endSquare, updatedBoardState, currentPuzzle, "", mode, makeMove);
                }, 1000);
              }
            } else {
              let puzzleResult;
              if (mode === "puzzle") {
                puzzleResult = isPuzzleMoveCorrect(
                  currentPuzzle.moves,
                  updatedBoardState.puzzleMoves,
                  sampleMode,
                  currentPuzzle,
                  setCurrentPuzzle,
                  setPuzzleCorrect,
                  setPuzzleIncorrect,
                  updateAllUserPuzzleData,
                  randomPuzzles,
                  setRandomPuzzles,
                  getPuzzlesWithinEloRange
                );
              }

              if (puzzleResult === false || puzzleResult === "finished") {
                setTimeout(() => {
                  updatedBoardState.fen = false;
                  updatedBoardState.puzzleMoves = [];
                }, 1000);
              }

              setInCheckStatus(true);
              setBoardState(updatedBoardState);
              console.log("major major we have a check");

              if (puzzleResult === true && updatedBoardState.puzzleMoves.length % 2 === 0) {
                setTimeout(() => {
                  let startSquare = currentPuzzle.moves[updatedBoardState.puzzleMoves.length].substring(0, 2);
                  let endSquare = currentPuzzle.moves[updatedBoardState.puzzleMoves.length].substring(2, 4);
                  sanToBoardStateMove(startSquare, endSquare, updatedBoardState, currentPuzzle, "", mode, makeMove);
                }, 1000);
              }
            }
          } else if (isGameADrawResult.draw) {
            console.log("game is a draw", isGameADrawResult);
            setInCheckStatus(false);
            setDraw(true);
            setBoardState(updatedBoardState);
          } else {
            let puzzleResult;
            if (mode === "puzzle") {
              puzzleResult = isPuzzleMoveCorrect(
                currentPuzzle.moves,
                updatedBoardState.puzzleMoves,
                sampleMode,
                currentPuzzle,
                setCurrentPuzzle,
                setPuzzleCorrect,
                setPuzzleIncorrect,
                updateAllUserPuzzleData,
                randomPuzzles,
                setRandomPuzzles,
                getPuzzlesWithinEloRange
              );
            }

            if (puzzleResult === false || puzzleResult === "finished") {
              setTimeout(() => {
                updatedBoardState.fen = false;
                updatedBoardState.puzzleMoves = [];
              }, 1000);
            }

            setInCheckStatus(false);
            setBoardState(updatedBoardState);

            if (puzzleResult === true && updatedBoardState.puzzleMoves.length % 2 === 0) {
              setTimeout(() => {
                let startSquare = currentPuzzle.moves[updatedBoardState.puzzleMoves.length].substring(0, 2);
                let endSquare = currentPuzzle.moves[updatedBoardState.puzzleMoves.length].substring(2, 4);
                sanToBoardStateMove(startSquare, endSquare, updatedBoardState, currentPuzzle, "", mode, makeMove);
              }, 1000);
            }
          }
        }
      }
    };

    const capturePiece = (square) => {
      let previousBoardState = { ...boardState };

      if (mode === "puzzle") {
        let sanMove = internalMoveToSan(previousBoardState.validMoves.pieceSquare, square);
        console.log("piece square", previousBoardState.validMoves.pieceSquare);
        console.log("square", square);
        if (!previousBoardState.puzzleMoves) {
          previousBoardState.puzzleMoves = [];
        }
        previousBoardState.puzzleMoves = [...previousBoardState.puzzleMoves, sanMove];
      }

      delete previousBoardState.board[square];
      delete previousBoardState.board[boardState.validMoves.pieceSquare];
      let updatedBoardState = {
        ...previousBoardState,
        currentPlayer: previousBoardState.currentPlayer === "white" ? "black" : "white",
      };
      updatedBoardState.board[square] = boardState.validMoves.piece;
      updatedBoardState.validMoves.possibleMoves = [];
      updatedBoardState.validMoves.possibleCaptures = [];
      updatedBoardState.validMoves.piece = "";
      updatedBoardState.validMoves.pieceSquare = "";

      // change first move property to false on first move
      if (updatedBoardState.board[square].hasOwnProperty("firstMove")) {
        updatedBoardState.board[square].firstMove = false;
      }

      let isGameADrawResult = isGameADraw(updatedBoardState);

      // check for pawn promotion
      if (updatedBoardState.board[square].piece === "pawn" && (square[1] == 8 || square[1] == 1)) {
        // capture with pawn promotion
        promotePawn(updatedBoardState, square);
      } else {
        if (isThisMoveACheck(square, updatedBoardState.board[square], updatedBoardState) && !inCheckStatus) {
          const clonedBoardState = _.cloneDeep(updatedBoardState);
          // check if the game is over
          const isThisCheckmate = isGameOver(square, updatedBoardState.board[square], clonedBoardState);
          if (isThisCheckmate) {
            let puzzleResult;
            // capture causing checkmate
            if (mode === "puzzle") {
              puzzleResult = isPuzzleMoveCorrect(
                currentPuzzle.moves,
                updatedBoardState.puzzleMoves,
                sampleMode,
                currentPuzzle,
                setCurrentPuzzle,
                setPuzzleCorrect,
                setPuzzleIncorrect,
                updateAllUserPuzzleData,
                randomPuzzles,
                setRandomPuzzles,
                getPuzzlesWithinEloRange
              );
            }

            if (puzzleResult === false || puzzleResult === "finished") {
              setTimeout(() => {
                updatedBoardState.fen = false;
                updatedBoardState.puzzleMoves = [];
              }, 1000);
            }

            console.log("game over chump");
            setBoardState(updatedBoardState);
            setCheckmate(true);

            if (puzzleResult === true && updatedBoardState.puzzleMoves.length % 2 === 0) {
              setTimeout(() => {
                let startSquare = currentPuzzle.moves[updatedBoardState.puzzleMoves.length].substring(0, 2);
                let endSquare = currentPuzzle.moves[updatedBoardState.puzzleMoves.length].substring(2, 4);
                sanToBoardStateMove(startSquare, endSquare, updatedBoardState, currentPuzzle, "", mode, makeMove);
              }, 1000);
            }
          } else {
            // capture causing check
            let puzzleResult;

            if (mode === "puzzle") {
              puzzleResult = isPuzzleMoveCorrect(
                currentPuzzle.moves,
                updatedBoardState.puzzleMoves,
                sampleMode,
                currentPuzzle,
                setCurrentPuzzle,
                setPuzzleCorrect,
                setPuzzleIncorrect,
                updateAllUserPuzzleData,
                randomPuzzles,
                setRandomPuzzles,
                getPuzzlesWithinEloRange
              );
            }

            if (puzzleResult === false || puzzleResult === "finished") {
              setTimeout(() => {
                updatedBoardState.fen = false;
                updatedBoardState.puzzleMoves = [];
              }, 1000);
            }

            setInCheckStatus(true);
            setBoardState(updatedBoardState);
            console.log("major major we have a check");

            if (puzzleResult === true && updatedBoardState.puzzleMoves.length % 2 === 0) {
              setTimeout(() => {
                let startSquare = currentPuzzle.moves[updatedBoardState.puzzleMoves.length].substring(0, 2);
                let endSquare = currentPuzzle.moves[updatedBoardState.puzzleMoves.length].substring(2, 4);
                sanToBoardStateMove(startSquare, endSquare, updatedBoardState, currentPuzzle, "", mode, makeMove);
              }, 1000);
            }
          }
        } else if (isGameADrawResult.draw) {
          // capture causing draw
          console.log("game is a draw", isGameADrawResult);
          setInCheckStatus(false);
          setDraw(true);
          setBoardState(updatedBoardState);
        } else {
          // normal capture
          let puzzleResult;

          if (mode === "puzzle") {
            puzzleResult = isPuzzleMoveCorrect(
              currentPuzzle.moves,
              updatedBoardState.puzzleMoves,
              sampleMode,
              currentPuzzle,
              setCurrentPuzzle,
              setPuzzleCorrect,
              setPuzzleIncorrect,
              updateAllUserPuzzleData,
              randomPuzzles,
              setRandomPuzzles,
              getPuzzlesWithinEloRange
            );
          }

          if (puzzleResult === false || puzzleResult === "finished") {
            setTimeout(() => {
              updatedBoardState.fen = false;
              updatedBoardState.puzzleMoves = [];
            }, 1000);
          }

          setInCheckStatus(false);
          setBoardState(updatedBoardState);

          if (puzzleResult === true && updatedBoardState.puzzleMoves.length % 2 === 0) {
            setTimeout(() => {
              let startSquare = currentPuzzle.moves[updatedBoardState.puzzleMoves.length].substring(0, 2);
              let endSquare = currentPuzzle.moves[updatedBoardState.puzzleMoves.length].substring(2, 4);
              sanToBoardStateMove(startSquare, endSquare, updatedBoardState, currentPuzzle, "", mode, makeMove);
            }, 1000);
          }
        }
      }
    };

    const selectPromotionPiece = (piece, square, promotionBoardState, currentPuzzle) => {
      console.log(piece);
      console.log(square);
      console.log(promotionBoardState);
      let sanMove;

      // Update the copy of board state
      delete promotionBoardState.board[Number(square)];
      promotionBoardState.board[Number(square)] = piece;

      console.log("!!!!! promotionBoardState before setting new state", promotionBoardState);

      if (mode === "puzzle") {
        sanMove = internalMoveToSan(promotionBoardState.validMoves.pieceSquare, square);
        switch (piece.piece) {
          case "queen":
            sanMove += "q";
            break;
          case "rook":
            sanMove += "r";
            break;
          case "bishop":
            sanMove += "b";
            break;
          case "knight":
            sanMove += "n";
            break;
        }
        if (!promotionBoardState.puzzleMoves) {
          promotionBoardState.puzzleMoves = [];
        }
        // remove last puzzleMove set by makeMove because it is missing the pawn promotion piece letter
        promotionBoardState.puzzleMoves.pop();
        promotionBoardState.puzzleMoves = [...promotionBoardState.puzzleMoves, sanMove];
      }

      const clonedBoardState = _.cloneDeep(promotionBoardState);

      // check if the game is over
      const isThisCheckmate = isGameOver(square, clonedBoardState.board[square], clonedBoardState);

      // check if game is a draw
      let isGameADrawResult = isGameADraw(clonedBoardState);

      if (isThisCheckmate) {
        // if checkmate, execute this code
        let puzzleResult;
        if (mode === "puzzle") {
          puzzleResult = isPuzzleMoveCorrect(
            currentPuzzle.moves,
            clonedBoardState.puzzleMoves,
            sampleMode,
            currentPuzzle,
            setCurrentPuzzle,
            setPuzzleCorrect,
            setPuzzleIncorrect,
            updateAllUserPuzzleData,
            randomPuzzles,
            setRandomPuzzles,
            getPuzzlesWithinEloRange
          );
        }

        if (puzzleResult === false || puzzleResult === "finished") {
          setTimeout(() => {
            clonedBoardState.fen = false;
            clonedBoardState.puzzleMoves = [];
          }, 1000);
        }

        console.log("game over chump");
        setBoardState(clonedBoardState);
        setCheckmate(true);

        if (puzzleResult === true && clonedBoardState.puzzleMoves.length % 2 === 0) {
          setTimeout(() => {
            let startSquare = currentPuzzle.moves[clonedBoardState.puzzleMoves.length].substring(0, 2);
            let endSquare = currentPuzzle.moves[clonedBoardState.puzzleMoves.length].substring(2, 4);
            sanToBoardStateMove(startSquare, endSquare, clonedBoardState, currentPuzzle, sanMove, mode, makeMove);
          }, 1000);
        }
      } else if (isThisMoveACheck(square, clonedBoardState.board[square], promotionBoardState) && !inCheckStatus) {
        // if check, execute this code
        let puzzleResult;
        if (mode === "puzzle") {
          puzzleResult = isPuzzleMoveCorrect(
            currentPuzzle.moves,
            clonedBoardState.puzzleMoves,
            sampleMode,
            currentPuzzle,
            setCurrentPuzzle,
            setPuzzleCorrect,
            setPuzzleIncorrect,
            updateAllUserPuzzleData,
            randomPuzzles,
            setRandomPuzzles,
            getPuzzlesWithinEloRange
          );
        }

        if (puzzleResult === false || puzzleResult === "finished") {
          setTimeout(() => {
            clonedBoardState.fen = false;
            clonedBoardState.puzzleMoves = [];
          }, 1000);
        }

        setInCheckStatus(true);
        setBoardState(clonedBoardState);
        console.log("major major we have a check");

        if (puzzleResult === true && clonedBoardState.puzzleMoves.length % 2 === 0) {
          setTimeout(() => {
            let startSquare = currentPuzzle.moves[clonedBoardState.puzzleMoves.length].substring(0, 2);
            let endSquare = currentPuzzle.moves[clonedBoardState.puzzleMoves.length].substring(2, 4);
            sanToBoardStateMove(startSquare, endSquare, clonedBoardState, currentPuzzle, sanMove, mode, makeMove);
          }, 1000);
        }
      } else if (isGameADrawResult.draw) {
        console.log("game is a draw", isGameADrawResult);
        setInCheckStatus(false);
        setDraw(true);
        setBoardState(clonedBoardState);
      } else {
        // otherwise its a normal promotion, execute this code
        let puzzleResult;
        if (mode === "puzzle") {
          puzzleResult = isPuzzleMoveCorrect(
            currentPuzzle.moves,
            clonedBoardState.puzzleMoves,
            sampleMode,
            currentPuzzle,
            setCurrentPuzzle,
            setPuzzleCorrect,
            setPuzzleIncorrect,
            updateAllUserPuzzleData,
            randomPuzzles,
            setRandomPuzzles,
            getPuzzlesWithinEloRange
          );
        }

        if (puzzleResult === false || puzzleResult === "finished") {
          setTimeout(() => {
            clonedBoardState.fen = false;
            clonedBoardState.puzzleMoves = [];
          }, 1000);
        }

        setInCheckStatus(false);
        setBoardState(clonedBoardState);

        if (puzzleResult === true && clonedBoardState.puzzleMoves.length % 2 === 0) {
          setTimeout(() => {
            let startSquare = currentPuzzle.moves[clonedBoardState.puzzleMoves.length].substring(0, 2);
            let endSquare = currentPuzzle.moves[clonedBoardState.puzzleMoves.length].substring(2, 4);
            sanToBoardStateMove(startSquare, endSquare, clonedBoardState, currentPuzzle, "", mode, makeMove);
          }, 1000);
        }
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

    // rendering functions
    const renderSquare = (square, isDark) => {
      const piece = boardState.board[square];
      const isValidMove = boardState.validMoves.possibleMoves.includes(square);
      const isValidCapture = boardState.validMoves.possibleCaptures.includes(square);
      const isValidCastle = boardState.validMoves.possibleCastles.includes(square);
      const isValidEnPassant = boardState.validMoves.enPassantCapture?.squareToMoveTo === square;
      let currentPlayer = boardState.currentPlayer;
      // Check if the square is empty
      if (!piece) {
        return (
          <>
            {isValidMove || isValidEnPassant ? (
              <Box
                className={`square ${isDark ? "dark" : "light"}-square ${square}`}
                onClick={() => makeMove(square, boardState, currentPuzzle, "", mode)}
                sx={{
                  "&:hover": {
                    backgroundImage: "linear-gradient(rgb(0 0 0/10%) 0 0)",
                    cursor: "pointer",
                  },
                }}
              >
                <Box className="valid-move-dot" />
              </Box>
            ) : (
              <Box className={`square ${isDark ? "dark" : "light"}-square ${square}`}>
                {isValidCastle && (
                  <Box className="valid-capture-ring" onClick={() => handleCastle(square, boardState, setBoardState)} />
                )}
              </Box>
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
          getPawnMoves={getPawnMoves}
          getBishopMoves={getBishopMoves}
          getKnightMoves={getKnightMoves}
          getRookMoves={getRookMoves}
          getQueenMoves={getQueenMoves}
          getKingMoves={getKingMoves}
          inCheckStatus={inCheckStatus}
          checkmate={checkmate}
          getAllPossibleMovesForPlayer={getAllPossibleMovesForPlayer}
          capturePiece={capturePiece}
        />
      );
    };

    const renderRow = (row) => {
      const rowSquares = ["1", "2", "3", "4", "5", "6", "7", "8"];
      return rowSquares.map((col, index) => {
        const square = `${col}${row}`;
        const isDark = (index + row) % 2 !== 0;
        return <Box key={square}>{renderSquare(square, isDark, boardState)}</Box>;
      });
    };

    const renderBoard = () => {
      const rows = boardOrientation === "black" ? [1, 2, 3, 4, 5, 6, 7, 8] : [8, 7, 6, 5, 4, 3, 2, 1];
      return (
        <Grid
          container
          direction="column"
          className={
            mode === "puzzle" && puzzleCorrect
              ? "glow-green chess-board"
              : mode === "puzzle" && puzzleIncorrect
              ? "glow-red chess-board"
              : "chess-board"
          }
        >
          {rows.map((row, index) => (
            <Grid container item key={row} className={`board-row ${index % 2 === 0 ? "light" : "dark"}-row`}>
              {renderRow(row)}
            </Grid>
          ))}
        </Grid>
      );
    };

    return (
      <div style={{ width: "484px" }} ref={ref}>
        {draw && (
          <Typography variant="h5" textAlign="center">
            Draw!
          </Typography>
        )}
        {mode === "puzzle" && currentPuzzle && (
          <div>
            {fade ? (
              <Fade in={true} timeout={1000}>
                <Paper elevation={6}>{renderBoard()}</Paper>
              </Fade>
            ) : (
              <Paper elevation={6}>{renderBoard()}</Paper>
            )}
          </div>
        )}

        {mode === "chess" && <Paper elevation={6}>{renderBoard()}</Paper>}

        {checkmate && mode !== "puzzle" && (
          <Typography variant="h5" textAlign="center">
            Checkmate! {getOpponent(boardState.currentPlayer)} wins!
          </Typography>
        )}

        <PawnPromotionModal
          boardState={boardState}
          selectPromotionPiece={selectPromotionPiece}
          open={open}
          promotionBoardState={promotionBoardState}
          promotionSquare={promotionSquare}
          currentPuzzle={currentPuzzle}
          promotionPreviousSquare={promotionPreviousSquare}
        />
      </div>
    );
  }
);

export default ChessBoard;
