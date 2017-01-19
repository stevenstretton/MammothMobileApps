import { Injectable, Inject } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseApp } from 'angularfire2';
import { FirebaseGET } from "./get"

@Injectable()
export class FirebasePOST {
	private _fb: any;

	constructor(private af: AngularFire,
				public firebaseGet: FirebaseGET,
				@Inject(FirebaseApp) firebaseApp: any) {
		this._fb = firebaseApp;
	}

	postNewTrip(trip): void {
		const promise = this.af.database.list('/trips').push(trip);

		promise
			.then(_ => console.log("success!"))
			.catch(err => console.log(err));
	}

	postNewUser(user, credentials): void {
		const usersTable = this.af.database.object("users/" + user.uid);

		this._fb.storage().ref("default_image/placeholder-user.png").getDownloadURL().then((placeholderPhotoUrl) => {
			usersTable.set({
				email: credentials.email,
				firstName: credentials.firstName,
				lastName: credentials.surname,
				username: credentials.username,
				shareLocation: 0,
				photoUrl: placeholderPhotoUrl
			});
		});
	}
}
