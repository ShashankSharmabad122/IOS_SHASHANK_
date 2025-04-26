# Shashank OS

A web-based operating system interface with login/signup functionality and SQL database integration.

## Setup Instructions

1. Make sure you have a local web server (like XAMPP, WAMP, or MAMP) installed and running.
2. Place all files in your web server's document root (e.g., htdocs for XAMPP).
3. Create the database by visiting `db_setup.php` in your browser (e.g., http://localhost/exp1/db_setup.php).
4. After database setup is complete, navigate to the main application (e.g., http://localhost/exp1/).
5. You will be redirected to the login page where you can create a new account or log in.

## Features

- User authentication system (login/signup)
- Remember me functionality
- Secure password hashing
- User-specific settings and files
- Virtual file system with database storage
- Modern UI with desktop-like interface

## Database Structure

- **users**: Stores user account information
- **user_settings**: Stores user preferences
- **user_files**: Stores virtual files
- **user_folders**: Stores folder structure

## Technologies Used

- HTML/CSS/JavaScript for frontend
- PHP for backend
- MySQL for database
- PDO for database connections

## Security Features

- Password hashing using PHP's password_hash()
- Session-based authentication
- Remember me tokens
- Input validation and sanitization