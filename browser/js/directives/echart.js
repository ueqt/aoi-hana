(function(){
  'use strict';
  
    /**
     * Make DIV becoming an echart control.
     *
     * Recommend use `<echarts options="::YourOptions"></echart>`, because the options will not accept new changes
     * anyway after the directive is stabilized.
     */
  angular.module('aoiHana') 
       .directive('echart', [function() {
           
    return {
      restrict: 'E',
      template: '<div style="width: 1000px;height:600px;"></div>',
      replace: true /* tag will be replaced as div, otherwise echart cannot find a container to stay. */,
      scope: {
        options: '=',
        click: '=onClick',
        doubleClick: '=onDoubleClick'
        // data: '='
      },
      controller: ['$scope', '$element',
        function($scope, $element) {
          var options = $scope.options;
          var elem0 = $element[0];
          angular.forEach(['width', 'height'], function(prop) {
            if (options && options[prop]) {
              elem0.style[prop] = options[prop];
            }
          });
          var chart = echarts.init(elem0);

          angular.element(window).on('resize', chart.resize);
          $scope.$on('$destroy', function() {
            angular.element(window).off('resize', chart.resize);
            chart.dispose();
            chart = null;
          });
          
          // 这样可以支持echarts3
          $scope.$watch('options', function (option) {
              if(option) {
                  chart.setOption(option);
              }
          })
          
          // 定义事件
          if($scope.click) {
              chart.on('click', function (param) {
                var option = chart.getOption();
                var data = param.data;
                // 判断节点的相关数据是否正确
                if (data != null && data != undefined) {
                    $scope.click(option, data);
                }
              });
          }
          
          if($scope.doubleClick) {
              chart.on('dblclick', function (param) {
                var option = chart.getOption();
                var data = param.data;
                // 判断节点的相关数据是否正确
                if (data != null && data != undefined) {
                    $scope.doubleClick(option, data);
                }
              });
          }
          
          // 下面是echarts2的
        //  chart.setOption(options, /*overwrite=*/true);

        //   $scope.$watch('data', function(data) {
        //      if (data) {
        //        chart.addData(data);
        //      }
        //   });
        }]
    };
  }]);

})();