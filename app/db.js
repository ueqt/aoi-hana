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
        
        // 去除所有的$$hashKey, 否则无法保存
        var json = JSON.stringify(people, function( key, value ) {
            if( key === "$$hashKey" ) {
                return undefined;
            }

            return value;
        });
        
        people = JSON.parse(json);
        
        //delete people['$$hashKey'];
        delete people['_id'];      
        // if(people.relations != undefined) {
        //     for(var i=0;i<people.relations.length;i++) {
        //         delete people.relations[i]['$$hashKey'];
        //     }
        // }        
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


