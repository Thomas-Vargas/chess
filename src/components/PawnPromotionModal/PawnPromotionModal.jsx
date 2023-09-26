import {
  Modal,
  Typography,
  Box,
  Button,
  Stack,
  IconButton,
  Divider,
} from "@mui/material";
import { useEffect } from "react";

const PawnPromotionModal = ({ boardState, selectPromotionPiece, open, promotionBoardState, promotionSquare }) => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  console.log("promotion square", promotionSquare);
  console.log("promotion board state", promotionBoardState)

  return (
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography
          id="modal-modal-title"
          variant="h4"
          component="h2"
          textAlign="center"
          mb="10px"
        >
          Promote Pawn
        </Typography>
        <Divider />
        {boardState.currentPlayer === "white" ? (
          <Stack direction="row" justifyContent="center">
            <Button
              onClick={() =>
                selectPromotionPiece({ piece: "queen", player: "white" }, promotionSquare, promotionBoardState)
              }
            >
              <img src="/chess-pieces/white-queen.png" alt="White Queen" />
            </Button>
            <Button
              onClick={() =>
                selectPromotionPiece({ piece: "rook", player: "white" }, promotionSquare, promotionBoardState)
              }
            >
              <img src="/chess-pieces/white-rook.png" alt="White Rook" />
            </Button>
            <Button
              onClick={() =>
                selectPromotionPiece({ piece: "knight", player: "white" }, promotionSquare, promotionBoardState)
              }
            >
              <img src="/chess-pieces/white-knight.png" alt="White Knight" />
            </Button>
            <Button
              onClick={() =>
                selectPromotionPiece({ piece: "bishop", player: "white" }, promotionSquare, promotionBoardState)
              }
            >
              <img src="/chess-pieces/white-bishop.png" alt="White Bishop" />
            </Button>
          </Stack>
        ) : (
          <Stack direction="row" justifyContent="center">
            <Button
              onClick={() =>
                selectPromotionPiece({ piece: "queen", player: "black" }, promotionSquare, promotionBoardState)
              }
            >
              <img src="/chess-pieces/black-queen.png" alt="Black Queen" />
            </Button>
            <Button
              onClick={() =>
                selectPromotionPiece({ piece: "rook", player: "black" }, promotionSquare, promotionBoardState)
              }
            >
              <img src="/chess-pieces/black-rook.png" alt="Black Rook" />
            </Button>
            <Button
              onClick={() =>
                selectPromotionPiece({ piece: "knight", player: "black" }, promotionSquare, promotionBoardState)
              }
            >
              <img src="/chess-pieces/black-knight.png" alt="Black Knight" />
            </Button>
            <Button
              onClick={() =>
                selectPromotionPiece({ piece: "bishop", player: "black" }, promotionSquare, promotionBoardState)
              }
            >
              <img src="/chess-pieces/black-bishop.png" alt="Black Bishop" />
            </Button>
          </Stack>
        )}
      </Box>
    </Modal>
  );
};

export default PawnPromotionModal;
