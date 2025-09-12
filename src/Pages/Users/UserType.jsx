import React from "react";
import { useTable } from "../../Components/Models/useTable";

const UserType = () => {
  const attributes = [
   
    { id: "name", label: "User Type" },
    { id: "published", label: "Visibility" },
    { id: "createdAt", label: "Created At" },
  ];

  
  const { tableUI } = useTable({  attributes, tableType: "UserType" });

  return <>{tableUI}</>;
};

export default UserType;
