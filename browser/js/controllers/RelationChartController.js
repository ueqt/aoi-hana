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
                         
            $scope.links = [];
            for(var i=0;i<$scope.peoples.length;i++) {
                var p = $scope.peoples[i];
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
        
        $scope.option = {
            legend: {
                data: ['男', '女']
            },
            tooltip: {
                formatter: function(params) {
                    if(params.data.useType == 'node') {
                        return (params.data.wordName || '') + 
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
                data: $scope.peoples,
                categories: $scope.categories,
                force: {
                    //initLayout: 'circular',
                    //gravity: 10,                    
                    edgeLength: 100,
                    repulsion: 600
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
        };          
        });  
        
        $scope.editPeople = function(option, data) {
            $rootScope.$broadcast('showEditPeopleDialog', data);
        }       
  }
    
})();