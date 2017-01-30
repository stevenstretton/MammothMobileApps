"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var FirebasePUT = (function () {
    function FirebasePUT(af, firebaseGet) {
        this.af = af;
        this.firebaseGet = firebaseGet;
    }
    FirebasePUT.prototype.putUserFriends = function (userID, friends) {
        var userObjectObservable = this.af.database.object("users/" + userID);
        var currentFriendIDs = [];
        this.firebaseGet.getUserWithID(userID, function (user) {
            if ((typeof user.friends !== "undefined") && (user.friends.length > 0)) {
                currentFriendIDs = user.friends;
            }
            if (friends.length > 0) {
                friends.forEach(function (friend) {
                    currentFriendIDs.push(friend.key);
                });
            }
        });
        userObjectObservable.update({
            friends: currentFriendIDs
        });
    };
    FirebasePUT.prototype.putUserToSeeLocation = function (userID, tripID, usersIDsToSeeLoc) {
        var userObjectObservable = this.af.database.object("users/" + userID);
        var usersToSeeLoc = [];
        var pushTripObjToArray = function (trip, users) {
            usersToSeeLoc.push({
                trip: trip,
                users: users
            });
        };
        this.firebaseGet.getUserWithID(userID, function (user) {
            if (typeof user.usersToSeeLocation !== "undefined") {
                user.usersToSeeLocation.forEach(function (tripUserPair) {
                    if (tripID !== tripUserPair.trip) {
                        pushTripObjToArray(tripUserPair.trip, tripUserPair.users);
                    }
                    else {
                        pushTripObjToArray(tripID, usersIDsToSeeLoc);
                    }
                });
            }
            else {
                pushTripObjToArray(tripID, usersIDsToSeeLoc);
            }
        });
        userObjectObservable.update({
            usersToSeeLocation: usersToSeeLoc
        });
    };
    FirebasePUT.prototype.putShareLocation = function (userID, shareLocation) {
        var userObjectObservable = this.af.database.object("users/" + userID);
        userObjectObservable.update({
            shareLocation: shareLocation
        });
    };
    FirebasePUT = __decorate([
        core_1.Injectable()
    ], FirebasePUT);
    return FirebasePUT;
}());
exports.FirebasePUT = FirebasePUT;
