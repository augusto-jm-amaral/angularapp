(function() {
    'use strict';

    angular.module('campohouse').controller('EntrarCtrl', EntrarCtrl);

    EntrarCtrl.$inject = ['$scope', '$rootScope', '$location', '$http', 'Config', 'Usuario', 'toaster', 'Login', '$window'];

    function EntrarCtrl($scope, $rootScope, $location, $http, Config, Usuario, toaster, Login, $window) {

        $scope.cadastro = {};
        $scope.login = {};
        $scope.autologin = false;

        $scope.cadastrar = function() {

            if ($scope.formCadastro.$valid) {

                Usuario.save({
                    nome: $scope.cadastro.nomeCadastro,
                    // sobreNome: $scope.cadastro.emailCadastro,
                    email: $scope.cadastro.emailCadastro,
                    telefone: $scope.cadastro.telefoneCadastro,
                    senha: $scope.cadastro.senhaCadastro
                }).then(function(res) {

                    $scope.formCadastro.nome.$touched = false;
                    $scope.formCadastro.email.$touched = false;
                    $scope.formCadastro.telefone.$touched = false;
                    $scope.formCadastro.senhaCadastro.$touched = false;
                    $scope.formCadastro.repetirSenhaCadastro.$touched = false;

                    toaster.pop({
                        type: 'success',
                        title: 'Cadastro',
                        body: "Cadastro realizado com sucesso",
                        showCloseButton: true
                    });

                    $scope.login = {
                        emailLogin: $scope.cadastro.emailCadastro,
                        senhaLogin: $scope.cadastro.senhaCadastro
                    }

                    $scope.cadastro = {};

                    $scope.autologin = true;

                    $scope.logar();

                }).catch(function(err) {
                    if(err.status==412){
                      toaster.pop({
                          type: 'info',
                          title: 'Cadastro',
                          body: "Este e-mail já está sendo utilizado",
                          showCloseButton: true
                      });
                    }
                });
            }
        };

        $scope.logar = function() {

            if ($scope.loginForm.$valid || $scope.autologin) {


                Login.login($scope.login.emailLogin, $scope.login.senhaLogin)
                    .then(function(res) {

                        $scope.loginForm.emailLogin.$touched = false;
                        $scope.loginForm.senhaLogin.$touched = false;

                        toaster.pop({
                            type: 'success',
                            title: 'Login',
                            body: "Login realizado com sucesso",
                            showCloseButton: true
                        });

                        $scope.login = {};

                        $rootScope.nome = res.data.nome;

                        $window.sessionStorage.token = res.data.token;
                        $window.sessionStorage.nome = res.data.nome;
                        $window.sessionStorage._id = res.data._id;

                        $location.path('/home');

                    }).catch(function(err) {
                        toaster.pop({
                            type: 'info',
                            title: 'Login',
                            body: "E-mail ou senha incorretos. Tente novamente",
                            showCloseButton: true
                        });
                    });

            }
        };

    }
})();
