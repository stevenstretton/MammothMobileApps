"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var AddFriendModal = (function () {
    function AddFriendModal(viewCtrl, params, firebaseGet) {
        var _this = this;
        this.viewCtrl = viewCtrl;
        this.params = params;
        this.firebaseGet = firebaseGet;
        this._selectedPeople = [];
        this._usersThatNotFriends = [];
        this._currentUser = params.get('currentUser');
        var allUsers = this.firebaseGet.getAllUsers();
        allUsers.forEach(function (user) {
            if ((_this._currentUser.friends.indexOf(user.key) <= -1) && (user.key !== _this._currentUser.key)) {
                _this._usersThatNotFriends.push(user);
            }
        });
        this.initPeople();
    }
    AddFriendModal.prototype.initPeople = function () {
        this._people = this._usersThatNotFriends;
    };
    AddFriendModal.prototype.dismiss = function () {
        this.viewCtrl.dismiss(this._selectedPeople);
    };
    AddFriendModal.prototype.updateSearchResults = function (event) {
        this.initPeople();
        var currentVal = event.target.value;
        if (currentVal && currentVal.trim() != '') {
            this._people = this._people.filter(function (person) {
                return ((person.firstName.toLowerCase().indexOf(currentVal.toLowerCase()) > -1) ||
                    (person.lastName.toLowerCase().indexOf(currentVal.toLowerCase()) > -1));
            });
        }
    };
    AddFriendModal.prototype.ifInArray = function (person) {
        return (this._selectedPeople.indexOf(person) > -1);
    };
    AddFriendModal.prototype.toggleClicked = function (person, check) {
        if (check) {
            if (!this.ifInArray(person)) {
                this._selectedPeople.push(person);
            }
        }
        else {
            if (this.ifInArray(person)) {
                this._selectedPeople.splice(this._selectedPeople.indexOf(person), 1);
            }
        }
    };
    AddFriendModal = __decorate([
        core_1.Component({
            selector: 'page-addfriendmodal',
            templateUrl: 'addFriendModal.html'
        })
    ], AddFriendModal);
    return AddFriendModal;
}());
exports.AddFriendModal = AddFriendModal;
