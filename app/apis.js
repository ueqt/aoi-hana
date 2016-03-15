'use strict';

var db = require('./db');
const electron = require( 'electron' );
const ipcMain = electron.ipcMain;

ipcMain.on('loadAllPeoples', function(event, arg) {
    db.loadAllPeoples(function(err, docs) {         
        event.returnValue = docs;
    });        
});

ipcMain.on('addPeople', function(event, arg) {
    db.addPeople(function(err, docs) {         
        event.returnValue = docs;
    });        
});

ipcMain.on('removePeople', function(event, arg) {
    db.removePeople(function(err, docs) {         
        event.returnValue = docs;
    });        
});