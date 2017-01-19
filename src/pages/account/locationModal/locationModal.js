"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var LocationModal = (function () {
    function LocationModal(viewCtrl, params) {
        var _this = this;
        this.viewCtrl = viewCtrl;
        this.params = params;
        this._usersToSeeLocation = [];
        this._tripName = params.get('name');
        this._tripMembers = params.get('members');
        this._tripMembers.forEach(function (member) {
            if (member.canAlreadySee) {
                _this._usersToSeeLocation.push(member.user.key);
            }
        });
    }
    LocationModal.prototype.dismiss = function () {
        this.viewCtrl.dismiss(this._usersToSeeLocation);
    };
    LocationModal.prototype.ifInArray = function (userID) {
        return (this._usersToSeeLocation.indexOf(userID) > -1);
    };
    LocationModal.prototype.toggleClicked = function (memberID, check) {
        if (check) {
            if (!this.ifInArray(memberID)) {
                this._usersToSeeLocation.push(memberID);
            }
        }
        else {
            if (this.ifInArray(memberID)) {
                this._usersToSeeLocation.splice(this._usersToSeeLocation.indexOf(memberID), 1);
            }
        }
    };
    LocationModal = __decorate([
        core_1.Component({
            selector: 'page-locationModal',
            templateUrl: 'locationModal.html'
        })
    ], LocationModal);
    return LocationModal;
}());
exports.LocationModal = LocationModal;
