(function customersFactoryIIFE(){

  // Create a customers factory
  var customersFactory = function($http){
    var factory = {};

    factory.getCustomers = function(){
      // allow access to the list of customers
      return  $http.get('http://localhost:3000/customers');
    };

    factory.getCustomer = function(customerId){
      return  $http.get('http://localhost:3000/customers/' + customerId);
    };
    return factory;
  };

  customersFactory.$inject = ['$http'];

  angular.module('customersApp').factory('customersFactory', customersFactory);
})();
