import React from "react";
import _ from "lodash";

const Piece = ({
  piece,
  color,
  className,
  square,
  boardState,
  setBoardState,
  isValidCapture,
  promotePawn,
  getBishopMoves,
  getKingMoves,
  getKnightMoves,
  getPawnMoves,
  getRookMoves,
  getQueenMoves,
  isThisMoveACheck,
  isGameOver,
  setInCheckStatus,
  inCheckStatus,
  setCheckmate,
  checkmate,
  isGameADraw,
  setDraw,
  internalMoveToSan,
  isPuzzleMoveCorrect,
  currentPuzzle
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
      }
      if (piece.piece === "rook") {
        const possibleMoves = getRookMoves(square, piece, boardState, true);
        console.log("Possible Rook moves:", possibleMoves);
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
      }
      if (piece.piece === "bishop") {
        const possibleMoves = getBishopMoves(square, piece, boardState, true);
        console.log("Possible Bishop moves:", possibleMoves);
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
      }
      if (piece.piece === "knight") {
        const possibleMoves = getKnightMoves(square, piece, boardState, true);
        console.log("Possible Knight moves:", possibleMoves);
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
      }
      if (piece.piece === "queen") {
        const possibleMoves = getQueenMoves(square, piece, boardState, true);
        console.log("Possible Queen moves:", possibleMoves);
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
      }
      if (piece.piece === "king") {
        const possibleMoves = getKingMoves(square, piece, color, boardState, true);
        console.log("Possible King moves:", possibleMoves);
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
      }
    }
  };

  const capturePiece = () => {
    let previousBoardState = { ...boardState };

    let sanMove = internalMoveToSan(boardState.validMoves.pieceSquare, square);

    console.log("san move in capture piece", sanMove);

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
    // i dont think this is necessary
    if (!updatedBoardState.puzzleMoves) {
      updatedBoardState.puzzleMoves = [];
    }
    updatedBoardState.puzzleMoves = [...updatedBoardState.puzzleMoves, sanMove];

    // change first move property to false on first move
    if (updatedBoardState.board[square].hasOwnProperty("firstMove")) {
      updatedBoardState.board[square].firstMove = false;
    }

    // kept in case i need to revert to old logic

    // check for pawn promotion
    // if (updatedBoardState.board[square].piece === "pawn" && (square[1] == 8 || square[1] == 1)) {
    //   console.log("promoting pawn")
    //   const clonedBoardState = _.cloneDeep(updatedBoardState);
    //   promotePawn(clonedBoardState, square);
    // } else {
    //   console.log("not promoting pawn")
    //   const clonedBoardState = _.cloneDeep(updatedBoardState);
    //   // check if game is over
    //   if (isGameOver(square, updatedBoardState.board[square], clonedBoardState)) {
    //     console.log("game over chump");
    //     setBoardState(updatedBoardState);
    //     setCheckmate(true);
    //   } else if (isThisMoveACheck(square, updatedBoardState.board[square], updatedBoardState) && !inCheckStatus) {
    //     console.log("major major we have a check");
    //     // save check status to generate valid moves for escaping check
    //     setInCheckStatus(true);
    //     setBoardState(updatedBoardState);
    //   } else {
    //     setInCheckStatus(false);
    //     setBoardState(updatedBoardState);
    //   }
    // }
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
          // capture causing checkmate
          isPuzzleMoveCorrect(currentPuzzle.moves, updatedBoardState.puzzleMoves);
          console.log("game over chump");
          setBoardState(updatedBoardState);
          setCheckmate(true);
        } else {
          // capture causing check
          isPuzzleMoveCorrect(currentPuzzle.moves, updatedBoardState.puzzleMoves);
          setInCheckStatus(true);
          setBoardState(updatedBoardState);
          console.log("major major we have a check");
        }
      } else if (isGameADrawResult.draw) {
        // capture causing draw
        console.log("game is a draw", isGameADrawResult);
        setInCheckStatus(false);
        setDraw(true);
        setBoardState(updatedBoardState);
      } else {
        // normal capture
        isPuzzleMoveCorrect(currentPuzzle.moves, updatedBoardState.puzzleMoves);
        setInCheckStatus(false);
        setBoardState(updatedBoardState);
      }
    }
  };

  const pieceStyle = pieceStyles[piece.player][piece.piece];

  return (
    <>
      {isValidCapture ? (
        <div className={`piece ${color}-piece ${className}`} onClick={capturePiece}>
          <span className={`chess-piece ${pieceColor} ${square}`}>{pieceStyle.content}</span>
          {isValidCapture && <div className="valid-capture-ring" />}
        </div>
      ) : (
        <div className={`piece ${color}-piece ${className}`} onClick={onPieceClick}>
          <span className={`chess-piece ${pieceColor} ${square}`}>{pieceStyle.content}</span>
        </div>
      )}
    </>
  );
};

export default Piece;
