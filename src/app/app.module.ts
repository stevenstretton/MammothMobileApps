import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { MyTrips } from '../pages/myTrips/myTrips';
import { Notifications } from '../pages/notifications/notifications';
import { NewTrip } from '../pages/newTrip/newTrip';
import { Friends } from '../pages/friends/friends';
import { Account } from '../pages/account/account';
import { TabsPage } from '../pages/tabs/tabs';
import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';

import { FirebaseGET } from '../services/firebaseGET.service';
import { FirebasePUSH } from '../services/firebasePUSH.service';
import { AuthenticationHandler } from '../services/authenticationHandler.service';
import { LocationHandler } from '../services/locationHandler.service';

// Must export the config
export const firebaseConfig = {
	apiKey: 'AIzaSyCDRwbDvyyzCAQfaJF8vLoQx6XDBuQrw40',
	authDomain: 'mammoth-d3889.firebaseapp.com',
	databaseURL: 'https://mammoth-d3889.firebaseio.com',
	storageBucket: 'mammoth-d3889.appspot.com',
	messagingSenderId: "516201909596"
};

const myFirebaseAuthConfig = {
	provider: AuthProviders.Password,
	method: AuthMethods.Password
};

@NgModule({
	declarations: [
		MyApp,
		MyTrips,
		Notifications,
		NewTrip,
		Friends,
		Account,
		TabsPage
	],
	imports: [
		BrowserModule,
		IonicModule.forRoot(MyApp),
		AngularFireModule.initializeApp(firebaseConfig, myFirebaseAuthConfig)
	],
	bootstrap: [IonicApp],
	entryComponents: [
		MyApp,
		MyTrips,
		Notifications,
		NewTrip,
		Friends,
		Account,
		TabsPage
	],
	providers: [{provide: ErrorHandler, useClass: IonicErrorHandler},
		FirebaseGET,
		FirebasePUSH,
		AuthenticationHandler,
		LocationHandler
	]
})
export class AppModule {
}
