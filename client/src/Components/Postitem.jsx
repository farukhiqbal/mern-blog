import React from "react";
import { Link } from "react-router-dom";
import PostAuthor from "./PostAuthor";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Postitem = ({
  postID,
  category,
  title,
  description,
  authorID,
  thumbnail,
  createdAt,
}) => {
  // Shorten the title to 30 characters with ellipsis if it's too long
  const shortTitle = title.length > 30 ? `${title.substring(0, 30)}...` : title;

  // Shorten the description to 145 characters with ellipsis if it's too long
  // Note: For HTML content, consider truncating the raw text before converting to HTML
  const shortDescription =
    description.length > 145
      ? `${description.substring(0, 145)}...`
      : description;

  return (
    <article className="post">
      <div className="post_thumbnail">
        <img
          src={`${process.env.REACT_APP_BASE_URL}/uploads/${thumbnail}`}
          alt={title}
        />
      </div>

      <div className="post_content">
        <Link to={`/posts/${postID}`}>
          <h3>{shortTitle}</h3>
        </Link>

        <p
          className="card-text text-[1rem]"
          dangerouslySetInnerHTML={{ __html: shortDescription }}
        />

        <div className="post_footer">
          <PostAuthor authorID={authorID} createdAt={createdAt} />
          <Link
            to={`${process.env.REACT_APP_BASE_URL}/Posts/categories/${category}`}
            className="btn category"
          >
            {category}
          </Link>
        </div>
      </div>
    </article>
  );
};

export default Postitem;
