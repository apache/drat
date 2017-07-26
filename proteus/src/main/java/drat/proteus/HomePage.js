$("#files").change(function() {
     var fileName = $(this).val();
     $("#file-name").html("<strong>Path</strong>: " + fileName + "<a href='' class='x-link'><span class='glyphicon glyphicon-remove pull-right remove-icon'></span></a>");


     $("#remote_repository").prop('disabled', true);
     stateOfTextArea = $("#remote_repository").prop('disabled');
  });
  $(".x-link").click(function() {
     $("#file-name").html('');
     $("#remote_repository").removeAttr('disabled');
  });

angular
    .module('drat', [])
    .controller('switch', ['$scope', function($scope) {
        var  idOfCommand ='go';
        
        // home page loader
        $('#loader').css({'visibility': 'hidden'});
         $scope.load = function() {
              $('#loader').css({'visibility': 'show'});
         }

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
                        },
                        {
                        	id: 'reset',
                        	name: 'Reset'
                        }
                    ]
    }])