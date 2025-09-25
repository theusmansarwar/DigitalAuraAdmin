import React from "react";
import { useTable } from "../../Components/Models/useTable";

const Team = () => {
  const attributes = [
    { id: "name", label: "Name" },
    
   { id: "image", label: "Profile Image" },
    { id: "role.name", label: "Role" },
    { id: "category.name", label: "Category" },
    { id: "published", label: "Visibility" },
    { id: "createdAt", label: "Created At" },
  ];

  const { tableUI } = useTable({ attributes, tableType: "Team" });

  return <>{tableUI}</>;
};

export default Team;
