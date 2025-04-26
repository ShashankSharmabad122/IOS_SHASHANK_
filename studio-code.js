// ShashankOS Studio Code

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the editor
    initializeEditor();
    
    // Initialize activity bar
    initializeActivityBar();
    
    // Initialize folder tree
    initializeFolderTree();
    
    // Initialize tabs
    initializeTabs();
    
    // Initialize keyboard shortcuts
    initializeKeyboardShortcuts();
    
    // Initialize command palette
    initializeCommandPalette();
});

// Initialize the Ace editor
function initializeEditor() {
    const editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.session.setMode("ace/mode/markdown");
    editor.setOptions({
        fontSize: "14px",
        fontFamily: "Consolas, 'Courier New', monospace",
        showPrintMargin: false,
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true
    });
    
    // Set initial content
    editor.setValue(`# Welcome to ShashankOS Studio Code

A lightweight code editor inspired by Visual Studio Code.

## Features

- Syntax highlighting
- File explorer
- Tabs
- Command palette
- Keyboard shortcuts
- Themes

## Getting Started

1. Click on a file in the explorer to open it
2. Use Ctrl+P to open the command palette
3. Use Ctrl+S to save your work
4. Use Ctrl+F to find text

Happy coding!
`, -1);
    
    // Update status bar with cursor position
    editor.selection.on('changeCursor', function() {
        const cursorPosition = editor.selection.getCursor();
        document.querySelector('.status-right .status-item:nth-child(4)').innerHTML = 
            `<span>Ln ${cursorPosition.row + 1}, Col ${cursorPosition.column + 1}</span>`;
    });
    
    // Update language mode based on file extension
    window.changeEditorMode = function(filename) {
        const extension = filename.split('.').pop().toLowerCase();
        let mode;
        
        switch(extension) {
            case 'html':
                mode = 'ace/mode/html';
                break;
            case 'css':
                mode = 'ace/mode/css';
                break;
            case 'js':
                mode = 'ace/mode/javascript';
                break;
            case 'json':
                mode = 'ace/mode/json';
                break;
            case 'php':
                mode = 'ace/mode/php';
                break;
            case 'md':
                mode = 'ace/mode/markdown';
                break;
            default:
                mode = 'ace/mode/text';
        }
        
        editor.session.setMode(mode);
        
        // Update language in status bar
        const languageMap = {
            'html': 'HTML',
            'css': 'CSS',
            'javascript': 'JavaScript',
            'json': 'JSON',
            'php': 'PHP',
            'markdown': 'Markdown',
            'text': 'Plain Text'
        };
        
        const modeName = mode.split('/').pop();
        document.querySelector('.status-right .status-item:nth-child(3)').innerHTML = 
            `<span>${languageMap[modeName] || modeName}</span>`;
    };
    
    // Store editor instance globally
    window.editor = editor;
}

// Initialize activity bar functionality
function initializeActivityBar() {
    const activityIcons = document.querySelectorAll('.activity-icon');
    
    activityIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            // Remove active class from all icons
            activityIcons.forEach(i => i.classList.remove('active'));
            
            // Add active class to clicked icon
            this.classList.add('active');
            
            // Update sidebar content based on view
            const view = this.getAttribute('data-view');
            updateSidebarView(view);
        });
    });
}

// Update sidebar content based on selected view
function updateSidebarView(view) {
    const sidebarTitle = document.querySelector('.side-bar-title');
    const sidebarContent = document.querySelector('.side-bar-content');
    
    // Update title
    switch(view) {
        case 'explorer':
            sidebarTitle.textContent = 'EXPLORER';
            sidebarContent.innerHTML = document.querySelector('.folder-tree').outerHTML;
            initializeFolderTree(); // Re-initialize folder tree
            break;
        case 'search':
            sidebarTitle.textContent = 'SEARCH';
            sidebarContent.innerHTML = `
                <div class="search-container">
                    <div class="search-input-container">
                        <input type="text" class="search-input" placeholder="Search in files">
                        <div class="search-actions">
                            <button class="icon-button" title="Match Case"><i class="fas fa-font"></i></button>
                            <button class="icon-button" title="Match Whole Word"><i class="fas fa-text-width"></i></button>
                            <button class="icon-button" title="Use Regular Expression"><i class="fas fa-code"></i></button>
                        </div>
                    </div>
                    <div class="search-results">
                        <div class="search-message">Search across all files by typing in the input box.</div>
                    </div>
                </div>
            `;
            break;
        case 'git':
            sidebarTitle.textContent = 'SOURCE CONTROL';
            sidebarContent.innerHTML = `
                <div class="git-container">
                    <div class="git-message">
                        <p>You can initialize a git repository to track changes to your project.</p>
                        <button class="git-init-button">Initialize Repository</button>
                    </div>
                </div>
            `;
            break;
        case 'debug':
            sidebarTitle.textContent = 'RUN AND DEBUG';
            sidebarContent.innerHTML = `
                <div class="debug-container">
                    <div class="debug-message">
                        <p>To customize Run and Debug create a launch.json file.</p>
                        <button class="debug-config-button">Create a launch.json file</button>
                    </div>
                </div>
            `;
            break;
        case 'extensions':
            sidebarTitle.textContent = 'EXTENSIONS';
            sidebarContent.innerHTML = `
                <div class="extensions-container">
                    <div class="extensions-search">
                        <input type="text" placeholder="Search Extensions in Marketplace">
                    </div>
                    <div class="extensions-list">
                        <div class="extension-item">
                            <div class="extension-header">
                                <div class="extension-icon"><i class="fas fa-palette"></i></div>
                                <div class="extension-info">
                                    <div class="extension-name">Theme Pack</div>
                                    <div class="extension-publisher">ShashankOS</div>
                                </div>
                                <button class="extension-install">Install</button>
                            </div>
                        </div>
                        <div class="extension-item">
                            <div class="extension-header">
                                <div class="extension-icon"><i class="fas fa-code"></i></div>
                                <div class="extension-info">
                                    <div class="extension-name">Code Snippets</div>
                                    <div class="extension-publisher">ShashankOS</div>
                                </div>
                                <button class="extension-install">Install</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            break;
        case 'settings':
            sidebarTitle.textContent = 'SETTINGS';
            sidebarContent.innerHTML = `
                <div class="settings-container">
                    <div class="settings-search">
                        <input type="text" placeholder="Search settings">
                    </div>
                    <div class="settings-list">
                        <div class="settings-group">
                            <div class="settings-group-title">Editor</div>
                            <div class="settings-item">
                                <div class="settings-item-name">Font Size</div>
                                <div class="settings-item-value">
                                    <input type="number" value="14" min="8" max="30">
                                </div>
                            </div>
                            <div class="settings-item">
                                <div class="settings-item-name">Tab Size</div>
                                <div class="settings-item-value">
                                    <input type="number" value="4" min="1" max="8">
                                </div>
                            </div>
                            <div class="settings-item">
                                <div class="settings-item-name">Word Wrap</div>
                                <div class="settings-item-value">
                                    <select>
                                        <option>off</option>
                                        <option>on</option>
                                        <option>wordWrapColumn</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            break;
        case 'account':
            sidebarTitle.textContent = 'ACCOUNT';
            sidebarContent.innerHTML = `
                <div class="account-container">
                    <div class="account-info">
                        <div class="account-avatar">
                            <i class="fas fa-user-circle fa-3x"></i>
                        </div>
                        <div class="account-name">ShashankOS User</div>
                        <div class="account-email">user@shashankos.com</div>
                    </div>
                    <div class="account-actions">
                        <button class="account-action-button">
                            <i class="fas fa-sign-out-alt"></i> Sign Out
                        </button>
                    </div>
                </div>
            `;
            break;
    }
}

// Initialize folder tree functionality
function initializeFolderTree() {
    const folderHeaders = document.querySelectorAll('.folder-header');
    const fileItems = document.querySelectorAll('.file-item');
    
    folderHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const folderItem = this.parentElement;
            folderItem.classList.toggle('expanded');
        });
    });
    
    fileItems.forEach(item => {
        item.addEventListener('click', function() {
            const filename = this.getAttribute('data-file');
            openFile(filename);
        });
    });
}

// Open a file in the editor
function openFile(filename) {
    // Check if tab already exists
    let tabExists = false;
    const tabs = document.querySelectorAll('.tab');
    
    tabs.forEach(tab => {
        if (tab.getAttribute('data-file') === filename) {
            // Activate this tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            tabExists = true;
        }
    });
    
    if (!tabExists) {
        // Create new tab
        const tabsContainer = document.querySelector('.editor-tabs');
        const newTabButton = document.querySelector('.new-tab');
        
        const newTab = document.createElement('div');
        newTab.className = 'tab active';
        newTab.setAttribute('data-file', filename);
        newTab.innerHTML = `
            <span class="tab-name">${filename}</span>
            <button class="tab-close"><i class="fas fa-times"></i></button>
        `;
        
        // Remove active class from all tabs
        tabs.forEach(tab => tab.classList.remove('active'));
        
        // Insert before the new tab button
        tabsContainer.insertBefore(newTab, newTabButton);
        
        // Add event listeners to the new tab
        newTab.addEventListener('click', function() {
            tabs.forEach(tab => tab.classList.remove('active'));
            this.classList.add('active');
            changeEditorMode(filename);
        });
        
        newTab.querySelector('.tab-close').addEventListener('click', function(e) {
            e.stopPropagation();
            closeTab(newTab);
        });
    }
    
    // Load file content (simulated)
    loadFileContent(filename);
    
    // Change editor mode based on file extension
    changeEditorMode(filename);
}

// Load file content (simulated)
function loadFileContent(filename) {
    // This would normally fetch the file content from the server
    // For demo purposes, we'll use some sample content
    let content = '';
    
    switch(filename) {
        case 'index.html':
            content = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ShashankOS</title>
    <link rel="stylesheet" href="style.css">
    <script src="app.js"></script>
</head>
<body>
    <h1>Welcome to ShashankOS</h1>
    <p>A modern web-based operating system.</p>
</body>
</html>`;
            break;
        case 'style.css':
            content = `/* ShashankOS Styles */
body {
    font-family: 'Inter', sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f5f5f5;
    color: #333;
}

h1 {
    color: #007acc;
}`;
            break;
        case 'app.js':
            content = `// ShashankOS Main Application
document.addEventListener('DOMContentLoaded', function() {
    console.log('ShashankOS initialized');
    
    // Initialize the application
    init();
});

function init() {
    // Application initialization code
    console.log('Application ready');
}`;
            break;
        case 'README.md':
            content = `# ShashankOS Project

A modern web-based operating system interface.

## Features

- Clean, intuitive UI
- Multiple applications
- File management
- Settings and customization

## Getting Started

1. Clone the repository
2. Open index.html in your browser
3. Explore the interface

## License

MIT`;
            break;
        default:
            content = `// ${filename}\n// This is a sample file`;
    }
    
    // Set the content in the editor
    if (window.editor) {
        window.editor.setValue(content, -1);
    }
}

// Initialize tabs functionality
function initializeTabs() {
    const tabs = document.querySelectorAll('.tab');
    const closeButtons = document.querySelectorAll('.tab-close');
    const newTabButton = document.querySelector('.new-tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const filename = this.getAttribute('data-file');
            changeEditorMode(filename);
            loadFileContent(filename);
        });
    });
    
    closeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const tab = this.parentElement;
            closeTab(tab);
        });
    });
    
    newTabButton.addEventListener('click', function() {
        // Create a new untitled file
        const count = document.querySelectorAll('.tab[data-file^="untitled-"]').length;
        const filename = `untitled-${count + 1}.txt`;
        openFile(filename);
    });
}

// Close a tab
function closeTab(tab) {
    const isActive = tab.classList.contains('active');
    const tabs = document.querySelectorAll('.tab');
    
    // If this is the active tab, activate another tab
    if (isActive && tabs.length > 1) {
        // Find the next tab to activate
        let nextTab = tab.nextElementSibling;
        if (nextTab.classList.contains('new-tab') || !nextTab) {
            nextTab = tab.previousElementSibling;
        }
        
        if (nextTab) {
            nextTab.classList.add('active');
            const filename = nextTab.getAttribute('data-file');
            changeEditorMode(filename);
            loadFileContent(filename);
        }
    }
    
    // Remove the tab
    tab.remove();
}

// Initialize keyboard shortcuts
function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ctrl+P: Open command palette
        if (e.ctrlKey && e.key === 'p') {
            e.preventDefault();
            toggleCommandPalette();
        }
        
        // Ctrl+S: Save file
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            saveFile();
        }
        
        // Ctrl+F: Find
        if (e.ctrlKey && e.key === 'f') {
            e.preventDefault();
            window.editor.execCommand('find');
        }
        
        // Ctrl+N: New file
        if (e.ctrlKey && e.key === 'n') {
            e.preventDefault();
            const count = document.querySelectorAll('.tab[data-file^="untitled-"]').length;
            const filename = `untitled-${count + 1}.txt`;
            openFile(filename);
        }
        
        // Escape: Close command palette
        if (e.key === 'Escape') {
            const commandPalette = document.querySelector('.command-palette');
            if (commandPalette.style.display === 'flex') {
                commandPalette.style.display = 'none';
            }
        }
    });
}

// Toggle command palette
function toggleCommandPalette() {
    const commandPalette = document.querySelector('.command-palette');
    const commandInput = document.querySelector('.command-input');
    
    if (commandPalette.style.display === 'none' || commandPalette.style.display === '') {
        commandPalette.style.display = 'flex';
        commandInput.focus();
    } else {
        commandPalette.style.display = 'none';
    }
}

// Initialize command palette
function initializeCommandPalette() {
    const commandItems = document.querySelectorAll('.command-item');
    const commandInput = document.querySelector('.command-input');
    
    commandItems.forEach(item => {
        item.addEventListener('click', function() {
            const command = this.querySelector('.command-label').textContent;
            executeCommand(command);
            document.querySelector('.command-palette').style.display = 'none';
        });
    });
    
    commandInput.addEventListener('input', function() {
        // Filter commands based on input
        // This would be implemented in a real application
    });
}

// Execute a command
function executeCommand(command) {
    switch(command) {
        case 'New File':
            const count = document.querySelectorAll('.tab[data-file^="untitled-"]').length;
            const filename = `untitled-${count + 1}.txt`;
            openFile(filename);
            break;
        case 'Save':
            saveFile();
            break;
        case 'Find':
            window.editor.execCommand('find');
            break;
    }
}

// Save file (simulated)
function saveFile() {
    // This would normally save the file to the server
    // For demo purposes, we'll just show a notification
    
    // Get the active tab
    const activeTab = document.querySelector('.tab.active');
    if (activeTab) {
        const filename = activeTab.getAttribute('data-file');
        
        // Show saving indicator in status bar
        const statusItem = document.querySelector('.status-left .status-item:nth-child(2)');
        const originalText = statusItem.innerHTML;
        statusItem.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i><span>Saving...</span>';
        
        // Simulate saving delay
        setTimeout(() => {
            statusItem.innerHTML = originalText;
            
            // If it's an untitled file, rename it
            if (filename.startsWith('untitled-')) {
                // In a real app, this would open a save dialog
                console.log('File saved:', filename);
            }
        }, 800);
    }
}