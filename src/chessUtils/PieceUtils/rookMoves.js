import _, { endsWith, random } from "lodash";
import { amIStillInCheck } from "../CheckUtils/checkUtils";

export const getRookMoves = (square, piece, boardState, isCheckingForCheck = false) => {
    const col = square[0];
    const row = square[1];
    const moves = [];
    const captures = [];
    const selfCaptures = [];

    // Define the possible directions a rook can move
    const directions = [
      { col: 0, row: 1 }, // Up
      { col: 0, row: -1 }, // Down
      { col: 1, row: 0 }, // Right
      { col: -1, row: 0 }, // Left
    ];

    // Calculate potential moves for each direction
    directions.forEach((direction) => {
      for (let i = 1; i <= 8; i++) {
        const nextCol = Number(col) + direction.col * i;
        const nextRow = Number(row) + direction.row * i;
        const nextSquare = `${nextCol}${nextRow}`;

        if (nextCol < 1 || nextCol > 8 || nextRow < 1 || nextRow > 8) {
          break;
        }

        const tempBoardState = _.cloneDeep(boardState);

        // Apply the move to the temporary board state
        tempBoardState.board[nextSquare] = piece;
        delete tempBoardState.board[square]; // Remove the piece from its original position

        if (boardState.board.hasOwnProperty(nextSquare)) {
          if (boardState.board[nextSquare].player === piece.player) {
            selfCaptures.push(nextSquare);
            break;
          } else {
            if (!isCheckingForCheck || !amIStillInCheck(tempBoardState, boardState.currentPlayer, true)) {
              captures.push(nextSquare);
            }
          }
          break; // Stop checking in this direction after capturing an opponent's piece
        } else {
          if (!isCheckingForCheck || !amIStillInCheck(tempBoardState, boardState.currentPlayer, true)) {
            moves.push(nextSquare);
          }
        }
      }
    });

    return { moves, captures, selfCaptures };
  };