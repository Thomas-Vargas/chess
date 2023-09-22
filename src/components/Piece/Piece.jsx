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
  inCheckStatus
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
        content: (
          <img src="/chess-pieces/white-knight.png" alt="White Knight" />
        ),
      },
      bishop: {
        content: (
          <img src="/chess-pieces/white-bishop.png" alt="White Bishop" />
        ),
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
        content: (
          <img src="/chess-pieces/black-knight.png" alt="Black Knight" />
        ),
      },
      bishop: {
        content: (
          <img src="/chess-pieces/black-bishop.png" alt="Black Bishop" />
        ),
      },
      pawn: {
        content: <img src="/chess-pieces/black-pawn.png" alt="Black Pawn" />,
      },
    },
  };

  const onPieceClick = () => {
    if (piece && piece.player === boardState.currentPlayer) {
      if (piece.piece === "pawn") {
        const possibleMoves = getPawnMoves(square, piece.player, boardState, inCheckStatus);
        console.log("Possible Pawn moves:", possibleMoves);
        setBoardState({
          ...boardState,
          validMoves: {
            pieceSquare: square,
            possibleMoves: possibleMoves.moves,
            possibleCaptures: possibleMoves.captures,
            piece,
            possibleCastles: []
          },
        });
      }
      if (piece.piece === "rook") {
        const possibleMoves = getRookMoves(square, piece, boardState, inCheckStatus);
        console.log("Possible Rook moves:", possibleMoves);
        setBoardState({
          ...boardState,
          validMoves: {
            pieceSquare: square,
            possibleMoves: possibleMoves.moves,
            possibleCaptures: possibleMoves.captures,
            piece,
            possibleCastles: []
          },
        });
      }
      if (piece.piece === "bishop") {
        const possibleMoves = getBishopMoves(square, piece, boardState, inCheckStatus);
        console.log("Possible Bishop moves:", possibleMoves);
        setBoardState({
          ...boardState,
          validMoves: {
            pieceSquare: square,
            possibleMoves: possibleMoves.moves,
            possibleCaptures: possibleMoves.captures,
            piece,
            possibleCastles: []
          },
        });
      }
      if (piece.piece === "knight") {
        const possibleMoves = getKnightMoves(square, piece, boardState, inCheckStatus);
        console.log("Possible Knight moves:", possibleMoves);
        setBoardState({
          ...boardState,
          validMoves: {
            pieceSquare: square,
            possibleMoves: possibleMoves.moves,
            possibleCaptures: possibleMoves.captures,
            piece,
            possibleCastles: []
          },
        });
      }
      if (piece.piece === "queen") {
        const possibleMoves = getQueenMoves(square, piece, boardState, inCheckStatus);
        console.log("Possible Queen moves:", possibleMoves);
        setBoardState({
          ...boardState,
          validMoves: {
            pieceSquare: square,
            possibleMoves: possibleMoves.moves,
            possibleCaptures: possibleMoves.captures,
            piece,
            possibleCastles: []
          },
        });
      }
      if (piece.piece === "king") {
        const possibleMoves = getKingMoves(square, piece, color, boardState, inCheckStatus);
        console.log("Possible King moves:", possibleMoves);
        setBoardState({
          ...boardState,
          validMoves: {
            pieceSquare: square,
            possibleMoves: possibleMoves.moves,
            possibleCaptures: possibleMoves.captures,
            piece,
            possibleCastles: possibleMoves.castle
          },
        });
      }
    }
  };

  const capturePiece = () => {
    let previousBoardState = { ...boardState };
    delete previousBoardState.board[square];
    delete previousBoardState.board[boardState.validMoves.pieceSquare];
    let updatedBoardState = {
      ...previousBoardState,
      currentPlayer:
      previousBoardState.currentPlayer === "white" ? "black" : "white",
    };
    updatedBoardState.board[square] = boardState.validMoves.piece;

    // change first move property to false on first move
    if (updatedBoardState.board[square].hasOwnProperty('firstMove')) {
      updatedBoardState.board[square].firstMove = false;
    }

    // check for pawn promotion 
    // check for pawn promotion 
    if (updatedBoardState.board[square].piece === 'pawn' && (square[1] == 8 || square[1] == 1)) {
      promotePawn(updatedBoardState, square);
      // setBoardState(updatedBoardState);
    } else {

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
      setBoardState(updatedBoardState);
    }

    updatedBoardState.validMoves.possibleMoves = [];
    updatedBoardState.validMoves.possibleCaptures = [];
  };

  const pieceStyle = pieceStyles[piece.player][piece.piece];

  return (
    <>
      {isValidCapture ? (
        <div
          className={`piece ${color}-piece ${className}`}
          onClick={capturePiece}
        >
          <span className={`chess-piece ${pieceColor} ${square}`}>
            {pieceStyle.content}
          </span>
          {isValidCapture && <div className="valid-capture-ring" />}
        </div>
      ) : (
        <div
          className={`piece ${color}-piece ${className}`}
          onClick={onPieceClick}
        >
          <span className={`chess-piece ${pieceColor} ${square}`}>
            {pieceStyle.content}
          </span>
        </div>
      )}
    </>
  );
};

export default Piece;
