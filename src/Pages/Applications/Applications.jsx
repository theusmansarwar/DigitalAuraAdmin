import React from "react";
import { useTable } from "../../Components/Models/useTable";

const Applications = () => {
  const attributes = [
   
    { id: "name", label: "Name" },
    { id: "jobTitle", label: "Job Title" },
    { id: "email", label: "Email" },
    { id: "phone", label: "Phone" },
    { id: "createdAt", label: "Created At" },
  ];

  
  const { tableUI } = useTable({  attributes, tableType: "Applications" });

  return <>{tableUI}</>;
};

export default Applications;
