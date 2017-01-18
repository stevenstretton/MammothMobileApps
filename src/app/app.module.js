"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var platform_browser_1 = require('@angular/platform-browser');
var ionic_angular_1 = require('ionic-angular');
var app_component_1 = require('./app.component');
var login_1 = require('../pages/login/login');
var register_1 = require('../pages/register/register');
var myTrips_1 = require('../pages/myTrips/myTrips');
var notifications_1 = require('../pages/notifications/notifications');
var newTrip_1 = require('../pages/newTrip/newTrip');
var friendsModal_1 = require('../pages/newTrip/friendsModal/friendsModal');
var addFriendModal_1 = require('../pages/friends/addFriendModal/addFriendModal');
var viewTrip_1 = require('../pages/viewTrip/viewTrip');
var friends_1 = require('../pages/friends/friends');
var account_1 = require('../pages/account/account');
var locationModal_1 = require('../pages/account/locationModal/locationModal');
var map_1 = require('../pages/map/map');
var tabs_1 = require('../pages/tabs/tabs');
var angularfire2_1 = require('angularfire2');
var get_1 = require('../services/firebase.service/get');
var post_1 = require('../services/firebase.service/post');
var put_1 = require("../services/firebase.service/put");
var delete_1 = require("../services/firebase.service/delete");
var authenticationHandler_service_1 = require('../services/authenticationHandler.service');
var locationHandler_service_1 = require('../services/locationHandler.service');
var core_2 = require("angular2-google-maps/core");
// Must export the config
exports.firebaseConfig = {
    apiKey: 'AIzaSyCDRwbDvyyzCAQfaJF8vLoQx6XDBuQrw40',
    authDomain: 'mammoth-d3889.firebaseapp.com',
    databaseURL: 'https://mammoth-d3889.firebaseio.com',
    storageBucket: 'mammoth-d3889.appspot.com',
    messagingSenderId: "516201909596"
};
var firebaseAuthConfig = {
    provider: angularfire2_1.AuthProviders.Password,
    method: angularfire2_1.AuthMethods.Password
};
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [
                login_1.Login,
                register_1.Register,
                app_component_1.MyApp,
                myTrips_1.MyTrips,
                notifications_1.Notifications,
                newTrip_1.NewTrip,
                friendsModal_1.FriendsModal,
                viewTrip_1.ViewTrip,
                friends_1.Friends,
                account_1.Account,
                locationModal_1.LocationModal,
                addFriendModal_1.AddFriendModal,
                map_1.Map,
                tabs_1.TabsPage
            ],
            imports: [
                platform_browser_1.BrowserModule,
                ionic_angular_1.IonicModule.forRoot(app_component_1.MyApp),
                core_2.AgmCoreModule.forRoot({
                    apiKey: "AIzaSyDUdGaRHXhN5oy5zpETRll8KsHnvx19_9Y"
                }),
                angularfire2_1.AngularFireModule.initializeApp(exports.firebaseConfig, firebaseAuthConfig)
            ],
            bootstrap: [ionic_angular_1.IonicApp],
            entryComponents: [
                login_1.Login,
                register_1.Register,
                app_component_1.MyApp,
                myTrips_1.MyTrips,
                viewTrip_1.ViewTrip,
                notifications_1.Notifications,
                newTrip_1.NewTrip,
                friendsModal_1.FriendsModal,
                locationModal_1.LocationModal,
                addFriendModal_1.AddFriendModal,
                friends_1.Friends,
                account_1.Account,
                map_1.Map,
                tabs_1.TabsPage
            ],
            providers: [{ provide: core_1.ErrorHandler, useClass: ionic_angular_1.IonicErrorHandler },
                get_1.FirebaseGET,
                post_1.FirebasePOST,
                put_1.FirebasePUT,
                delete_1.FirebaseDELETE,
                authenticationHandler_service_1.AuthenticationHandler,
                locationHandler_service_1.LocationHandler]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
