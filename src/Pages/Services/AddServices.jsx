import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAlert } from "../../Components/Alert/AlertContext";
import { fetchservicebyid } from "../../DAL/fetch";
import { createNewService, uploadimage } from "../../DAL/create";
import { updateService } from "../../DAL/edit";
import { FaCircleInfo } from "react-icons/fa6";
import { BsInfoCircle } from "react-icons/bs";
import howwedelivered from '../../Assets/howwedelivered.png'
import faqssectionimg from '../../Assets/Faqssection.png'
import videosectionimg from '../../Assets/videosection.png'
import portfoliosectionimg from '../../Assets/portfolioimg.png'
import {
  Box,
  Button,
  Typography,
  TextField,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { IoMdCloseCircle } from "react-icons/io";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useTable1 } from "../../Components/Models/useTable1";
import { baseUrl } from "../../Config/Config";
import { useTable2 } from "../../Components/Models/useTable2";
import InfoModal from "../../Components/Models/InfoModal";
import InfoImageModel from "../../Components/Models/InfoImageModal";

const AddServices = () => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const { id } = useParams();
  const [open, setOpen] = useState(false);
 const [infoopen, setInfoOpen] = useState(false);
 const [infoboxheading, setInfoBoxHeading] = useState(false);
 const [infoboximage, setInfoBoxImage] = useState(false);
  // Service states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [short_description, setShortDescription] = useState("");
  const [detail, setDetail] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [icon, setIcon] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);
  const iconInputRef = useRef(null);
  // Nested states
  const [faqs, setFaqs] = useState({
    title: "",
    description: "",
    published: false,
  });
  const [portfolio, setPortfolio] = useState({
    published: false,
  });
  const [howWeDelivered, setHowWeDelivered] = useState({
    description: "",
    lower_description: "",
    image: null,
    published: false,
  });
  const [video, setVideo] = useState({
    description: "",
    url: "",
    published: false,
  });

  // Image preview + ref
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  // Upload states
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);

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

          setFaqs(
            service.faqs || { title: "", description: "", published: false }
          );
          setPortfolio(
            service.portfolio || {
              title: "",
              description: "",
              published: false,
            }
          );

          // ✅ Load existing image
          if (service.how_we_delivered?.image) {
            setImagePreview(baseUrl + service.how_we_delivered.image);
            setHowWeDelivered(service.how_we_delivered);
            setUploadSuccess(true);
          } else {
            setHowWeDelivered({
              description: "",
              image: null,
              published: false,
            });
          }

          if (service?.icon) {
            setIconPreview(baseUrl + service.icon);
          }
          setVideo(
            service.video || { description: "", url: "", published: false }
          );
        }
      } catch (error) {
        console.error("Error fetching service:", error);
      }
    };

    fetchService();
  }, [id]);
  const handleIconChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await uploadimage(formData);
      console.log("IMAGE RESPONSE IS :::", res);
      if (res.isSuccess) {
        setIcon(res.file); // backend returns path
        setIconPreview(`${baseUrl + res.file}`);
        showAlert("success", "Icon uploaded successfully!");
      }
    } catch (error) {
      console.error("Icon upload error:", error);
      showAlert("error", "Icon upload failed!");
    }
  };
  // --- File upload handler ---
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);
    setUploadSuccess(false);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await uploadimage(formData);

      if (res.isSuccess) {
        setHowWeDelivered({
          ...howWeDelivered,
          image: res.file, // ✅ store path from backend
        });
        setImagePreview(`${baseUrl + res.file}`);
        setUploadSuccess(true);
      }
    } catch (error) {
      console.error("Upload error:", error);
      showAlert("error", "Image upload failed!");
    } finally {
      setUploading(false);
    }
  };

  // --- Submit handler ---
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
      // Icon
      if (icon) {
        // new uploaded icon (backend returned path in uploadimage)
        formData.append("icon", icon);
      } else if (id && iconPreview) {
        // keep existing icon path
        formData.append("icon", iconPreview.replace(baseUrl, ""));
      }

      formData.append("detail", detail);
      formData.append("published", isVisible);

      // FAQs
      formData.append(
        "faqs",
        JSON.stringify({
          title: faqs.title,
          description: faqs.description,
          published: faqs.published,
        })
      );

      // How We Delivered
      formData.append(
        "how_we_delivered",
        JSON.stringify({
          description: howWeDelivered.description,
          lower_description: howWeDelivered.lower_description,
          image: howWeDelivered.image,
          published: howWeDelivered.published,
        })
      );

      // portfolio
      formData.append("portfolio_published", portfolio.published);
      // If you are sending file upload
      if (howWeDelivered.file) {
        formData.append("file", howWeDelivered.file);
      }

      // Video
      formData.append(
        "video",
        JSON.stringify({
          description: video.description,
          url: video.url,
          published: video.published,
        })
      );

      // API call
      let response = id
        ? await updateService(id, formData)
        : await createNewService(formData);

      if (response.status == 200 || response.status == 201) {
        showAlert("success", response.message);
        navigate("/services");
        setLoading(false);
      } else if (response.missingFields) {
        setLoading(false);
        const newErrors = {};
        response.missingFields.forEach((field) => {
          newErrors[field.name] = field.message;
        });
        setErrors(newErrors);
      } else {
        showAlert("error", response.message || "Something went wrong!");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      showAlert("error", "Something went wrong!");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
 
  // Table attributes
  const attributes1 = [
    { id: "question", label: "Questions" },
    { id: "answer", label: "Answers" },
  ];

  const { tableUI1 } = useTable1({
    attributes1,
    tableType: "FAQs",
    data: faqs?.items || [],
  });
  const attributes2 = [
    { id: "title", label: "Title" },
    { id: "description", label: "Description" },
    { id: "published", label: "Visibility" },
  ];

  const { tableUI2 } = useTable2({
    attributes2,
    tableType: "Portfolio",
    data: portfolio?.items || [],
  });
const openinfobox=(heading,image)=>{
  setInfoBoxImage(image);
  setInfoBoxHeading(heading)
  setInfoOpen(true);
  
}
  return (
    <Box sx={{ p: 3 }}>
      <Button
        variant="filled"
        onClick={() => setOpen(true)}
        sx={{
          position: "fixed",
          display: "flex",
          justifySelf: "flex-end",
          backgroundColor: "var(--background-color)",
          color: "var(--text-color)",
          top: "20px",
          right: "20px",
          gap: "5px",
          zIndex: 10,
        }}
      >
        Guide <FaCircleInfo />
      </Button>

      <InfoModal open={open} onClose={() => setOpen(false)} />
      <InfoImageModel open={infoopen} onClose={() => setInfoOpen(false)}  heading={infoboxheading} image={infoboximage} />
      <Typography
        variant="h4"
        sx={{ color: "var(--background-color)" }}
        gutterBottom
      >
        {id ? "Edit Service" : "Add Service"}
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "grid", gap: 2 }}
      >
        {/* Core fields */}
        <TextField
          fullWidth
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={!!errors.title}
          helperText={errors.title}
        />
        <TextField
          fullWidth
          label="Meta Description"
          value={metaDescription}
          onChange={(e) => setMetaDescription(e.target.value)}
          error={!!errors.metaDescription}
          helperText={errors.metaDescription}
        />
        <TextField
          fullWidth
          label="Short Description"
          multiline
          rows={2}
          value={short_description}
          onChange={(e) => setShortDescription(e.target.value)}
          error={!!errors.short_description}
          helperText={errors.short_description}
        />
        {/* Service Icon Upload */}
        <Typography variant="h5" sx={{ color: "var(--background-color)" }}>
          Service Icon
        </Typography>
        <Box
          sx={{
            position: "relative",
            width: "120px",
            height: "120px",
            border: errors?.icon ? "2px solid red" : "2px dashed #ccc",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            overflow: "hidden",
            mb: 2,
            "&:hover": { borderColor: "primary.main" },
          }}
          onClick={() => iconInputRef.current?.click()}
        >
          {iconPreview ? (
            <>
              <img
                src={iconPreview}
                alt="Service Icon"
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
                  fontSize: "24px",
                  color: "red",
                  cursor: "pointer",
                  background: "white",
                  borderRadius: "50%",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setIconPreview(null);
                  setIcon(null);
                  if (iconInputRef.current) iconInputRef.current.value = null;
                }}
              />
            </>
          ) : (
            <Box sx={{ textAlign: "center", color: "#888" }}>
              <FaCloudUploadAlt size={32} />
              <Typography variant="body2">Upload Service Icon  <BsInfoCircle style={{fontSize:'16px'}} onClick={()=>{openinfobox("Portfolio Section", portfoliosectionimg) }}/></Typography>
            </Box>
          )}
          <input
            type="file"
            accept="image/png, image/jpeg, image/webp, image/svg+xml"
            style={{ display: "none" }}
            ref={iconInputRef}
            onChange={handleIconChange}
          />
        </Box>

        <TextField
          fullWidth
          label="Description"
          multiline
          rows={6}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          error={!!errors.description}
          helperText={errors.description}
        />
        <TextField
          fullWidth
          label="Slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          error={!!errors.slug}
          helperText={errors.slug}
        />

        {id && (
          <>
            <Box
              sx={{
                borderRadius: "var(--default-border-radius)",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                boxShadow: "2px 0px 10px var(--shadow-low1)",
                padding: "20px",
                height: "fit-content",
              }}
            >
              <Typography
                variant="h5"
                sx={{ color: "var(--background-color)" }}
              >
                How We Delivered Section  <BsInfoCircle style={{fontSize:'16px'}} onClick={()=>{openinfobox("How We Delivered Section",howwedelivered) }}/>
              </Typography>
              <TextField
                fullWidth
                label="How We Delivered Description"
                multiline
                rows={6}
                value={howWeDelivered.description}
                onChange={(e) =>
                  setHowWeDelivered({
                    ...howWeDelivered,
                    description: e.target.value,
                  })
                }
                error={!!errors["how_we_delivered.description"]}
                helperText={errors["how_we_delivered.description"]}
              />
              {/* Upload UI */}
              <Box
                sx={{
                  position: "relative",
                  width: "500px",
                  aspectRatio: "16/9",
                  border: errors["how_we_delivered.image"]
                    ? "2px solid red"
                    : "2px dashed #ccc",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  overflow: "hidden",
                  mb: 2,
                  "&:hover": { borderColor: "primary.main" },
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    {uploading && (
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          height: "6px",
                          width: `${uploadProgress}%`,
                          background: "green",
                        }}
                      />
                    )}
                    {uploadSuccess && (
                      <Typography
                        sx={{
                          position: "absolute",
                          top: "8px",
                          right: "8px",
                          background: "white",
                          color: "green",
                          borderRadius: "50%",
                          padding: "4px 8px",
                          fontWeight: "bold",
                        }}
                      >
                        ✔
                      </Typography>
                    )}
                    <IoMdCloseCircle
                      style={{
                        position: "absolute",
                        top: "8px",
                        left: "8px",
                        fontSize: "28px",
                        color: "red",
                        cursor: "pointer",
                        background: "white",
                        borderRadius: "50%",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setImagePreview(null);
                        setHowWeDelivered({ ...howWeDelivered, image: null });
                        setUploadSuccess(false);
                        if (fileInputRef.current)
                          fileInputRef.current.value = null;
                      }}
                    />
                  </>
                ) : (
                  <Box sx={{ textAlign: "center", color: "#888" }}>
                    <FaCloudUploadAlt size={48} />
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      Upload file here
                    </Typography>
                  </Box>
                )}
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp, image/svg+xml"
                  style={{ display: "none" }}
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
              </Box>
              <TextField
                fullWidth
                label="Lower description"
                multiline
                rows={6}
                value={howWeDelivered.lower_description}
                onChange={(e) =>
                  setHowWeDelivered({
                    ...howWeDelivered,
                    lower_description: e.target.value,
                  })
                }
                error={!!errors["how_we_delivered.lower_description"]}
                helperText={errors["how_we_delivered.lower_description"]}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={howWeDelivered.published}
                    onChange={() =>
                      setHowWeDelivered({
                        ...howWeDelivered,
                        published: !howWeDelivered.published,
                      })
                    }
                  />
                }
                label={howWeDelivered.published ? "Published" : "Draft"}
              />
            </Box>
            <Box
              sx={{
                borderRadius: "var(--default-border-radius)",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                boxShadow: "2px 0px 10px var(--shadow-low1)",
                padding: "20px",
                height: "fit-content",
              }}
            >
              {/* FAQs */}
              <Typography
                variant="h5"
                sx={{ color: "var(--background-color)" }}
              >
                FAQs Section   <BsInfoCircle style={{fontSize:'16px'}} onClick={()=>{openinfobox("FAQs Section",faqssectionimg) }}/>
              </Typography>
              <TextField
                fullWidth
                label="FAQs Title"
                value={faqs.title}
                onChange={(e) => setFaqs({ ...faqs, title: e.target.value })}
                error={!!errors["faqs.title"]}
                helperText={errors["faqs.title"]}
              />
              <TextField
                fullWidth
                label="FAQs Description"
                multiline
                rows={6}
                value={faqs.description}
                onChange={(e) =>
                  setFaqs({ ...faqs, description: e.target.value })
                }
                error={!!errors["faqs.description"]}
                helperText={errors["faqs.description"]}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={faqs.published}
                    onChange={() =>
                      setFaqs({ ...faqs, published: !faqs.published })
                    }
                  />
                }
                label={faqs.published ? "Published" : "Draft"}
              />{" "}
              {tableUI1}
            </Box>
            <Box
              sx={{
                borderRadius: "var(--default-border-radius)",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                boxShadow: "2px 0px 10px var(--shadow-low1)",
                padding: "20px",
                height: "fit-content",
              }}
            >
              {/* Video */}
              <Typography
                variant="h5"
                sx={{ color: "var(--background-color)" }}
              >
                Video Section   <BsInfoCircle style={{fontSize:'16px'}} onClick={()=>{openinfobox("Video Section",videosectionimg) }}/>
              </Typography>
              <TextField
                fullWidth
                label="Video Description"
                multiline
                rows={6}
                value={video.description}
                onChange={(e) =>
                  setVideo({ ...video, description: e.target.value })
                }
                error={!!errors["video.description"]}
                helperText={errors["video.description"]}
              />
              <TextField
                fullWidth
                label="Video URL"
                value={video.url}
                onChange={(e) => setVideo({ ...video, url: e.target.value })}
                error={!!errors["video.url"]}
                helperText={errors["video.url"]}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={video.published}
                    onChange={() =>
                      setVideo({ ...video, published: !video.published })
                    }
                  />
                }
                label={video.published ? "Published" : "Draft"}
              />
            </Box>

            <Box
              sx={{
                borderRadius: "var(--default-border-radius)",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                boxShadow: "2px 0px 10px var(--shadow-low1)",
                padding: "20px",
                height: "fit-content",
              }}
            >
              <Typography
                variant="h5"
                sx={{ color: "var(--background-color)" }}
              >
                Portfolios Section   <BsInfoCircle style={{fontSize:'16px'}} onClick={()=>{openinfobox("Portfolio Section",portfoliosectionimg) }}/>
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={portfolio.published}
                    onChange={() =>
                      setPortfolio({
                        ...portfolio,
                        published: !portfolio.published,
                      })
                    }
                  />
                }
                label={portfolio.published ? "Published" : "Draft"}
              />{" "}
              {tableUI2}
            </Box>
          </>
        )}
        <TextField
          fullWidth
          label="Detail"
          multiline
          rows={16}
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          error={!!errors.detail}
          helperText={errors.detail}
        />

        <FormControlLabel
          control={
            <Switch
              checked={isVisible}
              onChange={() => setIsVisible(!isVisible)}
              color="primary"
            />
          }
          label={isVisible ? "Public" : "Draft"}
        />

        {/* Buttons */}
        <Box
          sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}
        >
          <Button
            variant="contained"
            onClick={() => navigate("/services")}
            sx={{
              background: "var(--secondary-color, #B1B1B1)",
              color: "#fff",
              borderRadius: "6px",
              "&:hover": { background: "#999" },
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              background: "var(--background-color)",
              color: "#fff",
              borderRadius: "6px",
              "&:hover": { background: "var(--primary-hover)" },
            }}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AddServices;
