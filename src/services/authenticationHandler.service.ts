import { Injectable, Inject } from '@angular/core';
import { AngularFire, FirebaseAuth, FirebaseAuthState, AuthMethods, AuthProviders, FirebaseApp } from 'angularfire2';

import { FirebaseGET } from "./firebase.service/get";
import { FirebasePOST } from "./firebase.service/post"


@Injectable()
export class AuthenticationHandler {
	private _authState: any;
	private _currentUser: any;

	private _fb: any;

	constructor(public auth$: FirebaseAuth,
	            public firebaseGet: FirebaseGET,
	            public firebasePost: FirebasePOST,
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

	changeUserPassword(newPassword): void {
		this._fb.auth().currentUser.updatePassword(newPassword).then(() => {
			console.log("Password changed")
		}, (err) => {
			console.log(err);
		});
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
			this.firebasePost.postNewUser(user, email, firstName, surname, username);
		});
	}

	getCurrentUser(): any {
		return this._currentUser;
	}

	setCurrentUser(): void {
		this.auth$.subscribe((user) => {

			this.firebaseGet.getUserWithID(user.uid, (currentUser) => {
				this._currentUser = currentUser;
			});
		});
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
