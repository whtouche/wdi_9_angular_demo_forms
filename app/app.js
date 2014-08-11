(function customersAppIIFE(){
  var app = angular.module('customersApp', ['ngRoute']);

  app.config(function($routeProvider){
    $routeProvider
      .when('/',
            {
              controller: 'customersController',
              templateUrl: 'app/views/customers.html'
            }
           )
      .when('/orders/:customerId',
            {
              controller: 'ordersController',
              templateUrl: 'app/views/orders.html'
            }
           )
      .otherwise({redirectTo: '/'});
  });

})();
