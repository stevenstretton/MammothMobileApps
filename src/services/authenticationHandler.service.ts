import { Injectable } from '@angular/core';
import { AngularFire, FirebaseAuth, FirebaseAuthState, AuthMethods, AuthProviders } from 'angularfire2';

import { FirebaseGET } from "./firebaseGET.service";


@Injectable()
export class AuthenticationHandler {
	private authState: FirebaseAuthState;
	private currentUser: FirebaseAuthState;

	constructor(public auth$: FirebaseAuth,
	            public firebaseGet: FirebaseGET) {

		this.authState = auth$.getAuth();
		auth$.subscribe((state: FirebaseAuthState) => {
			this.authState = state;
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

	getCurrentUser(): FirebaseAuthState {
		this.auth$.subscribe((user) => {
			this.currentUser = user;
		});
		return this.currentUser;
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
