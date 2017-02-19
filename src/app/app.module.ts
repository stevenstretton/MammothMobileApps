import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from "@angular/forms";
import { IonicApp, IonicModule, IonicErrorHandler, Platform } from 'ionic-angular';
import { BackgroundGeolocation } from "ionic-native";
import { MyApp } from './app.component';

import { Login } from '../pages/login/login';
import { Register } from '../pages/register/register';

import { MyTrips } from '../pages/myTrips/myTrips';
import { Notifications } from '../pages/notifications/notifications';

import { NewTrip } from '../pages/newTrip/newTrip';
import { FriendsModal, PresetsModal } from '../pages/newTrip/modals/modals';

import { ViewTrip } from '../pages/viewTrip/viewTrip';
import { EditInputModal, EditDateModal, EditTimeModal, EditTextareaModal, AddMembersModal, AddItemsModal } from '../pages/viewTrip/modals/modals';

import { Friends } from '../pages/friends/friends';
import { AddFriendModal } from '../pages/friends/modals/modals';

import { Account } from '../pages/account/account';
import { LocationModal, ChangePasswordModal } from '../pages/account/modals/modals';

import { Map } from '../pages/map/map';
import { TabsPage } from '../pages/tabs/tabs';
import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';

import { FirebaseGET } from '../services/firebase/get.service';
import { FirebasePOST } from '../services/firebase/post.service';
import { FirebasePUT } from "../services/firebase/put.service";
import { FirebaseDELETE } from "../services/firebase/delete.service";
import { AuthenticationHandler } from '../services/authenticationHandler.service';
import { LocationHandler } from '../services/locationHandler.service';

import { AgmCoreModule } from "angular2-google-maps/core";

// Must export the config
export const firebaseConfig = {
	apiKey: 'AIzaSyCDRwbDvyyzCAQfaJF8vLoQx6XDBuQrw40',
	authDomain: 'mammoth-d3889.firebaseapp.com',
	databaseURL: 'https://mammoth-d3889.firebaseio.com',
	storageBucket: 'mammoth-d3889.appspot.com',
	messagingSenderId: "516201909596"
};

const firebaseAuthConfig = {
	provider: AuthProviders.Password,
	method: AuthMethods.Password
};

@NgModule({
	declarations: [
		Login,
		Register,
		MyApp,
		MyTrips,
		Notifications,
		NewTrip,
		FriendsModal,
		PresetsModal,
		ViewTrip,
		Friends,
		Account,
		LocationModal,
		EditTimeModal,
		EditDateModal,
		EditInputModal,
		EditTextareaModal,
		AddMembersModal,
		AddItemsModal,
		ChangePasswordModal,
		AddFriendModal,
		Map,
		TabsPage
	],
	imports: [
		BrowserModule,
		FormsModule,
		IonicModule.forRoot(MyApp),
		AgmCoreModule.forRoot({
			apiKey: "AIzaSyDUdGaRHXhN5oy5zpETRll8KsHnvx19_9Y"
		}),
		AngularFireModule.initializeApp(firebaseConfig, firebaseAuthConfig)
	],
	bootstrap: [IonicApp],
	entryComponents: [
		Login,
		Register,
		MyApp,
		MyTrips,
		ViewTrip,
		Notifications,
		NewTrip,
		FriendsModal,
		PresetsModal,
		LocationModal,
		ChangePasswordModal,
		EditTimeModal,
		EditDateModal,
		EditInputModal,
		EditTextareaModal,
		AddMembersModal,
		AddItemsModal,
		AddFriendModal,
		Friends,
		Account,
		Map,
		TabsPage
	],
	providers: [{provide: ErrorHandler, useClass: IonicErrorHandler},
		FirebaseGET,
		FirebasePOST,
		FirebasePUT,
		FirebaseDELETE,
		AuthenticationHandler,
		LocationHandler]
})
export class AppModule {

	// As far as I can see, the configuration for the location needs to be in here
	constructor(private platform: Platform) {
		platform.ready().then(() => {
			const geolocationConfig = {
				desiredAccuracy: 10,
				stationaryRadius: 20,
				distanceFilter: 30,
				debug: true,
				stopOnTerminate: false
			};

			BackgroundGeolocation.configure((location) => {
				console.log("Lat: " + location.latitude);
				console.log("Lng: " + location.longitude);
			}, (error) => {
				console.log("BackgroundGeolocation error");
			}, geolocationConfig);

			// Set to use in background
			BackgroundGeolocation.Mode = 0;
		});
	}
}
