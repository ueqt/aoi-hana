'use strict';

var Datastore = require('nedb')
    , db = new Datastore({ filename: __dirname + '/../db/history.db', autoload: true });

var dbManager = {
    loadAllPeoples: function(callback) {       
        db.find({}, callback);
    },
    
    addPeople: function(callback) {
        db.insert({ name: '张飞' }, function (err, newDoc) {   
            db.find({}, callback);
        });
    },
    
    removePeople: function(callback) {
        db.remove({ name: '张飞' }, { multi: true }, function (err, numRemoved) {
            db.find({}, callback);
        });
    }
};

module.exports = dbManager;


