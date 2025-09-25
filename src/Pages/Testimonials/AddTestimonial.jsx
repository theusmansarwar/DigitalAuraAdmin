import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";
import { useAlert } from "../../Components/Alert/AlertContext";
import { fetchTestimonialbyid } from "../../DAL/fetch";
import { updateTestimonial } from "../../DAL/edit";
import { createTestimonial } from "../../DAL/create";
import UploadFile from "../../Components/Models/UploadFile";

const AddTestimonial = () => {
  const { id } = useParams();
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  const [singlePath, setSinglePath] = useState("");
  const [image, setImage] = useState("");
  const [whatwedid, setWhatwedid] = useState("");
  const [clientsays, setClientsays] = useState("");
  const [rating, setRating] = useState("");
  const [published, setPublished] = useState(true);
  const [boost, setBoost] = useState("");
  const [boosttext, setBoosttext] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchTestimonial = async () => {
      try {
        const response = await fetchTestimonialbyid(id);
        if (response) {
          setImage(response.image || "");
          setWhatwedid(response.whatwedid || "");
          setClientsays(response.clientsays || "");
          setRating(response.rating || "");
          setPublished(response.published ?? true);
          setBoost(response.boost || "");
          setBoosttext(response.boosttext || "");
        }
      } catch (error) {
        console.error("Error fetching testimonial:", error);
      }
    };
    if (id) fetchTestimonial();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrors({});

    const formData = {
      image: singlePath || image,
      whatwedid,
      clientsays,
      rating,
      published,
      boost,
      boosttext,
    };

    try {
      let response;
      if (id) {
        response = await updateTestimonial(id, formData);
      } else {
        response = await createTestimonial(formData);
      }

      if (response.status === 201 || response.status === 200) {
        showAlert("success", response.message);
        navigate("/testimonials");
      } else if (response.status === 400 && response.missingFields) {
        // backend validation errors
        const fieldErrors = {};
        response.missingFields.forEach((f) => {
          fieldErrors[f.name] = f.message;
        });
        setErrors(fieldErrors);
        showAlert("error", response.message);
      } else {
        showAlert("error", "Something went wrong!");
      }
    } catch (error) {
      console.error("Error saving testimonial:", error);
      showAlert("error", "Internal server error.");
    }

    setLoading(false);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
      <Typography variant="h5" gutterBottom>
        {id ? "Edit Testimonial" : "Add Testimonial"}
      </Typography>

      <Typography
        variant="h5"
        sx={{
          color: "var(--background-color)",
          marginTop: "20px",
          marginBottom: "20px",
        }}
      >
        Company Logo
      </Typography>
      <UploadFile
        multiple={false}
        accept="image/*"
        initialFiles={image}
        onUploadComplete={(path) => setSinglePath(path)}
      />

      {/* What We Did */}
      <TextField
        fullWidth
        label="What We Did"
        value={whatwedid}
        onChange={(e) => setWhatwedid(e.target.value)}
        error={!!errors.whatwedid}
        helperText={errors.whatwedid}
        margin="normal"
      />

      {/* Client Says */}
      <TextField
        fullWidth
        label="Client Says"
        multiline
        minRows={3}
        value={clientsays}
        onChange={(e) => setClientsays(e.target.value)}
        error={!!errors.clientsays}
        helperText={errors.clientsays}
        margin="normal"
      />

      {/* Rating */}
      <FormControl fullWidth margin="normal" error={!!errors.rating}>
        <InputLabel>Rating</InputLabel>
        <Select value={rating} onChange={(e) => setRating(e.target.value)}>
          <MenuItem value="">
            <em>Select Rating</em>
          </MenuItem>
          {[0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map((r) => (
            <MenuItem key={r} value={r}>
              {r}
            </MenuItem>
          ))}
        </Select>
        {errors.rating && <Typography color="error">{errors.rating}</Typography>}
      </FormControl>

      {/* Boost */}
      <TextField
        fullWidth
        label="Boost"
        value={boost}
        onChange={(e) => setBoost(e.target.value)}
        error={!!errors.boost}
        helperText={errors.boost}
        margin="normal"
      />

      {/* Boost Text */}
      <TextField
        fullWidth
        label="Boost Text"
        multiline
        minRows={2}
        value={boosttext}
        onChange={(e) => setBoosttext(e.target.value)}
        error={!!errors.boosttext}
        helperText={errors.boosttext}
        margin="normal"
      />

      {/* Published */}
      <FormControlLabel
        control={
          <Switch
            checked={published}
            onChange={() => setPublished(!published)}
            color="primary"
          />
        }
        label={`Published: ${published ? "Yes" : "No"}`}
        sx={{ mt: 2 }}
      />

      {/* Buttons */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 2 }}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate("/testimonials")}
        >
          Cancel
        </Button>
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : id ? "Update" : "Save"}
        </Button>
      </Box>
    </Box>
  );
};

export default AddTestimonial;
