import mongoose from "mongoose";
import fs from "fs";
import Blog from "../models/Blog.js"; // Adjust the path if necessary

mongoose.connect("mongodb+srv://USER123:HI1234@cluster0.tzonia2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {});

// Function to clean and transform blog data
const cleanData = (blogs) => {
  return blogs.map((blog) => {
    if (blog._id && typeof blog._id === "object" && blog._id.$oid) {
      blog._id = new mongoose.Types.ObjectId(blog._id.$oid);
    }
    return blog;
  });
};

const importData = async () => {
  try {
    // Read and parse JSON file
    let blogs = JSON.parse(fs.readFileSync("./PetConnect.blogs.json", "utf-8"));

    // Convert `_id` field to valid ObjectId format
    blogs = cleanData(blogs);
    
    // Insert data into MongoDB
    await Blog.insertMany(blogs);
    console.log("✅ Blogs Imported Successfully");
  } catch (error) {
    console.error("❌ Error importing blogs:", error);
  } finally {
    mongoose.connection.close();
  }
};

importData();
