import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { Login } from '../pages/login/login';
import { Register } from '../pages/register/register';

import { MyTrips } from '../pages/myTrips/myTrips';
import { Notifications } from '../pages/notifications/notifications';

import { NewTrip } from '../pages/newTrip/newTrip';
import { FriendsModal } from '../pages/newTrip/friendsModal/friendsModal';
import { AddFriendModal } from '../pages/friends/addFriendModal/addFriendModal';
import { ViewTrip } from '../pages/viewTrip/viewTrip';

import { Friends } from '../pages/friends/friends';

import { Account } from '../pages/account/account';
import { LocationModal } from '../pages/account/locationModal/locationModal';

import { Map } from '../pages/map/map';
import { TabsPage } from '../pages/tabs/tabs';
import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';

import { FirebaseGET } from '../services/firebaseGET.service';
import { FirebasePUSH } from '../services/firebasePUSH.service';
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
		ViewTrip,
		Friends,
		Account,
		LocationModal,
		AddFriendModal,
		Map,
		TabsPage
	],
	imports: [
		BrowserModule,
		IonicModule.forRoot(MyApp),
		// AgmCoreModule.forRoot({
		// 	apiKey: "AIzaSyDUdGaRHXhN5oy5zpETRll8KsHnvx19_9Y"
		// }),
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
		LocationModal,
		AddFriendModal,
		Friends,
		Account,
		Map,
		TabsPage
	],
	providers: [{provide: ErrorHandler, useClass: IonicErrorHandler},
		FirebaseGET,
		FirebasePUSH,
		AuthenticationHandler,
		LocationHandler]
})
export class AppModule {
}
