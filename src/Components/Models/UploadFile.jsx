import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  IconButton,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { baseUrl } from "../../Config/Config";

const VisuallyHiddenInput = React.forwardRef(
  ({ onChange, multiple, accept }, ref) => (
    <input
      ref={ref}
      type="file"
      multiple={multiple}
      accept={accept}
      style={{ display: "none" }}
      onChange={onChange}
    />
  )
);

const UploadFile = ({
  endpoint = "/upload-image",
  fieldName = "image",
  multiple = false,
  accept = "*/*",
  onUploadComplete,
  initialFiles = null, // <-- 🔄 new prop
}) => {
  const [files, setFiles] = useState([]);
  const inputRef = useRef(null);

  // 🔄 Load initial files (API data)
  useEffect(() => {
    if (initialFiles) {
      const normalized = (Array.isArray(initialFiles) ? initialFiles : [initialFiles])
        .filter(Boolean)
        .map((path) => ({
          file: null,
          preview: path.startsWith("http") ? path : `${baseUrl}${path}`,
          progress: 100,
          uploading: false,
          speed: "--",
          eta: "Done",
          uploadedPath: path,
        }));
      setFiles(normalized);
    }
  }, [initialFiles]);

  const handleSelectFiles = (event) => {
    const selectedFiles = Array.from(event.target.files).map((file) => ({
      file,
      preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
      progress: 0,
      uploading: false,
      speed: "--",
      eta: "--",
      uploadedPath: null,
    }));
    setFiles(multiple ? (prev) => [...prev, ...selectedFiles] : selectedFiles);
  };

  const handleRemoveFile = (index) => {
    setFiles((prev) => {
      const updated = prev.filter((_, i) => i !== index);

      // 🔄 Update parent when file removed
      if (onUploadComplete) {
        if (multiple) {
          const remainingPaths = updated.map((f) => f.uploadedPath).filter(Boolean);
          onUploadComplete(remainingPaths);
        } else {
          onUploadComplete(""); // empty payload for single
        }
      }

      return updated;
    });
  };

  const handleUpload = async (fileObj, index) => {
    if (!fileObj.file) return; // skip already uploaded initial files

    const formData = new FormData();
    formData.append(fieldName, fileObj.file);

    const startTime = Date.now();
    let lastLoaded = 0;

    try {
      setFiles((prev) =>
        prev.map((f, i) => (i === index ? { ...f, uploading: true, progress: 0 } : f))
      );

      const res = await axios.post(`${baseUrl}${endpoint}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("Token")}`,
        },
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          const progress = Math.round((loaded * 100) / total);

          const elapsed = (Date.now() - startTime) / 1000;
          const bytesSinceLast = loaded - lastLoaded;
          const speed = bytesSinceLast / elapsed;
          lastLoaded = loaded;

          const speedMB = speed / (1024 * 1024);
          const remaining = total - loaded;
          const eta = speed > 0 ? remaining / speed : 0;

          setFiles((prev) =>
            prev.map((f, i) =>
              i === index
                ? {
                    ...f,
                    progress,
                    speed: `${speedMB.toFixed(2)} MB/s`,
                    eta: `${Math.round(eta)}s left`,
                  }
                : f
            )
          );
        },
      });

      const uploadedPath = res?.data?.file || "";

      setFiles((prev) =>
        prev.map((f, i) =>
          i === index
            ? {
                ...f,
                uploading: false,
                progress: 100,
                uploadedPath,
                speed: "--",
                eta: "Done",
              }
            : f
        )
      );

      if (onUploadComplete) {
        if (multiple) {
          const allPaths = files
            .map((f, i) => (i === index ? uploadedPath : f.uploadedPath))
            .filter(Boolean);
          onUploadComplete(allPaths);
        } else {
          onUploadComplete(uploadedPath);
        }
      }
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <Box>
      <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
        Upload files
        <VisuallyHiddenInput
          ref={inputRef}
          multiple={multiple}
          accept={accept}
          onChange={handleSelectFiles}
        />
      </Button>

      <Box mt={2} display="flex" flexWrap="wrap" gap={2}>
        {files.map((fileObj, index) => (
          <Box
            key={index}
            sx={{
              width: 180,
              border: "1px solid #ddd",
              borderRadius: "8px",
              overflow: "hidden",
              position: "relative",
              p: 1,
            }}
          >
            {fileObj.preview ? (
              <img
                src={fileObj.preview}
                alt="preview"
                style={{
                  width: "100%",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "4px",
                }}
              />
            ) : (
              <Typography variant="body2" noWrap>
                {fileObj.file?.name}
              </Typography>
            )}

            <IconButton
              size="small"
              sx={{ position: "absolute", top: 4, right: 4, background: "white" }}
              onClick={() => handleRemoveFile(index)}
            >
              <CloseIcon fontSize="small" color="error" />
            </IconButton>

            {fileObj.uploading ? (
              <Box textAlign="center" mt={1}>
                <CircularProgress variant="determinate" value={fileObj.progress} />
                <Typography variant="caption" display="block">
                  {fileObj.progress}%
                </Typography>
                <Typography variant="caption" display="block">
                  {fileObj.speed} | {fileObj.eta}
                </Typography>
              </Box>
            ) : fileObj.progress === 100 ? (
              <Typography
                variant="caption"
                display="block"
                color="success.main"
                textAlign="center"
              >
                Uploaded
              </Typography>
            ) : (
              <Button
                fullWidth
                size="small"
                sx={{ mt: 1 }}
                onClick={() => handleUpload(fileObj, index)}
              >
                Start Upload
              </Button>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default UploadFile;
