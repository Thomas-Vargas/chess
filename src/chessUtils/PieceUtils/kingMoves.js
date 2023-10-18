import _, { endsWith, random } from "lodash";
import { amIStillInCheck } from "../CheckUtils/checkUtils";
import { isThisMoveACheck } from "../CheckUtils/checkUtils";

export const getKingMoves = (
  square,
  piece,
  color,
  boardState,
  isCheckingForCheck = false,
  opponentMoves,
  inCheckStatus
) => {
  const col = square[0];
  const row = square[1];
  const moves = [];
  const captures = [];
  const castle = [];
  const potentialMoves = [];
  const selfCaptures = [];

  // console.log(boardState.board['81'].firstMove);

  potentialMoves.push(col + `${Number(row) + 1}`);
  potentialMoves.push(col + `${Number(row) - 1}`);
  potentialMoves.push(`${Number(col) + 1}` + row);
  potentialMoves.push(`${Number(col) - 1}` + row);
  potentialMoves.push(`${Number(col) + 1}` + `${Number(row) + 1}`);
  potentialMoves.push(`${Number(col) + 1}` + `${Number(row) - 1}`);
  potentialMoves.push(`${Number(col) - 1}` + `${Number(row) + 1}`);
  potentialMoves.push(`${Number(col) - 1}` + `${Number(row) - 1}`);

  const validMoves = potentialMoves.filter(
    (move) => Number(move) >= 10 && Number(move) <= 88 && !move.includes("0") && !move.includes("9")
  );

  for (let move of validMoves) {
    const tempBoardState = _.cloneDeep(boardState);

    tempBoardState.board[move] = piece;
    delete tempBoardState.board[square];

    if (boardState.board.hasOwnProperty(move) && boardState.board[move].player !== piece.player) {
      // Check if capturing would put the king in check
      if (!isCheckingForCheck || !amIStillInCheck(tempBoardState, boardState.currentPlayer, true)) {
        captures.push(move);
      }
    } else if (!boardState.board.hasOwnProperty(move)) {
      // Check if moving would put the king in check
      if (!isCheckingForCheck || !amIStillInCheck(tempBoardState, boardState.currentPlayer, true)) {
        moves.push(move);
      }
    } else {
      selfCaptures.push(move);
    }
  }

  console.log("all opponent moves in get king moves", opponentMoves);

  // castle logic
  if (color === "white" && !inCheckStatus) {
    // check for possible castle right and left
    if (
      !boardState.board.hasOwnProperty(`${Number(col) + 1}` + row) &&
      !boardState.board.hasOwnProperty(`${Number(col) + 2}` + row) &&
      piece.firstMove === true &&
      boardState.board["81"].firstMove === true &&
      !opponentMoves.includes("61") &&
      !opponentMoves.includes("71")
    ) {
      castle.push(`${Number(col) + 2}` + row);
    }
    if (
      !boardState.board.hasOwnProperty(`${Number(col) - 1}` + row) &&
      !boardState.board.hasOwnProperty(`${Number(col) - 2}` + row) &&
      !boardState.board.hasOwnProperty(`${Number(col) - 3}` + row) &&
      piece.firstMove === true &&
      boardState.board["11"].firstMove === true &&
      !opponentMoves.includes("21") &&
      !opponentMoves.includes("31") &&
      !opponentMoves.includes("41")
    ) {
      castle.push(`${Number(col) - 2}` + row);
    }
  } else if (color === "black" && !inCheckStatus) {
    if (
      !boardState.board.hasOwnProperty(`${Number(col) + 1}` + row) &&
      !boardState.board.hasOwnProperty(`${Number(col) + 2}` + row) &&
      piece.firstMove === true &&
      boardState.board["88"].firstMove === true &&
      !opponentMoves.includes("68") &&
      !opponentMoves.includes("78")
    ) {
      castle.push(`${Number(col) + 2}` + row);
    }
    if (
      !boardState.board.hasOwnProperty(`${Number(col) - 1}` + row) &&
      !boardState.board.hasOwnProperty(`${Number(col) - 2}` + row) &&
      !boardState.board.hasOwnProperty(`${Number(col) - 3}` + row) &&
      piece.firstMove === true &&
      boardState.board["18"].firstMove === true &&
      !opponentMoves.includes("28") &&
      !opponentMoves.includes("38") &&
      !opponentMoves.includes("48")
    ) {
      castle.push(`${Number(col) - 2}` + row);
    }
  }

  return { moves, captures, castle, selfCaptures };
};

export const handleCastle = (square, boardState, setBoardState) => {
  let previousBoardState = { ...boardState };
  switch (square) {
    case "71":
      delete previousBoardState.board["51"];
      delete previousBoardState.board["81"];
      const updatedBoardState = {
        ...previousBoardState,
        currentPlayer: previousBoardState.currentPlayer === "white" ? "black" : "white",
      };
      updatedBoardState.board["71"] = {
        piece: "king",
        player: "white",
        firstMove: false,
      };
      updatedBoardState.board["61"] = {
        piece: "rook",
        player: "white",
        firstMove: false,
      };
      updatedBoardState.validMoves.possibleMoves = [];
      updatedBoardState.validMoves.possibleCaptures = [];
      updatedBoardState.validMoves.possibleCastles = [];
      setBoardState(updatedBoardState);
      break;
    case "31":
      delete previousBoardState.board["51"];
      delete previousBoardState.board["11"];
      const updatedBoardState1 = {
        ...previousBoardState,
        currentPlayer: previousBoardState.currentPlayer === "white" ? "black" : "white",
      };
      updatedBoardState1.board["31"] = {
        piece: "king",
        player: "white",
        firstMove: false,
      };
      updatedBoardState1.board["41"] = {
        piece: "rook",
        player: "white",
        firstMove: false,
      };
      updatedBoardState1.validMoves.possibleMoves = [];
      updatedBoardState1.validMoves.possibleCaptures = [];
      updatedBoardState1.validMoves.possibleCastles = [];
      setBoardState(updatedBoardState1);
      break;
    case "78":
      delete previousBoardState.board["58"];
      delete previousBoardState.board["88"];
      const updatedBoardState2 = {
        ...previousBoardState,
        currentPlayer: previousBoardState.currentPlayer === "white" ? "black" : "white",
      };
      updatedBoardState2.board["78"] = {
        piece: "king",
        player: "black",
        firstMove: false,
      };
      updatedBoardState2.board["68"] = {
        piece: "rook",
        player: "black",
        firstMove: false,
      };
      updatedBoardState2.validMoves.possibleMoves = [];
      updatedBoardState2.validMoves.possibleCaptures = [];
      updatedBoardState2.validMoves.possibleCastles = [];
      setBoardState(updatedBoardState2);
      break;
    case "38":
      delete previousBoardState.board["58"];
      delete previousBoardState.board["18"];
      const updatedBoardState3 = {
        ...previousBoardState,
        currentPlayer: previousBoardState.currentPlayer === "white" ? "black" : "white",
      };
      updatedBoardState3.board["38"] = {
        piece: "king",
        player: "black",
        firstMove: false,
      };
      updatedBoardState3.board["48"] = {
        piece: "rook",
        player: "black",
        firstMove: false,
      };
      updatedBoardState3.validMoves.possibleMoves = [];
      updatedBoardState3.validMoves.possibleCaptures = [];
      updatedBoardState3.validMoves.possibleCastles = [];
      setBoardState(updatedBoardState3);
      break;
  }
};
