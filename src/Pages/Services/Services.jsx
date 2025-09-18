import React from "react";
import { useTable } from "../../Components/Models/useTable";

const Services = () => {
  const attributes = [
   
    { id: "title", label: "Service Title" },
    { id: "published", label: "Visibility" },
    { id: "createdAt", label: "Created At" },
  ];

 

  const { tableUI } = useTable({  attributes, tableType: "Services" });

  return <>{tableUI}</>;
};

export default Services;
