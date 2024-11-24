const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (!isValid(username)) {
    return res.status(400).json({ message: "Username is already taken" });
  }

  // Add the new user to the users list
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
  // return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  // return res.status(200).json({ books });
  // return res.status(300).json({message: "Yet to be implemented"});


    try {
    
    const response = await axios.get("http://example.com/api/books");

    if (!response || !response.data) {
      return res.status(200).json({ books });
    }

    return res.status(200).json({ books: response.data });
  } catch (error) {
    console.error("Error fetching books:", error.message);
    return res.status(500).json({ message: "Failed to fetch books" });
  }

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
//     const { isbn } = req.params;
//   const book = books[isbn];

//   if (book) {
//     return res.status(200).json(book);
//   } else {
//     return res.status(404).json({ message: "Book not found" });
  //   }
  

  const { isbn } = req.params;

  try {
    const fetchBookByISBN = async (isbn) => {
      return new Promise((resolve, reject) => {
        const book = books[isbn];
        if (book) {
          resolve(book);
        } else {
          reject("Book not found");
        }
      });
    };
    const book = await fetchBookByISBN(isbn);
    return res.status(200).json(book);
  } catch (error) {
    // Handle errors
    return res.status(404).json({ message: error });
  }

//   // return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  //   const { author } = req.params;
  // const filteredBooks = Object.values(books).filter(book => book.author.toLowerCase() === author.toLowerCase());

  // if (filteredBooks.length > 0) {
  //   return res.status(200).json(filteredBooks);
  // } else {
  //   return res.status(404).json({ message: "No books found for the specified author" });
  // }

  const { author } = req.params;

  try {
    const response = await axios.get('https://your-api-endpoint/books');
    const filteredBooks = response.data.filter(
      (book) => book.author.toLowerCase() === author.toLowerCase()
    );

    if (filteredBooks.length > 0) {
      return res.status(200).json(filteredBooks);
    } else {
      return res.status(404).json({ message: "No books found for the specified author" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching books" });
  }



  // return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  //   const { title } = req.params;
  // const filteredBooks = Object.values(books).filter(book => book.title.toLowerCase().includes(title.toLowerCase()));

  // if (filteredBooks.length > 0) {
  //   return res.status(200).json(filteredBooks);
  // } else {
  //   return res.status(404).json({ message: "No books found for the specified title" });
  // }


    const { title } = req.params;

  try {
    const response = await axios.get('https://your-api-endpoint/books');  
    const filteredBooks = response.data.filter(
      (book) => book.title.toLowerCase().includes(title.toLowerCase())
    );

    if (filteredBooks.length > 0) {
      return res.status(200).json(filteredBooks);
    } else {
      return res.status(404).json({ message: "No books found for the specified title" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching books" });
  }


  // return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const { isbn } = req.params;
  const book = books[isbn];

  if (book && book.reviews) {
    return res.status(200).json(book.reviews);
  } else if (book) {
    return res.status(200).json({ message: "No reviews available for this book" });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
  // return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
