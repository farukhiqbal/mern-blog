import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../Components/Loader";
import Postitem from "../Components/Postitem";
import { useParams } from "react-router-dom";

const CategoryPost = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const { category } = useParams();

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/posts/categories/${category}`
        );
        setPosts(response?.data);
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    };
    fetchPosts();
  }, [category]);

  if (loading) {
    return <Loader />;
  }

  return (
    <section className="posts">
      {posts.length > 0 ? (
        <div className="container posts_container">
          {posts.map(
            ({
              _id: id,
              thumbnail,
              title,
              description,
              category,
              creator,
              createdAt,
            }) => (
              <Postitem
                key={id}
                postID={id}
                thumbnail={thumbnail}
                category={category}
                title={title}
                description={description}
                authorID={creator}
                createdAt={createdAt}
              />
            )
          )}
        </div>
      ) : (
        <h2 className="center">No posts founds</h2>
      )}
    </section>
  );
};

export default CategoryPost;
