"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = require('@angular/core');
var angularfire2_1 = require('angularfire2');
var AuthenticationHandler = (function () {
    function AuthenticationHandler(auth$, firebaseGet, firebasePost, af, firebaseApp) {
        var _this = this;
        this.auth$ = auth$;
        this.firebaseGet = firebaseGet;
        this.firebasePost = firebasePost;
        this.af = af;
        this._fb = firebaseApp;
        // Find out what this does
        this._authState = auth$.getAuth();
        auth$.subscribe(function (state) {
            _this._authState = state;
        });
    }
    AuthenticationHandler.prototype.loginFirebase = function (email, password) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.auth$.login({
                email: email,
                password: password
            }).then(function (successResponse) {
                resolve(successResponse);
            }).catch(function (errorResponse) {
                reject(errorResponse);
            });
        });
    };
    AuthenticationHandler.prototype.logoutFirebase = function () {
        this.auth$.logout();
    };
    AuthenticationHandler.prototype.createFirebaseUser = function (email, password) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.auth$.createUser({
                email: email,
                password: password
            }).then(function (successResponse) {
                resolve(successResponse);
            }).catch(function (errorResponse) {
                reject(errorResponse);
            });
        });
    };
    AuthenticationHandler.prototype.addNewUserToDatabase = function (email, firstName, surname, username) {
        var _this = this;
        this._fb.auth().onAuthStateChanged(function (user) {
            _this.firebasePost.postNewUser(user, email, firstName, surname, username);
        });
    };
    AuthenticationHandler.prototype.getCurrentUser = function () {
        return this._currentUser;
    };
    AuthenticationHandler.prototype.setCurrentUser = function () {
        var _this = this;
        this.auth$.subscribe(function (user) {
            _this.firebaseGet.getUserWithID(user.uid, function (currentUser) {
                _this._currentUser = currentUser;
            });
        });
    };
    // This may need to change
    // Visit: https://github.com/angular/angularfire2/blob/master/docs/5-user-authentication.md for more information
    AuthenticationHandler.prototype.loginFacebook = function () {
        this.auth$.login({
            provider: angularfire2_1.AuthProviders.Facebook,
            method: angularfire2_1.AuthMethods.Popup
        });
    };
    AuthenticationHandler.prototype.logoutFacebook = function () {
        this.auth$.logout();
    };
    AuthenticationHandler = __decorate([
        core_1.Injectable(),
        __param(4, core_1.Inject(angularfire2_1.FirebaseApp))
    ], AuthenticationHandler);
    return AuthenticationHandler;
}());
exports.AuthenticationHandler = AuthenticationHandler;
