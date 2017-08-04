angular
    .module('drat', ['ngAnimate', 'ui.bootstrap', 'nvd3', 'nvd3ChartDirectives'])
    .filter('bytes', function() {
    	return function(bytes, precision) {
    		if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
    		if (typeof precision === 'undefined') precision = 1;
    		var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
    		    number = Math.floor(Math.log(bytes) / Math.log(1024)) | 0;
    		return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) +  ' ' + units[number];
    	}
    })
    .controller('switch', ['$scope', '$http', function($scope, $http) {
     
        //using jquery for displaying the spinner instead of 'No Data Available'
        $(document).ready(function() {
            $('.nv-noData').html(" ");
            $(".spinner").show("slow").delay(4300).hide("slow");
        });
        
        var intervalMs = 1000;
        
        var checkDratStatus = 
        	setInterval(getDratStatus, intervalMs);
        var checkMIMEType = 
        	setInterval(getMIMEType, intervalMs);
        var checkLicenseType = 
        	setInterval(getLicenseType, intervalMs);
        var checkHealth = 
        	setInterval(getHealthMonitorService, intervalMs);
        var checkRecentFiles = 
        	setInterval(getRecentIngestedFiles, intervalMs);
        
        $scope.max = 100;
        // this indicates which step the app is on
        $scope.value = 0;
        $scope.steps = ['Starting..'];
        $scope.showLogsBox = false; // shows logs
        $scope.scanStatus = "Scanned Files";
        $scope.goSecondPage = false;
        $scope.showFirst = true;
        $scope.goSecond = false;
        $scope.scanComplete = false;

        // scanned list array
        $scope.arrayOfScannedFiles = [];
        // this will return true once the log is available
        $scope.readOrNot = true;

        var colorArray = ['#FFAD5C', '#4093E6', '#FF7373', '#58C658', '#33ADD6', '#B56C6C', '#B8B800'];
        $scope.colorFunction = function() {
            return function(d, i) {
                return colorArray[i];
            };
        }

            var  idOfCommand ='go';

            $scope.setId = function(id) {
                idOfCommand = id;
            }

            $scope.getId = function() {
                return idOfCommand;
            }

            $scope.listOfAvailableCommands = [
                {
                    id: 'go',
                    name: 'Go'
                },
                {
                    id: 'index',
                    name: 'Index'
                },
                {
                     id: 'map',
                     name: 'Map'
                },
                {
                    id: 'reduce',
                    name: 'Reduce'
                },
                {
                    id: 'crawl',
                    name: 'Crawl'
                }
            ]



        $scope.options = {
            chart: {
                type: 'pieChart',
                height: 300,
                x: function(d) {
                    return d.key;
                },
                y: function(d) {
                    return d.y;
                },
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

        $scope.data = [];

        $scope.xFunction = function() {
            return function(d) {
                return d.key;
            };
        }
        $scope.yFunction = function() {
            return function(d) {
                return d.y;
            };
        }

        $scope.chartOptions = {
            chart: {
                type: 'discreteBarChart',
                height: 250,
                width: 350,
                margin: {
                    top: 5,
                    right: 0,
                    bottom: 95,
                    left: 0
                },

                x: function(d) {
                    return d.label;
                },
                y: function(d) {
                    return d.value;
                },
                color: $scope.colorFunction(),
                showValues: true,
                valueFormat: function(d) {
                    return d3.format('.2f')(d) + '%';
                },
                transitionDuration: 0,
                xAxis: {
                    axisLabel: 'X Axis',
		    rotateLabels: -45
                },
                yAxis: {
                    axisLabel: 'Y Axis',
                    axisLabelDistance: 30
                }
            }
        };



         // sets the data in the Modal depending on the user's choice of the rat instance
         $scope.modalObject = null;
         var rightIndex = 0;
         $scope.openModal = function(id) {
            for(var i = 1; i <= $scope.ratInstances.length; i++) {
                if(id === i) {
                    rightIndex = i - 1;
                     $scope.modalObject = $scope.ratInstances[rightIndex];

                }
            }
         }
        $scope.chartData = [];
        $scope.lastLicenseData = null;

        $scope.memorySize = 0;
        $scope.numberOfFiles = 0;
        $scope.numOfRatRunning = 0;
        $scope.numORatFinished = 0;
        $scope.numOfRatfailed = 0;

        $scope.goToSecond = function() {
            $scope.goSecond = true;
        }

        $scope.runDrat = function() {
            $scope.showFirst = true;
            var sizePayload = $http({
                method: "GET",
                url: "./service/repo/size?dir="+repoPath
            }).success(function(response) {
                $scope.memorySize = response.memorySize;
                $scope.numberOfFiles = response.numberOfFiles;
                getUnapprovedList();
            });

        };

        function setNgShow() {
            $scope.goSecondPage = true;
        }

        var cmd = idOfCommand;
        $scope.ratInstances = null;

          // get the list of logs
          function getUnapprovedList () {
                var recent = $http({
                     method: "GET",
                     url: 'service/repo/licenses/unapproved'
                })
                .then(function(response) {
                    console.log(response.data);
                    $scope.ratInstances = response.data;
                });
          };


        function getHealthMonitorService() {
            var recent = $http({
                    method: "GET",
                    url: './service/status/oodt/raw'
                })
                .then(function(response) {
                    var temp = response.data.report.jobHealth;
                    for (var i = 0; i < temp.length; i++) {
                        if (temp[i].state == "PGE EXEC") {
                            $scope.numOfRatRunning = temp[i].numJobs;
                        } else if (temp[i].state == "FINISHED") {
                            $scope.numORatFinished = temp[i].numJobs;
                        }
                    }
                });

        };

        function showLogsDiv () {
            $scope.showLogsBox = true;
          }

        function getDratStatus() {
            var recent = $http({
                    method: "GET",
                    url: './service/status/drat'
                })
                .then(function(response) {
                    var res = response

                    if (response.data == "CRAWL") {
                        $scope.value = 0;
                        $scope.steps[0] = "Crawling";
                    } else if (response.data == "INDEX") {
                    	clearInterval(checkRecentFiles);
                        $scope.value = 25;
                        $scope.steps[0] = "Indexing";
                    } else if (response.data == "MAP") {
                        $scope.value = 50;
                        $scope.steps[0] = "Mapping";
                        clearInterval(checkMIMEType);
                    } else if (response.data == "REDUCE") {
                        $scope.value = 75;
                        $scope.steps[0] = "Reducing";
                        $scope.reduced = true;
                        clearInterval(checkLicenseType);
                    } else if (response.data == "IDLE") {
                        if ($scope.reduced) {
                            $scope.value = 100;
                            $scope.steps[0] = "Completed";
                            setTimeout(showLogsDiv, 2000);
                            $scope.scanComplete = true;
                            $scope.scanStatus = "Failed RAT Instances";
                            clearInterval(checkHealth);
                            clearInterval(checkDratStatus);
                        }

                    }
                    $scope.dynamic = $scope.value;

                });

        };


        function getMIMEType() {
                      var recent = $http({
                              method: "GET",
                              url: './service/repo/breakdown/mime?limit=5'

                          })
                          .then(function(response) {
                              $scope.data = [];
                              var j = 0;
                              for (var i = 0; i < response.data.length; i++) {
                                  if(response.data[i].weight < 0.0001){

                                  }else{
                                      var payload = {
                                         key: response.data[i].type,
                                        y: response.data[i].numberOfObjects
                                     };
                                     $scope.data[j] = payload;
                                     j++;
                                  }


                              }
                          });
        };
        function getLicenseType() {
                    var recent = $http({
                            method: "GET",
                            url: './service/repo/breakdown/license'
                        })
                        .then(function(response) {
                        	if (response.data != null){
                        		if(hasChanged(response.data, $scope.lastLicenseData)){
                        			$scope.lastLicenseData = response.data;
    		                        $scope.chartData = [];                            	
                                	var charLicData = [{
    										key: "License Data",
    										values: []
    									    }];
                                	
                                	for(var i=0; i < response.data.length; i++){
                                		var licData = {
                                			"label" : response.data[i].type,
                                			"value" : response.data[i].weight*100
                                		};
    				                    charLicData[0].values.push(licData);
                                	}
                                	//console.log("CHAR LIC DATA is "+JSON.stringify(charLicData));
    			                    if(response.data.length > 0){
                                    	$scope.chartData = charLicData;    			                    	
    			                    }
    			                    //else{
    			                    //	console.log("Response data wasn't > 0 "+JSON.stringify(response.data));
    			                    //}
                        		}
                        		//else{
                        		//	console.log("License data hasn't changed.");
                        		//}
                        	}                                   
                        });
        };
                  
        function getRecentIngestedFiles() {
            var recent = $http({
                    method: "GET",
                    url: './service/products'
                })
                .then(function(response) {
                    $scope.arrayOfScannedFiles = [];
                    for (var i = 0; i < response.data.length; i++) {
                        var payload = {
                            listId: i,
                            listName: response.data[i].title
                        };

                        $scope.arrayOfScannedFiles[i] = payload;
                    }
                    console.log($scope.arrayOfScannedFiles);
                });
        };
        
       function hasChanged(jsonRespData, lastRespData){
    	   if(lastRespData == null) return true;
    	   if(jsonRespData == null) return true;
    	   
    	   var licTypes = [];
    	   for(var i=0; i < jsonRespData.length; i++){
    		   licTypes.push(jsonRespData[i].type);
    	   }
    	   
    	   //console.log("License types: "+licTypes);
    	   for(var i=0; i < licTypes.length; i++){
    		   var lType = licTypes[i];
		       var lrType = getLicType(lType, lastRespData);
		       var jrType = getLicType(lType, jsonRespData);
		       //console.log("Comparing old data: type: ["+lType+"]: old: ["+lrType+"]: new: ["+jrType+"]");
		       if (lrType != jrType){
		    	   return true;
		       }
    	   }
    	   
    	   return false;
    	   
       };
       
       function getLicType(type, jsonData){
    	   var t = -1;
    	   
    	   for(var i=0; i < jsonData.length; i++){
    		   if(jsonData[i].type == type){
    			   return jsonData[i].weight;
    		   }
    	   }
    	   return t;
       };
    }])
