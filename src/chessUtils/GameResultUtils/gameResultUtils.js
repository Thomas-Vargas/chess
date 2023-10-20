import _, { endsWith, random } from "lodash";
import { amIStillInCheck, isPieceProtected } from "../CheckUtils/checkUtils";
import { getPieceMoves } from "../PieceUtils/pieceMoves";
import { getAllPossibleMovesForPlayer } from "../PlayerUtils/playerUtils";

export const isGameOver = (squareCausingCheck, piece, updatedBoardState) => {
  let isGameOver = true;
  let possibleMoves;

  console.log("in isgameover");

  console.log("updated board state before for loop", updatedBoardState);

  // get all moves
  for (let position in updatedBoardState.board) {
    console.log(position);
    if (updatedBoardState.board[position].player === updatedBoardState.currentPlayer) {
      possibleMoves = getPieceMoves(position, updatedBoardState.board[position], updatedBoardState);

      let currentPiece = updatedBoardState.board[position].piece;

      console.log("all possible moves", possibleMoves);

      console.log("current piece in is game over", currentPiece);

      // check if piece can be captured, make sure piece is not protected
      if (possibleMoves?.captures && possibleMoves.captures.includes(squareCausingCheck)) {
        if (currentPiece === "king" && !isPieceProtected(squareCausingCheck, updatedBoardState)) {
          console.log("piece can be captured by this position", position);
          isGameOver = false;
          break;
        } else if (currentPiece !== "king") {
          console.log("piece can be captured by this position", position);
          isGameOver = false;
          break;
        }
      } else {
        // check if a capture that does not capture the piece causing check would get player out of check
        console.log("check piece cant be captured, checking if another capture gets king out of check");
        if (possibleMoves?.captures) {
          for (let capture of possibleMoves.captures) {
            let testBoardState = _.cloneDeep(updatedBoardState);

            delete testBoardState.board[position];
            delete testBoardState.board[capture];
            testBoardState.board[capture] = possibleMoves.piece;

            if (!amIStillInCheck(testBoardState, updatedBoardState.currentPlayer, true)) {
              console.log("a capture can get king out of check, capturing to square:", capture);
              isGameOver = false;
              break;
            }
          }
        }
      }

      // check if move can block check
      if (possibleMoves?.moves) {
        for (let move of possibleMoves.moves) {
          // Create test board state modeling the move as made
          let testBoardState = _.cloneDeep(updatedBoardState);
          // Remove the previous square
          delete testBoardState.board[position];
          // Add the new move
          testBoardState.board[move] = possibleMoves.piece;
          // Use test board state to see if it blocks check
          if (!amIStillInCheck(testBoardState, updatedBoardState.currentPlayer, true)) {
            console.log("check can be blocked");
            isGameOver = false;
            break;
          }
        }
      }
      possibleMoves = {};
    } else {
      console.log("updated board state curr player", updatedBoardState.currentPlayer);
    }
  }

  return isGameOver;
};

export const isGameADraw = (updatedBoardState) => {
  let isDraw = true;
  let insufficientMaterial = true;
  const availableMoves = getAllPossibleMovesForPlayer(updatedBoardState.currentPlayer, updatedBoardState, true);

  if (availableMoves.length > 0) {
    isDraw = false;
  }

  // Check for insufficient material (only kings left)
  const piecesOnBoard = Object.values(updatedBoardState.board);
  const nonKingPieces = piecesOnBoard.filter((piece) => piece.piece !== "king");

  if (nonKingPieces.length > 0) {
    insufficientMaterial = false;
  }

  let result = {
    draw: isDraw || insufficientMaterial,
    insufficientMaterial: insufficientMaterial,
  };

  return result;
};
