import * as React from "react";
import {
  Box,
  Button,
  Typography,
  Modal,
  TextField,
  Switch,
  FormControlLabel,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { createNewPortfolio } from "../../DAL/create";
import { updatePortfolio } from "../../DAL/edit";
import { uploadimage } from "../../DAL/create"; // your upload API call
import { baseUrl } from "../../Config/Config";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "60%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "12px",
  maxHeight: "90vh",
  overflowY: "auto",
};

export default function PortfolioModel({
  open,
  setOpen,
  Modeltype,
  Modeldata,
  onResponse,
  serviceid,
}) {
  const [title, setTitle] = React.useState(Modeldata?.title || "");
  const [description, setDescription] = React.useState(
    Modeldata?.description || ""
  );
  const [images, setImages] = React.useState(Modeldata?.images || []);
  const [videos, setVideos] = React.useState(Modeldata?.videos || []);
  const [thumbnail, setThumbnail] = React.useState(Modeldata?.thumbnail || "");
  const [published, setPublished] = React.useState(
    Modeldata?.published || false
  );
  const [id, setId] = React.useState(Modeldata?._id || "");

  React.useEffect(() => {
    setTitle(Modeldata?.title || "");
    setDescription(Modeldata?.description || "");
    setImages(Modeldata?.images || []);
    setVideos(Modeldata?.videos || []);
    setThumbnail(Modeldata?.thumbnail || "");
    setPublished(Modeldata?.published || false);
    setId(Modeldata?._id || "");
  }, [Modeldata]);

  const handleClose = () => setOpen(false);

  // Upload handler
  const handleFileUpload = async (e, type) => {
    const files = Array.from(e.target.files);

    for (const file of files) {
      const formData = new FormData();
      formData.append("image", file);

      const res = await uploadimage(formData);
      if (res?.file) {
        if (type === "image") {
          setImages((prev) => [...prev, res.file]); // store relative path
        } else if (type === "video") {
          setVideos((prev) => [...prev, res.file]);
        } else if (type === "thumbnail") {
          setThumbnail(res.file);
        }
      }
    }
  };

  const handleRemove = (type, index = null) => {
    if (type === "image") {
      setImages((prev) => prev.filter((_, i) => i !== index));
    } else if (type === "video") {
      setVideos((prev) => prev.filter((_, i) => i !== index));
    } else if (type === "thumbnail") {
      setThumbnail("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const portfolioData = {
      title,
      description,
      images,
      videos,
      thumbnail,
      published,
      serviceid,
    };

    let response;
    if (Modeltype === "Add") {
      response = await createNewPortfolio(portfolioData);
    } else {
      response = await updatePortfolio(id, portfolioData);
    }

    if (response.status === 201 || response.status === 200) {
      onResponse({ messageType: "success", message: response.message });
    } else {
      onResponse({ messageType: "error", message: response.message });
    }
    setOpen(false);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h6">{Modeltype} Portfolio</Typography>

        {/* Title */}
        <TextField
          sx={{ marginTop: "10px" }}
          fullWidth
          required
          label="Portfolio Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Description */}
        <TextField
          sx={{ marginTop: "10px" }}
          fullWidth
          multiline
          minRows={4}
          label="Portfolio Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Thumbnail */}
        <Typography sx={{ mt: 2 }}>Thumbnail</Typography>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileUpload(e, "thumbnail")}
        />
        {thumbnail && (
          <Box sx={{ position: "relative", display: "inline-block", mt: 1 }}>
            <img
              src={baseUrl + thumbnail}
              alt="Thumbnail"
              style={{ width: 120, borderRadius: 6 }}
            />
            <IconButton
              size="small"
              sx={{ position: "absolute", top: 0, right: 0, bgcolor: "white" }}
              onClick={() => handleRemove("thumbnail")}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        )}

        {/* Images */}
        <Typography sx={{ mt: 2 }}>Portfolio Images</Typography>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFileUpload(e, "image")}
        />
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 1 }}>
          {images.map((img, idx) => (
            <Box
              key={idx}
              sx={{ position: "relative", display: "inline-block" }}
            >
               <img src={baseUrl + img} alt="images"  style={{ width: 200, borderRadius: 6 }}/>
              <IconButton
                size="small"
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  bgcolor: "white",
                }}
                onClick={() => handleRemove("image", idx)}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Box>

        {/* Videos */}
        <Typography sx={{ mt: 2 }}>Portfolio Videos</Typography>
        <input
          type="file"
          multiple
          accept="video/*"
          onChange={(e) => handleFileUpload(e, "video")}
        />
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 1 }}>
          {videos.map((vid, idx) => (
            <Box
              key={idx}
              sx={{ position: "relative", display: "inline-block" }}
            >
              <video src={baseUrl + vid} controls style={{ width: 200, borderRadius: 6 }} />
              <IconButton
                size="small"
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  bgcolor: "white",
                }}
                onClick={() => handleRemove("video", idx)}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Box>

        {/* Published */}
        <FormControlLabel
          control={
            <Switch
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
          }
          label="Published"
          sx={{ marginTop: "10px" }}
        />

        {/* Buttons */}
        <Box
          sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 3 }}
        >
          <Button
            variant="contained"
            sx={{ backgroundColor: "#B1B1B1" }}
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              background: "var(--background-color)",
              color: "white",
              borderRadius: "var(--default-border-radius)",
            }}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
