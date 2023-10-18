import { getKingPosition, getOpponent, getAllPossibleMovesForPlayer } from "../PlayerUtils/playerUtils";

export const amIStillInCheck = (updatedBoardState, currentPlayer, isRecursive = false) => {
  const kingPosition = getKingPosition(updatedBoardState, getOpponent(currentPlayer));

  // Get all possible moves for the opponent
  const opponentMoves = getAllPossibleMovesForPlayer(getOpponent(currentPlayer), updatedBoardState);
  // console.log("opponent moves", getOpponent(currentPlayer) ,opponentMoves);

  // console.log("opponent moves", opponentMoves);

  // Check if the opponent can capture the king
  if (opponentMoves.includes(kingPosition)) {
    return true;
  }

  return false;
};

export const isThisMoveACheck = (square, piece, updatedBoardState) => {
  console.log("current player in isThisMoveACheck", updatedBoardState.currentPlayer);
  return amIStillInCheck(updatedBoardState, updatedBoardState.currentPlayer);
};