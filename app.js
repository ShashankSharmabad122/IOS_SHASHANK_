// Function to toggle video wallpaper
function toggleVideoWallpaper() {
    const videoBackground = document.querySelector('.video-background');
    const backgroundGradient = document.querySelector('.background-gradient');
    const video = document.getElementById('bgVideo');
    const isVideoEnabled = localStorage.getItem('videoWallpaper') === 'true';
    
    if (isVideoEnabled) {
        // Disable video wallpaper
        videoBackground.style.display = 'none';
        video.pause();
        // Restore gradient background
        backgroundGradient.style.opacity = '0.05';
        localStorage.setItem('videoWallpaper', 'false');
        showNotification('Video wallpaper disabled');
    } else {
        // Enable video wallpaper
        videoBackground.style.display = 'block';
        video.play();
        // Hide gradient background for clean video visibility
        backgroundGradient.style.opacity = '0';
        localStorage.setItem('videoWallpaper', 'true');
        showNotification('Video wallpaper enabled');
    }
}

// Function to initialize video wallpaper based on saved preference
function initializeVideoWallpaper() {
    const videoBackground = document.querySelector('.video-background');
    const backgroundGradient = document.querySelector('.background-gradient');
    const video = document.getElementById('bgVideo');
    const isVideoEnabled = localStorage.getItem('videoWallpaper') === 'true';
    
    if (isVideoEnabled) {
        videoBackground.style.display = 'block';
        video.play();
        // Hide gradient background for clean video visibility
        backgroundGradient.style.opacity = '0';
    } else {
        videoBackground.style.display = 'none';
        video.pause();
        // Restore gradient background
        backgroundGradient.style.opacity = '0.05';
    }
}

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    updateTime();
    setInterval(updateTime, 1000);
    updateDate();

    // Add event listeners to window headers for dragging
    initializeDraggableWindows();

    // Initialize context menus for folders
    initializeContextMenus();

    // Initialize the Start Menu
    initializeStartMenu();

    // Initialize wallpaper gallery
    initializeWallpaperGallery();

    // Initialize terminal command history
    initializeTerminalHistory();
    
    // Initialize taskbar time
    updateTaskbarTime();
    setInterval(updateTaskbarTime, 1000);
    
    // Initialize notification center
    initializeNotificationCenter();
    
    // Initialize search functionality
    initializeSearch();
    
    // Initialize video wallpaper based on saved preference
    initializeVideoWallpaper();
    
    // Focus search when pressing Ctrl+F
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.key === 'f') {
            event.preventDefault();
            document.getElementById('taskbarSearch').focus();
        }
    });

    // Initialize profile popup
    try {
        initializeProfilePopup();
        console.log('Profile popup initialized');
    } catch (error) {
        console.error('Error initializing profile popup:', error);
    }

    // Check if adaptive wallpaper should be enabled by default
    // You can uncomment the line below to enable adaptive wallpaper by default
    // startAdaptiveWallpaper();
});

// App Management
function openApp(appName) {
    const appWindows = {
        fileExplorer: 'fileExplorerWindow',
        webBrowser: 'webBrowserWindow',
        settings: 'settingsWindow',
        flappyBird: 'flappyBirdWindow',
        paint: 'paintWindow',
        terminal: 'terminalWindow',
        profilePopup: 'profilePopupWindow'
    };

    // Special case for Studio Code - redirect to the dedicated page
    if (appName === 'studioCode') {
        // Use the redirect page to ensure proper loading
        window.location.href = 'studio-code-redirect.html';
        return;
    }
    
    // Special case for direct links to Studio Code
    if (appName === 'studio-code' || appName === 'studiocode') {
        window.location.href = 'studio-code-redirect.html';
        return;
    }

    if (appWindows[appName]) {
        openWindow(appWindows[appName]);

        // Initialize specific app functionality
        if (appName === 'flappyBird') {
            startFlappyBirdGame();
        } else if (appName === 'paint') {
            initializePaint();
        } else if (appName === 'settings') {
            initializeWallpaperGallery();
        } else if (appName === 'webBrowser') {
            initializeBrowser();
        } else if (appName === 'terminal') {
            initializeTerminal();
        }
        
        // Highlight active app in taskbar
        highlightTaskbarApp(appName);
        
        // Make sure taskbar is visible when opening an app
        const taskbar = document.getElementById('taskbar');
        if (!taskbar.classList.contains('active')) {
            toggleTaskbar();
        }
    } else {
        showNotification(`${appName} is opening...`);
    }
}

// Highlight active app in taskbar
function highlightTaskbarApp(appName) {
    // Remove active class from all taskbar apps
    const taskbarApps = document.querySelectorAll('.taskbar-app');
    taskbarApps.forEach(app => {
        app.classList.remove('active');
    });
    
    // Add active class to the opened app
    const appIndex = ['fileExplorer', 'webBrowser', 'settings', 'flappyBird', 'paint', 'terminal', 'studioCode'].indexOf(appName);
    if (appIndex !== -1 && taskbarApps[appIndex]) {
        taskbarApps[appIndex].classList.add('active');
    }
}

function initializeBrowser() {
    // Set the default home page
    const addressBar = document.getElementById('addressBar');

    // Load Google as the default home page
    addressBar.value = 'https://www.google.com';

    // Add to browser history if it's empty
    if (browserHistory.length === 0) {
        browserHistory = ['https://www.google.com'];
        currentHistoryIndex = 0;
    }

    // Load the page
    loadPage();

    // Update status
    updateBrowserStatus('Connected to Google');

    // Clear any existing search suggestions
    const suggestionsContainer = document.getElementById('searchSuggestions');
    if (suggestionsContainer) {
        suggestionsContainer.style.display = 'none';
    }
}

function updateBrowserStatus(message) {
    const statusText = document.querySelector('.browser-status-text');
    if (statusText) {
        statusText.textContent = message;
    }
}

function goToHomePage() {
    document.getElementById('addressBar').value = 'https://www.google.com';
    loadPage();
    updateBrowserStatus('Home page loaded');
}

function openWindow(id) {
    const windowElement = document.getElementById(id);

    // Enable drag-and-drop functionality
    windowElement.addEventListener('dragover', (event) => {
        event.preventDefault();
    });

    windowElement.addEventListener('drop', (event) => {
        event.preventDefault();
        const files = event.dataTransfer.files;
        handleFileDrop(files);
    });

    // Display the window with a smooth animation
    windowElement.style.display = 'block';
    windowElement.style.opacity = '0';
    windowElement.style.transform = 'translate(-50%, -50%) scale(0.9)';

    setTimeout(() => {
        windowElement.style.opacity = '1';
        windowElement.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 10);

    bringToFront(windowElement);
}

function closeWindow(id) {
    const windowElement = document.getElementById(id);
    windowElement.style.opacity = '0';
    windowElement.style.transform = 'translate(-50%, -50%) scale(0.9)';

    setTimeout(() => {
        windowElement.style.display = 'none';
    }, 300);
    
    // Remove active class from taskbar app
    const appMapping = {
        'fileExplorerWindow': 'fileExplorer',
        'webBrowserWindow': 'webBrowser',
        'settingsWindow': 'settings',
        'flappyBirdWindow': 'flappyBird',
        'paintWindow': 'paint',
        'terminalWindow': 'terminal'
        // Studio Code has its own page, so no window mapping needed
    };
    
    const appName = appMapping[id];
    if (appName) {
        const taskbarApps = document.querySelectorAll('.taskbar-app');
        const appIndex = ['fileExplorer', 'webBrowser', 'settings', 'flappyBird', 'paint', 'terminal', 'studioCode'].indexOf(appName);
        if (appIndex !== -1 && taskbarApps[appIndex]) {
            taskbarApps[appIndex].classList.remove('active');
        }
    }
}

function minimizeWindow(id) {
    const windowElement = document.getElementById(id);
    windowElement.style.opacity = '0';
    windowElement.style.transform = 'translate(-50%, -50%) scale(0.1)';

    setTimeout(() => {
        windowElement.style.display = 'none';
        windowElement.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 300);
}

function maximizeWindow(id) {
    const windowElement = document.getElementById(id);

    if (windowElement.classList.contains('maximized')) {
        // Restore to original size
        windowElement.classList.remove('maximized');
        windowElement.style.width = '800px';
        windowElement.style.height = '600px';
        windowElement.style.top = '50%';
        windowElement.style.left = '50%';
        windowElement.style.transform = 'translate(-50%, -50%)';
    } else {
        // Maximize
        windowElement.classList.add('maximized');
        windowElement.style.width = '100%';
        windowElement.style.height = 'calc(100% - 70px)';
        windowElement.style.top = '70px';
        windowElement.style.left = '0';
        windowElement.style.transform = 'none';
        windowElement.style.borderRadius = '0';
    }
}

function bringToFront(element) {
    const windows = document.querySelectorAll('.window');
    windows.forEach(win => win.style.zIndex = '1000');
    element.style.zIndex = '1001';
}

function initializeDraggableWindows() {
    document.querySelectorAll('.window-header').forEach(header => {
        header.addEventListener('mousedown', event => {
            // Don't initiate drag if clicking on a button
            if (event.target.tagName === 'BUTTON') return;

            const windowBox = header.parentElement;

            // Don't allow dragging if window is maximized
            if (windowBox.classList.contains('maximized')) return;

            bringToFront(windowBox);

            const rect = windowBox.getBoundingClientRect();
            const shiftX = event.clientX - rect.left;
            const shiftY = event.clientY - rect.top;

            function moveAt(pageX, pageY) {
                windowBox.style.left = `${pageX - shiftX}px`;
                windowBox.style.top = `${pageY - shiftY}px`;

                // Remove the transform property when dragging
                windowBox.style.transform = 'none';
            }

            function onMouseMove(event) {
                moveAt(event.pageX, event.pageY);
            }

            document.addEventListener('mousemove', onMouseMove);

            document.addEventListener('mouseup', () => {
                document.removeEventListener('mousemove', onMouseMove);
            }, { once: true });
        });
    });
}

// File Management with Database Integration
function handleFileDrop(files) {
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const content = e.target.result;
            
            // Get current folder ID (default to Desktop)
            const folderId = getCurrentFolderId();
            
            // Create file in database
            fetch('file_manager.php?action=create_file', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `file_name=${encodeURIComponent(file.name)}&folder_id=${folderId}&content=${encodeURIComponent(content)}&file_type=${encodeURIComponent(file.type)}`
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showNotification(`File ${file.name} uploaded successfully.`);
                    displayFiles();
                } else {
                    showNotification(`Error: ${data.error}`, 'error');
                }
            })
            .catch(error => {
                showNotification('Error uploading file.', 'error');
                console.error('Error:', error);
            });
        };
        
        reader.readAsText(file);
    }
}

function getCurrentFolderId() {
    // Get the current folder ID from the file explorer
    // This is a placeholder - implement based on your UI
    const activeFolder = document.querySelector('#systemFolders li.active');
    return activeFolder ? activeFolder.dataset.folderId : 1; // Default to Desktop (ID 1)
}

function displayFiles() {
    const folderId = getCurrentFolderId();
    
    fetch(`file_manager.php?action=list_files&folder_id=${folderId}`)
    .then(response => response.json())
    .then(data => {
        if (data.files) {
            const fileOperations = document.getElementById('fileOperations');
            fileOperations.innerHTML = '';
            
            if (data.files.length === 0) {
                fileOperations.innerHTML = '<p class="empty-folder">This folder is empty</p>';
                return;
            }
            
            const fileList = document.createElement('div');
            fileList.className = 'file-list';
            
            data.files.forEach(file => {
                const fileItem = document.createElement('div');
                fileItem.className = 'file-item';
                fileItem.dataset.fileId = file.id;
                
                // Determine icon based on file type
                let iconName = 'description';
                if (file.file_type.includes('image')) {
                    iconName = 'image';
                } else if (file.file_type.includes('video')) {
                    iconName = 'movie';
                } else if (file.file_type.includes('audio')) {
                    iconName = 'music_note';
                }
                
                fileItem.innerHTML = `
                    <span class="material-icon">${iconName}</span>
                    <span class="file-name">${file.filename}</span>
                `;
                
                // Add event listeners
                fileItem.addEventListener('dblclick', () => openFile(file.id));
                fileItem.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    showFileContextMenu(e.pageX, e.pageY, file.id, file.filename);
                });
                
                fileList.appendChild(fileItem);
            });
            
            fileOperations.appendChild(fileList);
        } else {
            showNotification(`Error: ${data.error}`, 'error');
        }
    })
    .catch(error => {
        showNotification('Error loading files.', 'error');
        console.error('Error:', error);
    });
}

function createFile() {
    const fileName = prompt("Enter the name of the new file:");
    if (fileName) {
        const folderId = getCurrentFolderId();
        
        fetch('file_manager.php?action=create_file', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `file_name=${encodeURIComponent(fileName)}&folder_id=${folderId}&content=&file_type=text/plain`
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification(`File ${fileName} created.`);
                displayFiles();
            } else {
                showNotification(`Error: ${data.error}`, 'error');
            }
        })
        .catch(error => {
            showNotification('Error creating file.', 'error');
            console.error('Error:', error);
        });
    }
}

function deleteFile(fileId, fileName) {
    if (confirm(`Are you sure you want to delete ${fileName}?`)) {
        fetch('file_manager.php?action=delete_file', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `file_id=${fileId}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification(`${fileName} deleted.`);
                displayFiles();
            } else {
                showNotification(`Error: ${data.error}`, 'error');
            }
        })
        .catch(error => {
            showNotification('Error deleting file.', 'error');
            console.error('Error:', error);
        });
    }
}

function renameFile(fileId, oldName) {
    const newName = prompt(`Enter new name for ${oldName}`);
    if (newName) {
        fetch('file_manager.php?action=rename_file', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `file_id=${fileId}&new_name=${encodeURIComponent(newName)}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification(`Renamed ${oldName} to ${newName}`);
                displayFiles();
            } else {
                showNotification(`Error: ${data.error}`, 'error');
            }
        })
        .catch(error => {
            showNotification('Error renaming file.', 'error');
            console.error('Error:', error);
        });
    }
}

function openFile(fileId) {
    // Fetch file content and open in appropriate app
    fetch(`file_manager.php?action=get_file&file_id=${fileId}`)
    .then(response => response.json())
    .then(data => {
        if (data.file) {
            const file = data.file;
            
            // Open file based on type
            if (file.file_type.includes('image')) {
                // Open in image viewer
                showImageViewer(file.content, file.filename);
            } else if (file.file_type.includes('text')) {
                // Open in text editor
                openTextEditor(file.content, file.filename, fileId);
            } else {
                // Default file viewer
                showFileViewer(file.content, file.filename, file.file_type);
            }
        } else {
            showNotification(`Error: ${data.error}`, 'error');
        }
    })
    .catch(error => {
        showNotification('Error opening file.', 'error');
        console.error('Error:', error);
    });
}

function showFileContextMenu(x, y, fileId, fileName) {
    // Remove any existing context menus
    const existingMenu = document.querySelector('.context-menu');
    if (existingMenu) existingMenu.remove();

    const contextMenu = document.createElement('div');
    contextMenu.className = 'context-menu';
    contextMenu.style.top = `${y}px`;
    contextMenu.style.left = `${x}px`;
    contextMenu.innerHTML = `
        <ul>
            <li onclick="openFile(${fileId})">Open</li>
            <li onclick="renameFile(${fileId}, '${fileName}')">Rename</li>
            <li onclick="deleteFile(${fileId}, '${fileName}')">Delete</li>
        </ul>
    `;
    document.body.appendChild(contextMenu);

    // Add a subtle animation
    contextMenu.style.opacity = '0';
    contextMenu.style.transform = 'scale(0.95)';

    setTimeout(() => {
        contextMenu.style.opacity = '1';
        contextMenu.style.transform = 'scale(1)';
    }, 10);

    document.addEventListener('click', () => {
        contextMenu.style.opacity = '0';
        contextMenu.style.transform = 'scale(0.95)';

        setTimeout(() => {
            contextMenu.remove();
        }, 200);
    }, { once: true });
}

function initializeContextMenus() {
    document.querySelectorAll('#systemFolders li').forEach(folder => {
        folder.addEventListener('click', () => {
            showNotification(`Opening ${folder.innerText}`);
        });

        folder.addEventListener('contextmenu', event => {
            event.preventDefault();
            showContextMenu(event.pageX, event.pageY, folder.innerText);
        });
    });
}

function showContextMenu(x, y, itemName) {
    // Remove any existing context menus
    const existingMenu = document.querySelector('.context-menu');
    if (existingMenu) existingMenu.remove();

    const contextMenu = document.createElement('div');
    contextMenu.className = 'context-menu';
    contextMenu.style.top = `${y}px`;
    contextMenu.style.left = `${x}px`;
    contextMenu.innerHTML = `
        <ul>
            <li onclick="renameFile('${itemName}')">Rename</li>
            <li onclick="deleteFile('${itemName}')">Delete</li>
            <li onclick="moveFolder('${itemName}')">Move</li>
        </ul>
    `;
    document.body.appendChild(contextMenu);

    // Add a subtle animation
    contextMenu.style.opacity = '0';
    contextMenu.style.transform = 'scale(0.95)';

    setTimeout(() => {
        contextMenu.style.opacity = '1';
        contextMenu.style.transform = 'scale(1)';
    }, 10);

    document.addEventListener('click', () => {
        contextMenu.style.opacity = '0';
        contextMenu.style.transform = 'scale(0.95)';

        setTimeout(() => {
            contextMenu.remove();
        }, 200);
    }, { once: true });
}

// Web Browser Functionality
let browserHistory = [];
let currentHistoryIndex = -1;
const searchEngine = {
    name: 'Google',
    searchUrl: 'https://www.google.com/search?q=',
    icon: 'search'
};

function loadPage() {
    const input = document.getElementById('addressBar').value.trim();
    const browserContent = document.getElementById('browserContent');
    let url;

    // Show loading indicator
    updateBrowserStatus('Loading...');
    showLoadingAnimation();

    // Check if input is a URL or a search query
    if (isValidUrl(input)) {
        // It's a URL
        url = input.startsWith('http') ? input : `https://${input}`;
        const hostname = new URL(url).hostname;
        updateBrowserStatus(`Connecting to ${hostname}...`);

        // Update address bar with the URL
        document.getElementById('addressBar').value = url;

        // Add to browser history
        browserHistory = browserHistory.slice(0, currentHistoryIndex + 1);
        browserHistory.push(url);
        currentHistoryIndex++;

        // Simulate loading a website
        setTimeout(() => {
            // Check for special case websites
            if (hostname === 'www.google.com' || hostname === 'google.com') {
                renderGoogleHomePage();
            } else {
                renderSimulatedWebsite(url, hostname);
            }

            // Update security indicator
            updateSecurityIndicator(url);

            // Update browser status
            updateBrowserStatus(`Connected to ${hostname}`);

            hideLoadingAnimation();
        }, 800);

    } else if (input.startsWith('google:') || input.startsWith('g:')) {
        // Direct Google search shortcut
        const query = input.replace(/^(google:|g:)\s*/, '');
        url = `${searchEngine.searchUrl}${encodeURIComponent(query)}`;
        document.getElementById('addressBar').value = url;
        updateBrowserStatus(`Searching Google for "${query}"`);

        // Add to browser history
        browserHistory = browserHistory.slice(0, currentHistoryIndex + 1);
        browserHistory.push(url);
        currentHistoryIndex++;

        // Simulate Google search results
        setTimeout(() => {
            renderGoogleSearchResults(query);
            updateSecurityIndicator(url);
            hideLoadingAnimation();
        }, 800);

    } else {
        // Treat as a search query
        url = `${searchEngine.searchUrl}${encodeURIComponent(input)}`;
        document.getElementById('addressBar').value = url;
        updateBrowserStatus(`Searching Google for "${input}"`);

        // Add to browser history
        browserHistory = browserHistory.slice(0, currentHistoryIndex + 1);
        browserHistory.push(url);
        currentHistoryIndex++;

        // Simulate Google search results
        setTimeout(() => {
            renderGoogleSearchResults(input);
            updateSecurityIndicator(url);
            hideLoadingAnimation();
        }, 800);
    }

    // Update search suggestions
    updateSearchSuggestions(input);
}

function showLoadingAnimation() {
    const browserContent = document.getElementById('browserContent');
    if (!browserContent) return;

    browserContent.innerHTML = `
        <div class="browser-loading">
            <div class="loading-spinner"></div>
            <p>Loading page...</p>
        </div>
    `;
}

function hideLoadingAnimation() {
    const loadingElement = document.querySelector('.browser-loading');
    if (loadingElement) {
        loadingElement.style.opacity = '0';
        setTimeout(() => {
            loadingElement.remove();
        }, 300);
    }
}

function updateSecurityIndicator(url) {
    const securityText = document.querySelector('.browser-security span:last-child');
    const securityIcon = document.querySelector('.browser-security .material-icon');

    if (!securityText || !securityIcon) return;

    if (url.startsWith('https://')) {
        securityText.textContent = 'Secure';
        securityIcon.textContent = 'lock';
        securityIcon.style.color = '#10b981';
    } else {
        securityText.textContent = 'Not Secure';
        securityIcon.textContent = 'lock_open';
        securityIcon.style.color = '#ef4444';
    }
}

function renderGoogleHomePage() {
    const browserContent = document.getElementById('browserContent');
    if (!browserContent) return;

    browserContent.innerHTML = `
        <div class="simulated-google">
            <div class="google-logo">
                <span style="color:#4285F4">G</span>
                <span style="color:#EA4335">o</span>
                <span style="color:#FBBC05">o</span>
                <span style="color:#4285F4">g</span>
                <span style="color:#34A853">l</span>
                <span style="color:#EA4335">e</span>
            </div>
            <div class="google-search-bar">
                <div class="google-search-icon">
                    <span class="material-icon">search</span>
                </div>
                <input type="text" placeholder="Search Google or type a URL"
                       onkeydown="if(event.key === 'Enter') {
                           document.getElementById('addressBar').value = 'google: ' + this.value;
                           loadPage();
                       }">
                <div class="google-mic-icon">
                    <span class="material-icon">mic</span>
                </div>
            </div>
            <div class="google-buttons">
                <button>Google Search</button>
                <button>I'm Feeling Lucky</button>
            </div>
            <div class="google-footer">
                <div>Google offered in: <a href="#">English</a></div>
            </div>
        </div>
    `;

    // Add event listeners to the Google search buttons
    const searchInput = browserContent.querySelector('.google-search-bar input');
    const searchButtons = browserContent.querySelectorAll('.google-buttons button');

    searchButtons[0].addEventListener('click', () => {
        if (searchInput.value.trim()) {
            document.getElementById('addressBar').value = 'google: ' + searchInput.value;
            loadPage();
        }
    });

    searchButtons[1].addEventListener('click', () => {
        if (searchInput.value.trim()) {
            document.getElementById('addressBar').value = 'google: ' + searchInput.value + ' lucky';
            loadPage();
        } else {
            // Random fun fact if no search term
            const funFacts = [
                "The first Google server was built in a custom case made of Lego bricks.",
                "Google's name is a play on the word 'googol', which is a 1 followed by 100 zeros.",
                "Google's first tweet was 'I'm feeling lucky' in binary code.",
                "Google's headquarters (Googleplex) has dinosaur fossils on display.",
                "Google's original storage was made from ten 4GB hard drives."
            ];
            alert("Fun fact: " + funFacts[Math.floor(Math.random() * funFacts.length)]);
        }
    });
}

function renderGoogleSearchResults(query) {
    const browserContent = document.getElementById('browserContent');
    if (!browserContent) return;

    // Generate some fake search results based on the query
    const results = generateSearchResults(query);

    browserContent.innerHTML = `
        <div class="simulated-search-results">
            <div class="search-results-header">
                <div class="mini-google-logo">
                    <span style="color:#4285F4">G</span>
                    <span style="color:#EA4335">o</span>
                    <span style="color:#FBBC05">o</span>
                    <span style="color:#4285F4">g</span>
                    <span style="color:#34A853">l</span>
                    <span style="color:#EA4335">e</span>
                </div>
                <div class="search-bar-top">
                    <input type="text" value="${query}"
                           onkeydown="if(event.key === 'Enter') {
                               document.getElementById('addressBar').value = 'google: ' + this.value;
                               loadPage();
                           }">
                    <button>
                        <span class="material-icon">search</span>
                    </button>
                </div>
            </div>
            <div class="search-results-count">
                About ${Math.floor(Math.random() * 900) + 100},000,000 results (${(Math.random() * 0.8 + 0.2).toFixed(2)} seconds)
            </div>
            <div class="search-results-list">
                ${results.map(result => `
                    <div class="search-result-item">
                        <div class="result-url">${result.url}</div>
                        <div class="result-title">${result.title}</div>
                        <div class="result-snippet">${result.snippet}</div>
                    </div>
                `).join('')}
            </div>
            <div class="search-pagination">
                <div class="google-pagination-logo">
                    <span style="color:#4285F4">G</span>
                    <span style="color:#EA4335">o</span>
                    <span style="color:#FBBC05">o</span>
                    <span style="color:#4285F4">g</span>
                    <span style="color:#34A853">l</span>
                    <span style="color:#EA4335">e</span>
                </div>
                <div class="pagination-buttons">
                    <button class="active">1</button>
                    <button>2</button>
                    <button>3</button>
                    <button>4</button>
                    <button>5</button>
                    <button>Next</button>
                </div>
            </div>
        </div>
    `;

    // Add event listener to the search button
    const searchInput = browserContent.querySelector('.search-bar-top input');
    const searchButton = browserContent.querySelector('.search-bar-top button');

    searchButton.addEventListener('click', () => {
        if (searchInput.value.trim()) {
            document.getElementById('addressBar').value = 'google: ' + searchInput.value;
            loadPage();
        }
    });

    // Add event listeners to result items
    const resultItems = browserContent.querySelectorAll('.search-result-item');
    resultItems.forEach(item => {
        item.addEventListener('click', () => {
            const url = item.querySelector('.result-url').textContent;
            document.getElementById('addressBar').value = url;
            loadPage();
        });
    });
}

function generateSearchResults(query) {
    // Generate fake search results based on the query
    const results = [];
    const domains = ['example.com', 'wikipedia.org', 'github.com', 'stackoverflow.com', 'medium.com'];
    const queryWords = query.toLowerCase().split(' ');

    for (let i = 0; i < 8; i++) {
        const domain = domains[Math.floor(Math.random() * domains.length)];
        const path = queryWords.join('-');
        const url = `https://www.${domain}/${path}`;

        // Create a title that includes the query
        let title = query.charAt(0).toUpperCase() + query.slice(1);
        if (i % 3 === 0) title += ' - Complete Guide';
        else if (i % 3 === 1) title += ' | ' + domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1);
        else title += ' Tutorial';

        // Create a snippet that includes the query
        const snippetParts = [
            `Learn all about ${query} with our comprehensive guide.`,
            `${query.charAt(0).toUpperCase() + query.slice(1)} is a popular topic that many people are interested in.`,
            `Discover the best practices for working with ${query}.`,
            `This article explains everything you need to know about ${query}.`,
            `Find out why ${query} is trending and how to use it effectively.`
        ];

        const snippet = snippetParts[Math.floor(Math.random() * snippetParts.length)];

        results.push({
            url,
            title,
            snippet
        });
    }

    return results;
}

function renderSimulatedWebsite(url, hostname) {
    const browserContent = document.getElementById('browserContent');
    if (!browserContent) return;

    // Create a simulated website based on the URL
    browserContent.innerHTML = `
        <div class="simulated-website">
            <div class="website-header">
                <h1>${hostname}</h1>
                <nav>
                    <ul>
                        <li>Home</li>
                        <li>About</li>
                        <li>Products</li>
                        <li>Services</li>
                        <li>Contact</li>
                    </ul>
                </nav>
            </div>
            <div class="website-content">
                <div class="website-main">
                    <h2>Welcome to ${hostname}</h2>
                    <p>This website cannot be displayed in the browser due to X-Frame-Options restrictions.</p>
                    <p>Most modern websites (including Google) prevent being loaded in iframes for security reasons.</p>
                    <p>This is a simulated version of what the website might look like.</p>
                    <div class="website-cta">
                        <button>Learn More</button>
                        <button>Get Started</button>
                    </div>
                </div>
                <div class="website-sidebar">
                    <div class="sidebar-section">
                        <h3>Latest News</h3>
                        <ul>
                            <li>New features announced</li>
                            <li>Company updates</li>
                            <li>Industry trends</li>
                        </ul>
                    </div>
                    <div class="sidebar-section">
                        <h3>Popular Links</h3>
                        <ul>
                            <li>Documentation</li>
                            <li>Resources</li>
                            <li>Blog</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="website-footer">
                <p>&copy; ${new Date().getFullYear()} ${hostname}. All rights reserved.</p>
                <p>Privacy Policy | Terms of Service | Cookies</p>
            </div>
        </div>
    `;
}

function isValidUrl(string) {
    try {
        // Check if it's a valid URL format
        new URL(string);
        return true;
    } catch (_) {
        // Check if it could be a valid URL with https:// prefix
        try {
            new URL('https://' + string);
            return string.includes('.') &&
                   !string.includes(' ') &&
                   string.length > 3;
        } catch (_) {
            return false;
        }
    }
}

function navigateBack() {
    if (currentHistoryIndex > 0) {
        currentHistoryIndex--;
        document.getElementById('addressBar').value = browserHistory[currentHistoryIndex];
        loadPage();
        updateBrowserStatus('Navigated back');
    }
}

function navigateForward() {
    if (currentHistoryIndex < browserHistory.length - 1) {
        currentHistoryIndex++;
        document.getElementById('addressBar').value = browserHistory[currentHistoryIndex];
        loadPage();
        updateBrowserStatus('Navigated forward');
    }
}

function refreshPage() {
    // Reload the current page
    const currentUrl = document.getElementById('addressBar').value;
    loadPage();
    updateBrowserStatus('Refreshing page...');
}

function updateSearchSuggestions(query) {
    // This would typically call an API to get search suggestions
    // For this demo, we'll just show some static suggestions
    const suggestionsContainer = document.getElementById('searchSuggestions');
    if (!suggestionsContainer) return;

    // Clear previous suggestions
    suggestionsContainer.innerHTML = '';

    if (query.length < 2 || isValidUrl(query)) {
        suggestionsContainer.style.display = 'none';
        return;
    }

    // Show suggestions container
    suggestionsContainer.style.display = 'block';

    // Add some example suggestions
    const suggestions = [
        `${query} search`,
        `${query} tutorial`,
        `${query} examples`,
        `how to use ${query}`,
        `${query} documentation`
    ];

    suggestions.forEach(suggestion => {
        const item = document.createElement('div');
        item.className = 'search-suggestion-item';
        item.innerHTML = `
            <span class="material-icon">${searchEngine.icon}</span>
            <span>${suggestion}</span>
        `;

        item.addEventListener('click', () => {
            document.getElementById('addressBar').value = suggestion;
            loadPage();
            suggestionsContainer.style.display = 'none';
        });

        suggestionsContainer.appendChild(item);
    });
}

function toggleSearchSuggestions() {
    const suggestionsContainer = document.getElementById('searchSuggestions');
    if (suggestionsContainer) {
        suggestionsContainer.style.display =
            suggestionsContainer.style.display === 'none' ? 'block' : 'none';
    }
}

// Settings Panel Functionality
function toggleTheme() {
    document.body.classList.toggle('dark-theme');

    // Show notification
    const theme = document.body.classList.contains('dark-theme') ? 'Dark' : 'Light';
    showNotification(`${theme} theme activated`);
}

// Global wallpaper settings
const wallpaperSettings = {
    isAdaptive: false,
    currentIndex: 0,
    adaptiveInterval: null
};

// Wallpaper gradients collection
const wallpaperGradients = [
    'linear-gradient(135deg, #6366f1 0%, #a5b4fc 100%)', // Indigo
    'linear-gradient(135deg, #10b981 0%, #34d399 100%)', // Green
    'linear-gradient(135deg, #f59e0b 0%, #fcd34d 100%)', // Amber
    'linear-gradient(135deg, #ef4444 0%, #fca5a5 100%)', // Red
    'linear-gradient(135deg, #8b5cf6 0%, #c4b5fd 100%)', // Purple
    'linear-gradient(135deg, #0ea5e9 0%, #7dd3fc 100%)', // Sky Blue
    'linear-gradient(135deg, #ec4899 0%, #f9a8d4 100%)', // Pink
    'linear-gradient(135deg, #14b8a6 0%, #5eead4 100%)', // Teal
    'linear-gradient(135deg, #f43f5e 0%, #fb7185 100%)', // Rose
    'linear-gradient(135deg, #84cc16 0%, #bef264 100%)'  // Lime
];

// Time-based adaptive wallpapers
const adaptiveWallpapers = {
    morning: {
        gradient: 'linear-gradient(135deg, #f59e0b 0%, #fcd34d 100%)', // Amber/Yellow for sunrise
        name: 'Morning Sunrise',
        timeRange: [5, 11] // 5 AM to 11 AM
    },
    day: {
        gradient: 'linear-gradient(135deg, #0ea5e9 0%, #7dd3fc 100%)', // Sky Blue for day
        name: 'Daytime Sky',
        timeRange: [11, 17] // 11 AM to 5 PM
    },
    evening: {
        gradient: 'linear-gradient(135deg, #f43f5e 0%, #fb7185 100%)', // Rose/Pink for sunset
        name: 'Evening Sunset',
        timeRange: [17, 20] // 5 PM to 8 PM
    },
    night: {
        gradient: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', // Dark blue for night
        name: 'Night Sky',
        timeRange: [20, 5] // 8 PM to 5 AM
    }
};

function changeWallpaper(selectedIndex) {
    const bgElement = document.querySelector('.background-gradient');

    // If adaptive mode is being turned off, clear the interval
    if (wallpaperSettings.isAdaptive && selectedIndex !== undefined) {
        stopAdaptiveWallpaper();
    }

    // If a specific index was provided, use it
    if (selectedIndex !== undefined && selectedIndex >= 0 && selectedIndex < wallpaperGradients.length) {
        wallpaperSettings.currentIndex = selectedIndex;
        bgElement.style.background = wallpaperGradients[selectedIndex];
    } else {
        // Otherwise cycle to the next wallpaper
        const currentBg = window.getComputedStyle(bgElement).backgroundImage;

        // Find the current gradient index
        let currentIndex = -1;
        for (let i = 0; i < wallpaperGradients.length; i++) {
            if (currentBg.includes(wallpaperGradients[i].split('(')[1].split(')')[0])) {
                currentIndex = i;
                break;
            }
        }

        // Move to the next gradient
        const nextIndex = (currentIndex + 1) % wallpaperGradients.length;
        wallpaperSettings.currentIndex = nextIndex;
        bgElement.style.background = wallpaperGradients[nextIndex];
    }

    // Fade animation
    bgElement.style.opacity = '0';
    setTimeout(() => {
        bgElement.style.opacity = '0.05';
    }, 10);

    showNotification('Wallpaper changed');
}

function toggleAdaptiveWallpaper() {
    if (wallpaperSettings.isAdaptive) {
        stopAdaptiveWallpaper();
        showNotification('Adaptive wallpaper disabled');
    } else {
        startAdaptiveWallpaper();
        showNotification('Adaptive wallpaper enabled');
    }

    // Update UI to reflect current state
    updateAdaptiveWallpaperUI();
}

function startAdaptiveWallpaper() {
    wallpaperSettings.isAdaptive = true;

    // Apply adaptive wallpaper immediately
    applyAdaptiveWallpaper();

    // Set interval to check time and update wallpaper every minute
    wallpaperSettings.adaptiveInterval = setInterval(applyAdaptiveWallpaper, 60000);
}

function stopAdaptiveWallpaper() {
    wallpaperSettings.isAdaptive = false;

    // Clear the interval
    if (wallpaperSettings.adaptiveInterval) {
        clearInterval(wallpaperSettings.adaptiveInterval);
        wallpaperSettings.adaptiveInterval = null;
    }
}

function applyAdaptiveWallpaper() {
    const now = new Date();
    const currentHour = now.getHours();
    const bgElement = document.querySelector('.background-gradient');

    let selectedWallpaper = null;

    // Find the appropriate wallpaper for the current time
    for (const [timeOfDay, wallpaper] of Object.entries(adaptiveWallpapers)) {
        const [start, end] = wallpaper.timeRange;

        if (start < end) {
            // Simple time range (e.g., 11 AM to 5 PM)
            if (currentHour >= start && currentHour < end) {
                selectedWallpaper = wallpaper;
                break;
            }
        } else {
            // Time range spans midnight (e.g., 8 PM to 5 AM)
            if (currentHour >= start || currentHour < end) {
                selectedWallpaper = wallpaper;
                break;
            }
        }
    }

    if (selectedWallpaper) {
        bgElement.style.background = selectedWallpaper.gradient;

        // Fade animation
        bgElement.style.opacity = '0';
        setTimeout(() => {
            bgElement.style.opacity = '0.05';
        }, 10);
    }
}

function updateAdaptiveWallpaperUI() {
    // Update the adaptive wallpaper toggle button
    const adaptiveToggle = document.getElementById('adaptiveWallpaperToggle');
    if (adaptiveToggle) {
        adaptiveToggle.classList.toggle('active', wallpaperSettings.isAdaptive);
        adaptiveToggle.querySelector('span:last-child').textContent =
            wallpaperSettings.isAdaptive ? 'Disable Adaptive Wallpaper' : 'Enable Adaptive Wallpaper';
    }

    // Update wallpaper thumbnails to show/hide active state
    const wallpaperThumbnails = document.querySelectorAll('.wallpaper-thumbnail');
    wallpaperThumbnails.forEach(thumb => {
        if (wallpaperSettings.isAdaptive) {
            thumb.classList.remove('active');
        } else if (parseInt(thumb.getAttribute('data-index')) === wallpaperSettings.currentIndex) {
            thumb.classList.add('active');
        } else {
            thumb.classList.remove('active');
        }
    });
}

// Initialize wallpaper gallery in settings
function initializeWallpaperGallery() {
    const wallpaperGallery = document.getElementById('wallpaperGallery');
    if (!wallpaperGallery) return;

    const gradients = [
        { name: 'Indigo', color: '#6366f1' },
        { name: 'Green', color: '#10b981' },
        { name: 'Amber', color: '#f59e0b' },
        { name: 'Red', color: '#ef4444' },
        { name: 'Purple', color: '#8b5cf6' },
        { name: 'Sky Blue', color: '#0ea5e9' },
        { name: 'Pink', color: '#ec4899' },
        { name: 'Teal', color: '#14b8a6' },
        { name: 'Rose', color: '#f43f5e' },
        { name: 'Lime', color: '#84cc16' }
    ];

    // Clear existing content
    wallpaperGallery.innerHTML = '';

    // Create adaptive wallpaper toggle
    const adaptiveToggle = document.createElement('div');
    adaptiveToggle.id = 'adaptiveWallpaperToggle';
    adaptiveToggle.className = 'adaptive-toggle' + (wallpaperSettings.isAdaptive ? ' active' : '');
    adaptiveToggle.innerHTML = `
        <span class="material-icon">auto_awesome</span>
        <span>${wallpaperSettings.isAdaptive ? 'Disable Adaptive Wallpaper' : 'Enable Adaptive Wallpaper'}</span>
    `;
    adaptiveToggle.addEventListener('click', toggleAdaptiveWallpaper);
    wallpaperGallery.appendChild(adaptiveToggle);

    // Create wallpaper thumbnails
    const thumbnailsContainer = document.createElement('div');
    thumbnailsContainer.className = 'wallpaper-thumbnails';

    gradients.forEach((gradient, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = 'wallpaper-thumbnail';
        thumbnail.style.backgroundColor = gradient.color;
        thumbnail.setAttribute('data-index', index);
        thumbnail.setAttribute('title', gradient.name);

        // Add active class to current wallpaper if not in adaptive mode
        if (!wallpaperSettings.isAdaptive && index === wallpaperSettings.currentIndex) {
            thumbnail.classList.add('active');
        }

        thumbnail.addEventListener('click', function() {
            // Remove active class from all thumbnails
            document.querySelectorAll('.wallpaper-thumbnail').forEach(thumb => {
                thumb.classList.remove('active');
            });

            // Add active class to selected thumbnail
            this.classList.add('active');

            // Change wallpaper
            changeWallpaper(parseInt(this.getAttribute('data-index')));
        });

        thumbnailsContainer.appendChild(thumbnail);
    });

    wallpaperGallery.appendChild(thumbnailsContainer);

    // Create adaptive wallpaper preview section
    const adaptivePreview = document.createElement('div');
    adaptivePreview.className = 'adaptive-preview';
    adaptivePreview.innerHTML = `
        <h4>Adaptive Wallpapers</h4>
        <div class="adaptive-times">
            <div class="adaptive-time-item" title="${adaptiveWallpapers.morning.name}">
                <span class="material-icon">wb_sunny</span>
                <span>Morning</span>
                <div class="time-preview" style="background: ${adaptiveWallpapers.morning.gradient}"></div>
            </div>
            <div class="adaptive-time-item" title="${adaptiveWallpapers.day.name}">
                <span class="material-icon">light_mode</span>
                <span>Day</span>
                <div class="time-preview" style="background: ${adaptiveWallpapers.day.gradient}"></div>
            </div>
            <div class="adaptive-time-item" title="${adaptiveWallpapers.evening.name}">
                <span class="material-icon">wb_twilight</span>
                <span>Evening</span>
                <div class="time-preview" style="background: ${adaptiveWallpapers.evening.gradient}"></div>
            </div>
            <div class="adaptive-time-item" title="${adaptiveWallpapers.night.name}">
                <span class="material-icon">nights_stay</span>
                <span>Night</span>
                <div class="time-preview" style="background: ${adaptiveWallpapers.night.gradient}"></div>
            </div>
        </div>
    `;
    wallpaperGallery.appendChild(adaptivePreview);
}

// Search Functionality
function search() {
    const query = document.getElementById('searchBar').value.toLowerCase();
    const appIcons = document.querySelectorAll('.app-icon');

    appIcons.forEach(icon => {
        const appName = icon.querySelector('.app-name').innerText.toLowerCase();

        if (query === '' || appName.includes(query)) {
            icon.style.display = 'flex';
            icon.style.opacity = '1';
        } else {
            icon.style.opacity = '0.3';
        }
    });
}

// System Utilities
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const timeElement = document.getElementById('currentTime');

    if (timeElement) {
        timeElement.innerText = timeString;

        // If we're in adaptive wallpaper mode, add the current time period
        if (wallpaperSettings.isAdaptive) {
            const hour = now.getHours();
            let timePeriod = '';

            if (hour >= 5 && hour < 11) {
                timePeriod = '🌅 Morning';
            } else if (hour >= 11 && hour < 17) {
                timePeriod = '☀️ Day';
            } else if (hour >= 17 && hour < 20) {
                timePeriod = '🌇 Evening';
            } else {
                timePeriod = '🌙 Night';
            }

            timeElement.setAttribute('title', timePeriod);
        } else {
            timeElement.removeAttribute('title');
        }
    }
}

// Terminal Functionality
let terminalHistory = [];
let historyIndex = -1;
let currentDirectory = '/home/user';
let fileSystem = {
    '/': {
        type: 'directory',
        children: {
            'home': {
                type: 'directory',
                children: {
                    'user': {
                        type: 'directory',
                        children: {
                            'documents': {
                                type: 'directory',
                                children: {
                                    'readme.txt': {
                                        type: 'file',
                                        content: 'Welcome to Shashank OS Terminal!\nThis is a simulated file system.'
                                    },
                                    'todo.txt': {
                                        type: 'file',
                                        content: '1. Complete project\n2. Update documentation\n3. Fix bugs'
                                    }
                                }
                            },
                            'downloads': {
                                type: 'directory',
                                children: {}
                            },
                            'pictures': {
                                type: 'directory',
                                children: {
                                    'wallpaper.jpg': {
                                        type: 'file',
                                        content: '[IMAGE DATA]'
                                    }
                                }
                            }
                        }
                    }
                }
            },
            'bin': {
                type: 'directory',
                children: {}
            },
            'etc': {
                type: 'directory',
                children: {
                    'hosts': {
                        type: 'file',
                        content: '127.0.0.1 localhost\n::1 localhost'
                    }
                }
            }
        }
    }
};

function initializeTerminalHistory() {
    terminalHistory = [];
    historyIndex = -1;

    // Add event listener for up/down arrow keys to navigate history
    document.getElementById('terminalInput').addEventListener('keydown', function(event) {
        if (event.key === 'ArrowUp') {
            event.preventDefault();
            navigateHistory('up');
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            navigateHistory('down');
        } else if (event.key === 'Tab') {
            event.preventDefault();
            autoCompleteCommand();
        }
    });
}

function initializeTerminal() {
    const terminalInput = document.getElementById('terminalInput');
    if (terminalInput) {
        terminalInput.focus();
    }

    // Update the prompt to show current directory
    updatePrompt();
}

function updatePrompt() {
    const promptElement = document.querySelector('.terminal-prompt');
    if (promptElement) {
        const shortDir = currentDirectory.replace('/home/user', '~');
        promptElement.textContent = `user@shashank-os:${shortDir}$ `;
    }
}

// Make executeCommand available globally
window.executeCommand = function() {
    const terminalInput = document.getElementById('terminalInput');
    const command = terminalInput.value.trim();

    if (command) {
        // Add command to history
        terminalHistory.push(command);
        historyIndex = terminalHistory.length;

        // Display command
        appendToTerminal(`<span class="terminal-prompt">user@shashank-os:${currentDirectory.replace('/home/user', '~')}$ </span>${command}`);

        // Process command
        processCommand(command);

        // Clear input
        terminalInput.value = '';
    }
}

function processCommand(command) {
    const args = command.split(' ');
    const cmd = args[0].toLowerCase();

    switch(cmd) {
        case 'help':
            showHelp();
            break;
        case 'ls':
            listDirectory(args[1]);
            break;
        case 'cd':
            changeDirectory(args[1]);
            break;
        case 'pwd':
            printWorkingDirectory();
            break;
        case 'cat':
            catFile(args[1]);
            break;
        case 'echo':
            echoText(args.slice(1).join(' '));
            break;
        case 'mkdir':
            makeDirectory(args[1]);
            break;
        case 'touch':
            touchFile(args[1]);
            break;
        case 'rm':
            removeFile(args[1]);
            break;
        case 'clear':
            clearTerminal();
            break;
        case 'date':
            showDate();
            break;
        case 'whoami':
            appendToTerminal('user');
            break;
        case 'uname':
            appendToTerminal('ShashankOS v1.0');
            break;
        case 'history':
            showHistory();
            break;
        default:
            appendToTerminal(`<span class="command-error">Command not found: ${cmd}</span>`);
            appendToTerminal('Type "help" to see available commands');
    }
}

function showHelp() {
    const helpText = `
<span class="command-info">Available commands:</span>

<span class="command-success">help</span>     - Show this help message
<span class="command-success">ls</span>       - List directory contents
<span class="command-success">cd</span>       - Change directory
<span class="command-success">pwd</span>      - Print working directory
<span class="command-success">cat</span>      - Display file contents
<span class="command-success">echo</span>     - Display a line of text
<span class="command-success">mkdir</span>    - Create a directory
<span class="command-success">touch</span>    - Create an empty file
<span class="command-success">rm</span>       - Remove a file
<span class="command-success">clear</span>    - Clear the terminal
<span class="command-success">date</span>     - Display the current date and time
<span class="command-success">whoami</span>   - Display current user
<span class="command-success">uname</span>    - Display system information
<span class="command-success">history</span>  - Display command history
`;
    appendToTerminal(helpText);
}

function listDirectory(path) {
    const targetPath = resolvePath(path || '.');
    const dirObj = getObjectAtPath(targetPath);

    if (!dirObj || dirObj.type !== 'directory') {
        appendToTerminal(`<span class="command-error">ls: cannot access '${path}': No such directory</span>`);
        return;
    }

    const children = dirObj.children;
    let output = '';

    for (const name in children) {
        const item = children[name];
        if (item.type === 'directory') {
            output += `<span class="command-info">${name}/</span>  `;
        } else {
            output += `${name}  `;
        }
    }

    appendToTerminal(output || '<empty directory>');
}

function changeDirectory(path) {
    if (!path) {
        currentDirectory = '/home/user';
        updatePrompt();
        return;
    }

    const targetPath = resolvePath(path);
    const dirObj = getObjectAtPath(targetPath);

    if (!dirObj) {
        appendToTerminal(`<span class="command-error">cd: no such directory: ${path}</span>`);
        return;
    }

    if (dirObj.type !== 'directory') {
        appendToTerminal(`<span class="command-error">cd: not a directory: ${path}</span>`);
        return;
    }

    currentDirectory = targetPath;
    updatePrompt();
}

function printWorkingDirectory() {
    appendToTerminal(currentDirectory);
}

function catFile(path) {
    if (!path) {
        appendToTerminal(`<span class="command-error">cat: missing file operand</span>`);
        return;
    }

    const targetPath = resolvePath(path);
    const fileObj = getObjectAtPath(targetPath);

    if (!fileObj) {
        appendToTerminal(`<span class="command-error">cat: ${path}: No such file or directory</span>`);
        return;
    }

    if (fileObj.type !== 'file') {
        appendToTerminal(`<span class="command-error">cat: ${path}: Is a directory</span>`);
        return;
    }

    appendToTerminal(fileObj.content);
}

function echoText(text) {
    appendToTerminal(text);
}

function makeDirectory(path) {
    if (!path) {
        appendToTerminal(`<span class="command-error">mkdir: missing operand</span>`);
        return;
    }

    const parentPath = getParentPath(resolvePath(path));
    const dirName = path.split('/').pop();
    const parentObj = getObjectAtPath(parentPath);

    if (!parentObj || parentObj.type !== 'directory') {
        appendToTerminal(`<span class="command-error">mkdir: cannot create directory '${path}': No such file or directory</span>`);
        return;
    }

    if (parentObj.children[dirName]) {
        appendToTerminal(`<span class="command-error">mkdir: cannot create directory '${path}': File exists</span>`);
        return;
    }

    parentObj.children[dirName] = {
        type: 'directory',
        children: {}
    };

    appendToTerminal(`<span class="command-success">Directory created: ${path}</span>`);
}

function touchFile(path) {
    if (!path) {
        appendToTerminal(`<span class="command-error">touch: missing file operand</span>`);
        return;
    }

    const parentPath = getParentPath(resolvePath(path));
    const fileName = path.split('/').pop();
    const parentObj = getObjectAtPath(parentPath);

    if (!parentObj || parentObj.type !== 'directory') {
        appendToTerminal(`<span class="command-error">touch: cannot touch '${path}': No such file or directory</span>`);
        return;
    }

    if (!parentObj.children[fileName]) {
        parentObj.children[fileName] = {
            type: 'file',
            content: ''
        };
        appendToTerminal(`<span class="command-success">File created: ${path}</span>`);
    } else {
        appendToTerminal(`<span class="command-info">File updated: ${path}</span>`);
    }
}

function removeFile(path) {
    if (!path) {
        appendToTerminal(`<span class="command-error">rm: missing operand</span>`);
        return;
    }

    const targetPath = resolvePath(path);
    const parentPath = getParentPath(targetPath);
    const fileName = targetPath.split('/').pop();
    const parentObj = getObjectAtPath(parentPath);

    if (!parentObj || !parentObj.children[fileName]) {
        appendToTerminal(`<span class="command-error">rm: cannot remove '${path}': No such file or directory</span>`);
        return;
    }

    if (parentObj.children[fileName].type === 'directory') {
        appendToTerminal(`<span class="command-error">rm: cannot remove '${path}': Is a directory (use rm -r for directories)</span>`);
        return;
    }

    delete parentObj.children[fileName];
    appendToTerminal(`<span class="command-success">Removed: ${path}</span>`);
}

function clearTerminal() {
    document.getElementById('terminalOutput').innerHTML = '';
}

function showDate() {
    const now = new Date();
    appendToTerminal(now.toString());
}

function showHistory() {
    if (terminalHistory.length === 0) {
        appendToTerminal('No commands in history');
        return;
    }

    let historyText = '';
    terminalHistory.forEach((cmd, index) => {
        historyText += `${index + 1}  ${cmd}<br>`;
    });

    appendToTerminal(historyText);
}

function navigateHistory(direction) {
    const terminalInput = document.getElementById('terminalInput');

    if (terminalHistory.length === 0) return;

    if (direction === 'up') {
        if (historyIndex > 0) {
            historyIndex--;
            terminalInput.value = terminalHistory[historyIndex];
        }
    } else if (direction === 'down') {
        if (historyIndex < terminalHistory.length - 1) {
            historyIndex++;
            terminalInput.value = terminalHistory[historyIndex];
        } else {
            historyIndex = terminalHistory.length;
            terminalInput.value = '';
        }
    }
}

function autoCompleteCommand() {
    const terminalInput = document.getElementById('terminalInput');
    const input = terminalInput.value.trim();

    // Simple command completion
    const commands = ['help', 'ls', 'cd', 'pwd', 'cat', 'echo', 'mkdir', 'touch', 'rm', 'clear', 'date', 'whoami', 'uname', 'history'];

    if (!input.includes(' ')) {
        // Complete command
        const matches = commands.filter(cmd => cmd.startsWith(input));
        if (matches.length === 1) {
            terminalInput.value = matches[0] + ' ';
        } else if (matches.length > 1) {
            appendToTerminal(`<span class="terminal-prompt">user@shashank-os:${currentDirectory.replace('/home/user', '~')}$ </span>${input}`);
            appendToTerminal(matches.join('  '));
        }
    } else {
        // Path completion would go here (more complex)
        // For simplicity, we're not implementing full path completion
    }
}

function appendToTerminal(text) {
    const terminalOutput = document.getElementById('terminalOutput');
    const newOutput = document.createElement('div');
    newOutput.className = 'command-output';
    newOutput.innerHTML = text;
    terminalOutput.appendChild(newOutput);

    // Scroll to bottom
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function resolvePath(path) {
    if (!path) return currentDirectory;

    // Handle absolute paths
    if (path.startsWith('/')) {
        return normalizePath(path);
    }

    // Handle home directory
    if (path === '~' || path.startsWith('~/')) {
        return normalizePath('/home/user/' + path.substring(path === '~' ? 1 : 2));
    }

    // Handle relative paths
    return normalizePath(`${currentDirectory}/${path}`);
}

function normalizePath(path) {
    const parts = path.split('/').filter(Boolean);
    const result = [];

    for (const part of parts) {
        if (part === '.') continue;
        if (part === '..') {
            if (result.length > 0) result.pop();
            continue;
        }
        result.push(part);
    }

    return '/' + result.join('/');
}

function getParentPath(path) {
    const parts = path.split('/').filter(Boolean);
    parts.pop();
    return '/' + parts.join('/');
}

function getObjectAtPath(path) {
    if (path === '/') return fileSystem['/'];

    const parts = path.split('/').filter(Boolean);
    let current = fileSystem['/'];

    for (const part of parts) {
        if (!current.children || !current.children[part]) {
            return null;
        }
        current = current.children[part];
    }

    return current;
}

function updateDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = now.toLocaleDateString(undefined, options);

    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
        dateElement.innerText = dateString;
    }
}

function toggleWiFi() {
    const wifiStatus = document.getElementById('wifiStatus');
    const isConnected = wifiStatus.innerText.includes('Wi-Fi');

    wifiStatus.innerText = isConnected ? 'Wi-Fi Off' : 'Wi-Fi';
    showNotification(`Wi-Fi ${isConnected ? 'disconnected' : 'connected'}`);
}

function showNotification(message) {
    // Remove any existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerText = message;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateY(0)';
        notification.style.opacity = '1';
    }, 10);

    // Automatically remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateY(20px)';
        notification.style.opacity = '0';

        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Start Menu Functionality
function initializeStartMenu() {
    // Create the start menu panel
    const startMenuPanel = document.createElement('div');
    startMenuPanel.className = 'start-menu-panel';
    startMenuPanel.innerHTML = `
        <div class="start-menu-container">
            <div class="start-menu-search">
                <div class="search-icon">
                    <span class="material-icon">search</span>
                </div>
                <input type="text" id="startMenuSearch" placeholder="Type here to search" oninput="searchStartMenu()">
            </div>
            
            <div class="start-menu-content">
                <div class="start-menu-left">
                    <div class="start-menu-pinned">
                        <h3>Pinned</h3>
                        <div class="start-menu-apps">
                            <div class="start-menu-app" onclick="openApp('fileExplorer'); toggleStartMenu();">
                                <span class="material-icon">folder</span>
                                <span>Files</span>
                            </div>
                            <div class="start-menu-app" onclick="openApp('webBrowser'); toggleStartMenu();">
                                <span class="material-icon">language</span>
                                <span>Browser</span>
                            </div>
                            <div class="start-menu-app" onclick="openApp('settings'); toggleStartMenu();">
                                <span class="material-icon">settings</span>
                                <span>Settings</span>
                            </div>
                            <div class="start-menu-app" onclick="openApp('flappyBird'); toggleStartMenu();">
                                <div class="mini-flappy-bird"></div>
                                <span>Flappy Bird</span>
                            </div>
                            <div class="start-menu-app" onclick="openApp('paint'); toggleStartMenu();">
                                <span class="material-icon">brush</span>
                                <span>Paint</span>
                            </div>
                            <div class="start-menu-app" onclick="openApp('terminal'); toggleStartMenu();">
                                <span class="material-icon">code</span>
                                <span>Terminal</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="start-menu-recommended">
                        <h3>Recommended</h3>
                        <div class="recent-items">
                            <div class="recent-item">
                                <span class="material-icon">description</span>
                                <div class="recent-item-info">
                                    <span class="recent-item-name">Document.txt</span>
                                    <span class="recent-item-date">Today</span>
                                </div>
                            </div>
                            <div class="recent-item">
                                <span class="material-icon">image</span>
                                <div class="recent-item-info">
                                    <span class="recent-item-name">Screenshot.png</span>
                                    <span class="recent-item-date">Yesterday</span>
                                </div>
                            </div>
                            <div class="recent-item">
                                <span class="material-icon">code</span>
                                <div class="recent-item-info">
                                    <span class="recent-item-name">Project.js</span>
                                    <span class="recent-item-date">Last week</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="start-menu-right">
                    <div class="user-profile-section">
                        <div class="user-avatar">
                            <span class="material-icon">account_circle</span>
                        </div>
                        <div class="user-info">
                            <span class="user-name">${document.querySelector('.user-profile span:last-child').textContent || 'User'}</span>
                            <a href="auth.php?logout=1" class="logout-link">Sign out</a>
                        </div>
                    </div>
                    
                    <div class="quick-actions">
                        <div class="quick-action" onclick="toggleTheme(); toggleStartMenu();">
                            <span class="material-icon">dark_mode</span>
                            <span>Theme</span>
                        </div>
                        <div class="quick-action" onclick="openApp('settings'); toggleStartMenu();">
                            <span class="material-icon">settings</span>
                            <span>Settings</span>
                        </div>
                        <div class="quick-action power-button" onclick="showPowerOptions()">
                            <span class="material-icon">power_settings_new</span>
                            <span>Power</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(startMenuPanel);

    // Close start menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.start-menu-panel') &&
            !event.target.closest('#startButton') &&
            startMenuPanel.classList.contains('active')) {
            toggleStartMenu();
        }
    });
    
    // Initialize power options menu
    initializePowerOptions();
}

function toggleStartMenu() {
    const startMenuPanel = document.querySelector('.start-menu-panel');
    startMenuPanel.classList.toggle('active');
    
    // Focus search input when opening
    if (startMenuPanel.classList.contains('active')) {
        setTimeout(() => {
            const searchInput = document.getElementById('startMenuSearch');
            if (searchInput) searchInput.focus();
        }, 100);
    }
}

// Function to handle main menu button click
function toggleMainMenu() {
    // Show taskbar if it's not already visible
    const taskbar = document.getElementById('taskbar');
    if (!taskbar.classList.contains('active')) {
        toggleTaskbar();
    }
    
    // Toggle start menu
    toggleStartMenu();
}

// Taskbar Functions
function toggleTaskbar() {
    const taskbar = document.getElementById('taskbar');
    taskbar.classList.toggle('active');
    
    // Add/remove taskbar-active class to body
    if (taskbar.classList.contains('active')) {
        document.body.classList.add('taskbar-active');
    } else {
        document.body.classList.remove('taskbar-active');
    }
    
    // Store taskbar state in localStorage
    localStorage.setItem('taskbarActive', taskbar.classList.contains('active'));
}

function updateTaskbarTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;
    
    const taskbarTime = document.getElementById('taskbarTime');
    if (taskbarTime) {
        taskbarTime.textContent = timeString;
    }
}

// Notification Center Functions
function initializeNotificationCenter() {
    // Create notification center
    const notificationCenter = document.createElement('div');
    notificationCenter.className = 'notification-center';
    notificationCenter.innerHTML = `
        <div class="notification-header">
            <h3>Notifications</h3>
            <div class="notification-close" onclick="toggleNotificationCenter()">
                <span class="material-icon">close</span>
            </div>
        </div>
        <div class="notification-list">
            <div class="notification-item">
                <div class="notification-title">System Update Available</div>
                <div class="notification-message">A new system update is available. Click to install.</div>
                <div class="notification-time">Just now</div>
            </div>
            <div class="notification-item">
                <div class="notification-title">Welcome to Shashank OS</div>
                <div class="notification-message">Thank you for using Shashank OS. Explore the features!</div>
                <div class="notification-time">5 minutes ago</div>
            </div>
            <div class="notification-item">
                <div class="notification-title">Profile Updated</div>
                <div class="notification-message">Your profile information has been updated successfully.</div>
                <div class="notification-time">1 hour ago</div>
            </div>
        </div>
    `;
    document.body.appendChild(notificationCenter);
    
    // Check if taskbar should be active on page load
    const taskbarActive = localStorage.getItem('taskbarActive') === 'true';
    if (taskbarActive) {
        const taskbar = document.getElementById('taskbar');
        if (taskbar) {
            taskbar.classList.add('active');
            document.body.classList.add('taskbar-active');
        }
    }
}

function toggleNotificationCenter() {
    const notificationCenter = document.querySelector('.notification-center');
    notificationCenter.classList.toggle('active');
}

// Search Functionality
function initializeSearch() {
    // Create search data
    window.searchData = [
        { title: 'Files', type: 'app', icon: 'folder', path: 'System Apps', action: () => openApp('fileExplorer') },
        { title: 'Browser', type: 'app', icon: 'language', path: 'System Apps', action: () => openApp('webBrowser') },
        { title: 'Settings', type: 'app', icon: 'settings', path: 'System Apps', action: () => openApp('settings') },
        { title: 'Flappy Bird', type: 'app', icon: 'sports_esports', path: 'Games', action: () => openApp('flappyBird') },
        { title: 'Paint', type: 'app', icon: 'brush', path: 'System Apps', action: () => openApp('paint') },
        { title: 'Terminal', type: 'app', icon: 'code', path: 'System Apps', action: () => openApp('terminal') },
        { title: 'Profile', type: 'app', icon: 'account_circle', path: 'System Apps', action: () => openApp('profilePopup') },
        { title: 'Documents', type: 'folder', icon: 'description', path: 'Files/Documents', action: () => openApp('fileExplorer') },
        { title: 'Pictures', type: 'folder', icon: 'image', path: 'Files/Pictures', action: () => openApp('fileExplorer') },
        { title: 'Music', type: 'folder', icon: 'music_note', path: 'Files/Music', action: () => openApp('fileExplorer') },
        { title: 'Videos', type: 'folder', icon: 'movie', path: 'Files/Videos', action: () => openApp('fileExplorer') },
        { title: 'Downloads', type: 'folder', icon: 'download', path: 'Files/Downloads', action: () => openApp('fileExplorer') },
        { title: 'Change Theme', type: 'setting', icon: 'dark_mode', path: 'Settings', action: () => toggleTheme() },
        { title: 'Wallpaper Settings', type: 'setting', icon: 'wallpaper', path: 'Settings', action: () => { openApp('settings'); showWallpaperSettings(); } },
        { title: 'System Info', type: 'setting', icon: 'info', path: 'Settings', action: () => { openApp('settings'); showSystemInfo(); } }
    ];
}

function performTaskbarSearch(event) {
    const searchTerm = event.target.value.toLowerCase().trim();
    
    // Filter app icons based on search term
    filterAppIcons(searchTerm);
    
    // If Enter key is pressed and there's a search term
    if (event.key === 'Enter' && searchTerm) {
        showSearchResults(searchTerm);
    }
    
    // If Escape key is pressed, clear search and close results
    if (event.key === 'Escape') {
        event.target.value = '';
        closeSearchResults();
        // Reset app icons filter
        filterAppIcons('');
    }
}

// Function to filter app icons based on search term
function filterAppIcons(searchTerm) {
    // Get all app icons from both desktop and taskbar
    const desktopAppIcons = document.querySelectorAll('.app-grid .app-icon');
    const taskbarAppIcons = document.querySelectorAll('.taskbar-apps .taskbar-app');
    
    if (!searchTerm) {
        // If no search term, show all apps
        desktopAppIcons.forEach(icon => {
            icon.classList.remove('app-icon-faded');
        });
        taskbarAppIcons.forEach(icon => {
            icon.classList.remove('app-icon-faded');
        });
        return;
    }
    
    // Filter desktop app icons
    desktopAppIcons.forEach(icon => {
        const appName = icon.querySelector('.app-name').textContent.toLowerCase();
        if (appName.includes(searchTerm)) {
            icon.classList.remove('app-icon-faded');
        } else {
            icon.classList.add('app-icon-faded');
        }
    });
    
    // Filter taskbar app icons
    taskbarAppIcons.forEach(icon => {
        const appTitle = icon.getAttribute('title').toLowerCase();
        if (appTitle.includes(searchTerm)) {
            icon.classList.remove('app-icon-faded');
        } else {
            icon.classList.add('app-icon-faded');
        }
    });
}

function showSearchResults(searchTerm) {
    if (!searchTerm) return;
    
    // Filter search data based on search term
    const results = window.searchData.filter(item => 
        item.title.toLowerCase().includes(searchTerm) || 
        item.path.toLowerCase().includes(searchTerm) ||
        item.type.toLowerCase().includes(searchTerm)
    );
    
    // Get the search results panel
    const searchResultsPanel = document.getElementById('searchResultsPanel');
    const searchResultsList = document.getElementById('searchResultsList');
    
    // Clear previous results
    searchResultsList.innerHTML = '';
    
    if (results.length === 0) {
        // No results found
        searchResultsList.innerHTML = `
            <div class="no-results">
                <div class="no-results-icon">
                    <span class="material-icon">search_off</span>
                </div>
                <p>No results found for "${searchTerm}"</p>
                <p class="search-suggestion">Try a different search term</p>
            </div>
        `;
    } else {
        // Populate results
        results.forEach(result => {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';
            resultItem.innerHTML = `
                <div class="search-result-icon">
                    <span class="material-icon">${result.icon}</span>
                </div>
                <div class="search-result-info">
                    <div class="search-result-title">${result.title}</div>
                    <div class="search-result-path">${result.type} • ${result.path}</div>
                </div>
            `;
            
            // Add click event to open the item
            resultItem.addEventListener('click', () => {
                result.action();
                closeSearchResults();
                document.getElementById('taskbarSearch').value = '';
            });
            
            searchResultsList.appendChild(resultItem);
        });
    }
    
    // Show the search results panel
    searchResultsPanel.classList.add('active');
}

function closeSearchResults() {
    const searchResultsPanel = document.getElementById('searchResultsPanel');
    searchResultsPanel.classList.remove('active');
}

// Helper function to show wallpaper settings (placeholder)
function showWallpaperSettings() {
    // This would be implemented to focus on wallpaper settings
    showNotification('Wallpaper settings opened');
}

// Helper function to show system info (placeholder)
function showSystemInfo() {
    // This would be implemented to focus on system info
    showNotification('System info opened');
}

function initializePowerOptions() {
    // Create power options menu
    const powerMenu = document.createElement('div');
    powerMenu.className = 'power-options-menu';
    powerMenu.innerHTML = `
        <div class="power-option" onclick="restartSystem()">
            <span class="material-icon">restart_alt</span>
            <span>Restart</span>
        </div>
        <div class="power-option" onclick="sleepSystem()">
            <span class="material-icon">bedtime</span>
            <span>Sleep</span>
        </div>
        <div class="power-option" onclick="shutdownSystem()">
            <span class="material-icon">power_settings_new</span>
            <span>Shut down</span>
        </div>
    `;
    document.body.appendChild(powerMenu);
}

function showPowerOptions() {
    const powerMenu = document.querySelector('.power-options-menu');
    powerMenu.classList.toggle('active');
    
    // Close when clicking outside
    const closeHandler = function(event) {
        if (!event.target.closest('.power-options-menu') && 
            !event.target.closest('.power-button')) {
            powerMenu.classList.remove('active');
            document.removeEventListener('click', closeHandler);
        }
    };
    
    setTimeout(() => {
        document.addEventListener('click', closeHandler);
    }, 10);
}

function restartSystem() {
    showNotification('Restarting system...');
    setTimeout(() => {
        location.reload();
    }, 1500);
}

function sleepSystem() {
    showNotification('System going to sleep...');
    const overlay = document.createElement('div');
    overlay.className = 'sleep-overlay';
    document.body.appendChild(overlay);
    
    setTimeout(() => {
        overlay.style.opacity = '1';
    }, 10);
    
    // Wake up on click
    overlay.addEventListener('click', () => {
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.remove();
            showNotification('System waking up...');
        }, 500);
    });
}

function shutdownSystem() {
    showNotification('Shutting down...');
    const overlay = document.createElement('div');
    overlay.className = 'shutdown-overlay';
    overlay.innerHTML = `
        <div class="shutdown-message">
            <div class="shutdown-spinner"></div>
            <p>Shutting down</p>
        </div>
    `;
    document.body.appendChild(overlay);
    
    setTimeout(() => {
        overlay.style.opacity = '1';
    }, 10);
    
    // Redirect to login after "shutdown"
    setTimeout(() => {
        window.location.href = 'auth.php?logout=1';
    }, 3000);
}

// Enhanced Start Menu Search
function searchStartMenu() {
    const searchTerm = document.getElementById('startMenuSearch').value.toLowerCase();
    const apps = document.querySelectorAll('.start-menu-app');
    const recentItems = document.querySelectorAll('.recent-item');
    
    // If search is empty, show everything
    if (searchTerm === '') {
        apps.forEach(app => {
            app.style.display = 'flex';
            app.style.opacity = '1';
            app.style.transform = 'translateY(0)';
        });
        
        recentItems.forEach(item => {
            item.style.display = 'flex';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        });
        
        // Show section headers
        document.querySelector('.start-menu-pinned h3').style.display = 'block';
        document.querySelector('.start-menu-recommended h3').style.display = 'block';
        
        // Remove no results message if it exists
        const noResultsMsg = document.querySelector('.no-search-results');
        if (noResultsMsg) noResultsMsg.remove();
        return;
    }
    
    // Search in apps with animation
    let matchCount = 0;
    let delay = 0;
    
    apps.forEach(app => {
        const appName = app.querySelector('span:last-child').textContent.toLowerCase();
        if (appName.includes(searchTerm)) {
            app.style.display = 'flex';
            app.style.opacity = '0';
            app.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                app.style.opacity = '1';
                app.style.transform = 'translateY(0)';
            }, delay);
            
            delay += 50;
            matchCount++;
        } else {
            app.style.opacity = '0';
            app.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                app.style.display = 'none';
            }, 200);
        }
    });
    
    // Search in recent items with animation
    recentItems.forEach(item => {
        const itemName = item.querySelector('.recent-item-name').textContent.toLowerCase();
        const itemDate = item.querySelector('.recent-item-date').textContent.toLowerCase();
        
        if (itemName.includes(searchTerm) || itemDate.includes(searchTerm)) {
            item.style.display = 'flex';
            item.style.opacity = '0';
            item.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, delay);
            
            delay += 50;
            matchCount++;
        } else {
            item.style.opacity = '0';
            item.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                item.style.display = 'none';
            }, 200);
        }
    });
    
    // Show/hide section headers based on search results
    const pinnedSection = document.querySelector('.start-menu-pinned');
    const recommendedSection = document.querySelector('.start-menu-recommended');
    
    const hasVisibleApps = Array.from(apps).some(app => app.querySelector('span:last-child').textContent.toLowerCase().includes(searchTerm));
    const hasVisibleRecentItems = Array.from(recentItems).some(item => {
        const name = item.querySelector('.recent-item-name').textContent.toLowerCase();
        const date = item.querySelector('.recent-item-date').textContent.toLowerCase();
        return name.includes(searchTerm) || date.includes(searchTerm);
    });
    
    pinnedSection.querySelector('h3').style.display = hasVisibleApps ? 'block' : 'none';
    recommendedSection.querySelector('h3').style.display = hasVisibleRecentItems ? 'block' : 'none';
    
    // Show a message if no results found
    const noResultsMsg = document.querySelector('.no-search-results');
    if (matchCount === 0) {
        if (!noResultsMsg) {
            const msg = document.createElement('div');
            msg.className = 'no-search-results';
            msg.innerHTML = `
                <div class="empty-search-icon">
                    <span class="material-icons">search_off</span>
                </div>
                <p>No results found for "${searchTerm}"</p>
                <p class="search-suggestion">Try a different search term</p>
            `;
            document.querySelector('.start-menu-left').appendChild(msg);
        }
    } else if (noResultsMsg) {
        noResultsMsg.remove();
    }
}

function showPowerOptions() {
    showNotification('Power options: Restart or Shutdown would go here');
}

// Flappy Bird Game
function startFlappyBirdGame() {
    const canvas = document.getElementById('flappyBirdCanvas');
    const ctx = canvas.getContext('2d');

    let bird = {
        x: 50,
        y: 150,
        width: 30,
        height: 30,
        gravity: 0.6,
        lift: -15,
        velocity: 0
    };

    let pipes = [];
    let frame = 0;
    let score = 0;
    let gameRunning = true;

    function drawBird() {
        // Bird body
        ctx.fillStyle = '#FDD835'; // Yellow body
        ctx.beginPath();
        ctx.arc(bird.x + bird.width/2, bird.y + bird.height/2, bird.width/2, 0, Math.PI * 2);
        ctx.fill();

        // Eyes
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(bird.x + bird.width/2 + 5, bird.y + bird.height/2 - 5, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(bird.x + bird.width/2 - 5, bird.y + bird.height/2 - 5, 6, 0, Math.PI * 2);
        ctx.fill();

        // Pupils
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(bird.x + bird.width/2 + 5, bird.y + bird.height/2 - 5, 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(bird.x + bird.width/2 - 5, bird.y + bird.height/2 - 5, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Beak
        ctx.fillStyle = '#FF6F00'; // Orange beak
        ctx.beginPath();
        ctx.moveTo(bird.x + bird.width/2 + 12, bird.y + bird.height/2);
        ctx.lineTo(bird.x + bird.width/2, bird.y + bird.height/2 + 5);
        ctx.lineTo(bird.x + bird.width/2, bird.y + bird.height/2 - 5);
        ctx.closePath();
        ctx.fill();

        // Wings
        ctx.fillStyle = '#F57F17'; // Darker yellow for wings
        ctx.beginPath();
        ctx.ellipse(
            bird.x + bird.width/2 - 5,
            bird.y + bird.height/2 + 5,
            8, 5,
            Math.PI / 4, 0, Math.PI * 2
        );
        ctx.fill();
    }

    function drawPipes() {
        pipes.forEach(pipe => {
            // Draw top pipe
            const gradient1 = ctx.createLinearGradient(pipe.x, 0, pipe.x + pipe.width, 0);
            gradient1.addColorStop(0, '#10b981');
            gradient1.addColorStop(1, '#34d399');

            ctx.fillStyle = gradient1;
            ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);

            // Draw pipe cap
            ctx.fillStyle = '#059669';
            ctx.fillRect(pipe.x - 5, pipe.top - 10, pipe.width + 10, 10);

            // Draw bottom pipe
            const gradient2 = ctx.createLinearGradient(pipe.x, canvas.height, pipe.x + pipe.width, canvas.height);
            gradient2.addColorStop(0, '#10b981');
            gradient2.addColorStop(1, '#34d399');

            ctx.fillStyle = gradient2;
            ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipe.width, pipe.bottom);

            // Draw pipe cap
            ctx.fillStyle = '#059669';
            ctx.fillRect(pipe.x - 5, canvas.height - pipe.bottom, pipe.width + 10, 10);
        });
    }

    function updatePipes() {
        if (frame % 90 === 0) {
            let pipeHeight = Math.floor(Math.random() * (canvas.height / 2));
            pipes.push({
                x: canvas.width,
                width: 50,
                top: pipeHeight + 50,
                bottom: canvas.height - pipeHeight - 200
            });
        }

        pipes.forEach(pipe => {
            pipe.x -= 3;
        });

        pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);
    }

    function updateBird() {
        bird.velocity += bird.gravity;
        bird.y += bird.velocity;

        if (bird.y + bird.height > canvas.height || bird.y < 0) {
            gameRunning = false;
        }
    }

    function checkCollision() {
        pipes.forEach(pipe => {
            const birdCenterX = bird.x + bird.width/2;
            const birdCenterY = bird.y + bird.height/2;
            const radius = bird.width/2;

            if ((birdCenterX + radius > pipe.x && birdCenterX - radius < pipe.x + pipe.width) &&
                (birdCenterY - radius < pipe.top || birdCenterY + radius > canvas.height - pipe.bottom)) {
                gameRunning = false;
            }
        });
    }

    function resetGame() {
        bird.y = 150;
        bird.velocity = 0;
        pipes = [];
        frame = 0;
        score = 0;
        gameRunning = true;
    }

    function drawScore() {
        ctx.fillStyle = '#1f2937';
        ctx.font = 'bold 24px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(`Score: ${score}`, canvas.width/2, 40);
    }

    function drawBackground() {
        // Sky gradient
        const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        skyGradient.addColorStop(0, '#60a5fa');
        skyGradient.addColorStop(1, '#93c5fd');

        ctx.fillStyle = skyGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Ground
        ctx.fillStyle = '#92400e';
        ctx.fillRect(0, canvas.height - 20, canvas.width, 20);

        // Grass
        ctx.fillStyle = '#65a30d';
        ctx.fillRect(0, canvas.height - 20, canvas.width, 5);
    }

    function gameLoop() {
        if (!gameRunning) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = 'white';
            ctx.font = 'bold 24px Inter';
            ctx.textAlign = 'center';
            ctx.fillText('Game Over!', canvas.width/2, canvas.height/2 - 20);
            ctx.fillText(`Score: ${score}`, canvas.width/2, canvas.height/2 + 20);
            ctx.font = '18px Inter';
            ctx.fillText('Click to Restart', canvas.width/2, canvas.height/2 + 60);
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBackground();
        drawPipes();
        drawBird();
        updatePipes();
        updateBird();
        checkCollision();
        drawScore();

        frame++;
        score = Math.floor(frame / 30);

        requestAnimationFrame(gameLoop);
    }

    canvas.addEventListener('click', () => {
        if (!gameRunning) {
            resetGame();
            gameLoop();
        } else {
            bird.velocity = bird.lift;
        }
    });

    document.addEventListener('keydown', event => {
        if (event.code === 'Space' && gameRunning) {
            bird.velocity = bird.lift;
        }
    });

    resetGame();
    gameLoop();
}

// Paint Application
function initializePaint() {
    const canvas = new fabric.Canvas('paintCanvas');
    let tool = 'brush';
    let color = '#6366f1'; // Use primary color
    let brushSize = 5;

    canvas.isDrawingMode = true;
    canvas.freeDrawingBrush.color = color;
    canvas.freeDrawingBrush.width = brushSize;

    // Set canvas background to white
    canvas.setBackgroundColor('white', canvas.renderAll.bind(canvas));

    window.setTool = function(selectedTool) {
        tool = selectedTool;

        if (tool === 'brush') {
            canvas.isDrawingMode = true;
            canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
            canvas.freeDrawingBrush.color = color;
            canvas.freeDrawingBrush.width = brushSize;
        } else if (tool === 'eraser') {
            canvas.isDrawingMode = true;
            // Use white color for eraser in a simple implementation
            const prevColor = color;
            color = 'white';
            canvas.freeDrawingBrush.color = color;
            canvas.freeDrawingBrush.width = brushSize * 2;
            color = prevColor; // Restore color for next tool change
        } else {
            canvas.isDrawingMode = false;
        }
    };

    window.setColor = function(selectedColor) {
        color = selectedColor;
        if (tool !== 'eraser') {
            canvas.freeDrawingBrush.color = color;
        }
    };

    window.setBrushSize = function(size) {
        brushSize = parseInt(size);
        canvas.freeDrawingBrush.width = tool === 'eraser' ? brushSize * 2 : brushSize;
    };

    window.clearCanvas = function() {
        canvas.clear();
        canvas.setBackgroundColor('white', canvas.renderAll.bind(canvas));
    };

    window.saveCanvas = function() {
        const link = document.createElement('a');
        link.download = 'igloo-painting.png';
        link.href = canvas.toDataURL({
            format: 'png',
            quality: 1
        });
        link.click();
        showNotification('Image saved');
    };

    canvas.on('mouse:down', function(options) {
        if (tool === 'rectangle' || tool === 'circle') {
            const pointer = canvas.getPointer(options.e);
            const startX = pointer.x;
            const startY = pointer.y;
            let shape;

            if (tool === 'rectangle') {
                shape = new fabric.Rect({
                    left: startX,
                    top: startY,
                    fill: color,
                    width: 0,
                    height: 0,
                    selectable: true
                });
            } else if (tool === 'circle') {
                shape = new fabric.Circle({
                    left: startX,
                    top: startY,
                    fill: color,
                    radius: 0,
                    selectable: true
                });
            }

            canvas.add(shape);

            canvas.on('mouse:move', function(options) {
                const pointer = canvas.getPointer(options.e);

                if (tool === 'rectangle') {
                    shape.set({
                        width: Math.abs(startX - pointer.x),
                        height: Math.abs(startY - pointer.y),
                        left: Math.min(startX, pointer.x),
                        top: Math.min(startY, pointer.y)
                    });
                } else if (tool === 'circle') {
                    const radius = Math.sqrt(Math.pow(startX - pointer.x, 2) + Math.pow(startY - pointer.y, 2)) / 2;
                    shape.set({
                        radius: radius,
                        left: startX - radius,
                        top: startY - radius
                    });
                }

                canvas.renderAll();
            });

            canvas.on('mouse:up', function() {
                canvas.off('mouse:move');
            });
        }
    });

    // Add CSS for the notification and start menu
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            bottom: 70px;
            right: 20px;
            background-color: var(--primary-color);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 2000;
            transform: translateY(20px);
            opacity: 0;
            transition: all 0.3s ease;
        }

        .start-menu-panel {
            position: fixed;
            bottom: 60px;
            left: 0;
            width: 350px;
            background-color: var(--window-bg);
            border-radius: 12px 12px 0 0;
            box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.2);
            z-index: 1001;
            padding: 1.5rem;
            transform: translateY(100%);
            opacity: 0;
            transition: all 0.3s ease;
            display: none;
        }

        .start-menu-panel.active {
            transform: translateY(0);
            opacity: 1;
            display: block;
        }

        .start-menu-header {
            display: flex;
            align-items: center;
            margin-bottom: 1.5rem;
        }

        .start-menu-header .user-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-color: var(--primary-color);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            margin-right: 1rem;
        }

        .start-menu-header .user-name {
            font-weight: 600;
            font-size: 1.1rem;
        }

        .start-menu-apps {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1rem;
            margin-bottom: 1.5rem;
        }

        .start-menu-app {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
            cursor: pointer;
            padding: 0.75rem;
            border-radius: 8px;
            transition: background-color 0.2s ease;
        }

        .start-menu-app:hover {
            background-color: var(--background-color);
        }

        .start-menu-app .material-icon {
            color: var(--primary-color);
            font-size: 24px;
        }

        .start-menu-app span {
            font-size: 0.8rem;
            text-align: center;
        }

        .start-menu-footer {
            display: flex;
            justify-content: space-between;
            border-top: 1px solid var(--background-color);
            padding-top: 1rem;
        }

        .power-button {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: #ef4444;
            cursor: pointer;
        }
    `;
    document.head.appendChild(style);
}

// Profile Popup Functions
function initializeProfilePopup() {
    // Initialize system usage stats with random values
    updateProfileStats();
    
    // Update stats periodically
    setInterval(updateProfileStats, 30000);
    
    // Add recent activity tracking
    trackUserActivity();
}

function toggleProfilePopup() {
    const profileWindow = document.getElementById('profilePopupWindow');
    
    if (profileWindow.style.display === 'none' || !profileWindow.style.display) {
        openWindow('profilePopupWindow');
        
        // Add this activity to the activity list
        addActivityToList('Viewed profile');
        
        // Update stats when opening
        updateProfileStats();
    } else {
        closeWindow('profilePopupWindow');
    }
}

function updateProfileStats() {
    try {
        // Update CPU usage with random value between 20-60%
        const cpuUsage = Math.floor(Math.random() * 40) + 20;
        const cpuElement = document.getElementById('cpuUsage');
        if (cpuElement) {
            cpuElement.textContent = `${cpuUsage}%`;
        }
        
        // Update RAM usage with random value between 0.8-2.5 GB
        const ramUsage = (Math.random() * 1.7 + 0.8).toFixed(1);
        const ramElement = document.getElementById('ramUsage');
        if (ramElement) {
            ramElement.textContent = `${ramUsage} GB`;
        }
        
        // Update storage stats
        const storageUsed = (Math.random() * 10 + 2).toFixed(1);
        const storageFree = (20 - storageUsed).toFixed(1);
        const storageUsedElement = document.getElementById('storageUsed');
        const storageFreeElement = document.getElementById('storageFree');
        
        if (storageUsedElement) {
            storageUsedElement.textContent = `${storageUsed}`;
        }
        
        if (storageFreeElement) {
            storageFreeElement.textContent = `${storageFree}`;
        }
    } catch (error) {
        console.error('Error updating profile stats:', error);
    }
}

function addActivityToList(activity) {
    try {
        const activityList = document.getElementById('activityList');
        if (!activityList) {
            console.error('Activity list element not found');
            return;
        }
        
        // Create new activity item
        const newActivity = document.createElement('li');
        newActivity.innerHTML = `<span class="activity-time">Now</span> ${activity}`;
        
        // Add to the beginning of the list
        activityList.insertBefore(newActivity, activityList.firstChild);
        
        // Update time labels for other activities
        const timeLabels = activityList.querySelectorAll('.activity-time');
        if (timeLabels.length > 1) {
            timeLabels[1].textContent = '5m ago';
        }
        if (timeLabels.length > 2) {
            timeLabels[2].textContent = '10m ago';
        }
        
        // Remove oldest activity if more than 5
        if (activityList.children.length > 5) {
            activityList.removeChild(activityList.lastChild);
        }
    } catch (error) {
        console.error('Error adding activity to list:', error);
    }
}

function trackUserActivity() {
    try {
        // Track window openings
        const appIcons = document.querySelectorAll('.app-icon');
        appIcons.forEach(icon => {
            const appNameElement = icon.querySelector('.app-name');
            if (appNameElement) {
                const appName = appNameElement.textContent;
                icon.addEventListener('click', () => {
                    addActivityToList(`Opened ${appName}`);
                });
            }
        });
        
        // Track settings changes
        const settingsCards = document.querySelectorAll('.settings-card');
        settingsCards.forEach(card => {
            const settingNameElement = card.querySelector('span:last-child');
            if (settingNameElement) {
                const settingName = settingNameElement.textContent;
                card.addEventListener('click', () => {
                    addActivityToList(`Changed setting: ${settingName}`);
                });
            }
        });
    } catch (error) {
        console.error('Error tracking user activity:', error);
    }
}

function changeTheme() {
    document.body.classList.toggle('dark-theme');
    addActivityToList('Changed theme');
    showNotification('Theme changed');
}

function changeAvatar() {
    const avatars = [
        'face', 'person', 'sentiment_very_satisfied', 'emoji_emotions', 
        'self_improvement', 'psychology', 'sports_esports'
    ];
    
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
    const avatarIcon = document.querySelector('.profile-avatar .material-icon');
    
    if (avatarIcon) {
        avatarIcon.textContent = randomAvatar;
        addActivityToList('Changed avatar');
        showNotification('Avatar changed');
    }
}

function showSettings() {
    openApp('settings');
    closeWindow('profilePopupWindow');
    addActivityToList('Opened settings');
}

function switchProfileTab(tabId) {
    // Hide all tab panes
    const tabPanes = document.querySelectorAll('.tab-pane');
    tabPanes.forEach(pane => {
        pane.classList.remove('active');
    });
    
    // Show the selected tab pane
    const selectedPane = document.getElementById(tabId);
    if (selectedPane) {
        selectedPane.classList.add('active');
    }
    
    // Update tab buttons
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.classList.remove('active');
        if (button.getAttribute('data-tab') === tabId) {
            button.classList.add('active');
        }
    });
    
    // Add to activity list if it's not the overview tab (to avoid duplicate entries)
    if (tabId !== 'profile-overview') {
        const tabName = tabId.replace('profile-', '');
        addActivityToList(`Viewed ${tabName} tab`);
    }
}

// Enhanced Start Menu Search
function searchStartMenu() {
    const searchTerm = document.getElementById('startMenuSearch').value.toLowerCase();
    const apps = document.querySelectorAll('.start-menu-app');
    const recentItems = document.querySelectorAll('.recent-item');
    
    // If search is empty, show everything
    if (searchTerm === '') {
        apps.forEach(app => {
            app.style.display = 'flex';
            app.style.opacity = '1';
            app.style.transform = 'translateY(0)';
        });
        
        recentItems.forEach(item => {
            item.style.display = 'flex';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        });
        
        // Show section headers
        document.querySelector('.start-menu-pinned h3').style.display = 'block';
        document.querySelector('.start-menu-recommended h3').style.display = 'block';
        
        // Remove no results message if it exists
        const noResultsMsg = document.querySelector('.no-search-results');
        if (noResultsMsg) noResultsMsg.remove();
        return;
    }
    
    // Search in apps with animation
    let matchCount = 0;
    let delay = 0;
    
    apps.forEach(app => {
        const appName = app.querySelector('span:last-child').textContent.toLowerCase();
        if (appName.includes(searchTerm)) {
            app.style.display = 'flex';
            app.style.opacity = '0';
            app.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                app.style.opacity = '1';
                app.style.transform = 'translateY(0)';
            }, delay);
            
            delay += 50;
            matchCount++;
        } else {
            app.style.opacity = '0';
            app.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                app.style.display = 'none';
            }, 200);
        }
    });
    
    // Search in recent items with animation
    recentItems.forEach(item => {
        const itemName = item.querySelector('.recent-item-name').textContent.toLowerCase();
        const itemDate = item.querySelector('.recent-item-date').textContent.toLowerCase();
        
        if (itemName.includes(searchTerm) || itemDate.includes(searchTerm)) {
            item.style.display = 'flex';
            item.style.opacity = '0';
            item.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, delay);
            
            delay += 50;
            matchCount++;
        } else {
            item.style.opacity = '0';
            item.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                item.style.display = 'none';
            }, 200);
        }
    });
    
    // Show/hide section headers based on search results
    const pinnedSection = document.querySelector('.start-menu-pinned');
    const recommendedSection = document.querySelector('.start-menu-recommended');
    
    const hasVisibleApps = Array.from(apps).some(app => app.querySelector('span:last-child').textContent.toLowerCase().includes(searchTerm));
    const hasVisibleRecentItems = Array.from(recentItems).some(item => {
        const name = item.querySelector('.recent-item-name').textContent.toLowerCase();
        const date = item.querySelector('.recent-item-date').textContent.toLowerCase();
        return name.includes(searchTerm) || date.includes(searchTerm);
    });
    
    pinnedSection.querySelector('h3').style.display = hasVisibleApps ? 'block' : 'none';
    recommendedSection.querySelector('h3').style.display = hasVisibleRecentItems ? 'block' : 'none';
    
    // Show a message if no results found
    const noResultsMsg = document.querySelector('.no-search-results');
    if (matchCount === 0) {
        if (!noResultsMsg) {
            const msg = document.createElement('div');
            msg.className = 'no-search-results';
            msg.innerHTML = `
                <div class="empty-search-icon">
                    <span class="material-icons">search_off</span>
                </div>
                <p>No results found for "${searchTerm}"</p>
                <p class="search-suggestion">Try a different search term</p>
            `;
            document.querySelector('.start-menu-left').appendChild(msg);
        }
    } else if (noResultsMsg) {
        noResultsMsg.remove();
    }
}
