import express from 'express';
import { getAllBlogs, addNewBlog, updateBlog, deleteBlog, getBlogById } from '../controllers/blog-controller.js';
const blogRouter = express.Router();

blogRouter.get("/get_all_blogs", getAllBlogs);
blogRouter.get("/get_blog_by_id/:id", getBlogById);
blogRouter.post("/add_new_blog", addNewBlog);
blogRouter.put("/update_blog/:id", updateBlog);
blogRouter.delete("/delete_blog/:id", deleteBlog);

export default blogRouter; 