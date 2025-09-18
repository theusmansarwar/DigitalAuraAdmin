import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAlert } from "../../Components/Alert/AlertContext";
import { fetchservicebyid } from "../../DAL/fetch";
import { createNewService } from "../../DAL/create";
import { updateService } from "../../DAL/edit";
import {
  Box,
  Button,
  Typography,
  TextField,
  Switch,
  FormControlLabel,
} from "@mui/material";

const AddServices = () => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const { id } = useParams();

  // Service states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [short_description, setShortDescription] = useState("");
  const [detail, setDetail] = useState("");
  const [isVisible, setIsVisible] = useState(true);

  // Nested states
  const [faqs, setFaqs] = useState({ title: "", description: "", published: false });
  const [howWeDelivered, setHowWeDelivered] = useState({ description: "", image: "", published: false });
  const [video, setVideo] = useState({ description: "", url: "", published: false });

  // Misc
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // --- Fetch existing service if editing ---
  useEffect(() => {
    if (!id) return;

    const fetchService = async () => {
      try {
        const response = await fetchservicebyid(id);
        if (response.status === 200) {
          const service = response.service;
          setTitle(service.title || "");
          setDescription(service.description || "");
          setMetaDescription(service.metaDescription || "");
          setSlug(service.slug || "");
          setShortDescription(service.short_description || "");
          setDetail(service.detail || "");
          setIsVisible(service.published || false);

          // Populate nested fields
          setFaqs(service.faqs || { title: "", description: "", published: false });
          setHowWeDelivered(service.how_we_delivered || { description: "", image: "", published: false });
          setVideo(service.video || { description: "", url: "", published: false });
        }
      } catch (error) {
        console.error("Error fetching service:", error);
      }
    };

    fetchService();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("short_description", short_description);
      formData.append("metaDescription", metaDescription);
      formData.append("slug", slug);
      formData.append("detail", detail);
      formData.append("published", isVisible);

      // Nested
      formData.append("faqs[title]", faqs.title);
      formData.append("faqs[description]", faqs.description);
      formData.append("faqs[published]", faqs.published);

      formData.append("how_we_delivered[description]", howWeDelivered.description);
      formData.append("how_we_delivered[image]", howWeDelivered.image);
      formData.append("how_we_delivered[published]", howWeDelivered.published);

      formData.append("video[description]", video.description);
      formData.append("video[url]", video.url);
      formData.append("video[published]", video.published);

      let response = id
        ? await updateService(id, formData)
        : await createNewService(formData);

      if (response.status === 200 || response.status === 201) {
        showAlert("success", response.message);
        navigate("/services");
      } else if (Array.isArray(response.missingFields)) {
        const newErrors = {};
        response.missingFields.forEach((field) => {
          if (field.name && field.message) {
            newErrors[field.name] = field.message;
          }
        });
        setErrors(newErrors);
        showAlert("error", response.message || "Please fix the highlighted errors.");
      } else {
        showAlert("error", response.message || "Something went wrong!");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      showAlert("error", "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        {id ? "Edit Service" : "Add Service"}
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 2 }}>
        {/* Core fields */}
        <TextField fullWidth label="Title" value={title} onChange={(e) => setTitle(e.target.value)} error={!!errors.title} helperText={errors.title} />
        <TextField fullWidth label="Meta Description" value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} error={!!errors.metaDescription} helperText={errors.metaDescription} />
        <TextField fullWidth label="Description" multiline rows={3} value={description} onChange={(e) => setDescription(e.target.value)} error={!!errors.description} helperText={errors.description} />
        <TextField fullWidth label="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} error={!!errors.slug} helperText={errors.slug} />
        <TextField fullWidth label="Short Description" multiline rows={2} value={short_description} onChange={(e) => setShortDescription(e.target.value)} error={!!errors.short_description} helperText={errors.short_description} />
        <TextField fullWidth label="Detail" multiline rows={4} value={detail} onChange={(e) => setDetail(e.target.value)} error={!!errors.detail} helperText={errors.detail} />

        {/* FAQs section */}
        <Typography variant="h6">FAQs</Typography>
        <TextField fullWidth label="FAQs Title" value={faqs.title} onChange={(e) => setFaqs({ ...faqs, title: e.target.value })} error={!!errors["faqs.title"]} helperText={errors["faqs.title"]} />
        <TextField fullWidth label="FAQs Description" multiline rows={2} value={faqs.description} onChange={(e) => setFaqs({ ...faqs, description: e.target.value })} error={!!errors["faqs.description"]} helperText={errors["faqs.description"]} />
        <FormControlLabel control={<Switch checked={faqs.published} onChange={() => setFaqs({ ...faqs, published: !faqs.published })} />} label={faqs.published ? "Published" : "Draft"} />

        {/* How We Delivered section */}
        <Typography variant="h6">How We Delivered</Typography>
        <TextField fullWidth label="Description" multiline rows={2} value={howWeDelivered.description} onChange={(e) => setHowWeDelivered({ ...howWeDelivered, description: e.target.value })} error={!!errors["how_we_delivered.description"]} helperText={errors["how_we_delivered.description"]} />
        <TextField fullWidth label="Image URL" value={howWeDelivered.image} onChange={(e) => setHowWeDelivered({ ...howWeDelivered, image: e.target.value })} error={!!errors["how_we_delivered.image"]} helperText={errors["how_we_delivered.image"]} />
        <FormControlLabel control={<Switch checked={howWeDelivered.published} onChange={() => setHowWeDelivered({ ...howWeDelivered, published: !howWeDelivered.published })} />} label={howWeDelivered.published ? "Published" : "Draft"} />

        {/* Video section */}
        <Typography variant="h6">Video</Typography>
        <TextField fullWidth label="Video Description" multiline rows={2} value={video.description} onChange={(e) => setVideo({ ...video, description: e.target.value })} error={!!errors["video.description"]} helperText={errors["video.description"]} />
        <TextField fullWidth label="Video URL" value={video.url} onChange={(e) => setVideo({ ...video, url: e.target.value })} error={!!errors["video.url"]} helperText={errors["video.url"]} />
        <FormControlLabel control={<Switch checked={video.published} onChange={() => setVideo({ ...video, published: !video.published })} />} label={video.published ? "Published" : "Draft"} />

        {/* Toggle Switch */}
        <FormControlLabel control={<Switch checked={isVisible} onChange={() => setIsVisible(!isVisible)} color="primary" />} label={isVisible ? "Public" : "Draft"} />

        {/* Buttons */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
          <Button variant="contained" onClick={() => navigate("/services")} sx={{ background: "var(--secondary-color, #B1B1B1)", color: "#fff", borderRadius: "6px", "&:hover": { background: "#999" } }}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading} sx={{ background: "var(--background-color)", color: "#fff", borderRadius: "6px", "&:hover": { background: "var(--primary-hover)" } }}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AddServices;
