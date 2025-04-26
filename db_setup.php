<?php
// Database connection parameters
$host = 'localhost';
$username = 'root';
$password = '';
$dbname = "shashank_os";

try {
    // Connect to MySQL server
    $pdo = new PDO("mysql:host=$host", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "Connected to MySQL server successfully.<br>";
    
    // Read SQL file
    $sql = file_get_contents('setup_database.sql');
    
    // Execute SQL commands
    $pdo->exec($sql);
    
    echo "Database and tables created successfully.<br>";
    echo "You can now use the Shashank OS with login functionality.<br>";
    echo "<a href='login.html'>Go to Login Page</a>";
    
} catch(PDOException $e) {
    die("Database setup failed: " . $e->getMessage());
}
?>