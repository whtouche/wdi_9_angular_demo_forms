## Angular Factories and Services.

We are going to dive into Angular Factories and Services.

## Objectives


## Demo


#### Setup
We have copied all of the code from the last lesson [wdi_9_angular_demo_routes](https://github.com/ga-wdi-boston/wdi_9_angular_demo_routes) into this repo to start off.


Oh, all but the app/customersData.js. And we'll see why we don't need this later.

#### Singleton

The Singleton Design pattern will prevent more than one instance of a class to occur. One can only create one instance of a Singleton. 

We've seen Singletons in the past when we've used an object literal to create only one Carlot, TodoList, etc.

Factories and Services are Singletons.

[Singleton Pattern in Javascript](http://addyosmani.com/resources/essentialjsdesignpatterns/book/#singletonpatternjavascript)

#### Built-in Services
These services are provided by Angular.

* [$http](https://docs.angularjs.org/api/ng/service/$http) - Provides Ajax requests. Like the jQuery $.ajax we've used.
* [$location](https://docs.angularjs.org/api/ng/service/$location) - Represent the Browser URL. Can access and change the Browser's URL.
* $timeout
* $window
* $q - Provides a Promise that can be used to handle asynchronous callbacks.


#### Factories

Will return a custom object that can be used by multiple other components, typically controllers.

Factories use the [Revealing Module Javascript Pattern](http://addyosmani.com/resources/essentialjsdesignpatterns/book/#revealingmodulepatternjavascript) to create the custom object they return.


##### Create a app/services/customerFactory.js  

```
(function customersFactoryIIFE(){

  // Create a customers factory
  var customersFactory = function(){
    // customers is private, only available in this scope
    var customers = [
      {
        id: 1,
        joined: '2000-12-02',
        name:'John',
        city:'Chandler',
        orderTotal: 9.9956,
        orders: [
          {
            id: 1,
            product: 'Shoes',
            total: 9.9956
          }
        ]
      },
      {
        id: 2,
        joined: '1965-01-25',
        name:'Zed',
        city:'Las Vegas',
        orderTotal: 19.99,
        orders: [
          {
            id: 2,
            product: 'Baseball',
            total: 9.995
          },
          {
            id: 3,
            product: 'Bat',
            total: 9.995
          }
        ]
      },
      {
        id: 3,
        joined: '1944-06-15',
        name:'Tina',
        city:'New York',
        orderTotal:44.99,
        orders: [
          {
            id: 4,
            product: 'Headphones',
            total: 44.99
          }
        ]
      },
      {
        id: 4,
        joined: '1995-03-28',
        name:'Dave',
        city:'Seattle',
        orderTotal:101.50,
        orders: [
          {
            id: 5,
            product: 'Kindle',
            total: 101.50
          }
        ]
      }
    ]; // end of customers data

    var factory = {};

    factory.getCustomers = function(){
      // allow access to the list of customers
      return customers;
    };

    factory.getCustomer = function(customerId){
      for(var i=0, len=customers.length; i < len; i++){
        if(customers[i].id == parseInt(customerId)){
          return customers[i];
        }
      }
      return {};
    };
    return factory;
  };

  angular.module('customersApp').factory('customersFactory', customersFactory);
})();

```

* Create an IIFE that will hide all the variables from Global scope.  
* Create a Self Revealing Function, customersFactory, in the IIFE.
* In the customersFactory function we will:  
	* _hard code_ all the customer data.  
		* _We'll remove this when we get customer data from the back end_  
	* Create an empty object literal, "factory". 
	* Create a method on factory, getCustomers, that can be used to access the customer data. 
	* Create a method on factory, getCustomers, that given a customer id will return data for that customer.
	* return the object literal "factory". _It will encapsulate all it's implementation and data inside the two methods, customersData and customerData._

* Register the Angular Factory. So it's available throughout the application.


##### Add the customer factory to the index.html.

```
<!DOCTYPE html>
<html ng-app="customersApp">
  <head>
    <script src='js/angular.js'></script>
    <script src='js/angular-route.js'></script>
    <script src='app/app_done.js'></script>
   	<!-- customer factory -->
    <script src='app/services/customersFactory_done.js'></script>
    <script src='app/controllers/customersController_done.js'></script>
    <script src='app/controllers/ordersController_done.js'></script>
  </head>

  <body>
    <div ng-view></div>
  </body>
</html>

```  

##### Add the app/controllers/customersController.js

```
(function customersControllerIIFE(){

  // 1. Inject the customersFactory into this controller
  var CustomersController = function($scope, customersFactory){
    $scope.sortBy = "name";
    $scope.reverse = false;
    // 2. Create an empty customers Array in the scope.
    $scope.customers= [];

    // 3. Create a function that will set the customers Array in the scope
    // from the customersFactory
    function init(){
      // Init the customers from the factory
      $scope.customers = customersFactory.getCustomers();
    }

    // 4. Initialize the controller.
    init();

    $scope.doSort = function(propName){
      $scope.sortBy = propName;
      $scope.reverse = !$scope.reverse;
    };

  };

 // Prevent the minifier from breaking dependency injection.
 CustomersController.$inject = ['$scope', 'customersFactory'];

 // The Controller is part of the module.
 angular.module('customersApp').controller('customersController', CustomersController);

})();
```

1. Inject the customersFactory into this controller  
2. Create an empty customers Array in the scope.  
3. Create a function that will set the customers Array in the scope from the customersFactory.getCustomers method.
4. Initialize the controller.  

##### Add the app/controllers/ordersController.js

```
(function ordersControllerIIFE(){

  var OrdersController = function($scope, $routeParams, customersFactory){
    var customerId = $routeParams.customerId;
    $scope.customer= null;

    // private function, not available outside of IIFE

    function init(){
      // Search for the customer by id
      $scope.customer = customersFactory.getCustomer(customerId);
    }

    init();
  };

  // Prevent the minifier from breaking dependency injection.
  OrdersController.$inject = ['$scope', '$routeParams', 'customersFactory'];

  // The Controller is part of the module.
  angular.module('customersApp').controller('ordersController', OrdersController);

})();
```
1. Inject the customersFactory into this controller  
2. Create an null customer.  
3. Create a function, init, that will set the customers from the customerId param.
4. Initialize the controller. 

##### Add the app/views/orders.html

```
 <h3>{{ customer.name}}'s Orders</h3>
 <table>
   <tr>
	<th>Product</th>
    <th>Total</th>
  </tr>
  <tr ng-repeat="order in customer.orders">
    <td>{{ order.product }}</td>
    <td>{{ order.total | currency }}</td>
  </tr>
</table>
<br/>
```

#### Services (Optional)

Services behave somewhat like Factories. They are both Singletons. __But, a Service doesn't use the Self Revealing Function pattern.__


_This is implemented in tbe "services" branch._

##### Create a app/services/customerService.js. (Only the changes from Factory are shown.)

```
(function customersServiceIIFE(){

  // Create a customers service
  var customersService = function(){
    // customers is private, only available in this scope
    var customers = [
     ...
         ]; // end of customers data

    this.getCustomers = function(){
      // allow access to the list of customers
      return customers;
    };

    this.getCustomer = function(customerId){
      for(var i=0, len=customers.length; i < len; i++){
        if(customers[i].id == parseInt(customerId)){
          return customers[i];
        }
      }
      return {};
    };
  };

  angular.module('customersApp').service('customersService', customersService);
})();

```

* An Angular Service provides a function that gets injected into a controller. _Note: we are NOT using a Self Revealing Function here. We have remove one level of indirection_.
* The methods of a Service are set on the Service Singleton's "this" pointer.
* The Service is registered using the angular.module('appName').service(...) method.

##### Change the customers controller to use a service instead of a factory. (Only the changes from Factory are shown.)

```
(function customersControllerIIFE(){

  // 1. Inject the customersService into this controller
  var CustomersController = function($scope, customersService){
	 ...

    function init(){
      // Init the customers from the service
      $scope.customers = customersService.getCustomers();
    }
	...

  };

 // Prevent the minifier from breaking dependency injection.
 CustomersController.$inject = ['$scope', 'customersService'];

 ...

})();

```

##### Change the shell file, index.html, to use a service instead of a factory. (Only the changes from Factory are shown.)

```
 <!-- <script src='app/services/customersFactory_done.js'></script> -->
 <script src='app/services/customersService_done.js'></script>
```


#### Defining Application Wide Variables.

Provide variables that don't belong in a factory, service or controller. They are application wide variables that have values.

##### Add app settings to the app/services/values.js

```
// Create applicaton wide settings
angular.module("customersApp").value('appSettings', {
  title: "Customers Application",
  version: "1.0"
});

/*
// Use constant if you need app wide values available inside the app config
angular.module("customersApp").constant('appSettings', {
  title: "Customers Application",
  version: "1.0"
});
*/

```

##### Add the app settings to the $scope for the customers View, app/controllers/customersController.js .

```
(function customersControllerIIFE(){

  // 1. Inject application wide value, appSetting.
  var CustomersController = function($scope, customersFactory, appSettings){
	...
    // 2. Make the application wide settings available in the view.
    $scope.appSettings = appSettings;

	...

  };

 // 3. Prevent the minifier from breaking dependency injection.
 CustomersController.$inject = ['$scope', 'customersFactory', 'appSettings'];
 ...
})();

```

##### Use the app settings in the customers View, app/views/customers.html.

```
 <h3>{{ appSettings.title}} </h3>
...
<span>Total customers: {{customers.length}}</span>
<br/>
<br/>
<footer>Version: {{ appSettings.version }}</footer>

```

## Ajax (finally)

We are, finally, going to make remote API HTTP Request for the customer data. We will be using a very simple Rails app, actually created with the Rails API gem.

The repo for this API is [Customers API](https://github.com/ga-wdi-boston/wdi_9_rails_customers_api). 


But, we will need to setup the Angular Factories we created above to make Ajax calls to this API.

##### Modify the app/services/customersFactory.js 

```
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

```

* We've injected the Angular Ajax Service, __$http__ , in to this Factory. 
	* The $http behaves very much like the jQuery $.ajax  
* We have __FINALLY__ removed the hard coded customers data from our app. And now are making a remote API request for this data.  
	``$http.get('http://localhost:3000/customers') ``  
* And we are making a HTTP GET Request for a specific customers data.  
	``$http.get('http://localhost:3000/customers/' + customerId) ``  
* Doing the weasel work of preventing the javascript minification problems.  
	``customersFactory.$inject = ['$http']; ``  

Check out the $http Angular service. In each of the methods above we return a _Promise_ from the $http service. A Promise will be invoked when the Ajax asynchronous request is returned from the server.

##### Modify the app/controllers/customersController.js

```
(function customersControllerIIFE(){

  var CustomersController = function($scope, customersFactory, appSettings){

	... 
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
    ...

  };

 ...

})();

```

* We have changed the init function to handle the _Promise_ returned by the customersFactory.getCustomers method. 
	* The anonymous function passed to success will fire and update the ViewModel's, $scope, with the customers data.
	* The anonymous function passed to error will fire if there is an error communicating with the API.  

#### Modify the app/controllers/ordersController.js

```
... 
    function init(){
      // Search for the customer by id
      // $scope.customer = customersFactory.getCustomer(customerId);
      customersFactory.getCustomer(customerId)
        .success(function(customer){
          $scope.customer = customer;
        })
        .error(function(data, status, headers, config){
          console.log("Error getting a customer from the remote api");
        alert();ert("Error getting a customer from the remote api");

        });

    }

... 
```

* We have changed the init function to handle the _Promise_ returned by the customersFactory.getCustomer(customerID) method. 
	* The anonymous function passed to success will fire and update the ViewModel's, $scope, with the customer data, $scope.customer.
	* The anonymous function passed to error will fire if there is an error communicating with the API.


## Documentation

[AngularJS](https://angularjs.org/)

[API Documentation](https://docs.angularjs.org/api)

This is like the $.ajax in JQuery.  
[Ajax HTTP Service](https://docs.angularjs.org/api/ng/service/$http) 