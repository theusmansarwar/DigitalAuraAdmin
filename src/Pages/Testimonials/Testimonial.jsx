import React from "react";
import { useTable } from "../../Components/Models/useTable";

const Testimonial = () => {
  const attributes = [
   
    { id: "name", label: "Name" },
    { id: "service", label: "Service" },
    { id: "description", label: "Description" },
    { id: "published", label: "Visibility" },
    { id: "createdAt", label: "Created At" },
  ];

  
  const { tableUI } = useTable({  attributes, tableType: "Testimonial" });

  return <>{tableUI}</>;
};

export default Testimonial;
