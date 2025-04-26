<?php
session_start();

// Database connection
$host = 'localhost';
$dbname = 'shashank_os';
$username = 'root';
$password = '';

try {
    $db = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}

// Function to redirect with error message
function redirectWithError($message) {
    $_SESSION['error'] = $message;
    header('Location: login.html');
    exit;
}

// Function to redirect with success message
function redirectWithSuccess($message) {
    $_SESSION['success'] = $message;
    header('Location: login.html');
    exit;
}

// Handle login
if (isset($_POST['login'])) {
    $username = trim($_POST['username']);
    $password = $_POST['password'];
    $remember = isset($_POST['remember']) ? true : false;
    
    if (empty($username) || empty($password)) {
        redirectWithError('Please enter both username and password');
    }
    
    // Check if user exists
    $stmt = $db->prepare("SELECT * FROM users WHERE username = :username");
    $stmt->bindParam(':username', $username);
    $stmt->execute();
    
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($user && password_verify($password, $user['password'])) {
        // Login successful
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        
        // Set remember me cookie if checked
        if ($remember) {
            $token = bin2hex(random_bytes(32));
            
            // Store token in database
            $stmt = $db->prepare("UPDATE users SET remember_token = :token WHERE id = :id");
            $stmt->bindParam(':token', $token);
            $stmt->bindParam(':id', $user['id']);
            $stmt->execute();
            
            // Set cookie for 30 days
            setcookie('remember_token', $token, time() + (86400 * 30), '/');
        }
        
        // Redirect to main OS
        header('Location: index.html');
        exit;
    } else {
        redirectWithError('Invalid username or password');
    }
}

// Handle signup
if (isset($_POST['signup'])) {
    $username = trim($_POST['username']);
    $email = trim($_POST['email']);
    $password = $_POST['password'];
    $confirm_password = $_POST['confirm_password'];
    
    // Validate input
    if (empty($username) || empty($email) || empty($password) || empty($confirm_password)) {
        redirectWithError('All fields are required');
    }
    
    if ($password !== $confirm_password) {
        redirectWithError('Passwords do not match');
    }
    
    if (strlen($password) < 6) {
        redirectWithError('Password must be at least 6 characters long');
    }
    
    // Check if username already exists
    $stmt = $db->prepare("SELECT * FROM users WHERE username = :username");
    $stmt->bindParam(':username', $username);
    $stmt->execute();
    
    if ($stmt->rowCount() > 0) {
        redirectWithError('Username already exists');
    }
    
    // Check if email already exists
    $stmt = $db->prepare("SELECT * FROM users WHERE email = :email");
    $stmt->bindParam(':email', $email);
    $stmt->execute();
    
    if ($stmt->rowCount() > 0) {
        redirectWithError('Email already exists');
    }
    
    // Hash password
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    
    // Insert new user
    $stmt = $db->prepare("INSERT INTO users (username, email, password, created_at) VALUES (:username, :email, :password, NOW())");
    $stmt->bindParam(':username', $username);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':password', $hashed_password);
    
    try {
        $stmt->execute();
        redirectWithSuccess('Account created successfully. You can now log in.');
    } catch(PDOException $e) {
        redirectWithError('Error creating account: ' . $e->getMessage());
    }
}

// Handle logout
if (isset($_GET['logout'])) {
    // Clear session
    session_unset();
    session_destroy();
    
    // Clear remember me cookie
    if (isset($_COOKIE['remember_token'])) {
        setcookie('remember_token', '', time() - 3600, '/');
    }
    
    // Redirect to login page
    header('Location: login.html');
    exit;
}

// Auto-login with remember me token
if (!isset($_SESSION['user_id']) && isset($_COOKIE['remember_token'])) {
    $token = $_COOKIE['remember_token'];
    
    $stmt = $db->prepare("SELECT * FROM users WHERE remember_token = :token");
    $stmt->bindParam(':token', $token);
    $stmt->execute();
    
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($user) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        
        // Redirect to main OS if on login page
        $current_page = basename($_SERVER['PHP_SELF']);
        if ($current_page === 'login.html') {
            header('Location: index.html');
            exit;
        }
    }
}
?>