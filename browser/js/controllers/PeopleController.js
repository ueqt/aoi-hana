(function(){
  'use strict';
  
  angular.module('aoiHana')
       .controller('PeopleController', [
          '$scope', '$rootScope', 'peopleService', '$mdDialog', 'mapService', '$window',
          PeopleController
       ]);

  function PeopleController($scope, $rootScope, peopleService, $mdDialog, mapService, $window) {
    var self = this;      

    // https://github.com/angular/material/issues/4314
    self.listStyle = {
      height: ($window.innerHeight - 232) + 'px'
    };
    $window.addEventListener('resize', onResize);
    function onResize() {
      self.listStyle.height = ($window.innerHeight - 232) + 'px';
      if(!$scope.$root.$$phase) $scope.$digest();
    } 

    self.selected     = null;
    self.peoples        = [ ];
    self.maps = mapService.allMaps;
    self.searchNameText = '';
    self.nameReverse = false;
    self.birthYearReverse = false;    
    self.predicate = [(self.nameReverse ? '-' : '') + 'firstName', (self.nameReverse ? '-' : '') + 'lastName',      (self.birthYearReverse ? '-' : '') + 'birthYear'];    
    
    self.searchByName = function (text) {
        return function(item) {
            if(!text || text == '') {
                return true;
            }
            var name = '';
            if(item.wordName) {
                name = item.firstName + item.lastName + item.wordName;
            } else {
                name = item.firstName + item.lastName;
            }
            if(name.indexOf(text) > -1) {
                return true;
            }
            return false;
        };
    }
    
    self.orderByName = function() {
        self.nameReverse = !self.nameReverse;
        self.predicate = [(self.nameReverse ? '-' : '') + 'firstName', (self.nameReverse ? '-' : '') + 'lastName',      (self.birthYearReverse ? '-' : '') + 'birthYear'];   
    }
    
    self.orderByBirthYear = function() {
        self.birthYearReverse = !self.birthYearReverse;
        self.predicate = [(self.birthYearReverse ? '-' : '') + 'birthYear', (self.nameReverse ? '-' : '') + 'firstName', (self.nameReverse ? '-' : '') + 'lastName'];    
    }
    
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
                peoples: self.peoples,
                people: self.selected,
                maps: self.maps  
            },
            clickOutsideToClose: false
            })
            .then(function(result) {
                self.peoples = [].concat(result.peoples);
                self.selected = result.selected;            
            }, function() {                
            });
    };     
    
    $rootScope.$on('showEditPeopleDialog', function(event, msg) {
        self.selected = _.find(self.peoples, {'_id': msg._id});;        
        self.showEditPeopleDialog(undefined);
    });

  }
  
  function EditPeopleController($scope, $mdDialog, peopleService, peoples, people, maps) {
      
        var old = people;
      
        $scope.sexs = ['男', '女'];
        $scope.showHints = true;
        // http://stackoverflow.com/questions/15818431/how-can-i-check-an-ng-included-forms-validity-from-the-parent-scope
        // 因为ngInclude的form无法从外面访问，所以用这个变通的方法就能访问了
        $scope.editPeopleForm = {};
      
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
        
        $scope.getPeople = function (id) {
            return _.find(peoples, {'_id': id});
        }
        
        $scope.showPeopleName = function (p) {
            if(p.wordName) {
                return p.firstName + p.lastName + p.wordName;
            } else {
                return p.firstName + p.lastName;
            }
        }
        
        $scope.rs = {            
            searchTextChange: function searchTextChange(text) {
                //$log.info('Text changed to ' + text);
            },
            selectedItemChange: function selectedItemChange(item) {
                //$log.info('Item changed to ' + JSON.stringify(item));
            },
            querySearch: function querySearch (query) {
                var results = _.filter(peoples, function(o) {
                    return $scope.showPeopleName(o).indexOf(query) > -1;
                });
                
                return _.map(results, function(o) {
                   return o._id; 
                });
            }
        };
        
        $scope.queryPlaceSearch = function (query, year) {
            var results = _.filter(maps, function (o) {
                return $scope.showPlaceName(o, year).indexOf(query) > -1;
            });
            
            var temp = _.map(results, function(o) {
                   return $scope.showPlaceName(o, year); 
                });
            
            return temp;
        }
        
        $scope.showPlaceName = function (p, year) {
            if(p.古名 && year) {
                return p['古名'](year) + '(今' + p['省份'] + p['地市'] + p['区县'] + ')';       
            } else {
                return p['省份'] + p['地市'] + p['区县'];
            }            
        }
        
        $scope.addHistory = function () {
            if(!$scope.people.histories) {
                $scope.people.histories = [];
            }
            $scope.people.histories.push({     
                place: '',
                year: $scope.people.birthYear,
                thing: ''    
            });
        }
        
        $scope.removeHistory = function(his) {  
            // TODO:这里有一个小bug，如果新建了两个履历，然后删了一个，保存按钮会认为可以保存，其实校验是不通过的
            $scope.people.histories.splice($scope.people.histories.indexOf(his), 1);                  
        };
    
        $scope.addRelation = function () {
            if(!$scope.people.relations) {
                $scope.people.relations = [];
            }
            $scope.people.relations.push({
                who: '',
                type: ''            
            });
        };
        
        $scope.removeRelation = function(index) {  
            // TODO:这里有一个小bug，如果新建了两个关系，然后删了一个，保存按钮会认为可以保存，其实校验是不通过的
            $scope.people.relations.splice(index, 1);            
        };
        
        $scope.save = function() {
            if($scope.people.histories) {
                // 给履历按年份排序
                $scope.people.histories = _.orderBy($scope.people.histories, ['year'], ['asc']);
            }
            
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