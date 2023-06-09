import React from "react";

const Piece = ({
  piece,
  color,
  className,
  square,
  boardState,
  setBoardState,
  isValidCapture,
}) => {
  console.log(isValidCapture);
  console.log("square valid capture", square);
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
    console.log(square);
    if (piece && piece.player === boardState.currentPlayer) {
      // Determine the possible moves for the selected pawn
      if (piece.piece === "pawn") {
        const possibleMoves = getPawnMoves(square, piece.player);
        console.log("Possible moves:", possibleMoves);
        setBoardState({
          ...boardState,
          validMoves: {
            pieceSquare: square,
            possibleMoves: possibleMoves.moves,
            possibleCaptures: possibleMoves.captures,
            piece,
          },
        });
      }
    }
  };

  // to dos:
  // check if pawns first move - DONE
  // check if piece in front of pawn, stop any movement - DONE
  // show valid moves -DONE
  // make move - DONE`
  // check for capture - DONE
  // display possible captures
  // capture piece func
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
      // i dont think i need to check for out of bounds because that piece will never exist in board state to capture
      if (
        boardState.board.hasOwnProperty(
          Number(`${Number(col) + 1}` + `${Number(row) + 1}`)
        )
      ) {
        captures.push(`${Number(col) + 1}` + `${Number(row) + 1}`);
      }
      if (
        boardState.board.hasOwnProperty(
          Number(`${Number(col) - 1}` + `${Number(row) + 1}`)
        )
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
    }
    return { moves, captures };
  };

  const capturePiece = () => {};

  const pieceStyle = pieceStyles[piece.player][piece.piece];

  return (
    <>
      <div
        className={`piece ${color}-piece ${className}`}
        onClick={onPieceClick}
      >
        <span className={`chess-piece ${pieceColor} ${square}`}>
          {pieceStyle.content}
        </span>
        {isValidCapture && (
          <div className="valid-capture-ring" />
        )}
      </div>
    </>
  );
};

export default Piece;
