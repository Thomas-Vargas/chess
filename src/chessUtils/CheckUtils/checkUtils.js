import { getKingPosition, getOpponent, getAllPossibleMovesForPlayer } from "../PlayerUtils/playerUtils";
import { getPieceMoves } from "../PieceUtils/pieceMoves";

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

export const isPieceProtected = (square, updatedBoardState) => {
    let isPieceProtected = false;
    let possibleMoves;

    console.log("board in is piece protected", updatedBoardState);

    // get all moves
    for (let position in updatedBoardState.board) {
      if (updatedBoardState.board[position].player !== updatedBoardState.currentPlayer) {
        // am i trying to make sure the king is not protected?
        // chanded to !== king 9/24, seems to fix the is piece protected functionality
        // if (updatedBoardState.board[position].piece !== "king") {
        possibleMoves = getPieceMoves(position, updatedBoardState.board[position], updatedBoardState);
        // }

        console.log("possible moves", possibleMoves);

        // check if piece is protected
        if (possibleMoves?.selfCaptures && possibleMoves.selfCaptures.includes(square)) {
          console.log("piece cannot be captured, piece is protected");
          isPieceProtected = true;
          break;
        }
        possibleMoves = {};
      }
    }

    return isPieceProtected;
  };