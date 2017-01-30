"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var login_1 = require("../login/login");
var Register = (function () {
    function Register(navCtrl, authenticationHandler) {
        this.navCtrl = navCtrl;
        this.authenticationHandler = authenticationHandler;
    }
    Register.prototype.register = function () {
        var _this = this;
        if (this._password === this._confirmPassword) {
            var registerPromise = this.authenticationHandler.createFirebaseUser(this._email, this._password);
            registerPromise.then(function (successResponse) {
                _this.authenticationHandler.addNewUserToDatabase(_this._email, _this._firstName, _this._surname, _this._username);
                _this.navCtrl.setRoot(login_1.Login);
            }).catch(function (errorRepsonse) {
                console.log(errorRepsonse);
            });
        }
    };
    Register = __decorate([
        core_1.Component({
            selector: 'page-register',
            templateUrl: 'register.html'
        })
    ], Register);
    return Register;
}());
exports.Register = Register;
