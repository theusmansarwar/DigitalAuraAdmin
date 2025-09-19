import { invokeApi } from "../Utils/InvokeApi";
export const createBlog = async (data) => {
  console.log(...data, "djskfhjksdfks");
  const reqObj = {
    path: "/blog/create",
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: data,
  };
  return invokeApi(reqObj);
};
export const createNewFaq = async (data) => {
  const reqObj = {
    path: "/faqs/add",
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: data,
  };
  return invokeApi(reqObj);
};

export const uploadimage = async (data) => {
  const reqObj = {
    path: "/upload-image",
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: data,
  };
  return invokeApi(reqObj);
};
export const createNewWhyService = async (data) => {
  const reqObj = {
    path: "/WhyService/add",
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: data,
  };
  return invokeApi(reqObj);
};
export const createnewCategory = async (data) => {
  const reqObj = {
    path: "/category/add",
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: data,
  };
  return invokeApi(reqObj);
};
//////////////////////
export const createnewServicesCategory = async (data) => {
  const reqObj = {
    path: "/servicecategory/add",
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },

    postData: data,
  };
  return invokeApi(reqObj);
};
/////////////////////
export const createNewService = async (data) => {
  const reqObj = {
    path: "/service/create",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },

    postData: data,
  };
  return invokeApi(reqObj);
};
export const createNewPortfolio = async (data) => {
  const reqObj = {
    path: "/portfolio/add",
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },

    postData: data,
  };
  return invokeApi(reqObj);
};
export const createNewHowwedo = async (data) => {
  const reqObj = {
    path: "/howwedo/create",
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },

    postData: data,
  };
  return invokeApi(reqObj);
};
export const createNewSuccessStory = async (data) => {
  const reqObj = {
    path: "/successstories/add",
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },

    postData: data,
  };
  return invokeApi(reqObj);
};
export const createTestimonial = async (data) => {
  const reqObj = {
    path: "/testimonial/add",
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: data,
  };
  return invokeApi(reqObj);
};
export const createnewusertype = async (data) => {
  const reqObj = {
    path: "/usertype/add",
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: data,
  };
  return invokeApi(reqObj);
};
export const createTeamMember = async (data) => {
  const reqObj = {
    path: "/admin/register",
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: data,
  };
  return invokeApi(reqObj);
};
export const createnewticket = async (id) => {
  const reqObj = {
    path: "/ticket/add",
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    postData: id,
  };
  return invokeApi(reqObj);
};
export const createMessage = async (data) => {
  const reqObj = {
    path: "/chat/add",
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    postData: data,
  };
  return invokeApi(reqObj);
};
