angular.module('authService',[]) //Authentication Service



.factory('Auth',function($http,$q,AuthToken){ // this factory takes htpp requests, promise object and

    var authFactory = {}; // ALl the API routes requested gets store inside AuthFactory

    //Gets the login api and authenticates user login
    authFactory.login= function(username,password){

        return $http.post('/api/login',{
            username: username,
            password:password
        })
            .then(function(response){
                AuthToken.setToken(response.data.token);
                return response.data;// Return data after getting the token
            })
    };

    authFactory.logout = function(){
        AuthToken.setToken();
    };

    //To check if user has token in frontend
    authFactory.isLoggedIn = function(){
        if(AuthToken.getToken())
            return true;
        else
            return false;
    };

    authFactory.getUser = function(){
        if(AuthToken.getToken())
            return $http.get('/api/me');
        else
            return $q.reject({message:'User has no token'});
    };

    return authFactory;
})

//Factory to Retrieve Token from Browser
.factory('AuthToken', function($window){
    var authTokenFactory = {};

    authTokenFactory.getToken = function(){
        return $window.localStorage.getItem('token'); //Getting the token from the browser
    };

    authTokenFactory.setToken = function(token){
        if(token)
            $window.localStorage.setItem('token',token);//If its a valid token store the token in the local storage
        else
            $window.localStorage.removeItem('token');

    };
    return authTokenFactory;
})

.factory('AuthInterceptor',function($q,$location,AuthToken){

    var interceptorFactory = {};

    interceptorFactory.request = function (config) {

        var token = AuthToken.getToken();
        if(token){
            config.headers['x-access-token'] = token; // Making sure that it stores token to authenticate users
        }

        return config;
    };

    interceptorFactory.response = function(response){
        if(response.status === 403)
            $location.path('/login');

        return $q.reject(response); // If it fails reject and send the promise response
    }

});

