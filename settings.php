<?php
session_start();

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Not authenticated']);
    exit;
}

// Database connection
$host = 'localhost';
$dbname = 'shashank_os';
$username = 'root';
$password = '';

try {
    $db = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

// Get user ID from session
$user_id = $_SESSION['user_id'];

// Handle different operations based on the action parameter
$action = $_GET['action'] ?? '';

switch ($action) {
    case 'get_settings':
        getSettings();
        break;
    case 'update_theme':
        $theme = $_POST['theme'] ?? 'light';
        updateTheme($theme);
        break;
    case 'update_wallpaper':
        $wallpaper = $_POST['wallpaper'] ?? 'default';
        updateWallpaper($wallpaper);
        break;
    case 'update_notes':
        $notes = $_POST['notes'] ?? '';
        updateNotes($notes);
        break;
    default:
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Invalid action']);
        exit;
}

// Function to get user settings
function getSettings() {
    global $db, $user_id;
    
    try {
        $stmt = $db->prepare("SELECT * FROM user_settings WHERE user_id = :user_id");
        $stmt->bindParam(':user_id', $user_id);
        $stmt->execute();
        
        $settings = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$settings) {
            // Create default settings if not exists
            $stmt = $db->prepare("INSERT INTO user_settings (user_id, theme, wallpaper, notes) VALUES (:user_id, 'light', 'default', 'Welcome to Shashank OS!')");
            $stmt->bindParam(':user_id', $user_id);
            $stmt->execute();
            
            $settings = [
                'theme' => 'light',
                'wallpaper' => 'default',
                'notes' => 'Welcome to Shashank OS!'
            ];
        }
        
        header('Content-Type: application/json');
        echo json_encode(['settings' => $settings]);
    } catch(PDOException $e) {
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Failed to get settings']);
    }
}

// Function to update theme
function updateTheme($theme) {
    global $db, $user_id;
    
    try {
        $stmt = $db->prepare("UPDATE user_settings SET theme = :theme WHERE user_id = :user_id");
        $stmt->bindParam(':theme', $theme);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->execute();
        
        header('Content-Type: application/json');
        echo json_encode(['success' => true]);
    } catch(PDOException $e) {
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Failed to update theme']);
    }
}

// Function to update wallpaper
function updateWallpaper($wallpaper) {
    global $db, $user_id;
    
    try {
        $stmt = $db->prepare("UPDATE user_settings SET wallpaper = :wallpaper WHERE user_id = :user_id");
        $stmt->bindParam(':wallpaper', $wallpaper);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->execute();
        
        header('Content-Type: application/json');
        echo json_encode(['success' => true]);
    } catch(PDOException $e) {
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Failed to update wallpaper']);
    }
}

// Function to update notes
function updateNotes($notes) {
    global $db, $user_id;
    
    try {
        $stmt = $db->prepare("UPDATE user_settings SET notes = :notes WHERE user_id = :user_id");
        $stmt->bindParam(':notes', $notes);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->execute();
        
        header('Content-Type: application/json');
        echo json_encode(['success' => true]);
    } catch(PDOException $e) {
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Failed to update notes']);
    }
}
?>