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
import { createNewHowwedo } from "../../DAL/create";
import { updateHowwedo } from "../../DAL/edit";
import { baseUrl } from "../../Config/Config";
import bgimg from "../../Assets/upload-background.PNG";
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
  maxHeight: "80vh",
  overflowY: "scroll",
};

export default function Howwedos({
  open,
  setOpen,
  Modeltype,
  Modeldata,
  onResponse,
  serviceid,
}) {
  const [name, setName] = React.useState(Modeldata?.name || "");
  const [description, setDescription] = React.useState(
    Modeldata?.description || ""
  );
   const [howwedo_cta, setHowwedo_cta] = React.useState(Modeldata?.howwedo_cta||"");
  const [itemsText, setItemsText] = React.useState(
    Modeldata?.items ? Modeldata.items.join("\n") : ""
  );
  const [image, setImage] = React.useState(null);
  const [preview, setPreview] = React.useState(Modeldata?.image || "");
  const [id, setId] = React.useState(Modeldata?._id || "");

  React.useEffect(() => {
    setName(Modeldata?.name || "");
    setDescription(Modeldata?.description || "");
    setItemsText(Modeldata?.items ? Modeldata.items.join("\n") : "");
setHowwedo_cta(Modeldata?.howwedo_cta || "")
    setId(Modeldata?._id || "");
    setPreview(Modeldata?.image);
  }, [Modeldata]);

  const handleClose = () => setOpen(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const itemsArray = itemsText
      .split("\n")
      .map((item) => item.trim())
      .filter((item) => item !== "");

    // Use FormData for image upload
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("serviceid", serviceid);
    formData.append("howwedo_cta", howwedo_cta);
    itemsArray.forEach((item, idx) => formData.append(`items[${idx}]`, item));
    if (image) formData.append("image", image);

    let response;
    if (Modeltype === "Add") {
      response = await createNewHowwedo(formData); // expects multipart/form-data
    } else {
      response = await updateHowwedo(id, formData);
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
          {Modeltype} Howwedos
        </Typography>

        {/* Title */}
        <TextField
          sx={{ marginTop: "10px" }}
          fullWidth
          required
          label="Howwedo Title"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Description */}
        <TextField
          sx={{ marginTop: "10px" }}
          fullWidth
          multiline
          minRows={3}
          label="Howwedo Description"
          variant="outlined"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Items */}
        <TextField
          sx={{ marginTop: "10px" }}
          fullWidth
          multiline
          minRows={4}
          label="Howwedo Items (one per line)"
          variant="outlined"
          value={itemsText}
          onChange={(e) => setItemsText(e.target.value)}
        />

<TextField
          sx={{ marginTop: "10px" }}
          fullWidth
          required
          label="Howwedo CTA"
          variant="outlined"
          value={howwedo_cta}
          onChange={(e) => setHowwedo_cta(e.target.value)}
        />
        {/* Image Upload */}
        <Box sx={{ marginTop: "15px" }}>
          <Typography variant="body2" sx={{ fontWeight: 600, marginBottom: 1 }}>
            Upload Image
          </Typography>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {preview && (
            <Box sx={{ marginTop: 2 }}>
              <img
                src={
                  preview?.startsWith("blob")
                    ? preview
                    : preview
                    ? baseUrl + preview
                    : bgimg
                }
                alt="Preview"
                style={{
                  width: "100%",
                  Height: "auto",
                  borderRadius: "8px",
                  objectFit: "cover",
                }}
              />
            </Box>
          )}
        </Box>

        {/* Buttons */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "flex-end",
            marginTop: "20px",
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
