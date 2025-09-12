import React, { useState, useEffect, useRef, useMemo } from "react";
import "./AddBlog.css";
import { IoMdCloseCircle } from "react-icons/io";
import JoditEditor from "jodit-react";
import dummyimg from "../../Assets/upload-background.PNG";
import { useNavigate, useParams } from "react-router-dom";
import { useAlert } from "../../Components/Alert/AlertContext";
import { fetchBlogById, fetchcategorylist } from "../../DAL/fetch";
import { updateBlog } from "../../DAL/edit";
import { createBlog } from "../../DAL/create";
import { baseUrl } from "../../Config/Config";

const AddBlog = () => {
  const path = window.location.pathname;
  const segments = path.split("/");

  const route = segments[1];

  // "edit-featuredblog"

  const { id } = useParams();
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  const [selectedDateTime, setSelectedDateTime] = useState("");
  const [faqSchema, setFaqSchema] = useState({});
  const [faqSchemaText, setFaqSchemaText] = useState("{}");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [detail, setDetail] = useState("");
  const [author, setAuthor] = useState("");
  const [newauthor, setNewAuthor] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [image, setImage] = useState(dummyimg);
  const [isVisible, setIsVisible] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const fileInputRef = useRef(null);
  const editor = useRef(null);

  const config = useMemo(
    () => ({
      readonly: false,
      uploader: { insertImageAsBase64URI: true },
      placeholder: "Start typing...",
      imageExtensions: ["jpg", "jpeg", "png", "gif", "bmp", "svg"],
    }),
    []
  );

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userName = user?.name || "";
    setNewAuthor(userName);
    if (id) {
      const fetchBlog = async () => {
        try {
          const response = await fetchBlogById(id);
          if (response.status === 200) {
            const blog = response.blog;
            setTitle(blog.title || "");
            setDescription(blog.description || "");
            setDetail(blog.detail || "");
            setAuthor(blog.author || "");
            setMetaDescription(blog.metaDescription || "");
            setSlug(blog.slug || "");
            setCategoryId(blog.category?._id || "");
            setImage(blog.thumbnail ? baseUrl + blog.thumbnail : dummyimg);
            const schema = blog.faqSchema ? JSON.parse(blog.faqSchema) : {};
            setFaqSchema(schema);
            setFaqSchemaText(JSON.stringify(schema, null, 2));
            setIsFeatured(blog?.featured);
            setIsVisible(blog?.published);
          }
        } catch (error) {
          console.error("Error fetching blog:", error);
        }
      };
      fetchBlog();
    }
  }, [id]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetchcategorylist();
        if (response && response.categories) {
          setCategories(response.categories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleFileChange = (event) => {
    if (event.target.files?.[0]) {
      const file = event.target.files[0];
      setImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const errorObj = {};
    if (!categoryId) errorObj.category = "Category is required.";

    try {
      JSON.parse(faqSchemaText);
    } catch {
      errorObj.faqSchema = "Schema JSON is invalid.";
    }

    if (Object.keys(errorObj).length > 0) {
      setErrors(errorObj);
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("detail", detail);
    formData.append("author", author || newauthor);
    formData.append("metaDescription", metaDescription);
    formData.append("slug", slug);
    formData.append("category", categoryId);
    formData.append("published", isVisible);
    formData.append("featured", isFeatured);
    formData.append("faqSchema", faqSchemaText);

    if (fileInputRef.current?.files[0]) {
      formData.append("thumbnail", fileInputRef.current.files[0]);
    }

    try {
      const response = id
        ? await updateBlog(id, formData)
        : await createBlog(formData);

      if (response.status === 200 || response.status === 201) {
        showAlert("success", response.message);

        if (route === "edit-featuredblog") {
          navigate("/blogs/featured");
        } else {
          navigate("/blogs");
        }
      } else if (response.missingFields) {
        const newErrors = {};
        response.missingFields.forEach((field) => {
          newErrors[field.name] = field.message;
        });
        setErrors(newErrors);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      showAlert("error", "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="AddPost">
      <form onSubmit={handleSubmit}>
        <h3>{id ? "Edit Blog" : "Add Blog"}</h3>
        <div className="upper-section">
          <div className="left">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {errors.title && <p className="error">{errors.title}</p>}

            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {errors.description && (
              <p className="error">{errors.description}</p>
            )}

            <textarea
              placeholder="Meta Description"
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
            />
            {errors.metaDescription && (
              <p className="error">{errors.metaDescription}</p>
            )}

            <textarea
              placeholder="Schema (JSON)"
              value={faqSchemaText}
              onChange={(e) => {
                setFaqSchemaText(e.target.value);
                try {
                  const parsed = JSON.parse(e.target.value);
                  setFaqSchema(parsed);
                  setErrors((prev) => ({ ...prev, faqSchema: null }));
                } catch {
                  setErrors((prev) => ({
                    ...prev,
                    faqSchema: "Invalid JSON format",
                  }));
                }
              }}
            />
            {errors.faqSchema && <p className="error">{errors.faqSchema}</p>}
          </div>

          <div
            className="image-container"
            style={{ border: errors.thumbnail ? "2px solid red" : "" }}
          >
            <img
              src={image}
              alt="Thumbnail"
              onClick={() => fileInputRef.current?.click()}
            />
            <IoMdCloseCircle
              className="remove-icon"
              onClick={() => {
                setImage(dummyimg);
                fileInputRef.current.value = null;
              }}
            />
            <input
              type="file"
              accept="image/png, image/jpeg, image/webp"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </div>
        </div>

        <input
          type="text"
          placeholder="Slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />
        {errors.slug && <p className="error">{errors.slug}</p>}

        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.category && <p className="error">{errors.category}</p>}

        <JoditEditor
          ref={editor}
          value={detail}
          config={config}
          tabIndex={1}
          onChange={(newContent) => setDetail(newContent)}
        />
        {errors.detail && <p className="error">{errors.detail}</p>}

        <div className="toggle-container">
          <span className="toggle-label">Featured: </span>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={() => setIsFeatured(!isFeatured)}
            />
            <span className="slider"></span>
          </label>
        </div>
        <div className="toggle-container">
          <span className="toggle-label">
            Blog Visibility:{" "}
            <span className={isVisible ? "Public" : "Draft"}>
              {isVisible ? "Public" : "Draft"}
            </span>
          </span>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={isVisible}
              onChange={() => setIsVisible(!isVisible)}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="button-sections">
          <button
            type="button"
            className="cancelbtn"
            onClick={() => {
              if (route === "edit-featuredblog") {
                navigate("/blogs/featured");
              } else {
                navigate("/blogs");
              }
            }}
          >
            Cancel
          </button>

          <button className="published" type="submit" disabled={loading}>
            {loading ? "Saving..." : id ? "Update Blog" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBlog;
