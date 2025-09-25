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
import { createnewuser, createnewusertype, createTeamMember } from "../../DAL/create";
import { updateuser, updateusertype } from "../../DAL/edit";
import { fetchallUsertypeslist } from "../../DAL/fetch"; // Make sure this function exists

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

export default function AddUser({ open, setOpen, Modeltype, Modeldata, onResponse }) {
  const [name, setName] = React.useState(Modeldata?.name || "");
  const [email, setEmail] = React.useState(Modeldata?.email || "");
  const [password, setPassword] = React.useState("");
  const [published, setPublished] = React.useState(Modeldata?.published || false);
  const [id, setId] = React.useState(Modeldata?._id || "");

  const [userTypes, setUserTypes] = React.useState([]);
  const [selectedTypeId, setSelectedTypeId] = React.useState("");

  React.useEffect(() => {
    setName(Modeldata?.name || "");
    setEmail(Modeldata?.email || "");
    setPublished(Modeldata?.published || false);
    setId(Modeldata?._id || "");
    setSelectedTypeId(Modeldata?.type?._id || "");

    const fetchTypes = async () => {
      const res = await fetchallUsertypeslist();
   
        setUserTypes(res.userType);
     
    };

    fetchTypes();
  }, [Modeldata]);

  const handleClose = () => setOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const usertypeData = {
      name,
      email,
      password,
      published,
      typeId: selectedTypeId,
    };

    let response;
    if (Modeltype === "Add") {
      response = await createnewuser(usertypeData);
    } else {
      response = await updateuser(id, usertypeData);
    }

    if (response.status === 201 || response.status === 200) {
      onResponse({ messageType: "success", message: response.message });
    } else {
      onResponse({ messageType: "error", message: response.message });
    }
    setOpen(false);
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-title">
      <Box sx={style}>
        <Typography id="modal-title" variant="h6" component="h2">
          {Modeltype} User
        </Typography>

        <TextField
          sx={{ marginTop: "10px", borderRadius: "6px" }}
          fullWidth
          required
          label="Name"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <TextField
          sx={{ marginTop: "10px", borderRadius: "6px" }}
          fullWidth
          required
          label="Email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
{Modeltype === "Add" && (
        <TextField
          sx={{ marginTop: "10px", borderRadius: "6px" }}
          fullWidth
          required
          type="password"
          label="Password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
)}

        <select
          style={{
            marginTop: "10px",
            borderRadius: "6px",
            width: "100%",
            padding: "15px",
            borderColor: "#ccc",
          }}
          value={selectedTypeId}
          onChange={(e) => setSelectedTypeId(e.target.value)}
        >
          <option value="" disabled>
            Select User Type
          </option>
          {userTypes?.map((type) => (
            <option key={type._id} value={type._id}>
              {type.name}
            </option>
          ))}
        </select>

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
