const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
return !users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  // Generate a JWT token for the authenticated user
  const token = jwt.sign({ username }, "your_secret_key", { expiresIn: "1h" }); 
  req.session.token = token;

  return res.status(200).json({ message: "Login successful", token });
  // return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
  const { review } = req.body;

  if (!req.session.token) {
    return res.status(401).json({ message: "Unauthorized: Please log in to add a review" });
  }

  try {
    // Verify JWT token
    const decoded = jwt.verify(req.session.token, "your_secret_key");
    const username = decoded.username;

    // Check if the book exists
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Add or update the review for the book
    if (!books[isbn].reviews) {
      books[isbn].reviews = {};
    }
    books[isbn].reviews[username] = review;

    return res.status(200).json({
      message: "Review added/updated successfully",
      reviews: books[isbn].reviews
    });
  } catch (err) {
    return res.status(403).json({ message: "Forbidden: Invalid token" });
  }
  // return res.status(300).json({message: "Yet to be implemented"});
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;

  // Check if the user is logged in by validating the session token
  if (!req.session?.token) {
    return res.status(401).json({ message: "Unauthorized: Please log in to delete a review" });
  }

  try {
    // Verify JWT token
    const decoded = jwt.verify(req.session.token, process.env.JWT_SECRET || "your_secret_key");
    const username = decoded.username;

    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (!books[isbn].reviews || !books[isbn].reviews[username]) {
      return res.status(404).json({ message: "No review found for this book by the current user" });
    }

    delete books[isbn].reviews[username];

    return res.status(200).json({
      message: "Review deleted successfully",
      reviews: books[isbn].reviews,
    });
  } catch (err) {
    console.error("Error verifying token:", err.message);
    return res.status(403).json({ message: "Forbidden: Invalid token" });
  }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
