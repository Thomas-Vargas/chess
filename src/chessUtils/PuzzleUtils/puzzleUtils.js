import { getPieceMoves } from "../PieceUtils/pieceMoves";

export const sanToBoardStateMove = (sanSquare1, sanSquare2, fenBoardState, currentPuzzle, sanMove, mode, makeMove) => {
  let startSquare = getColumnNumOrChar(sanSquare1[0]) + `${sanSquare1[1]}`;
  let endSquare = getColumnNumOrChar(sanSquare2[0]) + `${sanSquare2[1]}`;
  let capture = false;
  let promotion = false;
  let promotionSanMove = null;

  console.log("start square for finding piece", startSquare);
  console.log("board state in sanToBoardStateMove", fenBoardState);
  console.log("entire san move", sanMove);

  let piece = fenBoardState.board[startSquare];

  if (sanMove && sanMove.length === 5) {
    promotion = true;
  }

  if (fenBoardState.board[endSquare]) {
    capture = true;
  }

  let validMoves = getPieceMoves(startSquare, piece, fenBoardState);

  let boardStateWithValidMoves = {
    ...fenBoardState,
    validMoves: {
      pieceSquare: startSquare,
      possibleMoves: validMoves.moves,
      possibleCaptures: validMoves.captures,
      enPassantCapture: validMoves.enPassantCapture ? validMoves.enPassantCapture : {},
      piece,
      possibleCastles: validMoves.castle ? validMoves.castle : [],
    },
  };

  console.log(startSquare, endSquare, piece, capture, validMoves, boardStateWithValidMoves);
  if (capture) {
    delete boardStateWithValidMoves.board[endSquare];
  }

  if (promotion) {
    // this assumes i will send the entire sanMove being made everytime this function is called
    if (sanMove) {
      promotionSanMove = sanMove;
    }
    // change the piece from pawn to promotion piece
    let promotionPiece = { piece: getPieceName(sanMove[4]), player: boardStateWithValidMoves.currentPlayer };
    boardStateWithValidMoves.validMoves.piece = promotionPiece;

    // change board state by removing pawn and changing it to promoted piece
    delete boardStateWithValidMoves.board[startSquare];
    boardStateWithValidMoves.board[startSquare] = promotionPiece;
  }

  // console.log("boardState before calling makeMove", boardStateWithValidMoves);
  makeMove(endSquare, boardStateWithValidMoves, currentPuzzle, promotionSanMove, mode);
};

export const fenToBoardState = (fen, setBoardState) => {
  const fenBoardState = {
    board: {},
    currentPlayer: "white",
    validMoves: {
      piece: "",
      pieceSquare: "",
      possibleMoves: [],
      possibleCaptures: [],
      possibleCastles: [],
      enPassantCapture: {},
    },
    lastMove: null,
    fen: true,
    puzzleMoves: [],
  };

  const [position, turn, castling, enPassant, halfMove, fullMove] = fen.split(" ");

  console.log("castling rights", castling);

  // Update the current player based on the turn information
  fenBoardState.currentPlayer = turn === "w" ? "white" : "black";

  const rows = position.split("/");
  let rank = 8; // start from the top rank

  rows.forEach((row) => {
    let file = 1; // files are 1-indexed
    row.split("").forEach((char) => {
      if (isNaN(char)) {
        const player = char === char.toUpperCase() ? "white" : "black";
        const piece = char.toLowerCase();

        if (piece !== "p") {
          const pieceName = getPieceName(piece);
          const square = getSquare(file, rank);
          let pieceObj = { piece: pieceName, player };

          // check if king should have first move property
          if ((castling.includes("K") || castling.includes("Q")) && pieceName === "king" && player === "white") {
            pieceObj.firstMove = true;
          }
          if ((castling.includes("k") || castling.includes("q")) && pieceName === "king" && player === "black") {
            pieceObj.firstMove = true;
          }
          // check if rook should have first move property
          if (castling.includes("K") && square === 81 && pieceName === "rook") {
            pieceObj.firstMove = true;
          }
          if (castling.includes("Q") && square === 11 && pieceName === "rook") {
            pieceObj.firstMove = true;
          }
          if (castling.includes("k") && square === 18 && pieceName === "rook") {
            pieceObj.firstMove = true;
          }
          if (castling.includes("q") && square === 88 && pieceName === "rook") {
            pieceObj.firstMove = true;
          }
          fenBoardState.board[square] = pieceObj;
        } else {
          // Handle pawn separately
          const square = getSquare(file, rank);
          fenBoardState.board[square] = { piece: "pawn", player };
        }
        file++;
      } else {
        file += parseInt(char, 10);
      }
    });
    rank--; // Move to the next rank
  });

  setBoardState(fenBoardState);

  return fenBoardState;
};

export const internalMoveToSan = (square1, square2) => {
  const startSquare = getColumnNumOrChar(square1[0]) + square1[1];
  const endSquare = getColumnNumOrChar(square2[0]) + square2[1];

  return startSquare + endSquare;
};

// utility functions
export const getColumnNumOrChar = (char) => {
  switch (char) {
    case "a":
      return 1;
    case "b":
      return 2;
    case "c":
      return 3;
    case "d":
      return 4;
    case "e":
      return 5;
    case "f":
      return 6;
    case "g":
      return 7;
    case "h":
      return 8;
    case "1":
      return "a";
    case "2":
      return "b";
    case "3":
      return "c";
    case "4":
      return "d";
    case "5":
      return "e";
    case "6":
      return "f";
    case "7":
      return "g";
    default:
      return "h";
  }
};

export const getPieceName = (piece) => {
  switch (piece) {
    case "r":
      return "rook";
    case "n":
      return "knight";
    case "b":
      return "bishop";
    case "q":
      return "queen";
    case "k":
      return "king";
    default:
      return "pawn";
  }
};

export const getSquare = (file, rank) => {
  return rank + file * 10;
};

export const startPuzzle = (currentPuzzle, fenBoardState, mode, makeMove) => {
  let startSquare = currentPuzzle.moves[0].substring(0, 2);
  let endSquare = currentPuzzle.moves[0].substring(2, 4);

  console.log("start square in start puzzle", startSquare);
  console.log("end square in start puzzle", endSquare);

  // console.log(startSquare, endSquare)
  sanToBoardStateMove(startSquare, endSquare, fenBoardState, currentPuzzle, currentPuzzle.moves[0], mode, makeMove);
};

export const startNextPuzzle = async (setCurrentPuzzle, setRandomPuzzles, getPuzzlesWithinEloRange, randomPuzzles) => {
  let puzzles = [...randomPuzzles];
  puzzles.shift();

  let nextPuzzle = puzzles[0];

  console.log("next puzzle", nextPuzzle);

  // If there's a next puzzle, proceed
  if (nextPuzzle) {
    // reset state causing nextPuzzle functionality to trigger
    setCurrentPuzzle(nextPuzzle);
    setRandomPuzzles(puzzles);
  } else {
    // Handle the case when there are no more puzzles
    console.log("No more puzzles");
    let newPuzzles = await getPuzzlesWithinEloRange();
    setRandomPuzzles(newPuzzles);
    setCurrentPuzzle(newPuzzles[0]);
  }
};

export const isPuzzleMoveCorrect = (
  correctPuzzleMoves,
  currentPuzzleMoves,
  sampleMode,
  currentPuzzle,
  setCurrentPuzzle,
  setPuzzleCorrect,
  setPuzzleIncorrect,
  updateAllUserPuzzleData,
  randomPuzzles,
  setRandomPuzzles,
  getPuzzlesWithinEloRange
) => {
  if (JSON.stringify(correctPuzzleMoves) === JSON.stringify(currentPuzzleMoves)) {
    if (!sampleMode) {
      updateAllUserPuzzleData(true, currentPuzzle, "");
    }
    setPuzzleCorrect(true);
    // alert("puzzle complete! you go!");
    setTimeout(() => {
      setPuzzleCorrect(false);
    }, 1000);
    startNextPuzzle(setCurrentPuzzle, setRandomPuzzles, getPuzzlesWithinEloRange, randomPuzzles);
    return "finished";
    // return "finished";
  } else {
    let numberOfMoves = currentPuzzleMoves.length;
    let shortenedCorrectPuzzleMoves = correctPuzzleMoves.slice(0, numberOfMoves);

    console.log("moves comparison", shortenedCorrectPuzzleMoves, currentPuzzleMoves);

    if (JSON.stringify(shortenedCorrectPuzzleMoves) === JSON.stringify(currentPuzzleMoves)) {
      return true;
    } else {
      if (!sampleMode) {
        updateAllUserPuzzleData(false, currentPuzzle, "");
      }
      setPuzzleIncorrect(true);
      // alert("failed puzzle");
      setTimeout(() => {
        setPuzzleIncorrect(false);
      }, 1000);
      startNextPuzzle(setCurrentPuzzle, setRandomPuzzles, getPuzzlesWithinEloRange, randomPuzzles);
      return false;
      // return false;
    }
  }
};
