import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAlert } from "../../Components/Alert/AlertContext";
import {  fetchTestimonialbyid } from "../../DAL/fetch";
import "./AddTestimonial.css";
import { updateTestimonial } from "../../DAL/edit";
import { createTestimonial } from "../../DAL/create";

const AddTestimonial = () => {
  const { id } = useParams();
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [service, setService] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [rating, setRating] = useState("");
  const [description, setDescription] = useState("");
  const [published, setPublished] = useState(true);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});


  useEffect(() => {
    const fetchTestimonial = async () => {
      try {
        const response = await fetchTestimonialbyid(id);
        setName(response.name);
        setService(response.service);
        setRating(response.rating);
        setDate(response.date)
         setLocation(response.location);
         setDescription(response.description);
         setPublished(response.published)
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    fetchTestimonial();
  }, [id]);

  // Handle Form Submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrors({});

    // Form Validation
    const newErrors = {};
    if (!name) newErrors.name = "Name is required";
    if (!service) newErrors.service = "Service is required";
    if (!location) newErrors.location = "Location is required";
    if (!date) newErrors.date = "Date is required";
    if (!rating) newErrors.rating = "Rating is required";
    if (!description) newErrors.description = "Description is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    const formData = {
      name,
      service,
      location,
      date,
      rating,
      description,
      published,
    };

    try {
      let response;
      if (id) {
        response = await updateTestimonial(id, formData);
      } else {
        response = await createTestimonial(formData);
      }

      if (response.status === 201 || response.status === 200) {
        showAlert("success", response.message);
        navigate("/testimonials");
      } else {
        showAlert("error", "Something went wrong!");
      }
    } catch (error) {
      console.error("Error saving testimonial:", error);
      showAlert("error", "Internal server error.");
    }
    setLoading(false);
  };

  return (
    <div className="AddTestimonial">
      <form onSubmit={handleSubmit}>
        <h3>{id ? "Edit Testimonial" : "Add Testimonial"}</h3>

        {/* Name Input */}
        {errors.name && <p className="error">{errors.name}</p>}
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Service Dropdown */}
        {errors.service && <p className="error">{errors.service}</p>}
        <select value={service} onChange={(e) => setService(e.target.value)}>
          <option value="">Select a Service</option>
          {services.map((srv) => (
            <option key={srv._id} value={srv.name}>
              {srv.name}
            </option>
          ))}
        </select>

        {/* Location Input */}
        {errors.location && <p className="error">{errors.location}</p>}
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        {/* Date Picker */}
        {errors.date && <p className="error">{errors.date}</p>}
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        {/* Rating Dropdown */}
        {errors.rating && <p className="error">{errors.rating}</p>}
        <select value={rating} onChange={(e) => setRating(e.target.value)}>
          <option value="">Select Rating</option>
          {[0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        {/* Description Text Area */}
        {errors.description && <p className="error">{errors.description}</p>}
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Published Toggle */}
        <div className="toggle-container">
          <span>Published: {published ? "Yes" : "No"}</span>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={published}
              onChange={() => setPublished(!published)}
            />
            <span className="slider"></span>
          </label>
        </div>

        {/* Submit Buttons */}
        <div className="button-sections">
          <button
            type="button"
            className="cancelbtn"
            onClick={() => navigate("/testimonials")}
          >
            Cancel
          </button>
          <button className="published" type="submit" disabled={loading}>
            {loading ? "Saving..." : id ? "Update" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTestimonial;
