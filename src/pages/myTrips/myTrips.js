"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var viewTrip_1 = require('../viewTrip/viewTrip');
var MyTrips = (function () {
    function MyTrips(navCtrl, firebaseGet, authenticationHandler) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.firebaseGet = firebaseGet;
        this.authenticationHandler = authenticationHandler;
        this._trips = [];
        this._currentUser = this.authenticationHandler.getCurrentUser();
        var allTrips = this.firebaseGet.getAllTrips();
        allTrips.forEach(function (trip) {
            // determine they are a part of the trip
            if ((trip.leadOrganiser === _this._currentUser.key) || (trip.friends.indexOf(_this._currentUser.key) > -1)) {
                _this.firebaseGet.getUserWithID(trip.leadOrganiser, function (leadOrganiser) {
                    _this._trips.push({
                        lead: leadOrganiser,
                        trip: trip
                    });
                });
            }
        });
    }
    MyTrips.prototype.goToTrip = function (trip) {
        this.navCtrl.push(viewTrip_1.ViewTrip, {
            trip: trip
        });
    };
    MyTrips.prototype.fetchTrips = function () {
        var _this = this;
        var allTrips = this.firebaseGet.getAllTrips();
        this._trips = [];
        allTrips.forEach(function (trip) {
            // determine they are a part of the trip
            if ((trip.leadOrganiser === _this._currentUser.key) || (trip.friends.indexOf(_this._currentUser.key) > -1)) {
                _this.firebaseGet.getUserWithID(trip.leadOrganiser, function (leadOrganiser) {
                    _this._trips.push({
                        lead: leadOrganiser,
                        trip: trip
                    });
                });
            }
        });
    };
    MyTrips.prototype.doRefresh = function (refresher) {
        console.log('Begin async operation', refresher);
        //this.fetchTrips();
        setTimeout(function () {
            console.log('Async operation has ended');
            refresher.complete();
        }, 2000);
    };
    MyTrips = __decorate([
        core_1.Component({
            selector: 'page-myTrips',
            templateUrl: 'myTrips.html'
        })
    ], MyTrips);
    return MyTrips;
}());
exports.MyTrips = MyTrips;
