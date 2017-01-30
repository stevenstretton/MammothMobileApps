"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var Map = (function () {
    function Map(navCtrl, navParams, authenticationHandler) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.authenticationHandler = authenticationHandler;
        this._membersAllowingToSeeLocation = [];
        this._tripMembers = this.navParams.get('tripMembers');
        this._currentUser = this.authenticationHandler.getCurrentUser();
        this._currentUserLat = this._currentUser.location["lat"];
        this._currentUserLng = this._currentUser.location["lng"];
        this._tripMembers.forEach(function (tripMember) {
            // determining they have a location and that the current user is allowed to see it
            if ((tripMember.location) && (tripMember.usersToSeeLocation.indexOf(_this._currentUser.key) > -1)) {
                _this._membersAllowingToSeeLocation.push(tripMember);
            }
        });
    }
    Map = __decorate([
        core_1.Component({
            selector: 'page-map',
            templateUrl: 'map.html'
        })
    ], Map);
    return Map;
}());
exports.Map = Map;
