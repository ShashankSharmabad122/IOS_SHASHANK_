-- Create database
CREATE DATABASE IF NOT EXISTS shashank_os;

-- Use the database
USE shashank_os;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    remember_token VARCHAR(100) DEFAULT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create user_settings table
CREATE TABLE IF NOT EXISTS user_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    theme VARCHAR(20) DEFAULT 'light',
    wallpaper VARCHAR(100) DEFAULT 'default',
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create user_files table to store virtual files
CREATE TABLE IF NOT EXISTS user_files (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size INT DEFAULT 0,
    content LONGTEXT,
    created_at DATETIME NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create user_folders table
CREATE TABLE IF NOT EXISTS user_folders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    folder_name VARCHAR(255) NOT NULL,
    parent_folder_id INT DEFAULT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_folder_id) REFERENCES user_folders(id) ON DELETE CASCADE
);

-- Create default folders for new users
DELIMITER //
CREATE TRIGGER after_user_insert
AFTER INSERT ON users
FOR EACH ROW
BEGIN
    -- Insert default folders
    INSERT INTO user_folders (user_id, folder_name, parent_folder_id, created_at)
    VALUES 
        (NEW.id, 'Desktop', NULL, NOW()),
        (NEW.id, 'Documents', NULL, NOW()),
        (NEW.id, 'Downloads', NULL, NOW()),
        (NEW.id, 'Pictures', NULL, NOW()),
        (NEW.id, 'Music', NULL, NOW()),
        (NEW.id, 'Videos', NULL, NOW());
    
    -- Create default settings
    INSERT INTO user_settings (user_id, theme, wallpaper, notes)
    VALUES (NEW.id, 'light', 'default', 'Welcome to Shashank OS!');
END //
DELIMITER ;