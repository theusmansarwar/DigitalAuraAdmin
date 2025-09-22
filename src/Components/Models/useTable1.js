import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
  Checkbox,
  Button,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { formatDate } from "../../Utils/Formatedate";
import truncateText from "../../truncateText";
import {  deleteAllFaqs } from "../../DAL/delete";
import { useAlert } from "../Alert/AlertContext";
import DeleteModal from "./confirmDeleteModel";
import { useParams } from "react-router-dom";
import FaqsModel from "./faqsModel";

export function useTable1({ attributes1, tableType, data = []  }) {
  const { showAlert } = useAlert(); // Since you created a custom hook

  const [selected, setSelected] = useState([]);
  const [openFaqsModel, setOpenFaqsModel] = useState(false);
  const [modeltype, setModeltype] = useState("Add");
  const [modelData, setModelData] = useState({});
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const {id} = useParams()




  const handleSelectAllClick = (event) => {
    setSelected(event.target.checked ? data.map((row) => row._id) : []);
  };

  const isSelected = (id) => selected.includes(id);

  const handleViewClick = (category) => {
    setModelData(category);
    setModeltype("Update");
    setOpenFaqsModel(true);
  };

  const handleDelete = async () => {
    if (selected.length === 0) {
      showAlert("warning", "No items selected for deletion");
      return;
    }

    console.log("Attempting to delete IDs:", selected);

    try {
      let response = await deleteAllFaqs({ ids: selected });

      if (response.status === 200) {
        showAlert("success", response.message || "Deleted successfully");
        setSelected([]);
      } else {
        showAlert("error", response.message || "Failed to delete items");
      }
    } catch (error) {
      console.error("Error in delete request:", error);
      showAlert("error", "Something went wrong. Try again later.");
    }
  };

  const handleAddButton = () => {
    setOpenFaqsModel(true);
    setModeltype("Add");
    setModelData();
  };

  const getNestedValue = (obj, path) => {
    return path
      .split(".")
      .reduce(
        (acc, key) => (acc && acc[key] !== undefined ? acc[key] : "N/A"),
        obj
      );
  };

  const handleResponse = (response) => {
    showAlert(response.messageType, response.message);
  };
  const handleDeleteClick = () => {
    setOpenDeleteModal(true);
  };
  

  return {
    tableUI1: (
      <>
        <FaqsModel
          open={openFaqsModel}
          setOpen={setOpenFaqsModel}
          Modeltype={modeltype}
          Modeldata={modelData}
          onResponse={handleResponse}
          serviceid={id}
        />

        <DeleteModal
          open={openDeleteModal}
          setOpen={setOpenDeleteModal}
          onConfirm={handleDelete}
        />

        <Box sx={{ width: "100%", marginBottom:"20px" }}>
          <Paper sx={{ width: "100%", boxShadow: "none" }}>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between"  }}>
              <Typography
                variant="h5"
                sx={{ color: "var(--background-color)" }}
              >
                {tableType} List
              </Typography>

              {selected.length > 0 ? (
                <IconButton onClick={handleDeleteClick} sx={{ color: "red" }}>
                  <DeleteIcon />
                </IconButton>
              ) : (
                <Button
                  sx={{
                    background: "var(--background-color)",
                    color: "var(--text-color)",
                    borderRadius: "var(--default-border-radius)",
                    "&:hover": { background: "var(--shadow-low3)" },
                  }}
                  onClick={handleAddButton}
                >
                  Add {tableType}
                </Button>
              )}
            </Toolbar>
            <TableContainer>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        sx={{
                          color: "var(--background-color)",
                          "&.Mui-checked": { color: "var(--background-color)" },
                          "&.MuiCheckbox-indeterminate": {
                            color: "var(--background-color)",
                          },
                        }}
                        indeterminate={
                          selected.length > 0 && selected.length < data.length
                        }
                        checked={
                          data.length > 0 && selected.length === data.length
                        }
                        onChange={handleSelectAllClick}
                      />
                    </TableCell>
                    {attributes1.map((attr) => (
                      <TableCell
                        key={attr._id}
                        sx={{ color: "var(--background-color)" }}
                      >
                        {attr.label}
                      </TableCell>
                    ))}
                    <TableCell sx={{ color: "var(--background-color)" }}>
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.map((row) => {
                    const isItemSelected = isSelected(row._id);
                    return (
                      <TableRow key={row._id} selected={isItemSelected}>
                        <TableCell padding="checkbox">
                          <Checkbox
                            sx={{
                              color: "var(--background-color)",
                              "&.Mui-checked": {
                                color: "var(--background-color)",
                              },
                            }}
                            checked={isItemSelected}
                            onChange={() => {
                              setSelected((prev) =>
                                isItemSelected
                                  ? prev.filter((id) => id !== row._id)
                                  : [...prev, row._id]
                              );
                            }}
                          />
                        </TableCell>

                        {attributes1.map((attr) => (
                          <TableCell
                            key={attr.id}
                            sx={{ color: "var(--black-color)" }}
                          >
                            {attr.id === "createdAt" ||
                            attr.id === "publishedDate" ? (
                              formatDate(row[attr.id])
                            ) : attr.id === "published" ? (
                              <span
                                style={{
                                  color: row[attr.id]
                                    ? "var(--success-color)"
                                    : "var(--warning-color)",
                                  background: row[attr.id]
                                    ? "var(--success-bgcolor)"
                                    : "var(--warning-bgcolor)",
                                  padding: "5px",
                                  minWidth: "200px",
                                  borderRadius: "var(--default-border-radius)",
                                }}
                              >
                                {row[attr.id] ? "Public" : "Private"}
                              </span>
                            ) : attr.id === "status" ? (
                              <span
                                style={{
                                  color: row[attr.id] ? "green" : "orange",
                                  background: row[attr.id]
                                    ? "#d4edda"
                                    : "#fff3cd",
                                  padding: "5px",
                                  minWidth: "100px",
                                  borderRadius: "var(--default-border-radius)",
                                }}
                              >
                                {row[attr.id] ? "Answered" : "Pending"}
                              </span>
                            ) : row[attr.id] === 0 ? (
                              0
                            ) : typeof getNestedValue(row, attr.id) ===
                              "string" ? (
                              truncateText(getNestedValue(row, attr.id), 30)
                            ) : (
                              getNestedValue(row, attr.id)
                            )}
                          </TableCell>
                        ))}

                        <TableCell>
                          <span
                            onClick={() => handleViewClick(row)}
                            style={{
                              color: "var(--background-color)",
                              textDecoration: "underline",
                              cursor: "pointer",
                            }}
                          >
                            View
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      </>
    ),
  };
}
