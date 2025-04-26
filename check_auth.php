<?php
session_start();

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    // Check for remember me cookie
    if (isset($_COOKIE['remember_token'])) {
        // Include auth.php to handle auto-login
        include 'auth.php';
    } else {
        // Not logged in, redirect to login page
        header('Location: login.html');
        exit;
    }
}
?>