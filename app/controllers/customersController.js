(function customersControllerIIFE(){

  var CustomersController = function($scope, customersFactory, appSettings){
    $scope.sortBy = "name";
    $scope.reverse = false;
    $scope.customers= [];
    $scope.appSettings = appSettings;

    function init(){
      // Init the customers from the factory
      //$scope.customers = customersFactory.getCustomers();
      customersFactory.getCustomers()
      .success(function(customers){
        $scope.customers = customers;
      })
      .error(function(data, status, headers, config){
        console.log("Error getting customers from the remote api");
        alert("Error getting customers from the remote api");
      });
    }

    init();

    $scope.doSort = function(propName){
      $scope.sortBy = propName;
      $scope.reverse = !$scope.reverse;
    };

  };

 CustomersController.$inject = ['$scope', 'customersFactory', 'appSettings'];

 // The Controller is part of the module.
 angular.module('customersApp').controller('customersController', CustomersController);

})();
