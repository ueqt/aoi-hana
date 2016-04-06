(function(){
  'use strict';
  
  angular.module('aoiHana')
       .controller('RelationChartController', [     
          '$scope', '$rootScope', 'peopleService',      
          RelationChartController
       ]);

  function RelationChartController($scope, $rootScope, peopleService) {
      
      peopleService
        .loadAllPeoples()
        .then(function(peoples) {
            $scope.peoples = [].concat(peoples).map(function (node, idx) {
                node.id = idx;
                node.useType = 'node';
                node.category = node.sex;
                node.fullName = node.firstName + node.lastName;
                node.symbolSize = (node.deathYear || 0) - (node.birthYear || 0); // 按年龄显示圆大小
                if(node.symbolSize > 100) {
                    node.symbolSize = 100;
                }
                if(node.symbolSize < 10) {
                    node.symbolSize = 10;
                }                
                // 自定义图片 
                node.symbol = 'image://../image/head/' + (node.avatar || 'default') + '.png';                              
                node.itemStyle = {
                    normal: {
                        borderRadius: '50%'
                    }
                };            
                return node;
            });
        
            $scope.categories = [
                {
                    "name": "男",
                    "keyword": {},
                    "base": "男"
                },
                {
                    "name": "女",
                    "keyword": {},
                    "base": "女"
                }];
                
            var timelineDatas = [];
            var subOptions = [];                
                         
            $scope.links = [];
            var maxYear = -9999;
            var minYear = 9999;
            for(var i=0;i<$scope.peoples.length;i++) {
                var p = $scope.peoples[i];
                if(p.deathYear > maxYear) {
                    maxYear = p.deathYear;
                }
                if(p.birthYear < minYear) {
                    minYear = p.birthYear
                }
                if(p.relations) {
                    for(var j=0;j<p.relations.length;j++) {
                        var r = p.relations[j];
                        // 寻找r的index
                        var target = _.find($scope.peoples, {'_id': r.who});
                        var link = {
                            source: p.id,
                            target: target.id,
                            label: r.type,
                            useType: 'link',
                            // itemStyle: {
                            //     normal: {
                            //         lineType: 'dashed',
                            //         strokeColor: 'red',
                            //         text: '文字',
                            //         textPosition: 'inside'
                            //     }
                            // }
                            lineStyle: {
                                normal: {
                                    symbol: 'arrow'
                                }  
                            }
                        };                        
                        $scope.links.push(link);
                    }
                }
            }           
            
            for(var i=minYear;i<=maxYear;i++) {               
                
                var datas = JSON.parse(JSON.stringify(_.filter($scope.peoples, function(p) {  
                            return p.birthYear <=i && p.deathYear >=i;
                        }))); // 深复制一下，否则年龄永远是固定的      
                        
                if(datas.length <= 0) {
                    continue;
                }       

                for(var j=0;j<datas.length;j++){                    
                   // 按实际年龄来显示
                   var p = datas[j];
                    p.symbolSize = (i - p.birthYear + 1) * 2; // *2否则圈太小了                            
                    if(p.symbolSize > 200) {
                        p.symbolSize = 200;
                    }
                    if(p.symbolSize < 10) {
                        p.symbolSize = 10;
                    } 
                    
                    if(i == p.birthYear) {
                        // 出生年
                        p.itemStyle = {
                            normal: {
                                shadowBlur: 100,
                                shadowColor: '#FF0033'
                            }
                        };       
                    } else if(i == p.deathYear) {
                        // 死亡年
                        p.itemStyle = {
                            normal: {
                                shadowColor: '#0000FF',
                                shadowBlur: 100 
                            }
                        };     
                    } else {
                        p.itemStyle = {
                            normal: {
                                borderRadius: '50%',
                                shadowBlur: 0
                            }
                        }; 
                    }
                }
                                
                timelineDatas.push({
                    value: i,
                    // tooltip: {
                    //     formatter: function (params) {
                    //         return 'his.thing';
                    //     }
                    // },
                    symbol: 'diamond',                    
                    symbolSize: 16
                });                                                         
        
                subOptions.push({
                    // legend: {
                    //     data: ['男', '女']
                    // },
                    title: {
                        text: i + '年'
                    },  
                    tooltip: {
                        formatter: function(params) {
                            if(params.data.useType == 'node') {
                                return params.data.firstName + params.data.lastName + (params.data.wordName || '') + 
                                '(生:' + (params.data.birthYear || '') + 
                                '  卒:' + (params.data.deathYear || '') + ')';
                            } else if(params.data.useType == 'link') {
                                return params.data.label;
                            } else {
                                return '';
                            }                    
                        }
                    },
                    series: [{
                        type: 'graph',
                        layout: 'force',
                        animation: true,
                        roam: true,                
                        label: {
                            normal: {
                                show: true,
                                position: 'bottom',
                                formatter: function(params) {
                                    if(params.data) {
                                        return params.data.fullName;
                                    } else {
                                        return '';
                                    }
                                }                    
                            }
                        },
                        draggable: true,                
                        data: datas,
                        categories: $scope.categories,
                        force: {
                            //initLayout: 'circular',
                            //gravity: 10,                    
                            edgeLength: 200,
                            repulsion: 1200
                        },
                        // itemStyle: {
                        //     normal: {
                        //         nodeStyle: {
                        //             brushType: 'both',
                        //             strokeColor: 'rgba(255,215,0,0.4)',
                        //             lineWidth: 8
                        //         }
                        //     }  
                        // },
                        lineStyle: {
                            normal: {                                                
                                curveness: 0.3
                            }
                        },
                        links: $scope.links
                    }]
                });          
            };            
            
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
        });                                      
        
        $scope.editPeople = function(option, data) {
            $rootScope.$broadcast('showEditPeopleDialog', data);
        }       
  }
    
})();