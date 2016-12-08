import { Injectable } from '@angular/core';
import { AngularFire, AuthMethods, AuthProviders } from 'angularfire2';

@Injectable()
export class AuthenticationHandler {
	constructor(private af: AngularFire) {}

	loginFirebase(email, password): void {
		this.af.auth.login({
			email: email,
			password: password
		});

		// This will get the current user logged into Firebase
		this.af.auth.subscribe(user => {
			if (user) {
				console.log(user);
			}
		})
	}

	logoutFirebase(): void {
		// This may be auth.signOut() instead
		this.af.auth.logout();
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
