"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var addFriendModal_1 = require("./addFriendModal/addFriendModal");
var Friends = (function () {
    function Friends(navCtrl, firebaseGet, authenticationHandler, modalCtrl, firebasePush, firebasePut) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.firebaseGet = firebaseGet;
        this.authenticationHandler = authenticationHandler;
        this.modalCtrl = modalCtrl;
        this.firebasePush = firebasePush;
        this.firebasePut = firebasePut;
        this._friends = [];
        this._currentUser = this.authenticationHandler.getCurrentUser();
        this._currentUser.friends.forEach(function (friendID) {
            _this.firebaseGet.getUserWithID(friendID, function (friend) {
                _this._friends.push(friend);
            });
        });
    }
    Friends.prototype.unfriend = function (friend) {
        var index = this._friends.indexOf(friend);
        this._friends.splice(index, 1);
    };
    Friends.prototype.presentAddFriendModal = function () {
        var _this = this;
        var modal = this.modalCtrl.create(addFriendModal_1.AddFriendModal, {
            currentUser: this._currentUser
        });
        modal.onDidDismiss(function (setOfFriends) {
            setOfFriends.forEach(function (friend) {
                _this._friends.push(friend);
            });
            _this.firebasePut.putUserFriends(_this._currentUser.key, setOfFriends);
        });
        modal.present();
    };
    Friends = __decorate([
        core_1.Component({
            selector: 'page-friends',
            templateUrl: 'friends.html'
        })
    ], Friends);
    return Friends;
}());
exports.Friends = Friends;
