import React from "react";
import {
  Box,
  Modal,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "60%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "12px",
  maxHeight: "75vh",
  overflowY: "auto",
  fontFamily: "monospace",
};

const snippets = [
  {
    title: "Paragraph",
    code: `<p>This is a paragraph</p>`,
  },
  {
    title: "Multiple Paragraphs",
    code: `<p>Paragraph one</p>\n<p>Paragraph two</p>`,
  },
  {
    title: "Bold Text",
    code: `<b>Bold Text</b>`,
  },
  {
    title: "Unordered List",
    code: `<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n</ul>`,
  },
  {
    title: "External Link",
    code: `<a href="https://yourlink.com">Click Here</a>`,
  },
];

export default function InfoModal({ open, onClose }) {
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied!");
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Content Formatting Guide</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
 <Box
          sx={{
            maxHeight: "55vh",
  overflowY: "auto",
   width:"100%"
           
          }}
        >
        {/* Snippets */}
        {snippets.map((item, idx) => (
          <Box
            key={idx}
            sx={{
              mt: 3,
              p: 2,
              bgcolor: "#f4f4f4",
              borderRadius: "8px",
            }}
          >
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              {item.title}
            </Typography>
            <Box
              component="pre"
              sx={{
                m: 0,
                p: 1.5,
                bgcolor: "#fff",
                borderRadius: "6px",
                fontSize: "14px",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                border: "1px solid #ddd",
              }}
            >
              <code>{item.code}</code>
            </Box>
            <Box sx={{ textAlign: "right", mt: 1 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleCopy(item.code)}
              >
                Copy
              </Button>
            </Box>
          </Box>
          
        ))}
      </Box>
      </Box>
    </Modal>
  );
}
