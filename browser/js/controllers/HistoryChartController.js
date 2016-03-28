(function(){
  'use strict';
  
  angular.module('aoiHana')
       .controller('HistoryChartController', [     
          '$scope', '$rootScope', 'peopleService', 'mapService',     
          HistoryChartController
       ]);

  function HistoryChartController($scope, $rootScope, peopleService, mapService) {
      
        $scope.showPlaceName = function (p, year) {
            if(p.古名 && year) {
                return p['古名'](year) + '(今' + p['省份'] + p['地市'] + p['区县'] + ')';       
            } else {
                return p['省份'] + p['地市'] + p['区县'];
            }            
        }      
      
      peopleService
        .loadAllPeoples()
        .then(function(peoples) {
            $scope.peoples = [].concat(peoples);
                  
            var timelineDatas = [];
            var subOptions = [];
            var maps = mapService.allMaps;                        
            
            var allDatas = [];
            
            // 处理数据
            for(var i=0;i<$scope.peoples.length;i++) {
                var people = $scope.peoples[i];
                if(people.histories) {
                    for(var j=0;j<people.histories.length;j++) {
                        var his = people.histories[j];
                        // 按年份归类数据
                        var yearData = allDatas[his.year];
                        if(!yearData) {
                            allDatas[his.year] = [];
                            yearData = allDatas[his.year];
                        }
                        
                        yearData.push({who: people, history: his});
                    }
                }
            }
            
            var keys = Object.keys(allDatas);
            for(var i=0;i<keys.length;i++) {
                timelineDatas.push({
                            value: keys[i],    
                            symbol: 'diamond',                    
                            symbolSize: 16
                        });  
                        
                // 每个人一个数据
                var legendDatas = [];
                var series = [];
                // 先计算一下每个位置多少人
                var samePlaces = [];       
                var samePlaceTooltip = [];         
                for(var j=0;j<allDatas[keys[i]].length;j++) {
                    var yearData = allDatas[keys[i]][j];
                    if(samePlaces[yearData.history.place]) {
                        samePlaces[yearData.history.place]++;                        
                    } else {
                        samePlaces[yearData.history.place] = 1;
                    }   
                    
                    if(!samePlaceTooltip[yearData.history.place]) {
                        samePlaceTooltip[yearData.history.place] = '';                        
                    }                    
                    if(samePlaceTooltip[yearData.history.place] != '') {
                        samePlaceTooltip[yearData.history.place] += '</br>'; 
                    } else {
                        samePlaceTooltip[yearData.history.place] += yearData.history.place + '</br>';
                    }
                    samePlaceTooltip[yearData.history.place] += '<img width="30" src="../image/head/' + (yearData.who.avatar || 'default') + '.png"></img>' + yearData.who.firstName + yearData.who.lastName + ' ' +   yearData.history.thing;                      
                }
                
                // Echarts3恶心地去掉了NotMerge功能，意味着如果有人这年没发生事情，会保留他之前的状态，也就是死人会一直显示
                // 这里用空间换bug吧，默认加上所有人的series，坐标给到（0，0），让人看不见他们，就像去了地狱一样
                // 就是不知道人多了以后性能能抗住么
                for(var k=0;k<$scope.peoples.length;k++) {
                    var people = $scope.peoples[k];
                    series.push({
                        name: people._id,
                        type: 'scatter',
                        coordinateSystem: 'geo',      
                        roam: true,         
                        label: {
                            normal: {                            
                                show: false
                            },
                            emphasis: {
                                show: false
                            }
                        },            
                        data:[
                            {name: '未知', value: [0, 0, 0]}
                        ]
                    });
                }
                
                for(var j=0;j<allDatas[keys[i]].length;j++) {
                    var yearData = allDatas[keys[i]][j];
                    // legendDatas.push({
                    //    name: yearData.who._id,
                    //    icon: 'image://../image/head/' + (yearData.who.avatar || 'default') + '.png',
                    //    textStyle: {
                    //        fontSize: 30
                    //    }  
                    // });  
                    
                    var place = _.find(maps, function (p) {
                        return $scope.showPlaceName(p, yearData.history.year) == yearData.history.place;
                    });                                                                            
                    
                    var jingdu = place['经度'];
                    var weidu = place['纬度'];
                    // 一个点多个人时，把后面的人向后排
                    jingdu = jingdu + j * 50;
                    
                    var serieIndex = _.findIndex(series, {name: yearData.who._id});
                    series[serieIndex] = {
                        name: yearData.who._id,
                        type: 'scatter',
                        coordinateSystem: 'geo',      
                        roam: true,         
                        label: {
                            normal: {                            
                                show: true,
                                position: 'right',
                                formatter: function(params) {
                                    return params.value[2] + '人';
                                },
                                textStyle: {
                                    color: '#5B00AE'
                                }
                            },
                            emphasis: {
                                show: true
                            }
                        },                              
                        symbol: 'image://../image/head/' + (yearData.who.avatar || 'default') + '.png',
                        symbolSize: 30,
                        data:[
                            {name: yearData.history.place, value: [jingdu, weidu, samePlaces[yearData.history.place], samePlaceTooltip[yearData.history.place]]}
                        ]
                    };
                }
                                        
                subOptions.push({
                        title: {
                            text: keys[i] + '年 事件一览',
                            left: 'center'
                        },              
                        tooltip: {
                            formatter: function(params) {
                                return params.value[3];
                            }
                        },
                        // legend: {
                        //     show: false,
                        //     orient: 'vertical',
                        //     left: 20,
                        //     data: legendDatas
                        // },
                        series: series
                    });                           
            }                      

            $scope.option = {
                baseOption: {
                    timeline: {
                        axisType: 'category',
                        autoPlay: true,
                        inverse: true,
                        playInterval: 3000,
                        orient: 'vertical',
                        left: null,
                        right: 0,
                        top: 20,
                        bottom: 20,
                        width: 55,
                        height: null,                                             
                        data: timelineDatas
                    },               
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
                        roam: true
                    },
                    series: []            
                },
                options: subOptions
            };                                                
      
        });  
             
  }
    
})();