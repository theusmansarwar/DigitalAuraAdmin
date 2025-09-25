import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Switch,
  FormControlLabel,
  FormHelperText,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useAlert } from "../../Components/Alert/AlertContext";
import {
  fetchTeamMemberById,
  fetchTeamCategoryList,
  fetchRoleList,
} from "../../DAL/fetch";
import { updateTeamMember } from "../../DAL/edit";
import { createTeamMember } from "../../DAL/create";
import UploadFile from "../../Components/Models/UploadFile";

const AddTeam = () => {
  const { id } = useParams();
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [roleId, setRoleId] = useState("");
  const [roles, setRoles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [socialLinks, setSocialLinks] = useState({
    linkedin: "",
    instagram: "",
    facebook: "",
  });
  const [singlePath, setSinglePath] = useState(""); // ✅ uploaded file path
  const [isVisible, setIsVisible] = useState(true);
  const [isHomeShow, setIsHomeshow] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch team member (edit mode)
  useEffect(() => {
    if (id) {
      const fetchTeamMember = async () => {
        try {
          const response = await fetchTeamMemberById(id);
          const member = response.member;
          setName(member.name || "");
          setRoleId(member.role?._id || "");
          setDescription(member.description || "");
          setCategoryId(member.category?._id || "");
          setSocialLinks(member.socialLinks || {});
          setSinglePath(member.image || "");
          setIsVisible(member.published);
          setIsHomeshow(member.showonteamsection)
        } catch (error) {
          console.error("Error fetching team member:", error);
        }
      };
      fetchTeamMember();
    }
  }, [id]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetchTeamCategoryList();
        if (response?.categories) {
          setCategories(response.categories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetchRoleList();
        if (response?.roles) {
          setRoles(response.roles);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };
    fetchRoles();
  }, []);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const payload = {
      name,
      role: roleId,
      description,
      category: categoryId,
      published: isVisible,
      showonteamsection:isHomeShow,
      socialLinks,
      image: singlePath, // ✅ comes from UploadFile
    };

    let response;
    if (id) {
      response = await updateTeamMember(id, payload);
    } else {
      response = await createTeamMember(payload);
    }

    if (response.status === 201 || response.status === 200) {
      showAlert("success", response.message);
      navigate("/teams");
    } else if (response.missingFields) {
        const newErrors = {};
        response.missingFields.forEach((field) => {
          newErrors[field.name] = field.message;
        });
        setErrors(newErrors);
     
      showAlert("error", response.message);
    }

    setLoading(false);
  };

  return (
    <Box maxWidth="100%" mx="auto"  p={3}>
      <Typography variant="h5" mb={2}>
        {id ? "Edit Team Member" : "Add Team Member"}
      </Typography>

      <form onSubmit={handleSubmit}>
        {/* Name */}
        <TextField
          fullWidth
          label="Name"
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={!!errors.name}
          helperText={errors.name}
        />
        <Box display="flex" gap={2} mt={2}>
          {/* Role */}
          <FormControl fullWidth margin="normal" error={!!errors.role}>
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              id="role"
              value={roleId}
              label="Role"
                error={!!errors.role}
          helperText={errors.role}
              onChange={(e) => setRoleId(e.target.value)}
            >
              <MenuItem value="">Select a role</MenuItem>
              {roles.map((role) => (
                <MenuItem key={role._id} value={role._id}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
            {errors.role && <FormHelperText>{errors.role}</FormHelperText>}
          </FormControl>

          {/* Category */}
          <FormControl fullWidth margin="normal" error={!!errors.category}>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              id="category"
              value={categoryId}
              label="Category"
                error={!!errors.category}
          helperText={errors.category}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <MenuItem value="">Select a category</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat._id} value={cat._id}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
            {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
          </FormControl>
        </Box>
        {/* Description */}
        <TextField
          fullWidth
          label="Description"
          margin="normal"
          multiline
          rows={3}
          value={description}
              error={!!errors.description}
          helperText={errors.description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Social Links */}
        <TextField
          fullWidth
          label="LinkedIn"
          margin="normal"
          value={socialLinks.linkedin}
          onChange={(e) =>
            setSocialLinks({ ...socialLinks, linkedin: e.target.value })
          }
        />
        <TextField
          fullWidth
          label="Instagram"
          margin="normal"
          value={socialLinks.instagram}
          onChange={(e) =>
            setSocialLinks({ ...socialLinks, instagram: e.target.value })
          }
        />
        <TextField
          fullWidth
          label="Facebook"
          margin="normal"
          value={socialLinks.facebook}
          onChange={(e) =>
            setSocialLinks({ ...socialLinks, facebook: e.target.value })
          }
        />

        <Typography
          variant="h5"
          sx={{
            color: "var(--background-color)",
            marginTop: "20px",
            marginBottom: "20px",
          }}
        >
          {" "}
          Profile Picture
        </Typography>
        <UploadFile
          multiple={false}
          accept="image/*"
          initialFiles={singlePath}
          onUploadComplete={(path) => setSinglePath(path)}
        />
<FormControlLabel
          control={
            <Switch
              checked={isHomeShow}
              onChange={() => setIsHomeshow(!isHomeShow)}
            />
          }
          label={`Featured Member: ${isHomeShow ? "Yes" : "No"}`}
        />
        {/* Visibility Toggle */}
        <FormControlLabel
          control={
            <Switch
              checked={isVisible}
              onChange={() => setIsVisible(!isVisible)}
            />
          }
          label={`Visibility: ${isVisible ? "Public" : "Draft"}`}
        />

        {/* Buttons */}
        <Box mt={3} display="flex" justifyContent="space-between">
          <Button variant="outlined" onClick={() => navigate("/teams")}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? "Saving..." : id ? "Update" : "Save"}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default AddTeam;
