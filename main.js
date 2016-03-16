'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;

var menu = require('./app/menu');

const WINDOW_TITLE = '历史人物族谱';

require('electron-debug')({
    showDevTools: false
});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({ 
        width: 1024, 
        height: 768,
        resizable: true,
        center: true,
        //frame: true,
        //autoHideMenuBar: true,
        icon: 'assets/icon.jpg',
        //'accept-first-mouse': true,
        title: WINDOW_TITLE,
        show: false         
    });
    
    menu.createMenu(mainWindow);   
    mainWindow.loadURL('file://' + __dirname + '/static/view/index.html');       

    // Open the DevTools.
    //mainWindow.webContents.openDevTools();

    mainWindow.webContents.on( 'did-finish-load', function () {
        mainWindow.show();
    });
    
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
                 
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});

require('./app/apis');
