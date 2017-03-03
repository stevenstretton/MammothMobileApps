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
//		this.af.auth.logout();
		this._fb.auth().signOut().then(() => {
			console.log("Signout successful!");
		}, (err) => {
			console.log(err);
		});
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

	deleteFirebaseUser(callback): void {
		let user = this._fb.auth().currentUser;

		user.delete().then(() => {
			console.log("Success");
			callback();
		}, (error) => {
			console.log(error);
		});
	}

	addNewUserToDatabase(credentials): void {

		// Again, this is called when deleting a user as the authentication state has changed
		this._fb.auth().onAuthStateChanged((user) => {
			if (user) {
				this.firebasePost.postNewUser(user, credentials);
			}
		});
	}

	getCurrentUser(): any {
		return this._currentUser;
	}

	setCurrentUser(): void {
		// TODO: Figure out why this is being hit on logout

		// This is being hit because the authentication has changed
		this.af.auth.subscribe((user) => {
			// check to see if there actually is a user
			console.log(user);
			if (user) {
				this.firebaseGet.getUserWithID(user.uid, (currentUser) => {
					if (currentUser) {
						this._currentUser = currentUser;
					}
				});
			}
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

	sendPasswordReset(email: string): void {
		this._fb.auth().sendPasswordResetEmail(email).then(() => {
			console.log("Email sent");
		}, (error) => {
			console.log(error);
		});
	}

	sendEmailVerification(): void {
		console.log(this._fb.auth().currentUser);

		this._fb.auth().currentUser.sendEmailVerification().then(() => {
			console.log("Email sent");
		}, (error) => {
			console.log(error);
		});
	}
}
