import { invokeApi } from "../Utils/InvokeApi";

export const deleteAllBlogs = async (data) => {
  const reqObj = {
    path: `/blog/deleteMultiple`,
    method: "DELETE", // Ensure correct capitalization
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: data,
  };
  
  return invokeApi(reqObj);
};
//////////////////////
export const deleteAllFeaturedBlogs = async (data) => {
  const reqObj = {
    path: `/blog/deletefeatured`,
    method: "DELETE", // Ensure correct capitalization
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: data,
  };
  
  return invokeApi(reqObj);
};
//////////
export const deleteAllCategories = async (data) => {
  const reqObj = {
    path: `/category/delete`,
    method: "DELETE", // Ensure correct capitalization
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: data,
  };
  
  return invokeApi(reqObj);
};
export const deleteAllTickets = async (data) => {
  const reqObj = {
    path: `/ticket/deletemultiple`,
    method: "DELETE", // Ensure correct capitalization
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: data,
  };
  
  return invokeApi(reqObj);
};
////////////////////////
export const deleteAllServicesCategories = async (data) => {
  const reqObj = {
    path: `/servicecategory/delete`,
    method: "DELETE", // Ensure correct capitalization
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: data,
  };
  
  return invokeApi(reqObj);
};
export const deleteAllFaqs = async (data) => {
  const reqObj = {
    path: `/faqs/delete`,
    method: "DELETE", // Ensure correct capitalization
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: data,
  };
  
  return invokeApi(reqObj);
};
export const deleteAllWhyService = async (data) => {
  const reqObj = {
    path: `/WhyService/delete`,
    method: "DELETE", // Ensure correct capitalization
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: data,
  };
  
  return invokeApi(reqObj);
};
export const deleteAllHowwedo = async (data) => {
  const reqObj = {
    path: `/howwedo/deletemultiple`,
    method: "DELETE", // Ensure correct capitalization
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: data,
  };
  
  return invokeApi(reqObj);
};
export const deleteAllServices = async (data) => {
  const reqObj = {
    path: `/service/delete-many`,
    method: "DELETE", // Ensure correct capitalization
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: data,
  };
  
  return invokeApi(reqObj);
};
////////////////////////
export const deleteOfferingById = async (id,data) => {
  const reqObj = {
    path: `/offering/delete${id}`,
    method: "DELETE", // Ensure correct capitalization
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: data,
  };
  
  return invokeApi(reqObj);
};
export const deleteAllOfferings = async (data) => {
  const reqObj = {
    path: `/offering/delete-many`,
    method: "DELETE", // Ensure correct capitalization
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: data,
  };
  
  return invokeApi(reqObj);
};
export const deleteAllSuccessStories = async (data) => {
  const reqObj = {
    path: `/successstories/delete-many`,
    method: "DELETE", // Ensure correct capitalization
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: data,
  };
  
  return invokeApi(reqObj);
};
export const deleteSuccessStoryById = async (id,data) => {
  const reqObj = {
    path: `/successstories/delete${id}`,
    method: "DELETE", // Ensure correct capitalization
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: data,
  };
  
  return invokeApi(reqObj);
};

export const deleteAllApplications = async (data) => {
  const reqObj = {
    path: `/applications/ApplicationDelete`,
    method: "DELETE", // Ensure correct capitalization
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: data,
  };
  
  return invokeApi(reqObj);
};
export const deleteAllLeads = async (data) => {
  const reqObj = {
    path: `/leadsDelete`,
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: data,
  };
  
  return invokeApi(reqObj);
};
export const deleteAllTestimonials = async (data) => {
  const reqObj = {
    path: `/testimonial/delete`,
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: data,
  };
  
  return invokeApi(reqObj);
};
export const deleteAllUsersType = async (data) => {
  const reqObj = {
    path: `/usertype/delete`,
    method: "DELETE", 
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: data,
  };
  
  return invokeApi(reqObj);
};
export const deleteAllUsers = async (data) => {
  const reqObj = {
    path: `/admin/users/deleteMultiple`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: data,
  };
  
  return invokeApi(reqObj);
};


export const deleteAllComments = async (data) => {
  const reqObj = {
    path: `/comment/delete`,
    method: "DELETE", 
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: data,
  };
  
  return invokeApi(reqObj);
};
