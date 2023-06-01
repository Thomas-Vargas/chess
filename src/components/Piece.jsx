import React from 'react';

const Piece = ({ piece }) => {
  const pieceStyles = {
    // Define styles for each piece type
    // You can customize the styles based on your design requirements
    // Here, we're using simple text representations for the pieces
    'rook': {
      content: '♖',
    },
    'knight': {
      content: '♘',
    },
    'bishop': {
      content: '♗',
    },
    'pawn': {
      content: '♙',
    },
    // ... other piece types
  };

  const pieceStyle = pieceStyles[piece];

  return (
    <div className="piece">
      {pieceStyle && <span>{pieceStyle.content}</span>}
    </div>
  );
};

export default Piece;
