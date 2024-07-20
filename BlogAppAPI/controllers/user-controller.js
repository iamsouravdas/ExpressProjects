import User from "../models/User.js";
import byCrypt from "bcryptjs"

//getting all Users
const getAllUser = async (request, response, next) => {
    let users;

    try {
        users = await User.find();
    } catch (error) {
        console.log("The error did happened at controller level", error);
    }
    if (!users) {
        return response.status(404).json({
            message: "No records found"
        })
    }
    return response.status(200).json({
        users
    });
}

// Create new user 
const signup = async (request, response, next) => {
    const { name, email, password } = request.body;
    let existingUser;
    try {
        // Find whether the user is present or not
        existingUser = await User.findOne({ email });
    } catch (error) {
        console.log("The error occurred at the controller level", error);
    }
    if (existingUser) {
        return response.status(404).json({
            message: "User already exist"
        });
    }
    const hashedPassword = byCrypt.hashSync(password)
    // Create a new user if the user doesn't exist
    const user = new User({ name, email, password: hashedPassword, blogs: [] });
    try {
        await user.save();
    }
    catch (error) {
        console.log("An error occurred while creating a new user", error);
    }
    return response.status(201).json({
        user,
        message: "User Created  Successfully"
    });
}

// login fuction
const login = async (req, res, next) => {
    const { email, password } = req.body;
    let existingUser;
    try {
        existingUser = await User.findOne({ email });
    }
    catch (error) {
        console.log("The error occurred in the controller level", error);
    }
    if (!existingUser) {
        return res.status(404).json({
            message: "The user does not exist"
        });
    }
    const comparePassword = byCrypt.compareSync(password, existingUser.password);
    if (!comparePassword) {
        return res.status(404).json({ message: "Incorrect password" });
    }
    return res.status(200).json({ existingUser, message: "Login Successfull" });
}


export {
    getAllUser, signup, login
}