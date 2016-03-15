'use strict';

const electron = require('electron');
const Menu = electron.Menu;
const MenuItem = electron.MenuItem;

function createMenu(mainWindow) {
    var template = [
    {
        label: '历史人物族谱',
        submenu: [
            {
                label: '关于',
                selector: 'orderFrontStandardAboutPanel:'
            },
            {
                type: 'separator'
            },
            {
                label: '隐藏窗口',
                accelerator: 'Command+H',
                selector: 'hide:'
            },
            {
                type: 'separator'
            },
            {
                label: '退出',
                accelerator: 'Command+Q',
                selector: 'performClose:'
            }
        ]
    },
    {
        label: '菜单',
        submenu: [
        {
            label: '人物一览',
            accelerator: 'CmdOrCtrl+F',
            click: function(item, focusedWindow) {
                mainWindow.webContents.send('people', 'show');
            }
        }
        ]
    },
    {
        label: '视图',
        submenu: [
        {
            label: '刷新',
            accelerator: 'CmdOrCtrl+R',
            click: function(item, focusedWindow) {
            if (focusedWindow)
                focusedWindow.reload();
            }
        },
        {
            label: '切换全屏',
            accelerator: (function() {
            if (process.platform == 'darwin')
                return 'Ctrl+Command+F';
            else
                return 'F11';
            })(),
            click: function(item, focusedWindow) {
            if (focusedWindow)
                focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
            }
        },
        {
            label: '切换开发工具',
            accelerator: (function() {
            if (process.platform == 'darwin')
                return 'Alt+Command+I';
            else
                return 'Ctrl+Shift+I';
            })(),
            click: function(item, focusedWindow) {
            if (focusedWindow)
                focusedWindow.toggleDevTools();
            }
        },
        ]
    },
    {
        label: '窗口',
        role: 'window',
        submenu: [
        {
            label: '最小化',
            accelerator: 'CmdOrCtrl+M',
            role: 'minimize'
        },
        {
            label: '关闭',
            accelerator: 'CmdOrCtrl+W',
            role: 'close'
        },
        ]
    },
    {
        label: '帮助',
        role: 'help',
        submenu: [
        {
            label: '关于',
            click: function() { 
                electron.shell.openExternal('https://github.com/ueqt/aoi-hana'); 
            }
        },
        ]
    },
    ];

    var menu = Menu.buildFromTemplate(template);
    // var menu = new Menu();
    // menu.append(new MenuItem({ label: 'MenuItem1', click: function() { console.log('item 1 clicked'); } }));
    // menu.append(new MenuItem({ type: 'separator' }));
    // menu.append(new MenuItem({ label: 'MenuItem2', type: 'checkbox', checked: true }));         
    Menu.setApplicationMenu(menu); 
}

module.exports = {
    createMenu: createMenu
};