(function customersControllerIIFE(){

  var CustomersController = function($scope, customersFactory, appSettings){
    $scope.sortBy = "name";
    $scope.reverse = false;
    $scope.customers= [];
    $scope.appSettings = appSettings;

    $scope.master = {};

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

    $scope.update = function(customer){
      $scope.master = angular.copy(customer);

    };
    $scope.reset = function(){
      $scope.customer = angular.copy($scope.master);
    };

    $scope.isUnchanged = function(customer) {
      return angular.equals(customer, $scope.master);
    };

    $scope.reset();

    $scope.doSort = function(propName){
      $scope.sortBy = propName;
      $scope.reverse = !$scope.reverse;
    };

  };

 CustomersController.$inject = ['$scope', 'customersFactory', 'appSettings'];

 // The Controller is part of the module.
 angular.module('customersApp').controller('customersController', CustomersController);

})();
