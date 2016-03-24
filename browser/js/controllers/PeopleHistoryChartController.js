(function(){
  'use strict';
  
  angular.module('aoiHana')
       .controller('peopleHistoryChartController', [     
          '$scope', '$rootScope', 'peopleService', 'mapService',     
          PeopleHistoryChartController
       ]);

  function PeopleHistoryChartController($scope, $rootScope, peopleService, mapService) {
      
      $scope.people = $scope.$parent.$parent.people;
      
      var timelineDatas = [];
      var subOptions = [];
      var maps = mapService.allMaps;
      
        $scope.showPlaceName = function (p, year) {
            if(p.古名 && year) {
                return p['古名'](year) + '(今' + p['省份'] + p['地市'] + p['区县'] + ')';       
            } else {
                return p['省份'] + p['地市'] + p['区县'];
            }            
        }
      
      if($scope.people.histories) {
      
        for(var i=0;i<$scope.people.histories.length;i++) {
            var his = $scope.people.histories[i];         
            timelineDatas.push({
                    value: his.year,
                    tooltip: {
                        formatter: function (params) {
                            return 'his.thing';
                        }
                    },
                    symbol: 'diamond',                    
                    symbolSize: 16
                });            
            
            var place = _.find(maps, function (p) {
                return $scope.showPlaceName(p, his.year) == his.place;
            });
            
           subOptions.push({
                title: {
                    text: his.year + '年 在' + ' ' + his.place + ' ' + his.thing
                },              
                series: {
                    name: '中国',
                    type: 'scatter',
                    coordinateSystem: 'geo',                    
                    label: {
                        normal: {                            
                            show: true,
                            formatter: '{b}',
                            textStyle: {
                                color: '#5B00AE'
                            }
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    // tooltip: {
                    //     formatter: function (params) {
                    //         return params.data.place;
                    //     }
                    // },    
                    symbol: 'image://../image/head/' + ($scope.people.avatar || 'default') + '.png',
                    symbolSize: 30,
                    data:[
                        {name: his.place, value: [place['经度'], place['纬度']]}
                    ]
                } 
            });
         }            
      } 

        $scope.option = {
            baseOption: {
                timeline: {
                    axisType: 'category',
                    autoPlay: true,
                    inverse: true,
                    playInterval: 1000,
                    orient: 'vertical',
                    left: null,
                    right: 0,
                    top: 20,
                    bottom: 20,
                    width: 55,
                    height: null,                       
                    data: timelineDatas,
                    // label: {
                    //     formatter : function(s) {
                    //         return (new Date(s)).getFullYear();
                    //     }
                    // }
                },
                // title: {
                //     subtext: ''
                // },                
                geo: {
                    map: 'china',
                    label: {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    roam: true,
                    // itemStyle: {
                    //     normal: {
                    //         areaColor: '#323c48',
                    //         borderColor: '#404a59'
                    //     },
                    //     emphasis: {
                    //         areaColor: '#2a333d'
                    //     }
                    // }
                },
                series: [
                    // {
                    //     name: '中国',
                    //     type: 'map',
                    //     mapType: 'china',
                    //     selectedMode : 'multiple',
                    //     label: {
                    //         normal: {
                    //             show: true
                    //         },
                    //         emphasis: {
                    //             show: true
                    //         }
                    //     },
                    //     data:[
                    //         {name:'广东', selected:true}
                    //     ]
                    // }
                ]            
            },
            options: subOptions
        };      
  }
    
})();