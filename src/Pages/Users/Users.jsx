import React from "react";
import { useTable } from "../../Components/Models/useTable";

const Users = () => {
  const attributes = [
   
    { id: "name", label: "name" },
    { id: "email", label: "email" },
    { id: "type.name", label: "type" },
    { id: "createdAt", label: "Created At" },
  ];

  
  const { tableUI } = useTable({  attributes, tableType: "Users" });

  return <>{tableUI}</>;
};

export default Users;
