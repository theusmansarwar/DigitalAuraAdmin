import React from "react";
import { useTable } from "../../Components/Models/useTable";

const FeaturedBlogs = () => {
  const attributes = [

    { id: "title", label: "Blog Title" },
    { id: "category.name", label: "Category" },
    { id: "published", label: "Visibility" },
    { id: "views", label: "Views" },
    { id: "createdAt", label: "Created At" },
  ];
  const { tableUI } = useTable({  attributes, tableType: "Featured Blogs" }); 
  
  return <>{tableUI}</>;
};

export default FeaturedBlogs;
