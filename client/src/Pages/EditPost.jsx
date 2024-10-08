import React, { useEffect, useState, useContext } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../context/userContext";
import axios from "axios";

const EditPost = () => {
  const [title, setTitle] = useState("");
  const [category, setcategory] = useState("Uncategorized");
  const [description, setdescription] = useState("");
  const [thumbnail, setthumbnail] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { id } = useParams();

  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  //
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, []);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["blod", "italic", "underline", "strike", "blockqoute"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "blod",
    "italic",
    "underline",
    "strike",
    "blockqoute",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];

  const POST_CATEGORIES = [
    "Agriculture",
    "Business",
    "Education",
    "Entertainment",
    "Art",
    "Investment",
    "Uncategorized",
    "Weather",
  ];

  useEffect(() => {
    const getPost = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/posts/${id}`
        );
        setTitle(response.data.title);
        setdescription(response.data.description);
      } catch (error) {
        console.log(error);
      }
    };
    getPost();
  }, []);

  const editPost = async (e) => {
    e.preventDefault();
    const postData = new FormData();
    postData.set("title", title);
    postData.set("category", category);
    postData.set("description", description);
    postData.set("thumbnail", thumbnail);
  
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_BASE_URL}/posts/${id}`,
        postData,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        return navigate("/");
      }
    } catch (err) {
      // Check if err.response exists before accessing it
      if (err.response && err.response.data) {
        setError(err.response.data.message);
      } else {
        setError("An error occurred while updating the post.");
        console.error("Error details:", err);
      }
    }
  };
  

  return (
    <section className="create-post">
      <div className="container">
        <h2>Edit Post</h2>
        {error && <p className="form_error-message">{error}</p>}

        <form className="form create-post_form" onSubmit={editPost}>
          <input
            type="text"
            name=""
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />

          <select
            name="category"
            value={category}
            onChange={(e) => setcategory(e.target.value)}
          >
            {POST_CATEGORIES.map((cat) => (
              <option key={cat}> {cat}</option>
            ))}
          </select>

          <ReactQuill
            modules={modules}
            formats={formats}
            value={description}
            onChange={setdescription}
          />
          <input
            type="file"
            onChange={(e) => setthumbnail(e.target.files[0])}
            accept="png,jpg,jpeg"
          />

          <button type="submit" className="btn primary">
            Update{" "}
          </button>
        </form>
      </div>
    </section>
  );
};

export default EditPost;
