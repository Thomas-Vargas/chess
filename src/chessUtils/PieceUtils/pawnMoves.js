import _, { endsWith, random } from "lodash";
import { amIStillInCheck } from "../CheckUtils/checkUtils"

const isEnPassantPossible = (square, boardState) => {
  let possibleEnPassantSquares = [];
  possibleEnPassantSquares.push(Number(square[0]) + 1 + `${square[1]}`);
  possibleEnPassantSquares.push(Number(square[0]) - 1 + `${square[1]}`);

  console.log("possible en passant squares", possibleEnPassantSquares);
  if (possibleEnPassantSquares.includes(boardState.lastMove.destinationSquare)) {
    let result = {
      result: true,
      pieceSquareToCapture: possibleEnPassantSquares.find((square) => square === boardState.lastMove.destinationSquare),
      squareToMoveTo:
        boardState.currentPlayer === "white"
          ? `${Number(boardState.lastMove.destinationSquare) + 1}`
          : `${Number(boardState.lastMove.destinationSquare) - 1}`,
    };
    return result;
  } else {
    return { result: false };
  }
};

export const getPawnMoves = (square, player, boardState, isCheckingForCheck = false) => {
  const col = square[0];
  const row = square[1];
  const moves = [];
  const captures = [];
  const selfCaptures = [];
  let enPassantCapture;

  if (player === "white") {
    // Check for valid move
    if (!boardState.board.hasOwnProperty(col + (Number(row) + 1))) {
      const targetSquare1 = col + (Number(row) + 1);
      const tempBoardState1 = _.cloneDeep(boardState);

      // Apply the move to the temporary board state
      tempBoardState1.board[targetSquare1] = {
        type: "pawn",
        player: "white",
      };
      delete tempBoardState1.board[square]; // Remove the pawn from its original position

      if (!isCheckingForCheck || !amIStillInCheck(tempBoardState1, boardState.currentPlayer, true)) {
        moves.push(targetSquare1);
      }

      if (!boardState.board.hasOwnProperty(col + (Number(row) + 2)) && row == 2) {
        const targetSquare2 = col + (Number(row) + 2);
        const tempBoardState2 = _.cloneDeep(boardState);

        // Apply the move to the temporary board state
        tempBoardState2.board[targetSquare2] = {
          type: "pawn",
          player: "white",
        };
        delete tempBoardState2.board[square]; // Remove the pawn from its original position

        if (!isCheckingForCheck || !amIStillInCheck(tempBoardState2, boardState.currentPlayer, true)) {
          moves.push(targetSquare2);
        }
      }
    }

    // Check for valid capture in front of the pawn
    if (boardState.board.hasOwnProperty(Number(`${Number(col) + 1}` + `${Number(row) + 1}`))) {
      if (boardState.board[Number(`${Number(col) + 1}` + `${Number(row) + 1}`)].player !== "white") {
        const targetSquareCapture1 = `${Number(col) + 1}` + `${Number(row) + 1}`;
        const tempBoardStateCapture1 = _.cloneDeep(boardState);

        // Apply the capture to the temporary board state
        delete tempBoardStateCapture1.board[square];

        if (!isCheckingForCheck || !amIStillInCheck(tempBoardStateCapture1, boardState.currentPlayer, true)) {
          captures.push(targetSquareCapture1);
        }
      } else {
        selfCaptures.push(`${Number(col) + 1}` + `${Number(row) + 1}`);
      }
    }

    if (boardState.board.hasOwnProperty(Number(`${Number(col) - 1}` + `${Number(row) + 1}`))) {
      if (boardState.board[Number(`${Number(col) - 1}` + `${Number(row) + 1}`)].player !== "white") {
        const targetSquareCapture2 = `${Number(col) - 1}` + `${Number(row) + 1}`;
        const tempBoardStateCapture2 = _.cloneDeep(boardState);

        // Apply the capture to the temporary board state
        delete tempBoardStateCapture2.board[square];

        if (!isCheckingForCheck || !amIStillInCheck(tempBoardStateCapture2, boardState.currentPlayer, true)) {
          captures.push(targetSquareCapture2);
        }
      } else {
        selfCaptures.push(`${Number(col) - 1}` + `${Number(row) + 1}`);
      }
    }
  }

  if (player === "black") {
    // Check for valid move
    if (!boardState.board.hasOwnProperty(col + (Number(row) - 1))) {
      const targetSquare1 = col + (Number(row) - 1);
      const tempBoardState1 = _.cloneDeep(boardState);

      // Apply the move to the temporary board state
      tempBoardState1.board[targetSquare1] = {
        type: "pawn",
        player: "black",
      };
      delete tempBoardState1.board[square]; // Remove the pawn from its original position

      if (!isCheckingForCheck || !amIStillInCheck(tempBoardState1, boardState.currentPlayer, true)) {
        moves.push(targetSquare1);
      }

      if (!boardState.board.hasOwnProperty(col + (Number(row) - 2)) && row == 7) {
        const targetSquare2 = col + (Number(row) - 2);
        const tempBoardState2 = _.cloneDeep(boardState);

        // Apply the move to the temporary board state
        tempBoardState2.board[targetSquare2] = {
          type: "pawn",
          player: "black",
        };
        delete tempBoardState2.board[square]; // Remove the pawn from its original position

        if (!isCheckingForCheck || !amIStillInCheck(tempBoardState2, boardState.currentPlayer, true)) {
          moves.push(targetSquare2);
        }
      }
    }

    // Check for valid capture in front of the pawn
    if (boardState.board.hasOwnProperty(Number(`${Number(col) + 1}` + `${Number(row) - 1}`))) {
      if (boardState.board[Number(`${Number(col) + 1}` + `${Number(row) - 1}`)].player !== "black") {
        const targetSquareCapture1 = `${Number(col) + 1}` + `${Number(row) - 1}`;
        const tempBoardStateCapture1 = _.cloneDeep(boardState);

        // Apply the capture to the temporary board state
        delete tempBoardStateCapture1.board[targetSquareCapture1];
        tempBoardStateCapture1.board[targetSquareCapture1] = {
          type: "pawn",
          player: "black",
        };

        if (!isCheckingForCheck || !amIStillInCheck(tempBoardStateCapture1, boardState.currentPlayer, true)) {
          captures.push(targetSquareCapture1);
        }
      } else {
        selfCaptures.push(`${Number(col) + 1}` + `${Number(row) - 1}`);
      }
    }

    if (boardState.board.hasOwnProperty(Number(`${Number(col) - 1}` + `${Number(row) - 1}`))) {
      if (boardState.board[Number(`${Number(col) - 1}` + `${Number(row) - 1}`)].player !== "black") {
        const targetSquareCapture2 = `${Number(col) - 1}` + `${Number(row) - 1}`;
        const tempBoardStateCapture2 = _.cloneDeep(boardState);

        // Apply the capture to the temporary board state
        delete tempBoardStateCapture2.board[targetSquareCapture2];
        tempBoardStateCapture2.board[targetSquareCapture2] = {
          type: "pawn",
          player: "black",
        };

        if (!isCheckingForCheck || !amIStillInCheck(tempBoardStateCapture2, boardState.currentPlayer, true)) {
          captures.push(targetSquareCapture2);
        }
      } else {
        selfCaptures.push(`${Number(col) - 1}` + `${Number(row) - 1}`);
      }
    }
  }

  let isEnPassantPossibleResult;

  if (boardState.lastMove) {
    isEnPassantPossibleResult = isEnPassantPossible(square, boardState);
  }

  if (boardState.lastMove && isEnPassantPossibleResult.result) {
    console.log("en passant possible", isEnPassantPossibleResult);
    enPassantCapture = isEnPassantPossibleResult;
  } else {
    // console.log("en passant not possible");
    enPassantCapture = null;
  }

  return { moves, captures, selfCaptures, enPassantCapture };
};
