import ChessBoard from "./components/ChessBoard";

function App() {
  const boardState = {
    board: {
      a1: { piece: 'rook', player: 'white' },
      b1: { piece: 'knight', player: 'white' },
      c1: { piece: 'bishop', player: 'white' },
      d1: { piece: 'queen', player: 'white' },
      e1: { piece: 'king', player: 'white' },
      f1: { piece: 'bishop', player: 'white' },
      g1: { piece: 'knight', player: 'white' },
      h1: { piece: 'rook', player: 'white' },
      a2: { piece: 'pawn', player: 'white' },
      b2: { piece: 'pawn', player: 'white' },
      c2: { piece: 'pawn', player: 'white' },
      d2: { piece: 'pawn', player: 'white' },
      e2: { piece: 'pawn', player: 'white' },
      f2: { piece: 'pawn', player: 'white' },
      g2: { piece: 'pawn', player: 'white' },
      h2: { piece: 'pawn', player: 'white' },
      a8: { piece: 'rook', player: 'black' },
      b8: { piece: 'knight', player: 'black' },
      c8: { piece: 'bishop', player: 'black' },
      d8: { piece: 'queen', player: 'black' },
      e8: { piece: 'king', player: 'black' },
      f8: { piece: 'bishop', player: 'black' },
      g8: { piece: 'knight', player: 'black' },
      h8: { piece: 'rook', player: 'black' },
      a7: { piece: 'pawn', player: 'black' },
      b7: { piece: 'pawn', player: 'black' },
      c7: { piece: 'pawn', player: 'black' },
      d7: { piece: 'pawn', player: 'black' },
      e7: { piece: 'pawn', player: 'black' },
      f7: { piece: 'pawn', player: 'black' },
      g7: { piece: 'pawn', player: 'black' },
      h7: { piece: 'pawn', player: 'black' },
    },
    currentPlayer: 'white',
  };
  

  return (
    <div>
      <h1>Chess App</h1>

      <ChessBoard boardState={boardState} />
      {/* <img src="../../public/chess-pieces/kingb.svg"></img> */}
    </div>
  );
}

export default App;
