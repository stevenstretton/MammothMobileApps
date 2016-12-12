"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var ionic_angular_1 = require('ionic-angular');
var app_component_1 = require('./app.component');
var myTrips_1 = require('../pages/myTrips/myTrips');
var notifications_1 = require('../pages/notifications/notifications');
var newTrip_1 = require('../pages/newTrip/newTrip');
var friends_1 = require('../pages/friends/friends');
var account_1 = require('../pages/account/account');
var tabs_1 = require('../pages/tabs/tabs');
var firebaseTripGET_service_1 = require('../services/firebaseTripGET.service');
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [
                app_component_1.MyApp,
                myTrips_1.MyTrips,
                notifications_1.Notifications,
                newTrip_1.NewTrip,
                friends_1.Friends,
                account_1.Account,
                tabs_1.TabsPage,
                firebaseTripGET_service_1.FirebaseTripGET
            ],
            imports: [
                ionic_angular_1.IonicModule.forRoot(app_component_1.MyApp)
            ],
            bootstrap: [ionic_angular_1.IonicApp],
            entryComponents: [
                app_component_1.MyApp,
                myTrips_1.MyTrips,
                notifications_1.Notifications,
                newTrip_1.NewTrip,
                friends_1.Friends,
                account_1.Account,
                tabs_1.TabsPage
            ],
            providers: [{ provide: core_1.ErrorHandler, useClass: ionic_angular_1.IonicErrorHandler }]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
