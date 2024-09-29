const mongoose = require("mongoose");
const Post = require("./models/post.js"); // Import the Post model

// Connect to MongoDB
async function main() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/test");
        console.log("Connection successful");

        // Define default posts
        const defaultPosts = [
            {
                username: "Neha",
                content: "What strategies do you use to study effectively?",
                created_at: new Date()
            },
            {
                username: "Nikhil",
                content: "I usually make a study schedule.",
                created_at: new Date()
            },
            {
                username: "Manohar",
                content: "I find flashcards really helpful.",
                created_at: new Date()
            },
            {
                username: "Supradeep",
                content: "Group study sessions work for me.",
                created_at: new Date()
            },
            {
                username: "Priya",
                content: "I take regular breaks to stay focused.",
                created_at: new Date()
            },
        ];

        // Insert default posts into the database
        await Post.insertMany(defaultPosts);
        console.log("Default posts inserted successfully");
    } catch (err) {
        console.error("Error:", err);
    } finally {
        mongoose.connection.close(); // Close the connection
    }
}

main();
