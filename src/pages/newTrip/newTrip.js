"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var friendsModal_1 = require('./friendsModal/friendsModal');
var ionic_native_1 = require('ionic-native');
var NewTrip = (function () {
    function NewTrip(navCtrl, actionSheetCtrl, platform, firebaseGet, authenticationHandler, modalCtrl, firebasePush, toastCtrl) {
        this.navCtrl = navCtrl;
        this.actionSheetCtrl = actionSheetCtrl;
        this.platform = platform;
        this.firebaseGet = firebaseGet;
        this.authenticationHandler = authenticationHandler;
        this.modalCtrl = modalCtrl;
        this.firebasePush = firebasePush;
        this.toastCtrl = toastCtrl;
        this._tripCoverPhotoSelected = false;
        this._itemTitle = '';
        this._itemDescription = '';
        this._tripName = '';
        this._tripLoc = '';
        this._tripDescription = '';
        this._tripTransport = '';
        this._event = {
            start: {
                date: '',
                time: ''
            },
            end: {
                date: ''
            }
        };
        this.initialiseDate();
        this._currentUser = this.authenticationHandler.getCurrentUser();
        this._friendsAdded = [];
        this._itemList = [];
    }
    NewTrip.prototype.initialiseDate = function () {
        var today = new Date();
        var todayDate = today.getFullYear() + "-" + ('0' + (today.getMonth() + 1)).slice(-2) + "-" + ('0' + today.getDate()).slice(-2), nowTime = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        this._event = {
            start: {
                date: todayDate,
                time: nowTime
            },
            end: {
                date: todayDate
            }
        };
    };
    NewTrip.prototype.presentToast = function () {
        var toast = this.toastCtrl.create({
            message: 'Trip was added successfully',
            duration: 3000,
            position: 'top'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    NewTrip.prototype.presentModal = function () {
        var _this = this;
        var friendIDsAdded = this.buildFriendIDsAttending();
        this._friendsAdded = [];
        this._currentUser.friends.forEach(function (friendID) {
            _this.firebaseGet.getUserWithID(friendID, function (firebaseUser) {
                _this._friendsAdded.push({
                    isAdded: (friendIDsAdded.indexOf(friendID) > -1),
                    user: firebaseUser
                });
            });
        });
        this.modalCtrl.create(friendsModal_1.FriendsModal, {
            selectedFriends: this._friendsAdded
        }).present();
    };
    NewTrip.prototype.buildFriendIDsAttending = function () {
        var friendsAttending = [];
        if (this._friendsAdded.length > 0) {
            this._friendsAdded.forEach(function (friend) {
                if (friend.isAdded) {
                    friendsAttending.push(friend.user.key);
                }
            });
        }
        return friendsAttending;
    };
    NewTrip.prototype.pushTrip = function () {
        this._tripInfo = {
            name: this._tripName,
            location: this._tripLoc,
            description: this._tripDescription,
            transport: this._tripTransport,
            friends: this.buildFriendIDsAttending(),
            items: this._itemList,
            start: {
                date: this._event.start.date,
                time: this._event.start.time
            },
            end: {
                date: this._event.end.date
            },
            leadOrganiser: this._currentUser.key,
            coverPhotoUrl: "",
        };
        if (this._tripName != "" && this._tripLoc != "" && this._friendsAdded.length != 0) {
            this.firebasePush.postNewTrip(this._tripInfo);
            this.clearTrip();
            this.presentToast();
        }
    };
    NewTrip.prototype.clearTrip = function () {
        this._tripInfo = {};
        this._tripName = "";
        this._tripLoc = "";
        this._tripDescription = "";
        this._friendsAdded = [];
        this._itemList = [];
        this.initialiseDate();
    };
    NewTrip.prototype.addItem = function () {
        if (this._itemTitle != "") {
            var newItem = {
                name: this._itemTitle,
                description: this._itemDescription
            };
            this._itemList.push(newItem);
            this._itemTitle = "";
            this._itemDescription = "";
        }
    };
    NewTrip.prototype.deleteItem = function (item) {
        console.log(this._itemList);
        var index = this._itemList.indexOf(item);
        console.log(index);
        this._itemList.splice(index, 1);
        console.log(this._itemList);
    };
    NewTrip.prototype.presentActionSheet = function () {
        var cameraOptions = {
            quality: 75,
            destinationType: ionic_native_1.Camera.DestinationType.DATA_URL,
            sourceType: ionic_native_1.Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: ionic_native_1.Camera.EncodingType.JPEG,
            targetWidth: 300,
            targetHeight: 300,
            saveToPhotoAlbum: false
        };
        var actionSheet = this.actionSheetCtrl.create({
            title: 'Edit Trip Picture',
            buttons: [
                {
                    text: 'Remove Trip Picture',
                    icon: !this.platform.is('ios') ? 'trash' : null,
                    role: 'destructive',
                    handler: function () {
                        console.log('Destructive clicked');
                    }
                }, {
                    text: 'Take Photo',
                    icon: !this.platform.is('ios') ? 'camera' : null,
                    handler: function () {
                        cameraOptions.sourceType = ionic_native_1.Camera.PictureSourceType.CAMERA;
                        ionic_native_1.Camera.getPicture(cameraOptions).then(function (image) {
                            console.log(image);
                        });
                        console.log('Take Photo clicked');
                    }
                }, {
                    text: 'Choose From Library',
                    icon: !this.platform.is('ios') ? 'folder-open' : null,
                    handler: function () {
                        cameraOptions.sourceType = ionic_native_1.Camera.PictureSourceType.PHOTOLIBRARY;
                        ionic_native_1.Camera.getPicture(cameraOptions).then(function (image) {
                            console.log(image);
                        });
                        console.log('Library clicked');
                    }
                }, {
                    text: 'Choose From Presets',
                    icon: !this.platform.is('ios') ? 'folder-open' : null,
                    handler: function () {
                        console.log('Presets clicked');
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
    NewTrip = __decorate([
        core_1.Component({
            selector: 'page-newTrip',
            templateUrl: 'newTrip.html',
        })
    ], NewTrip);
    return NewTrip;
}());
exports.NewTrip = NewTrip;
