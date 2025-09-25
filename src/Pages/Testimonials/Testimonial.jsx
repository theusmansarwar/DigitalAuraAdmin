import React from "react";
import { useTable } from "../../Components/Models/useTable";

const Testimonial = () => {
  const attributes = [
   
    { id: "image", label: "Company Logo" },
    { id: "whatwedid", label: "What we Did" },
    { id: "clientsays", label: "Client Says" },
    { id: "published", label: "Visibility" },
    { id: "createdAt", label: "Created At" },
  ];

  
  const { tableUI } = useTable({  attributes, tableType: "Testimonial" });

  return <>{tableUI}</>;
};

export default Testimonial;
