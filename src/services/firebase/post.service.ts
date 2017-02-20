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

	postNewTrip(trip, callback): void {
		const promise = this.af.database.list('/trips').push(trip);

		promise.then(_ => {
			console.log("trip posted!");
			callback();
		})
			.catch(err => {
				console.log(err)
			});
	}

	postNewAccountPhoto(image, userID, callback) {
		var storageRef = this._fb.storage().ref('/user_images/');

		var metadata = {
			contentType: 'image/jpeg'
		};

		storageRef.child(userID).child("profile_image.jpeg").putString(image, 'base64', metadata).then(function (snapshot) {
			console.log('Uploaded a base64 string!');
			console.log(snapshot.downloadURL);
			callback(snapshot.downloadURL)
		});

	}

	postNewTripImage(image, tripID, callback) {
		var storageRef = this._fb.storage().ref('/trip_images/');

		var metadata = {
			contentType: 'image/jpeg'
		};

		storageRef.child(tripID).child("trip_image.jpeg").putString(image, 'base64', metadata).then(function (snapshot) {
			console.log('Uploaded a base64 string!');
			console.log(snapshot.downloadURL);
			callback(snapshot.downloadURL)
		});

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
    
    	postNewNotification(user, notifications): void {
		const userObjectObservable = this.af.database.object("users/" + user + "/notifications");

		userObjectObservable.set(notifications);
	}
}
