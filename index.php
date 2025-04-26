<?php
session_start();

// Check if user is logged in
if (isset($_SESSION['user_id'])) {
    // User is logged in, redirect to OS interface
    header('Location: index.html');
    exit;
} else {
    // Check for remember me cookie
    if (isset($_COOKIE['remember_token'])) {
        // Include auth.php to handle auto-login
        include 'auth.php';
        
        // If still not logged in after auto-login attempt, redirect to login page
        if (!isset($_SESSION['user_id'])) {
            header('Location: login.html');
            exit;
        }
    } else {
        // Not logged in, redirect to login page
        header('Location: login.html');
        exit;
    }
}
?>