Book Review API
A RESTful API for managing books and user reviews, built with Node.js, Express.js, and MongoDB.
It supports user authentication with JWT, allowing users to add books, submit and manage reviews,and search for books by title or author.


Features

* User signup and login with JWT authentication
* Authenticated users can add books
* Public endpoints to fetch books with pagination and filtering
* Detailed book information including average ratings and paginated reviews
* Authenticated users can submit, update, and delete their own reviews
* Search books by title or author (partial and case-insensitive matching)
* Modular and clean codebase with environment variable configuration
* Comprehensive API documentation with example requests

Tech Stack

* Backend: Node.js, Express.js
* Database: MongoDB
* Authentication: JSON Web Tokens (JWT)

Installation & Setup
 
1. Clone the repository

git clone https://github.com/hasnahussain/book-review-api-new.git
cd book-review-api-new

2. Install dependencies

   npm install
   
3. Create a .env file in the root directory and add the following variables:

PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

4. Start the server

   npm start
   The API will be accessible at http://localhost:3000

API Endpoints

* Authentication
  POST /signup – Register a new user

  POST /login – Login and receive a JWT token

* Books
  POST /books – Add a new book (authenticated)

  GET /books – Get all books with pagination and filters

  GET /books/:id – Get detailed info about a specific book including average rating and paginated reviews

* Reviews
  POST /books/:id/reviews – Add a review for a book (authenticated)

  PUT /reviews/:id – Update own review (authenticated)

  DELETE /reviews/:id – Delete own review (authenticated)

* Search
  GET /search – Search books by title or author (partial, case-insensitive)

Database Schema Overview

* User
  Fields: username, email, password (hashed)
  Functionality: authentication and authorization

* Book
  Fields: title, author, description, publicationDate, etc.

* Review
  Fields: userId, bookId, rating, comment, createdAt
  
Example API Requests

   # Signup
POST /signup
{
  "username": "user1",
  "email": "user1@example.com",
  "password": "password123"
}

# Login
POST /login
{
  "email": "user1@example.com",
  "password": "password123"
}

# Add Book (Authenticated)
POST /books
Headers: Authorization: Bearer <token>
{
  "title": "Example Book",
  "author": "Author Name",
  "description": "Book description",
  "publicationDate": "2023-01-01"
}

# Search Books
GET /search?query=harry

Notes
Ensure you replace .env variables with your own MongoDB URI and JWT secret.

Use a tool like Postman or Insomnia to test API endpoints.

The project follows best practices for security and code organization.


