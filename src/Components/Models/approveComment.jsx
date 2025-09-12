import * as React from "react";
import {
  Box,
  Button,
  Typography,
  Modal,
  Switch,
  FormControlLabel,
  TextField,
} from "@mui/material";
import { updateComment } from "../../DAL/edit";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "12px",
};

export default function ApproveComment({ open, setOpen, Modeldata, onResponse }) {
  const [published, setPublished] = React.useState(Modeldata?.published || false);
  const [comment, setComment] = React.useState(Modeldata?.comment || "");
  const commentId = Modeldata?._id || "";

  React.useEffect(() => {
    setPublished(Modeldata?.published || false);
    setComment(Modeldata?.comment || "");
  }, [Modeldata]);

  const handleClose = () => setOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = {
      status: published,
      commentId,
      comment,
    };

    try {
      const response = await updateComment(updatedData);

      if (response.status === 200) {
        onResponse({ messageType: "success", message: response.message });
      } else {
        onResponse({ messageType: "error", message: response.message });
      }
    } catch (error) {
      onResponse({ messageType: "error", message: "Something went wrong." });
    }

    setOpen(false);
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-title">
      <Box sx={style}>
        <Typography id="modal-title" variant="h6" component="h2">
          Edit Comment
        </Typography>

        <Box sx={{ marginTop: "10px" }}>
          <Typography variant="body1"><strong>Name:</strong> {Modeldata?.name || "N/A"}</Typography>
        </Box>
        <Box sx={{ marginTop: "10px" }}>
          <Typography variant="body1"><strong>Email:</strong> {Modeldata?.email || "N/A"}</Typography>
        </Box>
        <Box sx={{ marginTop: "10px" }}>
          <Typography variant="body1"><strong>Blog Title:</strong> {Modeldata?.blogId?.title || "N/A"}</Typography>
        </Box>

        {/* Editable Comment Field */}
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Comment"
          variant="outlined"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          sx={{ marginTop: "10px" }}
        />

        {/* Toggle Publish Status */}
        <FormControlLabel
          control={
            <Switch
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              color="primary"
            />
          }
          label="Published"
          sx={{ marginTop: "10px" }}
        />

        {/* Action Buttons */}
        <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", marginTop: "10px" }}>
          <Button variant="contained" sx={{ backgroundColor: "#B1B1B1" }} onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              background: "var(--background-color)",
              color: "var(--white-color)",
              borderRadius: "var(--default-border-radius)",
              "&:hover": { background: "var(--vertical-gradient)" },
            }}
          >
            Update
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
