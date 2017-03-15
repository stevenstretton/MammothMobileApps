import { Injectable, Inject } from '@angular/core';
import { AngularFire, FirebaseApp } from 'angularfire2';
import { FirebaseGET } from "./get.service"

@Injectable()
export class FirebasePOST {
	private _fb: any;

	constructor(private af: AngularFire,
		public firebaseGet: FirebaseGET,
		@Inject(FirebaseApp) firebaseApp: any) {

		this._fb = firebaseApp;
	}

	postNewTrip(trip: any, callback): void {
		console.log(typeof trip);

		const promise = this.af.database.list('/trips').push(trip);

		promise.then(_ => {
			console.log("trip posted!");
			callback();
		})
		.catch(err => {
			console.log(err)
		});
	}

	postNewAccountPhoto(image, userID: string, callback) {
		const storageRef = this._fb.storage().ref('/user_images/');

		let metadata = {
			contentType: 'image/jpeg'
		};

		storageRef.child(userID).child("profile_image.jpeg").putString(image, 'base64', metadata).then((snapshot) => {
			callback(snapshot.downloadURL)
		});
	}

	postNewTripImage(image, tripID: string, callback) {
		const storageRef = this._fb.storage().ref('/trip_images/');

		let metadata = {
			contentType: 'image/jpeg'
		};

		storageRef.child(tripID).child("trip_image.jpeg").putString(image, 'base64', metadata).then((snapshot) => {
			callback(snapshot.downloadURL)
		});

	}

	postNewUser(userID: string, credentials: any): void {
		const usersTable = this.af.database.object("users/" + userID);

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

    postNewNotification(user, notifications): void {
		const userObjectObservable = this.af.database.object("users/" + user + "/notifications");

		userObjectObservable.set(notifications);
	}
}
