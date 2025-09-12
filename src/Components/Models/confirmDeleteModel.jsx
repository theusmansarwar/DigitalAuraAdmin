import React from "react";
import { Box, Button, Typography, Modal } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "40%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "12px",
};

export default function DeleteModal({ open, setOpen, onConfirm }) {
  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    onConfirm(); // Sends delete confirmation to parent
    setOpen(false);
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-title">
      <Box sx={style}>
        <Typography id="modal-title" variant="h6">
          Confirm Delete?
        </Typography>
        <Typography>
          Are you sure you want to delete this item? This action cannot be undone.
        </Typography>
        <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", marginTop: "15px" }}>
          <Button variant="contained" sx={{ backgroundColor: "#B1B1B1" }} onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            sx={{
              background: "var(--warning-color)",
              color: "var(--white-color)",
              "&:hover": { background: "var(--warning-color)" },
            }}
          >
            Delete
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
