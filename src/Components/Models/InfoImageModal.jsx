import React from "react";
import { Modal, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function InfoImageModel({ open, onClose, heading, image }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-heading"
      aria-describedby="modal-image"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 3,
          borderRadius: 3,
          maxWidth: 500,
          width: "90%",
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>

        {/* Heading */}
        <Typography
          id="modal-heading"
          variant="h6"
          component="h2"
          sx={{ mb: 2 }}
        >
          {heading}
        </Typography>

        {/* Image */}
        {image && (
          <Box
            component="img"
            src={image}
            alt={heading}
            sx={{
              width: "100%",
              borderRadius: 2,
              objectFit: "cover",
            }}
          />
        )}
      </Box>
    </Modal>
  );
}
