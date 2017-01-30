"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var tabs_1 = require('../tabs/tabs');
var register_1 = require('../register/register');
var Login = (function () {
    function Login(navCtrl, authenticationHandler, firebaseGet) {
        this.navCtrl = navCtrl;
        this.authenticationHandler = authenticationHandler;
        this.firebaseGet = firebaseGet;
        this.firebaseGet.setAllTrips();
        this.firebaseGet.setAllUsers();
    }
    Login.prototype.login = function () {
        var _this = this;
        var loginPromise = this.authenticationHandler.loginFirebase(this._username, this._password);
        loginPromise.then(function (successResponse) {
            // TODO: Figure out another way to do this
            // Currently you have to wait until all trips have been pulled from firebase before a user logs in
            // This is because if the data has not been pulled from firebase, exceptions will be thrown as...
            // Cannot read Property of undefined
            _this.authenticationHandler.setCurrentUser();
            _this.navCtrl.setRoot(tabs_1.TabsPage);
        }).catch(function (errorResponse) {
            // do something with errorResponse
        });
    };
    Login.prototype.goToRegister = function () {
        //push another page onto the history stack
        //causing the nav controller to animate the new page in
        this.navCtrl.push(register_1.Register);
    };
    Login = __decorate([
        core_1.Component({
            selector: 'page-login',
            templateUrl: 'login.html'
        })
    ], Login);
    return Login;
}());
exports.Login = Login;
