import { Injectable, Inject } from '@angular/core';
import { AngularFire, FirebaseApp } from 'angularfire2';
import { FirebaseGET } from "./get.service"

@Injectable()
export class FirebasePOST {
	private _fb: any;

	constructor(private af: AngularFire,
	            private firebaseGet: FirebaseGET,
	            @Inject(FirebaseApp) firebaseApp: any) {

		this._fb = firebaseApp;
	}

	public postNewTrip(trip: any): Promise<any> {
		const tripListObservable = this.af.database.list('/trips');

		return new Promise((resolve, reject) => {
			tripListObservable
				.push(trip)
				.then((successRes) => {
					resolve(successRes);
				}).catch((errorRes) => {
					reject(errorRes);
			});
		})
	}

	public postNewAccountPhoto(image, userID: string): Promise<any> {
		const storageRef = this._fb.storage().ref('/user_images/');

		let metadata = {
			contentType: 'image/jpeg'
		};

		return new Promise((resolve, reject) => {
			storageRef.child(userID).child("profile_image.jpeg").putString(image, 'base64', metadata)
				.then((snapshot) => {
					resolve(snapshot.downloadURL);
				}).catch((errorRes) => {
					reject(errorRes);
			});
		});
	}

	public postNewTripImage(image, tripID: string): Promise<any> {
		const storageRef = this._fb.storage().ref('/trip_images/');

		let metadata = {
			contentType: 'image/jpeg'
		};

		return new Promise((resolve, reject) => {
			storageRef.child(tripID).child("trip_image.jpeg").putString(image, 'base64', metadata)
				.then((snapshot) => {
					resolve(snapshot.downloadURL);
				}).catch((errorRes) => {
					reject(errorRes);
			});
		});

	}

	public postNewUser(userID: string, credentials: any): Promise<any> {
		const usersTable = this.af.database.object("users/" + userID);

		return new Promise((resolve, reject) => {
			this._fb.storage().ref("default_image/placeholder-user.png").getDownloadURL().then((placeholderPhotoUrl) => {
				usersTable.set({
					email: credentials.email,
					firstName: credentials.firstName,
					lastName: credentials.surname,
					username: credentials.username,
					shareLocation: 0,
					photoUrl: placeholderPhotoUrl
				}).then((successRes) => {
					resolve(null);
				}).catch((errorRes) => {
					reject(errorRes);
				});
			});
		});
	}

	public postNewNotification(userID, notification): Promise<any> {
		let notifications = [];

		const userObjectObservable = this.af.database.object("users/" + userID + "/notifications", {
			preserveSnapshot: true
		});

		userObjectObservable.subscribe((snapshot) => {
			if (snapshot.val()) {
				notifications = snapshot.val();
			}
		});
		notifications.push(notification);

		return new Promise((resolve, reject) => {
			userObjectObservable
				.set(notifications)
				.then((succesRes) => {
					resolve(null);
				}).catch((errorRes) => {
					reject(errorRes);
			});
		});
	}
}
