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
    case 'list_folders':
        listFolders();
        break;
    case 'list_files':
        $folder_id = $_GET['folder_id'] ?? null;
        listFiles($folder_id);
        break;
    case 'create_folder':
        $folder_name = $_POST['folder_name'] ?? '';
        $parent_id = $_POST['parent_id'] ?? null;
        createFolder($folder_name, $parent_id);
        break;
    case 'create_file':
        $file_name = $_POST['file_name'] ?? '';
        $folder_id = $_POST['folder_id'] ?? null;
        $content = $_POST['content'] ?? '';
        $file_type = $_POST['file_type'] ?? 'text';
        createFile($file_name, $folder_id, $content, $file_type);
        break;
    case 'update_file':
        $file_id = $_POST['file_id'] ?? null;
        $content = $_POST['content'] ?? '';
        updateFile($file_id, $content);
        break;
    case 'delete_file':
        $file_id = $_POST['file_id'] ?? null;
        deleteFile($file_id);
        break;
    case 'delete_folder':
        $folder_id = $_POST['folder_id'] ?? null;
        deleteFolder($folder_id);
        break;
    case 'rename_file':
        $file_id = $_POST['file_id'] ?? null;
        $new_name = $_POST['new_name'] ?? '';
        renameFile($file_id, $new_name);
        break;
    case 'rename_folder':
        $folder_id = $_POST['folder_id'] ?? null;
        $new_name = $_POST['new_name'] ?? '';
        renameFolder($folder_id, $new_name);
        break;
    default:
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Invalid action']);
        exit;
}

// Function to list all folders for the current user
function listFolders() {
    global $db, $user_id;
    
    try {
        $stmt = $db->prepare("SELECT * FROM user_folders WHERE user_id = :user_id ORDER BY folder_name");
        $stmt->bindParam(':user_id', $user_id);
        $stmt->execute();
        
        $folders = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        header('Content-Type: application/json');
        echo json_encode(['folders' => $folders]);
    } catch(PDOException $e) {
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Failed to list folders']);
    }
}

// Function to list files in a folder
function listFiles($folder_id) {
    global $db, $user_id;
    
    try {
        $stmt = $db->prepare("SELECT * FROM user_files WHERE user_id = :user_id AND folder_id = :folder_id ORDER BY filename");
        $stmt->bindParam(':user_id', $user_id);
        $stmt->bindParam(':folder_id', $folder_id);
        $stmt->execute();
        
        $files = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        header('Content-Type: application/json');
        echo json_encode(['files' => $files]);
    } catch(PDOException $e) {
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Failed to list files']);
    }
}

// Function to create a new folder
function createFolder($folder_name, $parent_id) {
    global $db, $user_id;
    
    if (empty($folder_name)) {
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Folder name is required']);
        return;
    }
    
    try {
        $stmt = $db->prepare("INSERT INTO user_folders (user_id, folder_name, parent_folder_id, created_at) VALUES (:user_id, :folder_name, :parent_id, NOW())");
        $stmt->bindParam(':user_id', $user_id);
        $stmt->bindParam(':folder_name', $folder_name);
        $stmt->bindParam(':parent_id', $parent_id);
        $stmt->execute();
        
        $folder_id = $db->lastInsertId();
        
        header('Content-Type: application/json');
        echo json_encode(['success' => true, 'folder_id' => $folder_id]);
    } catch(PDOException $e) {
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Failed to create folder']);
    }
}

// Function to create a new file
function createFile($file_name, $folder_id, $content, $file_type) {
    global $db, $user_id;
    
    if (empty($file_name)) {
        header('Content-Type: application/json');
        echo json_encode(['error' => 'File name is required']);
        return;
    }
    
    try {
        $file_path = "user_{$user_id}/{$file_name}";
        $file_size = strlen($content);
        
        $stmt = $db->prepare("INSERT INTO user_files (user_id, filename, file_path, file_type, file_size, content, created_at) VALUES (:user_id, :filename, :file_path, :file_type, :file_size, :content, NOW())");
        $stmt->bindParam(':user_id', $user_id);
        $stmt->bindParam(':filename', $file_name);
        $stmt->bindParam(':file_path', $file_path);
        $stmt->bindParam(':file_type', $file_type);
        $stmt->bindParam(':file_size', $file_size);
        $stmt->bindParam(':content', $content);
        $stmt->execute();
        
        $file_id = $db->lastInsertId();
        
        header('Content-Type: application/json');
        echo json_encode(['success' => true, 'file_id' => $file_id]);
    } catch(PDOException $e) {
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Failed to create file']);
    }
}

// Function to update a file's content
function updateFile($file_id, $content) {
    global $db, $user_id;
    
    if (empty($file_id)) {
        header('Content-Type: application/json');
        echo json_encode(['error' => 'File ID is required']);
        return;
    }
    
    try {
        $file_size = strlen($content);
        
        $stmt = $db->prepare("UPDATE user_files SET content = :content, file_size = :file_size WHERE id = :file_id AND user_id = :user_id");
        $stmt->bindParam(':content', $content);
        $stmt->bindParam(':file_size', $file_size);
        $stmt->bindParam(':file_id', $file_id);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->execute();
        
        header('Content-Type: application/json');
        echo json_encode(['success' => true]);
    } catch(PDOException $e) {
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Failed to update file']);
    }
}

// Function to delete a file
function deleteFile($file_id) {
    global $db, $user_id;
    
    if (empty($file_id)) {
        header('Content-Type: application/json');
        echo json_encode(['error' => 'File ID is required']);
        return;
    }
    
    try {
        $stmt = $db->prepare("DELETE FROM user_files WHERE id = :file_id AND user_id = :user_id");
        $stmt->bindParam(':file_id', $file_id);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->execute();
        
        header('Content-Type: application/json');
        echo json_encode(['success' => true]);
    } catch(PDOException $e) {
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Failed to delete file']);
    }
}

// Function to delete a folder
function deleteFolder($folder_id) {
    global $db, $user_id;
    
    if (empty($folder_id)) {
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Folder ID is required']);
        return;
    }
    
    try {
        // Start a transaction
        $db->beginTransaction();
        
        // Delete all files in the folder
        $stmt = $db->prepare("DELETE FROM user_files WHERE folder_id = :folder_id AND user_id = :user_id");
        $stmt->bindParam(':folder_id', $folder_id);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->execute();
        
        // Delete the folder
        $stmt = $db->prepare("DELETE FROM user_folders WHERE id = :folder_id AND user_id = :user_id");
        $stmt->bindParam(':folder_id', $folder_id);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->execute();
        
        // Commit the transaction
        $db->commit();
        
        header('Content-Type: application/json');
        echo json_encode(['success' => true]);
    } catch(PDOException $e) {
        // Rollback the transaction on error
        $db->rollBack();
        
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Failed to delete folder']);
    }
}

// Function to rename a file
function renameFile($file_id, $new_name) {
    global $db, $user_id;
    
    if (empty($file_id) || empty($new_name)) {
        header('Content-Type: application/json');
        echo json_encode(['error' => 'File ID and new name are required']);
        return;
    }
    
    try {
        $stmt = $db->prepare("UPDATE user_files SET filename = :new_name WHERE id = :file_id AND user_id = :user_id");
        $stmt->bindParam(':new_name', $new_name);
        $stmt->bindParam(':file_id', $file_id);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->execute();
        
        header('Content-Type: application/json');
        echo json_encode(['success' => true]);
    } catch(PDOException $e) {
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Failed to rename file']);
    }
}

// Function to rename a folder
function renameFolder($folder_id, $new_name) {
    global $db, $user_id;
    
    if (empty($folder_id) || empty($new_name)) {
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Folder ID and new name are required']);
        return;
    }
    
    try {
        $stmt = $db->prepare("UPDATE user_folders SET folder_name = :new_name WHERE id = :folder_id AND user_id = :user_id");
        $stmt->bindParam(':new_name', $new_name);
        $stmt->bindParam(':folder_id', $folder_id);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->execute();
        
        header('Content-Type: application/json');
        echo json_encode(['success' => true]);
    } catch(PDOException $e) {
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Failed to rename folder']);
    }
}
?>