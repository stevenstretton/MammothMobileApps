import { Injectable, Inject } from '@angular/core';
import { AngularFire, FirebaseAuthState, AuthMethods, AuthProviders, FirebaseApp } from 'angularfire2';

import { FirebaseGET } from "./firebase/get.service";
import { FirebasePOST } from "./firebase/post.service"


@Injectable()
export class AuthenticationHandler {
	private _authState: any;
	private _currentUser: any;

	private _fb: any;

	constructor(public firebaseGet: FirebaseGET,
	            public firebasePost: FirebasePOST,
				public af: AngularFire,
				@Inject(FirebaseApp) firebaseApp: any) {

		this._fb = firebaseApp;

		// Find out what this does
		this._authState = af.auth.getAuth();
		af.auth.subscribe((state: FirebaseAuthState) => {
			this._authState = state;
		});
	}

	loginFirebase(email, password): any {
		return new Promise((resolve, reject) => {
			this.af.auth.login({
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
		this.af.auth.logout();
	}

	changeUserPassword(newPassword): void {
		this._fb.auth().currentUser.updatePassword(newPassword).then(() => {
			console.log("Password changed")
		}, (err) => {
			console.log(err);
		});
	}

	createFirebaseUser(emailPassCombo): any {
		return new Promise((resolve, reject) => {
			this.af.auth.createUser({
				email: emailPassCombo.email,
				password: emailPassCombo.password
			}).then((successResponse) => {
				resolve(successResponse);
			}).catch((errorResponse) => {
				reject(errorResponse);
			});
		});
	}

	addNewUserToDatabase(credentials): void {
		this._fb.auth().onAuthStateChanged((user) => {
			this.firebasePost.postNewUser(user, credentials);
		});
	}

	getCurrentUser(): any {
		return this._currentUser;
	}

	setCurrentUser(): void {
		this.af.auth.subscribe((user) => {

			this.firebaseGet.getUserWithID(user.uid, (currentUser) => {
				this._currentUser = currentUser;
			});
		});
	}

	// This may need to change
	// Visit: https://github.com/angular/angularfire2/blob/master/docs/5-user-authentication.md for more information
	loginFacebook(): void {
		this.af.auth.login({
			provider: AuthProviders.Facebook,
			method: AuthMethods.Popup
		})
	}

	logoutFacebook(): void {
		this.af.auth.logout();
	}
}