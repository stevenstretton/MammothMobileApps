import { Injectable, Inject } from '@angular/core';
import { AngularFire, FirebaseAuthState, AuthMethods, AuthProviders, FirebaseApp } from 'angularfire2';

import { FirebaseGET } from "./firebase/get.service";
import { FirebasePOST } from "./firebase/post.service"

@Injectable()
export class AuthenticationHandler {
	private _currentUser: any;
	private _fb: any;

	constructor(private firebaseGet: FirebaseGET,
	            private firebasePost: FirebasePOST,
	            private af: AngularFire,
	            @Inject(FirebaseApp) firebaseApp: any) {

		this._fb = firebaseApp;
	}

	public loginFirebase(email, password): Promise<any> {
		return new Promise((resolve, reject) => {
			this.af.auth.login({
				email: email,
				password: password
			}).then((successRes) => {
				resolve(successRes);
			}).catch((errorRes) => {
				reject(errorRes);
			});
		});
	}

	public logoutFirebase(): Promise<any> {
		return new Promise((resolve, reject) => {
			this._fb.auth().signOut()
				.then((successRes) => {
					resolve(successRes);
				}).catch((errorRes) => {
					reject(errorRes);
			});
		});
	}

	public changeUserPassword(newPassword: string): Promise<any> {
		return new Promise((resolve, reject) => {
			this._fb.auth().currentUser.updatePassword(newPassword)
				.then((successRes) => {
					resolve(successRes);
				}).catch((errorRes) => {
					reject(errorRes);
			});
		});
	}

	public createFirebaseUser(emailPassCombo): Promise<any> {
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

	public deleteFirebaseUser(): Promise<any> {
		return new Promise((resolve, reject) => {
			this._fb.auth().currentUser.delete()
				.then((successRes) => {
					resolve(successRes);
				}).catch((errorRes) => {
					reject(errorRes);
			});
		});
	}

	public addNewUserToDatabase(credentials: Object, callback: any): void {
		this._fb.auth().onAuthStateChanged((user) => {
			if (user) {
				const postNewUserPromise = this.firebasePost.postNewUser(user.uid, credentials);

				postNewUserPromise
					.then((successRes) => {
						callback(successRes);
					}).catch((errorRes) => {
						callback(errorRes)
				});
			}
		});
	}

	public getCurrentUser(): any {
		return this._currentUser;
	}

	public setCurrentUser(): void {
		this.af.auth.subscribe((user) => {
			if (user) {
				this.firebaseGet.getUserWithID(user.uid, (currentUser) => {
					if (currentUser) {
						this._currentUser = currentUser;
					}
				});
			}
		});
	}

	public sendPasswordReset(email: string): Promise<any> {
		return new Promise((resolve, reject) => {
			this._fb.auth().sendPasswordResetEmail(email)
				.then((successRes) => {
					resolve(successRes);
				}).catch((errorRes) => {
					reject(errorRes);
			});
		});
	}

	public sendEmailVerification(): Promise<any> {
		return new Promise((resolve, reject) => {
			this._fb.auth().currentUser.sendEmailVerification()
				.then((successRes) => {
					resolve(successRes);
				}).catch((errorRes) => {
					reject(errorRes);
			});
		});
	}
}
