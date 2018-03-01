angular.module('loginCtrl',[])

.controller('LoginController', function($rootScope,$location,Auth){

    var vm = this;

    vm.loggedIn = Auth.isLoggedIn();

    // Event Listener for changing its routing  accordingly
    $rootScope.$on('$routeChangeStart',function(){

        vm.loggedIn = Auth.isLoggedIn();

        //If the user is logged in then get their details
        Auth.getUser()
            .then(function(data){
                vm.user = data.data;
            });

    });

    vm.doLogin = function(){

        vm.processing = true;
        vm.error = '';
        Auth.login(vm.loginData.username,vm.loginData.password)
            .then(function(data){

                vm.processing = false ;

                Auth.getUser()
                    .then(function(data){
                        vm.user = data.data;
                    });
                //After logging in redirect user to homepage
                if(true)
                    //console.log(data);
                    $location.path('/');
                else
                     vm.error = data.message;

            });
    }

    //LogOut
    vm.doLogOut = function(){
        Auth.logout();
        $location.path('/logout');
    }

});
