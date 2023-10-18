import { getPawnMoves } from "./pawnMoves";
import { getBishopMoves } from "./bishopMoves";
import { getKnightMoves } from "./knightMoves";
import { getRookMoves } from "./rookMoves";
import { getQueenMoves } from "./queenMoves";
import { getKingMoves } from "./kingMoves";

export const getPieceMoves = (square, pieceObj, boardState, isCheckingForCheck = false) => {
    // console.log("square", square);
    // console.log(pieceObj)
    let possibleMoves;
    switch (pieceObj.piece) {
      case "queen":
        let queenMoves = getQueenMoves(square, pieceObj, boardState, isCheckingForCheck);

        // added piece to make sense of moves being created, may need to remove it
        possibleMoves = {
          ...queenMoves,
          piece: pieceObj,
        };
        break;
      case "rook":
        let rookMoves = getRookMoves(square, pieceObj, boardState, isCheckingForCheck);

        possibleMoves = {
          ...rookMoves,
          piece: pieceObj,
        };
        break;
      case "knight":
        let knightMoves = getKnightMoves(square, pieceObj, boardState, isCheckingForCheck);

        knightMoves.moves = knightMoves.moves.filter((move) => move[1] !== "9");

        possibleMoves = {
          ...knightMoves,
          piece: pieceObj,
        };
        break;
      case "bishop":
        let bishopMoves = getBishopMoves(square, pieceObj, boardState, isCheckingForCheck);

        possibleMoves = {
          ...bishopMoves,
          piece: pieceObj,
        };
        break;
      case "pawn":
        let pawnMoves = getPawnMoves(square, pieceObj.player, boardState, isCheckingForCheck);

        possibleMoves = {
          ...pawnMoves,
          piece: pieceObj,
        };
        break;
      case "king":
        // sending empty array for opponent moves because getPieceMoves result only useful for checking for valid moves
        // king can never castle to escape check anyway
        let kingMoves = getKingMoves(square, pieceObj, pieceObj.player, boardState, isCheckingForCheck, []);

        possibleMoves = {
          ...kingMoves,
          piece: pieceObj,
        };
        break;
    }

    return possibleMoves;
  };