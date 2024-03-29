import React from "react";
import _ from "lodash";
import { Box } from "@mui/material";

const Piece = ({
  piece,
  color,
  className,
  square,
  boardState,
  setBoardState,
  isValidCapture,
  getBishopMoves,
  getKingMoves,
  getKnightMoves,
  getPawnMoves,
  getRookMoves,
  getQueenMoves,
  inCheckStatus,
  checkmate,
  getAllPossibleMovesForPlayer,
  capturePiece
}) => {
  const pieceColor = color === "white" ? "white" : "black";
  const pieceStyles = {
    white: {
      king: {
        content: <img src="/chess-pieces/white-king.png" alt="White King" />,
      },
      queen: {
        content: <img src="/chess-pieces/white-queen.png" alt="White Queen" />,
      },
      rook: {
        content: <img src="/chess-pieces/white-rook.png" alt="White Rook" />,
      },
      knight: {
        content: <img src="/chess-pieces/white-knight.png" alt="White Knight" />,
      },
      bishop: {
        content: <img src="/chess-pieces/white-bishop.png" alt="White Bishop" />,
      },
      pawn: {
        content: <img src="/chess-pieces/white-pawn.png" alt="White Pawn" />,
      },
    },
    black: {
      king: {
        content: <img src="/chess-pieces/black-king.png" alt="Black King" />,
      },
      queen: {
        content: <img src="/chess-pieces/black-queen.png" alt="Black Queen" />,
      },
      rook: {
        content: <img src="/chess-pieces/black-rook.png" alt="Black Rook" />,
      },
      knight: {
        content: <img src="/chess-pieces/black-knight.png" alt="Black Knight" />,
      },
      bishop: {
        content: <img src="/chess-pieces/black-bishop.png" alt="Black Bishop" />,
      },
      pawn: {
        content: <img src="/chess-pieces/black-pawn.png" alt="Black Pawn" />,
      },
    },
  };

  const onPieceClick = () => {
    if (piece && piece.player === boardState.currentPlayer && !checkmate) {
      if (piece.piece === "pawn") {
        const possibleMoves = getPawnMoves(square, piece.player, boardState, true);
        console.log("Possible Pawn moves:", possibleMoves);
        if (square !== boardState.validMoves.pieceSquare) {
          setBoardState({
            ...boardState,
            validMoves: {
              pieceSquare: square,
              possibleMoves: possibleMoves.moves,
              possibleCaptures: possibleMoves.captures,
              enPassantCapture: possibleMoves.enPassantCapture,
              piece,
              possibleCastles: [],
            },
          });
        } else {
          setBoardState({
            ...boardState,
            validMoves: {
              pieceSquare: "",
              possibleMoves: [],
              possibleCaptures: [],
              enPassantCapture: [],
              piece: "",
              possibleCastles: [],
            },
          });
        }
      }
      if (piece.piece === "rook") {
        const possibleMoves = getRookMoves(square, piece, boardState, true);
        console.log("Possible Rook moves:", possibleMoves);
        if (square !== boardState.validMoves.pieceSquare) {
          setBoardState({
            ...boardState,
            validMoves: {
              pieceSquare: square,
              possibleMoves: possibleMoves.moves,
              possibleCaptures: possibleMoves.captures,
              piece,
              possibleCastles: [],
            },
          });
        } else {
          setBoardState({
            ...boardState,
            validMoves: {
              pieceSquare: "",
              possibleMoves: [],
              possibleCaptures: [],
              piece: "",
              possibleCastles: [],
            },
          });
        }
      }
      if (piece.piece === "bishop") {
        const possibleMoves = getBishopMoves(square, piece, boardState, true);
        console.log("Possible Bishop moves:", possibleMoves);
        if (square !== boardState.validMoves.pieceSquare) {
          setBoardState({
            ...boardState,
            validMoves: {
              pieceSquare: square,
              possibleMoves: possibleMoves.moves,
              possibleCaptures: possibleMoves.captures,
              piece,
              possibleCastles: [],
            },
          });
        } else {
          setBoardState({
            ...boardState,
            validMoves: {
              pieceSquare: "",
              possibleMoves: [],
              possibleCaptures: [],
              piece: "",
              possibleCastles: [],
            },
          });
        }
      }
      if (piece.piece === "knight") {
        const possibleMoves = getKnightMoves(square, piece, boardState, true);
        console.log("Possible Knight moves:", possibleMoves);
        if (square !== boardState.validMoves.pieceSquare) {
          setBoardState({
            ...boardState,
            validMoves: {
              pieceSquare: square,
              possibleMoves: possibleMoves.moves,
              possibleCaptures: possibleMoves.captures,
              piece,
              possibleCastles: [],
            },
          });
        } else {
          setBoardState({
            ...boardState,
            validMoves: {
              pieceSquare: "",
              possibleMoves: [],
              possibleCaptures: [],
              piece: "",
              possibleCastles: [],
            },
          });
        }
      }
      if (piece.piece === "queen") {
        const possibleMoves = getQueenMoves(square, piece, boardState, true);
        console.log("Possible Queen moves:", possibleMoves);
        if (square !== boardState.validMoves.pieceSquare) {
          setBoardState({
            ...boardState,
            validMoves: {
              pieceSquare: square,
              possibleMoves: possibleMoves.moves,
              possibleCaptures: possibleMoves.captures,
              piece,
              possibleCastles: [],
            },
          });
        } else {
          setBoardState({
            ...boardState,
            validMoves: {
              pieceSquare: "",
              possibleMoves: [],
              possibleCaptures: [],
              piece: "",
              possibleCastles: [],
            },
          });
        }
      }
      if (piece.piece === "king") {
        let oponnent = color === "white" ? "black" : "white";
        // using opponent moves here to send to get accurate castles
        let opponentMoves = getAllPossibleMovesForPlayer(oponnent, boardState);
        const possibleMoves = getKingMoves(square, piece, color, boardState, true, opponentMoves, inCheckStatus);
        console.log("Possible King moves:", possibleMoves);
        if (square !== boardState.validMoves.pieceSquare) {
          setBoardState({
            ...boardState,
            validMoves: {
              pieceSquare: square,
              possibleMoves: possibleMoves.moves,
              possibleCaptures: possibleMoves.captures,
              piece,
              possibleCastles: possibleMoves.castle,
            },
          });
        } else {
          setBoardState({
            ...boardState,
            validMoves: {
              pieceSquare: "",
              possibleMoves: [],
              possibleCaptures: [],
              piece: "",
              possibleCastles: [],
            },
          });
        }
      }
    }
  };

  // const capturePiece = () => {
  //   let previousBoardState = { ...boardState };

  //   if (mode === "puzzle") {
  //     let sanMove = internalMoveToSan(previousBoardState.validMoves.pieceSquare, square);
  //     console.log("piece square", previousBoardState.validMoves.pieceSquare);
  //     console.log("square", square);
  //     if (!previousBoardState.puzzleMoves) {
  //       previousBoardState.puzzleMoves = [];
  //     }
  //     previousBoardState.puzzleMoves = [...previousBoardState.puzzleMoves, sanMove];
  //   }

  //   delete previousBoardState.board[square];
  //   delete previousBoardState.board[boardState.validMoves.pieceSquare];
  //   let updatedBoardState = {
  //     ...previousBoardState,
  //     currentPlayer: previousBoardState.currentPlayer === "white" ? "black" : "white",
  //   };
  //   updatedBoardState.board[square] = boardState.validMoves.piece;
  //   updatedBoardState.validMoves.possibleMoves = [];
  //   updatedBoardState.validMoves.possibleCaptures = [];
  //   updatedBoardState.validMoves.piece = "";
  //   updatedBoardState.validMoves.pieceSquare = "";

  //   // change first move property to false on first move
  //   if (updatedBoardState.board[square].hasOwnProperty("firstMove")) {
  //     updatedBoardState.board[square].firstMove = false;
  //   }

  //   let isGameADrawResult = isGameADraw(updatedBoardState);

  //   // check for pawn promotion
  //   if (updatedBoardState.board[square].piece === "pawn" && (square[1] == 8 || square[1] == 1)) {
  //     // capture with pawn promotion
  //     promotePawn(updatedBoardState, square);
  //   } else {
  //     if (isThisMoveACheck(square, updatedBoardState.board[square], updatedBoardState) && !inCheckStatus) {
  //       const clonedBoardState = _.cloneDeep(updatedBoardState);
  //       // check if the game is over
  //       const isThisCheckmate = isGameOver(square, updatedBoardState.board[square], clonedBoardState);
  //       if (isThisCheckmate) {
  //         let puzzleResult;
  //         // capture causing checkmate
  //         if (mode === "puzzle") {
  //           puzzleResult = isPuzzleMoveCorrect(
  //             currentPuzzle.moves,
  //             updatedBoardState.puzzleMoves,
  //             updatedBoardState.puzzleMoves,
  //             sampleMode,
  //             currentPuzzle,
  //             setCurrentPuzzle,
  //             setPuzzleCorrect,
  //             setPuzzleIncorrect,
  //             updateAllUserPuzzleData,
  //             randomPuzzles,
  //             setRandomPuzzles,
  //             getPuzzlesWithinEloRange
  //           );
  //         }

  //         if (puzzleResult === false || puzzleResult === "finished") {
  //           setTimeout(() => {
  //             updatedBoardState.fen = false;
  //             updatedBoardState.puzzleMoves = [];
  //           }, 1000);
  //         }

  //         console.log("game over chump");
  //         setBoardState(updatedBoardState);
  //         setCheckmate(true);

  //         if (puzzleResult === true && updatedBoardState.puzzleMoves.length % 2 === 0) {
  //           setTimeout(() => {
  //             let startSquare = currentPuzzle.moves[updatedBoardState.puzzleMoves.length].substring(0, 2);
  //             let endSquare = currentPuzzle.moves[updatedBoardState.puzzleMoves.length].substring(2, 4);
  //             sanToBoardStateMove(startSquare, endSquare, updatedBoardState, currentPuzzle, "", mode, makeMove);
  //           }, 1000);
  //         }
  //       } else {
  //         // capture causing check
  //         let puzzleResult;

  //         if (mode === "puzzle") {
  //           puzzleResult = isPuzzleMoveCorrect(
  //             currentPuzzle.moves,
  //             updatedBoardState.puzzleMoves,
  //             updatedBoardState.puzzleMoves,
  //             sampleMode,
  //             currentPuzzle,
  //             setCurrentPuzzle,
  //             setPuzzleCorrect,
  //             setPuzzleIncorrect,
  //             updateAllUserPuzzleData,
  //             randomPuzzles,
  //             setRandomPuzzles,
  //             getPuzzlesWithinEloRange
  //           );
  //         }

  //         if (puzzleResult === false || puzzleResult === "finished") {
  //           setTimeout(() => {
  //             updatedBoardState.fen = false;
  //             updatedBoardState.puzzleMoves = [];
  //           }, 1000);
  //         }

  //         setInCheckStatus(true);
  //         setBoardState(updatedBoardState);
  //         console.log("major major we have a check");

  //         if (puzzleResult === true && updatedBoardState.puzzleMoves.length % 2 === 0) {
  //           setTimeout(() => {
  //             let startSquare = currentPuzzle.moves[updatedBoardState.puzzleMoves.length].substring(0, 2);
  //             let endSquare = currentPuzzle.moves[updatedBoardState.puzzleMoves.length].substring(2, 4);
  //             sanToBoardStateMove(startSquare, endSquare, updatedBoardState, currentPuzzle, "", mode, makeMove);
  //           }, 1000);
  //         }
  //       }
  //     } else if (isGameADrawResult.draw) {
  //       // capture causing draw
  //       console.log("game is a draw", isGameADrawResult);
  //       setInCheckStatus(false);
  //       setDraw(true);
  //       setBoardState(updatedBoardState);
  //     } else {
  //       // normal capture
  //       let puzzleResult;

  //       if (mode === "puzzle") {
  //         puzzleResult = isPuzzleMoveCorrect(
  //           currentPuzzle.moves,
  //           updatedBoardState.puzzleMoves,
  //           updatedBoardState.puzzleMoves,
  //           sampleMode,
  //           currentPuzzle,
  //           setCurrentPuzzle,
  //           setPuzzleCorrect,
  //           setPuzzleIncorrect,
  //           updateAllUserPuzzleData,
  //           randomPuzzles,
  //           setRandomPuzzles,
  //           getPuzzlesWithinEloRange
  //         );
  //       }

  //       if (puzzleResult === false || puzzleResult === "finished") {
  //         setTimeout(() => {
  //           updatedBoardState.fen = false;
  //           updatedBoardState.puzzleMoves = [];
  //         }, 1000);
  //       }

  //       setInCheckStatus(false);
  //       setBoardState(updatedBoardState);

  //       if (puzzleResult === true && updatedBoardState.puzzleMoves.length % 2 === 0) {
  //         setTimeout(() => {
  //           let startSquare = currentPuzzle.moves[updatedBoardState.puzzleMoves.length].substring(0, 2);
  //           let endSquare = currentPuzzle.moves[updatedBoardState.puzzleMoves.length].substring(2, 4);
  //           sanToBoardStateMove(startSquare, endSquare, updatedBoardState, currentPuzzle, "", mode, makeMove);
  //         }, 1000);
  //       }
  //     }
  //   }
  // };

  const pieceStyle = pieceStyles[piece.player][piece.piece];

  return (
    <>
      {isValidCapture ? (
        <Box
          className={`piece ${color}-piece ${className}`}
          onClick={() => capturePiece(square)}
          sx={{
            "&:hover": {
              backgroundImage: "linear-gradient(rgb(0 0 0/10%) 0 0)",
              cursor: "pointer",
            },
          }}
        >
          <span className={`chess-piece ${pieceColor} ${square}`}>{pieceStyle.content}</span>
          {isValidCapture && <Box className="valid-capture-ring" />}
        </Box>
      ) : (
        <Box
          className={`piece ${color}-piece ${
            !inCheckStatus
              ? className
              : inCheckStatus && piece.piece === "king" && piece.player === boardState.currentPlayer
              ? "check-square"
              : className
          }`}
          onClick={onPieceClick}
          sx={{
            ...(color === boardState.currentPlayer && square !== boardState.validMoves.pieceSquare
              ? {
                  "&:hover": {
                    backgroundImage: "linear-gradient(rgb(0 0 0/10%) 0 0)",
                    cursor: "pointer",
                  },
                }
              : {}),
            ...(square === boardState.validMoves.pieceSquare
              ? {
                  backgroundImage: "linear-gradient(rgb(0 0 0/40%) 0 0)",
                  "&:hover": {
                    cursor: "pointer",
                  },
                }
              : {}),
          }}
        >
          <span className={`chess-piece ${pieceColor} ${square}`}>{pieceStyle.content}</span>
        </Box>
      )}
    </>
  );
};

export default Piece;
