import _, { endsWith, random } from "lodash";
import { amIStillInCheck } from "../CheckUtils/checkUtils";

export const getKnightMoves = (square, piece, boardState, isCheckingForCheck = false) => {
    const col = square[0];
    const row = square[1];
    const moves = [];
    const captures = [];
    const selfCaptures = [];
    const potentialMoves = [];

    // Moves up
    potentialMoves.push(`${Number(col) + 1}${Number(row) + 2}`);
    potentialMoves.push(`${Number(col) - 1}${Number(row) + 2}`);
    potentialMoves.push(`${Number(col) + 2}${Number(row) + 1}`);
    potentialMoves.push(`${Number(col) - 2}${Number(row) + 1}`);

    // Moves down
    potentialMoves.push(`${Number(col) - 1}${Number(row) - 2}`);
    potentialMoves.push(`${Number(col) + 1}${Number(row) - 2}`);
    potentialMoves.push(`${Number(col) - 2}${Number(row) - 1}`);
    potentialMoves.push(`${Number(col) + 2}${Number(row) - 1}`);

    const validMoves = potentialMoves.filter(
      (move) => Number(move) >= 10 && Number(move) <= 88 && !move.includes("0")
    );

    for (let move of validMoves) {
      const tempBoardState = _.cloneDeep(boardState);

      // Apply the move to the temporary board state
      tempBoardState.board[move] = piece;
      delete tempBoardState.board[square]; // Remove the piece from its original position

      if (boardState.board.hasOwnProperty(move) && boardState.board[move].player !== piece.player) {
        if (!isCheckingForCheck || !amIStillInCheck(tempBoardState, boardState.currentPlayer, true)) {
          captures.push(move);
        }
      } else if (!boardState.board.hasOwnProperty(move)) {
        if (!isCheckingForCheck || !amIStillInCheck(tempBoardState, boardState.currentPlayer, true)) {
          moves.push(move);
        }
      } else {
        selfCaptures.push(move);
      }
    }

    return { moves, captures, selfCaptures };
  };