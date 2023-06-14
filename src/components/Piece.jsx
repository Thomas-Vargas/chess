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
      // Determine the possible moves for the selected pawn
      if (piece.piece === "pawn") {
        const possibleMoves = getPawnMoves(square, piece.player);
        console.log("Possible Pawn moves:", possibleMoves);
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
      if (piece.piece === "rook") {
        const possibleMoves = getRookMoves();
        console.log("Possible Rook moves:", possibleMoves);
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
      if (piece.piece === "bishop") {
        const possibleMoves = getBishopMoves();
        console.log("Possible Bishop moves:", possibleMoves);
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
      if (piece.piece === "knight") {
        const possibleMoves = getKnightMoves();
        console.log("Possible Knight moves:", possibleMoves);
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

  // NOTES:
  // It doesnt seem like i need to know what the color of the piece is, move logic will always be the same
  const getRookMoves = () => {
    const col = square[0];
    const row = square[1];
    const moves = [];
    const captures = [];
    
    // Find valid moves and captures moving forward
    for (let i = Number(row) + 1; i <= 8; i++) {
      if (boardState.board.hasOwnProperty(col + i) && boardState.board[col + i].player === piece.player) {
        break;
      }
      if (boardState.board.hasOwnProperty(col + i) && boardState.board[col + i].player !== piece.player) {
        captures.push(col + i);
        break;
      }
      moves.push(col + i);
    }

    //find valid moves and captures moving back
    for (let i = Number(row) - 1; i >= 1; i--) {
      if (boardState.board.hasOwnProperty(col + i) && boardState.board[col + i].player === piece.player) {
        break;
      }
      if (boardState.board.hasOwnProperty(col + i) && boardState.board[col + i].player !== piece.player) {
        captures.push(col + i);
        break;
      }
      moves.push(col + i);
    }

    // Find valid moves and captures moving right
    for (let i = Number(col) + 1; i <= 8; i++) {
      console.log(i + row)
      if (boardState.board.hasOwnProperty(i + row) && boardState.board[i + row].player === piece.player) {
        break;
      }
      if (boardState.board.hasOwnProperty(i + row) && boardState.board[i + row].player !== piece.player) {
        captures.push(i + row);
        break;
      }
      moves.push(i + row);
    }

    // Find valid moves and captures moving left
    for (let i = Number(col) - 1; i >= 1; i--) {
      console.log(i + row);
      if (boardState.board.hasOwnProperty(i + row) && boardState.board[i + row].player === piece.player) {
        break;
      }
      if (boardState.board.hasOwnProperty(i + row) && boardState.board[i + row].player !== piece.player) {
        captures.push(i + row);
        break;
      }
      moves.push(i + row);
    }

    return {moves, captures}
  }

  const getBishopMoves = () => {
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
  }

  const getKnightMoves = () => {
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

    const validMoves = potentialMoves.filter(move => Number(move) >= 10 && Number(move) <= 88 && !move.includes('0'));

    for (let move of validMoves) {
      if (boardState.board.hasOwnProperty(move) && boardState.board[move].player !== piece.player) {
        captures.push(move);
      } else if (!boardState.board.hasOwnProperty(move)) {
        moves.push(move);
      }
    }

    return {moves, captures}
  }
  

  const capturePiece = () => {
    let previousBoardState = { ...boardState };
    delete previousBoardState.board[square];
    delete previousBoardState.board[boardState.validMoves.pieceSquare];
    const updatedBoardState = {
      ...previousBoardState,
      currentPlayer:
      previousBoardState.currentPlayer === "white" ? "black" : "white",
    };
    updatedBoardState.board[square] = boardState.validMoves.piece;
    updatedBoardState.validMoves.possibleMoves = [];
    updatedBoardState.validMoves.possibleCaptures = [];
    setBoardState(updatedBoardState);
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
