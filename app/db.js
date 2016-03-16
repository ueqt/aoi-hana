'use strict';

var Datastore = require('nedb')
    , db = new Datastore({ filename: __dirname + '/../db/history.db', autoload: true });

var dbManager = {
    loadAllPeoples: function(callback) {       
        db.find({}, callback);
    },
    
    addPeople: function(people, callback) {
        db.insert(people, function (err, newDoc) {   
            db.find({}, callback);
        });
    },
    
    editPeople: function(people, callback) {
        var id = people._id;
        delete people['$$hashKey'];
        delete people['_id'];
        console.log(people);
        db.update({ _id: id }, people, {}, function (err, newDoc) {   
            db.find({}, callback);
        });
    },
    
    removePeople: function(people, callback) {
        db.remove({ _id: people._id }, { multi: true }, function (err, numRemoved) {
            db.find({}, callback);
        });
    }
};

module.exports = dbManager;


