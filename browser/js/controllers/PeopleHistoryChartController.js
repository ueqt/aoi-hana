(function(){
  'use strict';
  
  angular.module('aoiHana')
       .controller('peopleHistoryChartController', [     
          '$scope', '$rootScope', 'peopleService',      
          PeopleHistoryChartController
       ]);

  function PeopleHistoryChartController($scope, $rootScope, peopleService) {
      
      $scope.people = $scope.$parent.$parent.people;
      
      var fromYear = $scope.people.birthYear;
      var endYear = $scope.people.deathYear;
      
      if(!fromYear && !endYear) {
          // 如果两个都没有
          fromYear = new Date().getFullYear();
          endYear = fromYear;
      } else if(!fromYear) {
          // 没有生年
          fromYear = endYear - 120;
      } else if(!endYear) {
          // 没有卒年
          endYear = fromYear + 120;
      }
      
      var timelineDatas = [];
      var subOptions = [];
      for(var i=fromYear;i<=endYear;i++) {
          if(i==fromYear) {
              timelineDatas.push({
                    value: fromYear,
                    tooltip: {
                        formatter: function (params) {
                            return '生命的开始';
                        }
                    },
                    symbol: 'diamond',
                    symbolSize: 16
                });
          } else if(i==endYear) {
            timelineDatas.push({
                    value: endYear,
                    tooltip: {
                        formatter: function (params) {
                            return '生命的终点';
                        }
                    },
                    symbol: 'diamond',
                    symbolSize: 16
                });
          } else {
              //timelineDatas.push(i);
          }
          
          if(i==fromYear || i == endYear) {
            subOptions.push({
               title: {
                   text: i + '年'
               },
               series: {
                   name: '中国',
                        type: 'map',
                        mapType: 'china',
                        selectedMode : 'multiple',
                        roam: true,
                        label: {
                            normal: {
                                show: true
                            },
                            emphasis: {
                                show: true
                            }
                        },
                        data:[
                            {name:'上海', selected:true}
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
                tooltip: {},
                // geo: {
                //     map: 'china',
                //     label: {
                //         emphasis: {
                //             show: false
                //         }
                //     },
                //     roam: true,
                //     itemStyle: {
                //         normal: {
                //             areaColor: '#323c48',
                //             borderColor: '#404a59'
                //         },
                //         emphasis: {
                //             areaColor: '#2a333d'
                //         }
                //     }
                // },
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