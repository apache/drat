      (function(){
          var app = angular.module("pieChartLicense", ['nvd3']);

          app.controller("pieChartLicenseController", function($scope, $http){
    
              $scope.options = {
                  chart: {
                      type: 'pieChart',
                      height: 500,
                      x: function(d){return d.key;},
                      y: function(d){return d.y;},
                      showLabels: true,
                      duration: 500,
                      labelThreshold: 0.01,
                      labelSunbeamLayout: true,
                      legend: {
                          margin: {
                              top: 5,
                              right: 35,
                              bottom: 5,
                              left: 0
                          }
                      }
                  }
              };

              $scope.refreshPieChartLicense = function() {

                $http({
                    method: "GET",
                    url: SOLR_URL + '/select?q=type:software&rows=220&fl=license_*&wt=json'
                })
                .then(function(response) {

                  console.log(response.data);
                  var docs = response.data.response.docs;
                  var resultingData = [];
                  var result = [];
                  license = {};

                  for(var i = 0; i < docs.length; i++) {
                    doc = docs[i];
                    for(var x in doc) {
                      key = x.split("license_")[1];
                      value = doc[x];
                      if(typeof license[key] === 'undefined') {
                        license[key] = value;
                      }
                      else {
                        license[key] += value;
                      }
                    }
                  }

                  for(var x in license) {
                    var jsonObject = {};
                    jsonObject["key"] = x;
                    jsonObject["y"] = license[x];
                    resultingData.push(jsonObject);
                  }

                  resultingData.sort(function(a, b) {
                      return b.y - a.y;
                  });

                  for(var i = 0; i < resultingData.length; i++) {
                    if(resultingData[i]["y"] == 0)
                      break;
                    result[i] = resultingData[i];
                  }

                  console.log(result);
                  $scope.data = result;
                });
              };
          });
      })();
