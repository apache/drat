      (function(){
          var app = angular.module("saChart", ['nvd3']);

          app.controller("sacController", function($scope, $http){
    
              $scope.options = {
                  chart: {
                      type: 'stackedAreaChart',
                      height: 450,
                      margin : {
                          top: 20,
                          right: 20,
                          bottom: 30,
                          left: 40
                      },
                      x: function(d){return d[0];},
                      y: function(d){return d[1];},
                      useVoronoi: false,
                      clipEdge: true,
                      duration: 100,
                      useInteractiveGuideline: true,
                      xAxis: {
                          showMaxMin: false,
                          tickFormat: function(d) {
                              return d3.time.format('%x')(new Date(d))
                          }
                      },
                      yAxis: {
                          tickFormat: function(d){
                              return d3.format(',.2f')(d);
                          }
                      },
                      zoom: {
                          enabled: true,
                          scaleExtent: [1, 10],
                          useFixedDomain: false,
                          useNiceScale: false,
                          horizontalOff: false,
                          verticalOff: true,
                          unzoomEventType: 'dblclick.zoom'
                      }
                  }
              };

              $scope.refreshSac = function(query, rows, startDate, endDate) {

                var weaponTypesParam = "ner_weapon_type_ts_md";
                var datesParam = "dates";

                $http({
                    method: "GET",
                    url: SOLR_URL + '/query?q=' + query + '+AND+dates%3A%5B' + startDate + '+TO+' + endDate + '%5D&rows=' + rows + '&fl=' + datesParam + ',' + weaponTypesParam + '&wt=json'
                })
                .then(function(response) {

                  console.log(response.data);
                  var docs = response.data.response.docs;
                  var others = "Others";
                  var tempData = [];
                  var resultingData = [];
                  var valueCount = [];
                  var sortedCount = [];
                  var topN = 10;

                  for(var i = 0; i < docs.length; i++) {

                    if(typeof docs[i][datesParam] !== 'undefined') {
                      var dates = docs[i][datesParam];
                      var weaponTypes = docs[i][weaponTypesParam];

                      for(var j = 0; j < dates.length; j++) {
                        var value = getEpochTime(dates[j]);
                        if(typeof weaponTypes === 'undefined') {
                          var key = toTitleCase(others.trim());
                          if(typeof tempData[key] === 'undefined')
                            tempData[key] = [];
                          if(typeof tempData[key][value] !== 'undefined') {
                            tempData[key][value] += 1;
                            valueCount[key] += 1;
                          }
                          else {
                            tempData[key][value] = 1;
                            valueCount[key] = 1;
                          }
                        }
                        else {
                          for(var k = 0; k < weaponTypes.length; k++) {
                            var key = toTitleCase(weaponTypes[k].trim());
                            if(typeof tempData[key] === 'undefined')
                              tempData[key] = [];
                            if(typeof tempData[key][value] !== 'undefined') {
                              tempData[key][value] += 1;
                              valueCount[key] += 1;
                            }
                            else {
                              tempData[key][value] = 1;
                              valueCount[key] = 1;
                            }
                          }
                        }
                      }
                    }
                  }

                  console.log(tempData);
                  console.log(valueCount);

                  // Formatting to include all dates
                  for(var key in valueCount)
                    sortedCount.push([key, valueCount[key]]);
                  sortedCount.sort(function(a, b) { return b[1] - a[1]; });

                  console.log(sortedCount);

                  for(var i = 0; i < sortedCount.length && i < topN; i++) {
                    var jsonObject = {};
                    jsonObject['key'] = sortedCount[i][0];
                    jsonObject['values'] = [];
                    resultingData.push(jsonObject);
                  }

                  start = new Date(getEpochTime(startDate));
                  end = new Date(getEpochTime(endDate));

                  for(var i = start; i <= end; i.setDate(i.getDate() + 1)) {
                    var value = [];
                    value[0] = i.getTime();

                    for(var j = 0; j < resultingData.length; j++) {
                      if(typeof tempData[resultingData[j].key][value[0]] === 'undefined')
                        value[1] = 0;
                      else
                        value[1] = tempData[resultingData[j].key][value[0]];
                      var insValue = jQuery.extend(true, [], value);
                      resultingData[j].values.push(insValue);
                    }

                  }

                  console.log(resultingData);
                  //console.log(JSON.stringify(resultingData));
                  $scope.data = resultingData;
                });
              };
          });
      })();
