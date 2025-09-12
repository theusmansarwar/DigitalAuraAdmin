import * as React from "react";
import "./Viewleads.css";
import { Box, Button, IconButton, Modal } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { createnewticket } from "../../DAL/create";
import { formatDate } from "../../Utils/Formatedate";
import { useAlert } from "../Alert/AlertContext";
import DeleteModal from "./confirmDeleteModel";
import { deleteAllLeads } from "../../DAL/delete";

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

export default function ViewLead({ open, setOpen, Modeldata ,refreshdata}) {
  const [id, setId] = React.useState(Modeldata?._id || "");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
    const [budget, setBudget] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [query, setQuery] = React.useState("");
  const [createdAt, setCreatedAt] = React.useState("");
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);

  const { showAlert } = useAlert();

  React.useEffect(() => {
    if (Modeldata) {
      setId(Modeldata?._id || "");
      setName(Modeldata.name || "");
      setEmail(Modeldata.email || "");
      setPhone(Modeldata.phone || "");
      setSubject(Modeldata.subject || "");
      setQuery(Modeldata.query || "");
      setCreatedAt(Modeldata.createdAt || "");
      setBudget(Modeldata.budget|| "N/A")
    }
  }, [Modeldata]);

  const handleDelete = async () => {
    try {
      let response = await deleteAllLeads({ids:[id]});
      if (response.status === 200) {
        showAlert("success", response.message || "Deleted successfully");
        setOpen(false); 
        refreshdata();
      } else {
        showAlert("error", response.message || "Failed to delete items");
      }
    } catch (error) {
      console.error("Error in delete request:", error);
      showAlert("error", "Something went wrong. Try again later.");
    }
  };

  const handleClose = () => setOpen(false);

  const genarateticket = async () => {
    try {
      const res = await createnewticket({ id });
      if (res.status === 200 || res.status === 201) {
        showAlert("success", res.message);
      } else {
        showAlert("error", "Something went wrong");
      }
    } catch (err) {
      showAlert("error", "Something went wrong");
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <>
        {/* Delete confirmation modal */}
        <DeleteModal
          open={openDeleteModal}
          setOpen={setOpenDeleteModal}
          onConfirm={handleDelete}
        />

        <Box sx={style}>
          <div className="email-container">
            <div className="email-header">
              <h2>New Lead Submission</h2>
              <p className="email-date">Received on: {formatDate(createdAt)}</p>
            </div>

            <div className="email-body">
      
             

            
             

              <div className="ticketdata">
                <p><strong>Name:</strong> {name}</p>
                <p><strong>Email:</strong> <a href={`mailto:${email}`}>{email}</a></p>
                <p><strong>Phone:</strong> <a href={`tel:${phone}`}>{phone}</a></p>
                  <p><strong>Budget:</strong> {budget}</p>
                <p><strong>Subject:</strong> {subject}</p>
                <pre className="pretag"><strong>Query:</strong> {query}</pre>
              </div>
            </div>
          </div>

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
  variant="contained"          // Filled button
  color="error"                // Red color theme
  startIcon={<DeleteIcon />}   // Icon before text
  onClick={() => setOpenDeleteModal(true)}
>
  Delete
</Button>
          </Box>
        </Box>
      </>
    </Modal>
  );
}
