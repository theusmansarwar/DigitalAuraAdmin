import React from "react";
import { useTable } from "../../Components/Models/useTable";

const TeamCategory = () => {
  const attributes = [
   
    { id: "name", label: "Category" },
    { id: "published", label: "Visibility" },
    { id: "createdAt", label: "Created At" },
  ];

  
  const { tableUI } = useTable({  attributes, tableType: "Team Category" });

  return <>{tableUI}</>;
};

export default TeamCategory;
