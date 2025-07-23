import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function BlogPage() {
  const blogPosts = [
    {
      title: "Introducing Our Latest Project",
      date: "September 23, 2023",
      summary: "We're thrilled to announce our latest project, which aims to revolutionize the gaming industry. Read on to find out more about its features and what sets it apart."
    },
    {
      title: "Behind the Scenes: Game Development",
      date: "August 15, 2023",
      summary: "Ever wondered what goes into developing a game? Join us as we take a deep dive into the world of game development, from concept to release."
    },
    // ... more blog posts ...
  ];

  return (
    <div className="blog-page">
      <h1>Blog</h1>
      {blogPosts.map((post, index) => (
        <div key={index} className="blog-post">
          <h2>{post.title}</h2>
          <p><em>{post.date}</em></p>
          <p>{post.summary}</p>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default BlogPage;
