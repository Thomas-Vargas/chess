import React from 'react';
import Piece from './Piece';

const ChessBoard = ({ boardState }) => {
    let board = boardState.board
  const renderSquare = (square) => {
    const piece = board[square];
    // Check if the square is empty
    if (!piece) {
      return <div className="square empty-square" />;
    }
    // Render the piece component based on the piece type
    // You can create separate components for each chess piece
    // and pass the necessary props (e.g., piece type, player) to render the piece correctly.
    return <Piece piece={piece} />;
  };

  const renderRow = (row) => {
    const rowSquares = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    return rowSquares.map((col) => {
      const square = `${col}${row}`;
      return <div key={square}>{renderSquare(square)}</div>;
    });
  };

  const renderBoard = () => {
    const rows = [8, 7, 6, 5, 4, 3, 2, 1];
    return rows.map((row) => (
      <div key={row} className="board-row">
        {renderRow(row)}
      </div>
    ));
  };

  return <div className="chess-board">{renderBoard()}</div>;
};

export default ChessBoard;
