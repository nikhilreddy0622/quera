const express = require("express");
const app = express();
const path = require("path");
const port = 3000;
const mongoose = require("mongoose");
const Post = require("./models/post.js"); // Import the Post model
const methodOverride = require('method-override');
require('dotenv').config(); // Load environment variables

// Connect to MongoDB
async function main() {
    await mongoose.connect(process.env.ATLSDB_URL); // Use the connection string from .env
    console.log("Connection successful");
}

main().catch(err => console.log(err));

// Set up middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

// Home route
app.get("/", (req, res) => {
    res.send("This is your home page");
});

// Get all posts
app.get("/posts", async (req, res) => {
    const posts = await Post.find(); // Fetch posts from the database
    console.log(posts); // Log the fetched posts
    res.render("posts.ejs", { posts }); // Render the EJS template with the posts data
});

// Show form to create a new post
app.get("/posts/new", (req, res) => {
    res.render("new.ejs");
});

// Create a new post
app.post("/posts", async (req, res) => {
    const { username, content } = req.body; // Get data from the request body
    const newPost = new Post({
        username: username,
        content: content,
        created_at: new Date() // Set the current date
    });

    await newPost.save() // Save to the database
        .then(() => {
            console.log("Post was saved"); // Log success message
            res.redirect("/posts"); // Redirect to the posts page
        })
        .catch(err => {
            console.error("Error saving post:", err); // Log any errors
            res.status(500).send("Error saving post"); // Send error response
        });
});

// Show a specific post
app.get('/posts/:id', async (req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id); // Fetch post by ID
    res.render('show', { post });
});

// Delete a post
app.delete('/posts/:id', async (req, res) => {
    const { id } = req.params;
    await Post.findByIdAndDelete(id); // Remove the post with the matching ID
    res.redirect('/posts'); // Redirect to the list of posts
});

// Render form to edit a post
app.get('/posts/:id/edit', async (req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id); // Fetch post by ID
    res.render('edit', { post });
});

// Handle updating a post
app.patch('/posts/:id', async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    await Post.findByIdAndUpdate(id, { content: content }); // Update the post's content
    res.redirect(`/posts/${id}`); // Redirect to the updated post
});

// Start the server
app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});
