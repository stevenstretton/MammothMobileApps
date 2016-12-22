import { Injectable, Inject } from '@angular/core';
import { AngularFire, FirebaseAuth, FirebaseAuthState, AuthMethods, AuthProviders, FirebaseApp } from 'angularfire2';

import { FirebaseGET } from "./firebaseGET.service";


@Injectable()
export class AuthenticationHandler {
	private _authState: FirebaseAuthState;
	private _currentUser: FirebaseAuthState;

	private _fb: any;

	constructor(public auth$: FirebaseAuth,
	            public firebaseGet: FirebaseGET,
				public af: AngularFire,
				@Inject(FirebaseApp) firebaseApp: any) {

		this._fb = firebaseApp;

		// Find out what this does
		this._authState = auth$.getAuth();
		auth$.subscribe((state: FirebaseAuthState) => {
			this._authState = state;
		});
	}

	loginFirebase(email, password): any {
		return new Promise((resolve, reject) => {
			this.auth$.login({
				email: email,
				password: password
			}).then((successResponse) => {
				resolve(successResponse);
			}).catch((errorResponse) => {
				reject(errorResponse);
			});
		});
	}

	logoutFirebase(): void {
		this.auth$.logout();
	}

	createFirebaseUser(email, password): any {
		return new Promise((resolve, reject) => {
			this.auth$.createUser({
				email: email,
				password: password
			}).then((successResponse) => {
				resolve(successResponse);
			}).catch((errorResponse) => {
				reject(errorResponse);
			});
		});
	}

	addNewUserToDatabase(email, firstName, surname, username): void {
		this._fb.auth().onAuthStateChanged((user) => {
			const usersTable = this._fb.database().ref("/users/" + user.uid);

			usersTable.set({
				email: email,
				firstName: firstName,
				lastName: surname,
				username: username,
				shareLocation: 0
			});
		});
	}

	getCurrentFirebaseUser(): FirebaseAuthState {
		this.auth$.subscribe((user) => {
			this._currentUser = user;
		});
		return this._currentUser;
	}

	// This may need to change
	// Visit: https://github.com/angular/angularfire2/blob/master/docs/5-user-authentication.md for more information
	loginFacebook(): void {
		this.auth$.login({
			provider: AuthProviders.Facebook,
			method: AuthMethods.Popup
		})
	}

	logoutFacebook(): void {
		this.auth$.logout();
	}
}
