"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var map_1 = require('../map/map');
var ViewTrip = (function () {
    function ViewTrip(navCtrl, navParams, firebaseGet) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.firebaseGet = firebaseGet;
        this._tripMembers = [];
        this._trip = this.navParams.get('trip');
        this._trip.trip.friends.forEach(function (friendID) {
            _this.firebaseGet.getUserWithID(friendID, function (user) {
                _this._tripMembers.push(user);
            });
        });
    }
    ViewTrip.prototype.goToMap = function () {
        this.navCtrl.push(map_1.Map, {
            tripMembers: this._tripMembers
        });
    };
    ViewTrip.prototype.deleteTrip = function () {
        // code to delete trip here
    };
    ViewTrip = __decorate([
        core_1.Component({
            selector: 'page-viewTrip',
            templateUrl: 'viewTrip.html'
        })
    ], ViewTrip);
    return ViewTrip;
}());
exports.ViewTrip = ViewTrip;
