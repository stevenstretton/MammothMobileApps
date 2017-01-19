"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var FriendsModal = (function () {
    function FriendsModal(viewCtrl, firebaseGet, params) {
        var _this = this;
        this.viewCtrl = viewCtrl;
        this.firebaseGet = firebaseGet;
        this.params = params;
        this._friendsAdded = [];
        this._selectedFriends = [];
        this._selectedFriends = params.get('selectedFriends');
        this._selectedFriends.forEach(function (friend) {
            if (friend.isAdded) {
                _this._friendsAdded.push(friend.user.key);
            }
        });
    }
    FriendsModal.prototype.submit = function () {
        this.viewCtrl.dismiss();
    };
    FriendsModal.prototype.ifInArray = function (friendID) {
        return (this._friendsAdded.indexOf(friendID) > -1);
    };
    FriendsModal.prototype.toggleClicked = function (friendID, check) {
        if (check) {
            if (!this.ifInArray(friendID)) {
                this._friendsAdded.push(friendID);
            }
        }
        else {
            if (this.ifInArray(friendID)) {
                this._friendsAdded.splice(this._friendsAdded.indexOf(friendID), 1);
            }
        }
    };
    FriendsModal = __decorate([
        core_1.Component({
            selector: 'page-friendsModal',
            templateUrl: 'friendsModal.html'
        })
    ], FriendsModal);
    return FriendsModal;
}());
exports.FriendsModal = FriendsModal;
