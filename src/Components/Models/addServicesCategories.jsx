import * as React from "react";
import {
  Box,
  Button,
  Typography,
  Modal,
  TextField,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { createnewServicesCategory } from "../../DAL/create";
import { updateServicesCategory } from "../../DAL/edit";
import "./ModelStyle.css";
import { MdClose } from "react-icons/md";

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

export default function AddServicesCategories({
  open,
  setOpen,
  Modeltype,
  Modeldata,
  onResponse,
}) {
  const fileInputRef = React.useRef(null);
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [name, setName] = React.useState(Modeldata?.name || "");
  const [published, setPublished] = React.useState(
    Modeldata?.published || false
  );
  const [id, setId] = React.useState(Modeldata?._id || "");

  React.useEffect(() => {
    setName(Modeldata?.name || "");
    setPublished(Modeldata?.published || false);
    setId(Modeldata?._id || "");
  }, [Modeldata]);

  const handleClose = () => setOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const categoryData = new FormData();
    categoryData.append("name", name);
    categoryData.append("published", published);
    if (selectedFile) {
      categoryData.append("thumbnail", selectedFile);
    }

    let response;
    if (Modeltype === "Add") {
      response = await createnewServicesCategory(categoryData); // Send FormData
    } else {
      response = await updateServicesCategory(id, categoryData);
    }
    if (response.status == 201) {
      onResponse({ messageType: "success", message: response.message });
    } else if (response.status == 200) {
      onResponse({ messageType: "success", message: response.message });
    } else {
      onResponse({ messageType: "error", message: response.message });
    }
    setOpen(false);
  };
  ////////////////////////////////////////////
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      console.log(selectedFile);
    }
  };
  const handleRemoveFile = () => {
    setSelectedFile(null);
    fileInputRef.current.value = null;
  };
  const formatFileName = (filename) => {
    const dotIndex = filename.lastIndexOf(".");
    if (dotIndex === -1) return filename;

    const name = filename.slice(0, dotIndex);
    const ext = filename.slice(dotIndex);

    if (name.length > 10) {
      return name.slice(0, 10) + "..." + ext;
    }
    return name + ext;
  };
  //////////////////////////////////////////////
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-title" variant="h6" component="h2">
          {Modeltype} Services Category
        </Typography>
        <TextField
          sx={{ marginTop: "10px", borderRadius: "6px" }}
          fullWidth
          required
          label="Category Name"
          variant="outlined"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="file-input-wrapper">
          <input
            type="file"
            id="customFile"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <label htmlFor="customFile" className="custom-file-label">
            Choose File
          </label>
          <span className="file-name">
            {selectedFile
              ? formatFileName(selectedFile.name)
              : "No file chosen"}
          </span>

          {selectedFile && (
            <div className="cancel-btn" onClick={handleRemoveFile}>
              <MdClose />
            </div>
          )}
        </div>
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
