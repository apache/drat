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
  .module('drat', ['ngAnimate', 'ui.bootstrap', 'nvd3', 'nvd3ChartDirectives'])
  .controller('switch', ['$scope','$http', function($scope, $http){
      $scope.goToTwo = function() {
        console.log("goes");
      }
      $scope.max = 100;



      // this indicates which step the app is on
      $scope.value = 0;
      $scope.steps = ['Starting..'];

      // scanned list array
      $scope.arrayOfScannedFiles = [

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
             key: "application",
             y:0
         },
         {
             key: "application/java-archive",
             y: 0
         },
         {
             key: "java-archive",
             y: 0
         },
         {
             key: "html",
              y: 0
                  },
          {
             key: "text/html",
              y: 0
           },
           {
             key: "text",
             y: 0
           },
           {
             key: "image",
             y: 0
           },
           {
              key: "application/java-vm",
             y: 0
           },
           {
              key: "java-vm",
              y: 0
          },
          {
               key: "image/png",
               y: 0
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

        $scope.memorySize = 0;
        $scope.numberOfFiles = 0;
        $scope.numOfRatRunning = 0;
        $scope.numORatFinished = 0;
        $scope.numOfRatfailed = 0;




        $scope.go = function(path){
		$scope.goSecondPage = true;
         var go = {
                      method: 'POST',
                      url: '/drat/go',
                      data: {
                      dirPath: path
                       }
                     }
			//run drat
          $http(go).then(function(){});


			setTimeout(function() {
				getHealthMonitorService();
				checkingDratStatus();
               }, 3000);


        var checkingDrat;

        var sizePayload = $http({
            method: "GET",
            url: "/service/repo/size?dir=" + path
        }).success(function(response) {
            $scope.memorySize = response.memorySize;
            $scope.numberOfFiles = response.numberOfFiles;
        });

	};

	    function getHealthMonitorService(){
        		var recent = $http({
                      method: "GET",
                      url: '/service/status/oodt/raw'
                  })
                  .then(function(response) {
                        var temp = response.data.report.jobHealth;
                                               for(var i = 0; i < temp.length; i++){
                                                  if(temp[i].state == "PGE EXEC"){
                                                   $scope.numOfRatRunning = temp[i].numJobs;
                                                  }else if(temp[i].state == "FINISHED"){
                                                   $scope.numORatFinished = temp[i].numJobs;
                                                  }
                                               }
                 });

        };
        function checkingDratStatus(){
                 checkingDrat =  setInterval(function() {
                       getDratStatus();
                       getHealthMonitorService();
                       getMIMEType();
                       if($scope.steps[0] == "Crawling"){
                          getRecentIngestedFiles();
                       }
                 }, 500);

        };

        function getMIMEType(){
                         var recent = $http({
                                method: "GET",
                                url: '/service/repo/breakdown/mime'
                                })
                               .then(function(response) {
                                $scope.data = [];
                                for(var i = 0 ; i < response.data.length ; i++){
                                     if(response.data[i].numberOfFiles != null){
                                      var payload = {
                                            key: response.data[i].mimeType,
                                            y: response.data[i].numberOfFiles,
                                            };
                                            $scope.data[i] = payload;
                                            
                                     }

                                  }




});



                          };
        function getDratStatus(){


                                                          var recent = $http({
                                                                method: "GET",
                                                                url: '/service/status/drat'
                                                             })
                                                     .then(function(response) {
                                                     var res = response

                                                     if(response.data.currentState == "CRAWL"){
                                                            $scope.value = 0;
                                                            $scope.steps[0] = "Crawling";
                                                     }else if(response.data.currentState == "INDEX"){
                                                               $scope.value = 25;
                                                               $scope.steps[0] = "Indexing";
                                                     }else if(response.data.currentState == "MAP"){
                                                               $scope.value = 50;
                                                               $scope.steps[0] = "Mapping";
                                                   }else if(response.data.currentState == "REDUCE"){
                                                               $scope.value = 75;
                                                               $scope.steps[0] = "Reducing";
                                                               $scope.reduced = true;
                                                   }else if(response.data.currentState == "IDLE"){
                                                             if($scope.reduced){
                                                                $scope.value = 100;
                                                                $scope.steps[0] = "Completed";
                                                             }

                                                      }
                                                      $scope.dynamic = $scope.value;

                                                                      //if IDLE
                                                     //  clearInterval(checkingDrat);
                                                      });



                  };


        function getRecentIngestedFiles(){
                      var recent = $http({
                                method: "GET",
                                 url: '/service/products'
                                })
                            .then(function(response) {
                                $scope.arrayOfScannedFiles = [];
                                for(var i = 0 ; i < response.data.length; i ++){
                                    var payload = {
                                        listId: i,
                                        listName: response.data[i].title
                                    };
                                    $scope.arrayOfScannedFiles[i] = payload;
                                }
                            });


        };
  }])