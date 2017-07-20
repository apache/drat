      (function(){
          var app = angular.module("pieChart", ['nvd3']);

          app.controller("pieChartController", function($scope, $http){
    
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

              $scope.refreshPieChart = function(rows) {

                $http({
                    method: "GET",
                    url: SOLR_URL + '/select?q=type:software&rows=220&fl=mime_*&wt=json'
                })
                .then(function(response) {

                  console.log(response.data);
                  var docs = response.data.response.docs;
                  var resultingData = [];
                  var result = [];
                  mime = {};

                  for(var i = 0; i < docs.length; i++) {
                    doc = docs[i];
                    for(var x in doc) {
                      key = x.split("mime_")[1];
                      value = doc[x];
                      if(typeof mime[key] === 'undefined') {
                        mime[key] = value;
                      }
                      else {
                        mime[key] += value;
                      }
                    }
                  }

                  for(var x in mime) {
                    var jsonObject = {};
                    jsonObject["key"] = x;
                    jsonObject["y"] = mime[x];
                    resultingData.push(jsonObject);
                  }

                  resultingData.sort(function(a, b) {
                      return b.y - a.y;
                  });

                  for(var i = 1; i <= rows; i++) {
                    result[i-1] = resultingData[i-1];
                  }

                  console.log(result);
                  $scope.data = result;
                });
              };
          });
      })();
