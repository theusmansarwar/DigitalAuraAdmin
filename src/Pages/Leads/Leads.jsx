import React from "react";
import { useTable } from "../../Components/Models/useTable";

const Leads = () => {
  const attributes = [
   
    { id: "name", label: "Name" },
    { id: "subject", label: "Subject" },
    { id: "email", label: "Email" },

    { id: "phone", label: "Phone" },
    { id: "createdAt", label: "Created At" },
  ];

  
  const { tableUI } = useTable({  attributes, tableType: "Lead" });

  return <>{tableUI}</>;
};

export default Leads;
