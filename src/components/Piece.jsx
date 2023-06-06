import React from "react";

const Piece = ({ piece, color, className, square, boardState }) => {
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
    console.log(`hello from ${square}`);
    console.log(square);
    if (piece && piece.player === boardState.currentPlayer) {
      // Determine the possible moves for the selected pawn
      if (piece.piece === "pawn") {
        const possibleMoves = getPawnMoves(square, piece.player);
        console.log("Possible moves:", possibleMoves);
      }

    }
  }

  const getPawnMoves = (square, player) => {
    const moves = [];

    return moves;
  };

  const pieceStyle = pieceStyles[piece.player][piece.piece];

  return (
    <div className={`piece ${color}-piece ${className}`} onClick={onPieceClick}>
      <span className={`chess-piece ${pieceColor}`}>{pieceStyle.content}</span>
    </div>
  );
};

export default Piece;
