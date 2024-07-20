// app.js
import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import mongoose from 'mongoose';
import { userRouter } from './routes/user-routes.js';
import dotenv from 'dotenv'
import blogRouter from './routes/blog-routes.js';
dotenv.config();
const app = express();
app.use(express.json());
//Routes Filtering
app.use("/api/user", userRouter);
app.use("/api/blog", blogRouter);

mongoose.connect(process.env.CONNECTION_STRING)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log("App successfully started at Port number :", process.env.PORT);
        });
    }).catch((error) => {
        console.log("The error is:   ", error)
    });

// app.use((request, response, next) => {
//     response.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
// });
