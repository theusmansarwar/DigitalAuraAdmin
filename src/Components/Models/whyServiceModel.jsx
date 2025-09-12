import * as React from "react";
import {
  Box,
  Button,
  Typography,
  Modal,
  TextField,
} from "@mui/material";
import { createNewWhyService } from "../../DAL/create";
import { updateWhyNewService } from "../../DAL/edit";

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

export default function WhyServiceModel({
  open,
  setOpen,
  Modeltype,
  Modeldata,
  onResponse,
  serviceid,
}) {
  const [question, setQuestion] = React.useState(Modeldata?.question || "");
  const [answer, setAnswer] = React.useState(Modeldata?.answer || "");
  const [id, setId] = React.useState(Modeldata?._id || "");

  React.useEffect(() => {
    setQuestion(Modeldata?.question || "");
    setAnswer(Modeldata?.answer || "");
    setId(Modeldata?._id || "");
  }, [Modeldata]);

  const handleClose = () => setOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const WhyServiceData = {
      question,
      answer,
      serviceid,
    };

    let response;
    if (Modeltype === "Add") {
      response = await createNewWhyService(WhyServiceData);
    } else {
      response = await updateWhyNewService(id, WhyServiceData);
    }

    if (response.status === 201 || response.status === 200) {
      onResponse({ messageType: "success", message: response.message });
    } else {
      onResponse({ messageType: "error", message: response.message });
    }
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-title" variant="h6" component="h2">
          {Modeltype} Why Service
        </Typography>

        {/* Question input */}
        <TextField
          sx={{ marginTop: "10px", borderRadius: "6px" }}
          fullWidth
          required
          label="Why Service Question"
          variant="outlined"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        {/* Answer input */}
        <TextField
          sx={{ marginTop: "10px", borderRadius: "6px" }}
          fullWidth
          multiline
          minRows={4}
          label="Why Service Answer"
          variant="outlined"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />

        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "flex-end",
            marginTop: "10px",
          }}
        >
          <Button
            type="button"
            variant="contained"
            sx={{ backgroundColor: "#B1B1B1" }}
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            type="submit"
            variant="contained"
            sx={{
              background: "var(--background-color)",
              color: "var(--white-color)",
              borderRadius: "var(--default-border-radius)",
              "&:hover": { background: "var(--vertical-gradient)" },
            }}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
