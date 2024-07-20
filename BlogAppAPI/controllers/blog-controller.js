import mongoose from "mongoose";
import Blog from "../models/Blog.js";
import User from "../models/User.js";

// Get all blogs
const getAllBlogs = async (request, response, next) => {
    let blogs;
    try {
        blogs = await Blog.find();
    } catch (error) {
        return response.status(500).json({
            message: "Something went wrong while fetching all the blogs form the database. Please try again later"
        });
    }
    if (!blogs) {
        return response.status(400).json({
            message: "No Blogs present in the database"
        });
    }
    return response.status(200).json({
        blogs
    })
}

const getBlogById = async (request, response, next) => {
    let blogId = request.params.id;
    let blog
    try {
        blog = await Blog.findById(blogId);
    } catch (error) {
        return response.status(500).json({
            message: "An error occurred while fetching data",
            error: error
        });
    }
    if (!blog) {
        return response.status(404).json({
            message: "No blog found with the given id"
        });
    }
    return response.status(200).json({
        message: "Blog Found Successfully",
        data: blog
    });
}

// Add new Blog
const addNewBlog = async (request, response, next) => {
    const { title, description, imageUrl, username } = request.body;
    console.log("1234567", username)
    let existingUser;
    try {
        existingUser = await User.findById(username);


    } catch (error) {
        console.log("error: ", error);
    }
    if (!existingUser) {
        return response.status(400).json({
            message: "Unable to find the user with this id"
        })
    }
    const newBlog = new Blog({ title, description, image: imageUrl, user: username });
    try {

        // await 
        const session = await mongoose.startSession();
        session.startTransaction();
        await newBlog.save({session});
       
        existingUser.blogs.push(newBlog);
        await existingUser.save({session});

        await session.commitTransaction();
    }
    catch (error) {
        return response.status(400).json({
            message: "Something went wrong"
        });
    }
    return response.status(201).json({
        newBlog, message: "Blog Created Successfully"
    })
}

// Update Blog
const updateBlog = async (req, res, next) => {
    const blogId = req.params.id;
    const { title, description } = req.body;
    let blog;
    try {
        blog = await Blog.findByIdAndUpdate(blogId, {
            title,
            description,
        });
    }
    catch (err) {
        res.status(400).json({
            message: "Something went Wrong while updating the blog"
        });
        console.log("error occurred: ", err);
    }
    if (!blog) {
        return res.status(500).json({
            message: "Could not find the blog.Unable to Update the blog",
        })
    }
    return res.status(200).json({
        message: "Successfully updated the blog",
        data: blog
    });
}

//Delete a blog
const deleteBlog = async (req, res, next) => {
    const blogId = req.params.id;
    let blog;
    try {
        blog = await Blog.findByIdAndDelete(blogId).populate('user');
        console.log(blog);
        await blog.user.blogs.pull(blog);
        await blog.user.save();
        
    } catch (error) {
        return res.status(404).json({ message: "Error deleting blog" });
    }
    if (!blog) {
        return res.status(500).json({ message: "Cannot get the blog with the given id: " + id });
    }
    return res.status(200).json({ message: "Blog Deleted Successfully", data: blog });
}
export {
    getAllBlogs, addNewBlog, updateBlog, deleteBlog, getBlogById
}