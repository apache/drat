  $("input[name='attachment[]']").change(function() {
    var fileName = $(this).val();
    $("#file-name").html("<strong>Path</strong>: " + fileName + "<a href='' class='x-link'><span class='glyphicon glyphicon-remove pull-right remove-icon'></span></a>");
    $("#remote_repository").prop('disabled', true);
  });
  $(".x-link").click(function() {
    $("#file-name").html('');
    $("#remote_repository").removeAttr('disabled');
  });


  angular
  .module('drat', [])
  .controller('switch', ['$scope','$http', function($scope, $http){
      $scope.goToTwo = function() {
        console.log("goes");
      }
      $scope.max = 100;

      $scope.generateProgress = function() {
        $scope.value = 60;

        $scope.dynamic = $scope.value;
      }
      $scope.generateProgress();

      // this indicates which step the app is on
      $scope.steps = ['Indexing', 'Finished'];

      // scanned list array
      $scope.arrayOfScannedFiles = [
        {
           listId: 1,
           listName: '/foo/bar/feeb/manife'
        },
        {
          listId: 2,
          listName: '/foo/src/bar/baz/bim'
        },
        {
          listId: 3,
          listName: '2/foo/bar/blob/dj.wow'
        },
        {
          listId: 4,
          listName: '/foo/bar/baz/src.txt'
        },
        {
          listId: 5,
          listName: '/foo/bar/feeb/manife'
        },
        {
          listId: 6,
          listName: '/foo/bar/baz/keke.ke'
        },
        {
          listId: 7,
          listName: '/foo/bar/baz/keke.ke'
        },
        {
          listId: 8,
          listName: '/foo/bar/baz/keke.ke'
        },
        {
          listId: 9,
          listName: '/foo/bar/baz/keke.ke'
        },
        {
          listId: 10,
          listName: '/foo/bar/baz/keke.ke'
        },
        {
          listId: 11,
          listName: '/foo/bar/baz/keke.ke'
        },
        {
          listId: 12,
          listName: '/foo/bar/baz/keke.ke'
        },
        {
          listId: 10,
          listName: '/foo/bar/baz/keke.ke'
        },
        {
          listId: 11,
          listName: '/foo/bar/baz/keke.ke'
        },
        {
          listId: 12,
          listName: '/foo/bar/baz/keke.ke'
        },
        {
          listId: 10,
          listName: '/foo/bar/baz/keke.ke'
        },
        {
          listId: 11,
          listName: '/foo/bar/baz/keke.ke'
        },
        {
          listId: 12,
          listName: '/foo/bar/baz/keke.ke'
        },
        {
          listId: 10,
          listName: '/foo/bar/baz/keke.ke'
        },
        {
          listId: 11,
          listName: '/foo/bar/baz/keke.ke'
        },
        {
          listId: 12,
          listName: '/foo/bar/baz/keke.ke'
        },
        {
          listId: 10,
          listName: '/foo/bar/baz/keke.ke'
        },
        {
          listId: 11,
          listName: '/foo/bar/baz/keke.ke'
        },
        {
          listId: 12,
          listName: '/foo/bar/baz/keke.ke'
        }
      ]


      // this will return true once the log is available
      $scope.readOrNot = true;

      var colorArray = ['#FFAD5C', '#4093E6', '#FF7373', '#58C658', '#33ADD6', '#B56C6C', '#B8B800'];
        $scope.colorFunction = function() {
        	return function(d, i) {
            	return colorArray[i];
            };
      }

      $scope.options = {
          chart: {
              type: 'pieChart',
              height: 300,
              x: function(d){return d.key;},
              y: function(d){return d.y;},
              showLabels: true,
              transitionDuration: 500,
              labelThreshold: 0.05,
              donut: true,
              donutRatio: 0.30,
              showLabels: true,
              color: $scope.colorFunction(),
              labelType: "percent2digits",
              donutLabelsOutside: true,
              legend: {
                  margin: {
                      top: 5,
                      right: 0,
                      bottom: 0,
                      left: 0
                  }
              }
          }
      };

      $scope.data = [
         {
             key: "csv",
             y: 72.5
         },
         {
             key: "json",
             y: 12
         },
         {
             key: "text",
             y: 17.5
         }
     ];

       $scope.xFunction = function(){
          return function(d) {
              return d.key;
          };
        }
      $scope.yFunction = function(){
        	return function(d){
        		return d.y;
        	};
      }

      $scope.chartOptions = {
            chart: {
                type: 'discreteBarChart',
                height: 250,
                margin : {
                    top: 5,
                    right: 0,
                    bottom: 15,
                    left: 0
                },
                //xAxisTickFormat: $scope.yAxisFormatFunction(),
                x: function(d){return d.label;},
                y: function(d){return d.value;},
                color: $scope.colorFunction(),
                showValues: true,
                valueFormat: function(d){
                    return d3.format('.2f')(d) + '%';
                },
                transitionDuration: 500,
                xAxis: {
                    axisLabel: 'X Axis'
                },
                yAxis: {
                    axisLabel: 'Y Axis',
                    axisLabelDistance: 30
                }
            }
        };

        $scope.chartData = [
            {
                key: "Cumulative Return",
                values: [
                    {
                        "label" : "GPL" ,
                        "value" : 72.5
                    } ,
                    {
                        "label" : "MIT" ,
                        "value" : 12
                    } ,
                    {
                        "label" : "Restricted" ,
                        "value" : 17.5
                    } ,
                    {
                        "label" : "Other" ,
                        "value" : 17.5
                    } ,
                ]
            }
        ]

        $scope.memorySize = 42641;
        $scope.numOfRatRunning = 45;
        $scope.numORatFinished = 24;
        $scope.numOfRatfailed = 21;




        $scope.go = function(path){
		$scope.goSecondPage = true;
         var go = {
                      method: 'POST',
                      url: '/proteus/drat/go',
                      data: {
                      dirPath: path
                       }
                     }
			//run drat
          $http(go).then(function(){});


			setTimeout(function() {
				crawlReport();
               }, 5000);


		var getSizePath = '/proteus/service/repository/size?dir=' + path;

		var size = $http({
                      method: "GET",
                      url: getSizePath
                  })
                  .then(function(response) {

				var dd = response;

           });



	};

	    function crawlReport(){
        		var recent = $http({
                      method: "GET",
                      url: '/proteus/service/products'


                  })
                  .then(function(response) {
					//put it on $scope.arrayOfScannedFiles

						   $http({
							  method: "GET",
							  url: '/proteus/service/status?type={OODT|DRAT}',
							  data: {
							  type: "drat"
							  }
						  })
						  .then(function(response) {
								// if status is still crawl
								// crawlReport()
								// if status is not crawl (index)
								// indexReport()
						  });

                 });

        };

        function indexReport(){
        		var recent = $http({
                      method: "GET",
                       url: '/proteus/service/status?type={OODT|DRAT}',
                       data: {
							  type: "drat"
					   }
                  })
                  .then(function(response) {
					//if status is still index
					//indexReport()
					//if status is not index (map)

                 });
        };


  }])