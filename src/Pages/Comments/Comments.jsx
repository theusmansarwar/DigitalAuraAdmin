import React from "react";
import { useTable } from "../../Components/Models/useTable";

const Comments = () => {
  const attributes = [
   
    { id: "comment", label: "Comment" },

    { id: "blogId.title", label: "Blog Title" },
    { id: "name", label: "Name" },
    { id: "email", label: "Email" },

    { id: "published", label: "Visibility" },
  
    { id: "createdAt", label: "Created At" },
  ];

 

  const { tableUI } = useTable({  attributes, tableType: "Comments" });

  return <>{tableUI}</>;
};

export default Comments;
