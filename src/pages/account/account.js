"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var login_1 = require('../login/login');
var locationModal_1 = require("./locationModal/locationModal");
var Account = (function () {
    function Account(app, navCtrl, actionSheetCtrl, platform, modalCtrl, authenticationHandler, firebaseGet, firebasePush, firebasePut) {
        var _this = this;
        this.app = app;
        this.navCtrl = navCtrl;
        this.actionSheetCtrl = actionSheetCtrl;
        this.platform = platform;
        this.modalCtrl = modalCtrl;
        this.authenticationHandler = authenticationHandler;
        this.firebaseGet = firebaseGet;
        this.firebasePush = firebasePush;
        this.firebasePut = firebasePut;
        this._usersToSeeLocation = [];
        this._currentUserTrips = [];
        this._currentUser = this.authenticationHandler.getCurrentUser();
        this._allUsers = this.firebaseGet.getAllUsers();
        var allTrips = this.firebaseGet.getAllTrips(), tripMembers = [];
        allTrips.forEach(function (trip) {
            tripMembers.push(trip.leadOrganiser);
            trip.friends.forEach(function (friend) {
                tripMembers.push(friend);
            });
            if (tripMembers.indexOf(_this._currentUser.key) > -1) {
                _this._currentUserTrips.push(trip);
            }
            tripMembers = [];
        });
    }
    Account.prototype.logout = function () {
        this.authenticationHandler.logoutFirebase();
        this.app.getRootNav().setRoot(login_1.Login);
    };
    Account.prototype.presentModal = function (trip) {
        var _this = this;
        var tripID = trip.key, tripName = trip.name, currentUsersToSeeLocationOfChosenTrip = [], tripMembers = [], allUsers = this._allUsers;
        var filterAllUsersIntoArray = function () {
            var allUsers = [];
            allUsers.push(trip.leadOrganiser);
            trip.friends.forEach(function (friend) {
                allUsers.push(friend);
            });
            return allUsers;
        };
        var filterOutCurrentUser = function (users) {
            var allUsers = [];
            users.forEach(function (user) {
                if (user !== _this._currentUser.key) {
                    allUsers.push(user);
                }
            });
            return allUsers;
        };
        var tripMemberIDs = filterOutCurrentUser(filterAllUsersIntoArray());
        if (typeof this._currentUser.usersToSeeLocation !== "undefined") {
            this._currentUser.usersToSeeLocation.forEach(function (userTripPair) {
                if (userTripPair.trip === tripID) {
                    currentUsersToSeeLocationOfChosenTrip = userTripPair.users;
                }
            });
        }
        allUsers.forEach(function (user) {
            if (tripMemberIDs.indexOf(user.key) > -1) {
                _this.firebaseGet.getUserWithID(user.key, function (firebaseUser) {
                    tripMembers.push({
                        canAlreadySee: (currentUsersToSeeLocationOfChosenTrip.indexOf(user.key) > -1),
                        user: firebaseUser
                    });
                });
            }
        });
        var modal = this.modalCtrl.create(locationModal_1.LocationModal, {
            name: tripName,
            members: tripMembers
        });
        modal.onDidDismiss(function (usersToSeeLocation) {
            if (usersToSeeLocation.length > 0) {
                _this.firebasePut.putUserToSeeLocation(_this._currentUser.key, tripID, usersToSeeLocation);
                // Refreshing the user
                _this._currentUser = _this.authenticationHandler.getCurrentUser();
            }
        });
        modal.present();
    };
    Account.prototype.changeSharingLocation = function () {
        this.firebasePut.putShareLocation(this._currentUser.key, this._currentUser.shareLocation);
    };
    Account.prototype.presentActionSheet = function () {
        var actionSheet = this.actionSheetCtrl.create({
            title: 'Edit Profile Picture',
            buttons: [
                {
                    text: 'Remove Profile Picture',
                    icon: !this.platform.is('ios') ? 'trash' : null,
                    role: 'destructive',
                    handler: function () {
                        console.log('Destructive clicked');
                    }
                }, {
                    text: 'Take Photo',
                    icon: !this.platform.is('ios') ? 'camera' : null,
                    handler: function () {
                        console.log('Archive clicked');
                    }
                }, {
                    text: 'Choose From Library',
                    icon: !this.platform.is('ios') ? 'folder-open' : null,
                    handler: function () {
                        console.log('Archive clicked');
                    }
                }, {
                    text: 'Cancel',
                    icon: !this.platform.is('ios') ? 'close' : null,
                    role: 'cancel',
                    handler: function () {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });
        actionSheet.present();
    };
    Account = __decorate([
        core_1.Component({
            selector: 'page-account',
            templateUrl: 'account.html'
        })
    ], Account);
    return Account;
}());
exports.Account = Account;
