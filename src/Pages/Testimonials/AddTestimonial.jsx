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
  TextareaAutosize,
  Switch,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";
import { useAlert } from "../../Components/Alert/AlertContext";
import { fetchallpublishedserviceslist, fetchallservicescategorylist, fetchallserviceslist, fetchTestimonialbyid } from "../../DAL/fetch";
import { updateTestimonial } from "../../DAL/edit";
import { createTestimonial } from "../../DAL/create";

const AddTestimonial = () => {
  const { id } = useParams();
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [service, setService] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [rating, setRating] = useState("");
  const [description, setDescription] = useState("");
  const [published, setPublished] = useState(true);
  const [services, setServices] = useState([]); // dropdown values
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadServices = async () => {
    const res = await fetchallpublishedserviceslist();
    setServices(res.services);
  };
  loadServices();


    const fetchTestimonial = async () => {
      try {
        const response = await fetchTestimonialbyid(id);
        if (response) {
          setName(response.name || "");
          setService(response.service || "");
          setRating(response.rating || "");
          setDate(response.date || "");
          setLocation(response.location || "");
          setDescription(response.description || "");
          setPublished(response.published ?? true);
        }
      } catch (error) {
        console.error("Error fetching testimonial:", error);
      }
    };
    if (id) fetchTestimonial();
  }, [id]);

  // Handle Form Submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrors({});

    // Form Validation
    const newErrors = {};
    if (!name) newErrors.name = "Name is required";
    if (!service) newErrors.service = "Service is required";
    if (!location) newErrors.location = "Location is required";
    if (!date) newErrors.date = "Date is required";
    if (!rating) newErrors.rating = "Rating is required";
    if (!description) newErrors.description = "Description is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    const formData = {
      name,
      service,
      location,
      date,
      rating,
      description,
      published,
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
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width:"100%",
      }}
    >
      <Typography variant="h5" gutterBottom>
        {id ? "Edit Testimonial" : "Add Testimonial"}
      </Typography>

      <TextField
        fullWidth
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={!!errors.name}
        helperText={errors.name}
        margin="normal"
      />
      <FormControl fullWidth margin="normal" error={!!errors.service}>
        <InputLabel>Select a Service</InputLabel>
        <Select value={service} onChange={(e) => setService(e.target.value)}>
          <MenuItem value="">
            <em>Select a Service</em>
          </MenuItem>
          {services.map((srv) => (
            <MenuItem key={srv._id} value={srv.title}>
              {srv.title}
            </MenuItem>
          ))}
        </Select>
        {errors.service && (
          <Typography color="error">{errors.service}</Typography>
        )}
      </FormControl>
      <TextField
        fullWidth
        label="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        error={!!errors.location}
        helperText={errors.location}
        margin="normal"
      />

      {/* Date Picker */}
      <TextField
        fullWidth
        type="date"
        label="Date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        InputLabelProps={{ shrink: true }}
        error={!!errors.date}
        helperText={errors.date}
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
        {errors.rating && (
          <Typography color="error">{errors.rating}</Typography>
        )}
      </FormControl>

      {/* Description */}
      <TextField
        fullWidth
        label="Description"
        multiline
        minRows={3}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        error={!!errors.description}
        helperText={errors.description}
        margin="normal"
      />

      {/* Published Toggle */}
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
        <Button
          type="submit"
          variant="contained"
          color="var(--background-color)"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : id ? "Update" : "Save"}
        </Button>
      </Box>
    </Box>
  );
};

export default AddTestimonial;
