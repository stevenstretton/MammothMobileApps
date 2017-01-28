"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var FirebaseGET = (function () {
    function FirebaseGET(af) {
        this.af = af;
        this._allUsers = [];
        this._allTrips = [];
    }
    FirebaseGET.prototype.setAllTrips = function () {
        var _this = this;
        var tripListObservable = this.af.database.list('/trips', {
            preserveSnapshot: true
        });
        tripListObservable.subscribe(function (snapshots) {
            snapshots.forEach(function (snapshot) {
                var snapKey = snapshot.key, snapVal = snapshot.val();
                _this._allTrips.push({
                    key: snapKey,
                    name: snapVal.name,
                    leadOrganiser: snapVal.leadOrganiser,
                    description: snapVal.description,
                    location: snapVal.location,
                    start: {
                        time: snapVal.start.time,
                        date: snapVal.start.date
                    },
                    end: {
                        date: snapVal.end.date
                    },
                    coverPhotoUrl: snapVal.coverPhotoUrl,
                    friends: snapVal.friends,
                    transport: snapVal.transport,
                    items: snapVal.items
                });
            });
        });
    };
    FirebaseGET.prototype.getAllTrips = function () {
        return this._allTrips;
    };
    FirebaseGET.prototype.setAllUsers = function () {
        var _this = this;
        var userListObservable = this.af.database.list('/users', {
            preserveSnapshot: true
        });
        userListObservable.subscribe(function (snapshots) {
            snapshots.forEach(function (snapshot) {
                var snapKey = snapshot.key, snapVal = snapshot.val();
                _this._allUsers.push({
                    key: snapKey,
                    email: snapVal.email,
                    firstName: snapVal.firstName,
                    lastName: snapVal.lastName,
                    username: snapVal.username,
                    shareLocation: snapVal.shareLocation,
                    photoUrl: snapVal.photoUrl,
                    usersToSeeLocation: snapVal.usersToSeeLocation,
                    friends: snapVal.friends,
                    location: snapVal.location
                });
            });
        });
    };
    FirebaseGET.prototype.getAllUsers = function () {
        console.log("\n\n====================");
        console.log("this._allUsers:");
        console.log(this._allUsers);
        console.log("====================");
        return this._allUsers;
    };
    FirebaseGET.prototype.getUserWithID = function (userID, callback) {
        var userObjectObservable = this.af.database.object('users/' + userID, {
            preserveSnapshot: true
        });
        userObjectObservable.subscribe(function (snapshot) {
            var snapVal = snapshot.val(), snapKey = snapshot.key;
            callback({
                key: snapKey,
                email: snapVal.email,
                firstName: snapVal.firstName,
                lastName: snapVal.lastName,
                username: snapVal.username,
                shareLocation: snapVal.shareLocation,
                photoUrl: snapVal.photoUrl,
                usersToSeeLocation: snapVal.usersToSeeLocation,
                friends: snapVal.friends,
                location: snapVal.location
            });
        });
    };
    FirebaseGET.prototype.getTripWithID = function (tripID, callback) {
        var tripObjectObservable = this.af.database.object('trips/' + tripID, {
            preserveSnapshot: true
        });
        tripObjectObservable.subscribe(function (snapshot) {
            var snapVal = snapshot.val(), snapKey = snapshot.key;
            callback({
                key: snapKey,
                name: snapVal.name,
                leadOrganiser: snapVal.leadOrganiser,
                location: snapVal.location,
                description: snapVal.description,
                start: {
                    time: snapVal.start.time,
                    date: snapVal.start.date
                },
                end: {
                    date: snapVal.end.date
                },
                coverPhotoUrl: snapVal.coverPhotoUrl,
                friends: snapVal.friends,
                transport: snapVal.transport,
                items: snapVal.items
            });
        });
    };
    FirebaseGET = __decorate([
        core_1.Injectable()
    ], FirebaseGET);
    return FirebaseGET;
}());
exports.FirebaseGET = FirebaseGET;
