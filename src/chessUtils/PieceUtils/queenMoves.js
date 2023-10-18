import { getBishopMoves } from "./bishopMoves";
import { getRookMoves } from "./rookMoves";

export const getQueenMoves = (square, piece, boardState, isCheckingForCheck = false) => {
  const diagonalMoves = getBishopMoves(square, piece, boardState, isCheckingForCheck);
  const horizontalAndVerticalMoves = getRookMoves(square, piece, boardState, isCheckingForCheck);
  const moves = [...diagonalMoves.moves, ...horizontalAndVerticalMoves.moves];
  const captures = [...diagonalMoves.captures, ...horizontalAndVerticalMoves.captures];
  const selfCaptures = [...diagonalMoves.selfCaptures, ...horizontalAndVerticalMoves.selfCaptures];

  return { moves, captures, selfCaptures };
};
