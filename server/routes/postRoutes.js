import express from 'express';
import * as dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

import Post from '../mongodb/models/post.js';

dotenv.config();

const router = express.Router();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

//Get All Posts 
router.route('/').get(async (req, res) => {
    try {
        const posts = await Post.find({});
        res.status(200).json({
            success: true,
            data: posts
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error
        })
    }
})

//Create a Post
router.route('/').post(async (req, res) => {
    try {
        console.log("Inside the backend try block");
        const { name, prompt, photo } = req.body;
        console.log("name is ", name);
        console.log("prompt is ", prompt);
        // console.log("photo is ", photo);
        const photoUrl = await cloudinary.uploader.upload(photo);
        // const photoUrl = await cloudinary.uploader.upload('https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg', { public_id: "olympic_flag" })



        const newPost = await Post.create({
            name,
            prompt,
            photo: photoUrl.url,
        })

        console.log("newPost is ", newPost);
        res.status(201).json({
            success: true,
            data: newPost,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error
        })
    }
})

export default router;