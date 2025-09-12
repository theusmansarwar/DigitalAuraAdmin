import React from "react";
import { useTable } from "../../Components/Models/useTable";

const Categories = () => {
  const attributes = [
   
    { id: "name", label: "Category" },
    { id: "published", label: "Visibility" },
    { id: "createdAt", label: "Created At" },
  ];

  
  const { tableUI } = useTable({  attributes, tableType: "Categories" });

  return <>{tableUI}</>;
};

export default Categories;
