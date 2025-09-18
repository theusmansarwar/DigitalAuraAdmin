import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { IoMdCloseCircle } from "react-icons/io";
import JoditEditor from "jodit-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAlert } from "../../Components/Alert/AlertContext";
import { fetchBlogById, fetchcategorylist } from "../../DAL/fetch";
import { updateBlog } from "../../DAL/edit";
import { createBlog } from "../../DAL/create";
import { baseUrl } from "../../Config/Config";
import { FaCloudUploadAlt } from "react-icons/fa";

const style = {
  Width: "100%",
  margin: "40px auto",
  bgcolor: "background.paper",
};

const AddBlog = () => {
  const { id } = useParams();
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [detail, setDetail] = useState("");
  const [author, setAuthor] = useState("");
  const [newauthor, setNewAuthor] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [faqSchemaText, setFaqSchemaText] = useState("{}");
  const [image, setImage] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const fileInputRef = useRef(null);
  const editor = useRef(null);

  const config = useMemo(
    () => ({
      readonly: false,
      uploader: { insertImageAsBase64URI: true },
      placeholder: "Start typing...",
    }),
    []
  );

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userName = user?.name || "";
    setNewAuthor(userName);
    if (id) {
      const fetchBlog = async () => {
        try {
          const response = await fetchBlogById(id);
          if (response.status === 200) {
            const blog = response.blog;
            setTitle(blog.title || "");
            setDescription(blog.description || "");
            setDetail(blog.detail || "");
            setAuthor(blog.author || "");
            setMetaDescription(blog.metaDescription || "");
            setSlug(blog.slug || "");
            setCategoryId(blog.category?._id || "");
            setImage(blog.thumbnail ? baseUrl + blog.thumbnail : "");
            setFaqSchemaText(blog.faqSchema || "{}");
            setIsFeatured(blog?.featured);
            setIsVisible(blog?.published);
            setAuthor(blog.author || "");
          }
        } catch (error) {
          console.error("Error fetching blog:", error);
        }
      };
      fetchBlog();
    }
  }, [id]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetchcategorylist();
        if (response && response.categories) {
          setCategories(response.categories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleFileChange = (event) => {
    if (event.target.files?.[0]) {
      const file = event.target.files[0];
      setImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const errorObj = {};
    if (!categoryId) errorObj.category = "Category is required.";

    try {
      JSON.parse(faqSchemaText);
    } catch {
      errorObj.faqSchema = "Schema JSON is invalid.";
    }

    if (Object.keys(errorObj).length > 0) {
      setErrors(errorObj);
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("detail", detail);
    formData.append("metaDescription", metaDescription);
    formData.append("slug", slug);
    formData.append("category", categoryId);
    formData.append("published", isVisible);
    formData.append("featured", isFeatured);
    formData.append("faqSchema", faqSchemaText);
    formData.append("author", author || newauthor);

    if (fileInputRef.current?.files[0]) {
      formData.append("thumbnail", fileInputRef.current.files[0]);
    }

    try {
      const response = id
        ? await updateBlog(id, formData)
        : await createBlog(formData);

      if (response.status === 200 || response.status === 201) {
        showAlert("success", response.message);
        navigate("/blogs");
      } else if (response.missingFields) {
        const newErrors = {};
        response.missingFields.forEach((field) => {
          newErrors[field.name] = field.message;
        });
        setErrors(newErrors);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      showAlert("error", "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={style}>
      <Typography variant="h5" mb={2}>
        {id ? "Edit Blog" : "Add Blog"}
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={!!errors.title}
          helperText={errors.title}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          multiline
          rows={2}
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          error={!!errors.description}
          helperText={errors.description}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          multiline
          rows={2}
          label="Meta Description"
          value={metaDescription}
          onChange={(e) => setMetaDescription(e.target.value)}
          error={!!errors.metaDescription}
          helperText={errors.metaDescription}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          multiline
          rows={4}
          label="FAQ Schema (JSON)"
          value={faqSchemaText}
          onChange={(e) => setFaqSchemaText(e.target.value)}
          error={!!errors.faqSchema}
          helperText={errors.faqSchema}
          sx={{ mb: 2 }}
        />

        <Box
          sx={{
            position: "relative",
            width: "500px",
            aspectRatio: "16/9", // keeps 16:9 size
            border: errors?.thumbnail ? "2px solid red" : "2px dashed #ccc",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            justifySelf: "center",
            alignSelf: "center",
            cursor: "pointer",
            overflow: "hidden",
            mb: 2,
            "&:hover": {
              borderColor: "primary.main", // hover effect
            },
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          {/* If image uploaded */}
          {image ? (
            <>
              <img
                src={image}
                alt="Thumbnail"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              <IoMdCloseCircle
                style={{
                  position: "absolute",
                  top: "8px",
                  right: "8px",
                  fontSize: "28px",
                  color: "red",
                  cursor: "pointer",
                  background: "white",
                  borderRadius: "50%",
                }}
                onClick={(e) => {
                  e.stopPropagation(); // prevent triggering file select
                  setImage(null); // clear image instead of showing dummy
                  if (fileInputRef.current) fileInputRef.current.value = null;
                }}
              />
            </>
          ) : (
            // Show Upload placeholder
            <Box sx={{ textAlign: "center", color: "#888" }}>
              <FaCloudUploadAlt size={48} />
              <Typography variant="body1" sx={{ mt: 1 }}>
                Upload file here
              </Typography>
            </Box>
          )}

          {/* Hidden input */}
          <input
            type="file"
            accept="image/png, image/jpeg, image/webp"
            style={{ display: "none" }}
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </Box>
        <TextField
          fullWidth
          label="Slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          error={!!errors.slug}
          helperText={errors.slug}
          sx={{ mb: 2 }}
        />
        <Box sx={{ minWidth: 120, mb: 2 }}>
          <FormControl fullWidth error={!!errors.category}>
            <InputLabel id="category-select-label">Category</InputLabel>
            <Select
              labelId="category-select-label"
              id="category-select"
              value={categoryId}
              label="Category"
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <MenuItem value="">Select a category</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
            {errors.category && (
              <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                {errors.category}
              </Typography>
            )}
          </FormControl>
        </Box>

        <JoditEditor
          ref={editor}
          value={detail}
          config={config}
          tabIndex={1}
          onChange={(newContent) => setDetail(newContent)}
        />
        {errors.detail && (
          <Typography color="error">{errors.detail}</Typography>
        )}

        <FormControlLabel
          control={
            <Switch
              checked={isFeatured}
              onChange={() => setIsFeatured(!isFeatured)}
              color="primary"
            />
          }
          label="Featured"
          sx={{ mt: 2 }}
        />

        <FormControlLabel
          control={
            <Switch
              checked={isVisible}
              onChange={() => setIsVisible(!isVisible)}
              color="primary"
            />
          }
          label={`Visibility: ${isVisible ? "Public" : "Draft"}`}
          sx={{ mt: 1 }}
        />

        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "flex-end",
            mt: 3,
          }}
        >
          <Button
            type="button"
            variant="contained"
            sx={{ backgroundColor: "#B1B1B1" }}
            onClick={() => navigate("/blogs")}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              background: "var(--background-color)",
              color: "var(--white-color)",
              borderRadius: "var(--default-border-radius)",
              "&:hover": { background: "var(--vertical-gradient)" },
            }}
          >
            {loading ? "Saving..." : id ? "Update Blog" : "Save"}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default AddBlog;
