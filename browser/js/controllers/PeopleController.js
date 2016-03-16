(function(){
  'use strict';
  
  angular.module('aoiHana')
       .controller('PeopleController', [
          'peopleService', '$mdDialog',
          PeopleController
       ]);

  function PeopleController(peopleService, $mdDialog) {
    var self = this;

    self.selected     = null;
    self.peoples        = [ ];
    
    peopleService
        .loadAllPeoples()
        .then(function(peoples) {
          self.peoples = [].concat(peoples);
          self.selected = peoples[0];
        });

     self.selectPeople = function (people) {
       self.selected =  people;
     }
     
     self.removePeople = function () {
         if(self.selected) {         
            peopleService
                .removePeople(self.selected)
                .then(function(peoples) {
                self.peoples = [].concat(peoples);
                self.selected = peoples[0];
                });           
         }
     }

     self.showEditPeopleDialog = function(ev) {
        $mdDialog.show({
            controller: EditPeopleController,
            templateUrl: '../view/partials/editPeople.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            locals: {
              people: self.selected  
            },
            clickOutsideToClose: false
            })
            .then(function(result) {
                self.peoples = [].concat(result.peoples);
                self.selected = result.selected;            
            }, function() {                
            });
    };

  }
  
  function EditPeopleController($scope, $mdDialog, peopleService, people) {
      
        var old = people;
      
        $scope.sexs = ['男', '女'];
        $scope.showHints = true;
      
        if(!people) {
            $scope.people =  {
                sex: '男'
            };
        } else {
            $scope.people = JSON.parse(JSON.stringify(people)); // 深复制一个
        }
      
        $scope.hide = function() {
            $mdDialog.hide();
        };
        $scope.cancel = function() {
            $mdDialog.cancel();
        };
        
        $scope.save = function() {
            if(!angular.equals($scope.people, old)) {
                if(old == undefined) {
                    peopleService
                        .addPeople($scope.people)
                        .then(function(peoples) {
                            $mdDialog.hide({peoples: peoples, selected: $scope.people}); // TODO:这里selected要从peoples里选
                        });              
                } else {
                    peopleService
                        .editPeople($scope.people)
                        .then(function(peoples) {
                            $mdDialog.hide({peoples: peoples, selected: $scope.people}); // TODO:这里selected要从peoples里选
                        }); 
                }
            } else {
                $mdDialog.cancel();
            }
        };
    }

})();