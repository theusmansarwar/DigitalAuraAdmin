import { invokeApi } from "../Utils/InvokeApi";

export const fetchcategorylist = async () => {
  const reqObj = {
    path: "/category/live",
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },

    postData: {},
  };
  return invokeApi(reqObj);
};

export const fetchDashboard = async () => {
  const reqObj = {
    path: "/admin/stats",
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },

    postData: {},
  };
  return invokeApi(reqObj);
};

export const fetchDashboardChart = async () => {
  const reqObj = {
    path: "/views/get/count",
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },

    postData: {},
  };
  return invokeApi(reqObj);
};
export const fetchallcategorylist = async (page, rowsPerPages) => {
  const reqObj = {
    path: `/category/view?limit=${rowsPerPages}&page=${page}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },

    body: {},
  };
  return invokeApi(reqObj);
};
export const searchBlog= async (title) => {
  const reqObj = {
    path: `/blog/search?title=${title}`,
    method: "GET",
    headers: {
    },

    body: {},
  };
  return invokeApi(reqObj);
};
export const searchService= async (title) => {
  const reqObj = {
    path: `/service/search?title=${title}`,
    method: "GET",
    headers: {
    },

    body: {},
  };
  return invokeApi(reqObj);
};
//////////////////////////////////////////////
export const fetchallservicescategorylist = async (page, rowsPerPages) => {
  const reqObj = {
    path: `/servicecategory/view?limit=${rowsPerPages}&page=${page}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },

    body: {},
  };
  return invokeApi(reqObj);
};
export const fetchallserviceslist = async (page, rowsPerPages,title) => {
  const reqObj = {
    path: `/service/listbyadmin?title=${title}&limit=${rowsPerPages}&page=${page}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },

    body: {},
  };
  return invokeApi(reqObj);
};
export const fetchservicebyid = async (id) => {
  const reqObj = {
    path: `/service/get/${id}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },

    body: {},
  };
  return invokeApi(reqObj);
};
//////////////////////////////////////////////
export const fetchallBloglist = async ( page, rowsPerPages, title) => {
  const reqObj = {
    path: `/blog/adminlist?title=${title}&limit=${rowsPerPages}&page=${page}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },

    body: {},
  };
  return invokeApi(reqObj);
};
export const fetchFeaturedBloglist = async ( page, rowsPerPages, title) => {
  const reqObj = {
    path: `/blog/featuredadmin?title=${title}&limit=${rowsPerPages}&page=${page}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },

    body: {},
  };
  return invokeApi(reqObj);
};
export const fetchallTickets = async ( page, rowsPerPages) => {
  const reqObj = {
    path: `/ticket/list?limit=${rowsPerPages}&page=${page}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },

    body: {},
  };
  return invokeApi(reqObj);
};
export const fetchTicket = async ( id) => {
  const reqObj = {
    path: `/ticket/view/${id}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },

    body: {},
  };
  return invokeApi(reqObj);
};
export const fetchBloglistofwritter = async ( page, rowsPerPages,name,title) => {
  const reqObj = {
    path: `/blog/writerlist?title=${title}&search=${name}&limit=${rowsPerPages}&page=${page}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },
    body:{},
  };
  return invokeApi(reqObj);
};
export const fetchBlogById = async (id) => {
  const reqObj = {
    path: `/blog/viewbyid/${id}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },

    body: {},
  };
  return invokeApi(reqObj);
};
export const fetchallCommentlist = async (page, rowsPerPages) => {
  const reqObj = {
    path: `/comment/view?limit=${rowsPerPages}&page=${page}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },

    body: {},
  };
  return invokeApi(reqObj);
};
export const fetchallTestimonialslist = async (page, rowsPerPages) => {
  const reqObj = {
    path: `/testimonial/view?limit=${rowsPerPages}&page=${page}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },

    body: {},
  };
  return invokeApi(reqObj);
};

export const fetchTestimonialbyid = async (id) => {
  const reqObj = {
    path: `/testimonial/view/${id}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },

    body: {},
  };
  return invokeApi(reqObj);
};
export const fetchallLeads = async ( page, rowsPerPages) => {
  const reqObj = {
    path: `/LeadsList?limit=${rowsPerPages}&page=${page}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },

    body: {},
  };
  return invokeApi(reqObj);
};
export const fetchSingleLeads = async (id) => {
  const reqObj = {
    path: `/Lead/${id}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },

    body: {},
  };
  return invokeApi(reqObj);
};
export const fetchallTeamCategories = async (id) => {
  const reqObj = {
    path: `/teamcategory/view`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },

    body: {},
  };
  return invokeApi(reqObj);
};
export const fetchallApplication = async ( page, rowsPerPages) => {
  const reqObj = {
    path: `/applications/ApplicationList?limit=${rowsPerPages}&page=${page}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },

    body: {},
  };
  return invokeApi(reqObj);
};
export const fetchSingleApplication = async (id) => {
  const reqObj = {
    path: `/applications/Application/${id}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },

    body: {},
  };
  return invokeApi(reqObj);
};
export const fetchallUserTypelist = async (id) => {
  const reqObj = {
    path: `/usertype/view`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },

    body: {},
  };
  return invokeApi(reqObj);
};
export const fetchallUserlist = async (page, rowsPerPages) => {
  const reqObj = {
    path: `/admin/users?limit=${rowsPerPages}&page=${page}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },

    body: {},
  };
  return invokeApi(reqObj);
};
export const fetchallUserbyid = async (id) => {
  const reqObj = {
    path: `/admin/users/${id}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },

    body: {},
  };
  return invokeApi(reqObj);
};
export const fetchallUsertypeslist = async () => {
  const reqObj = {
    path: `/usertype/live`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
    },

    body: {},
  };
  return invokeApi(reqObj);
};

