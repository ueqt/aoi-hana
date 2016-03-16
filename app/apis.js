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
    db.addPeople(arg.people, function(err, docs) {         
        event.returnValue = docs;
    });        
});

ipcMain.on('editPeople', function(event, arg) {
    db.editPeople(arg.people, function(err, docs) {         
        event.returnValue = docs;
    });        
});

ipcMain.on('removePeople', function(event, arg) {
    db.removePeople(arg.people, function(err, docs) {         
        event.returnValue = docs;
    });        
});