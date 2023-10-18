import { getPieceMoves } from "../PieceUtils/pieceMoves";

export const getOpponent = (currentPlayer) => {
  return currentPlayer === "white" ? "black" : "white";
};

export const getKingPosition = (boardState, player) => {
  for (let key in boardState.board) {
    if (boardState.board[key].piece === "king" && boardState.board[key].player !== player) {
      return key;
    }
  }
};

export const getAllPossibleMovesForPlayer = (currentPlayer, boardState, isCheckingForCheck = false) => {
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
