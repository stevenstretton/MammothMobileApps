import { Injectable, Inject } from '@angular/core';
import { AngularFire, FirebaseApp } from 'angularfire2';

@Injectable()
export class FirebaseDELETE {
	private _fb: any;

	constructor(private af: AngularFire,
	            @Inject(FirebaseApp) firebaseApp: any) {
		this._fb = firebaseApp;
	}

	public deleteTrip(tripID: string): Promise<any> {
		const tripObjectObservable = this.af.database.object('trips/' + tripID);

		return new Promise((resolve, reject) => {
			tripObjectObservable.remove()
				.then((successRes) => {
					resolve(null);
				}).catch((errorRes) => {
					reject(errorRes);
			});
		});
	}

	public deleteTripMember(memberID: string, tripID: string, tripMembers): Promise<any> {
		const tripObjectObservable = this.af.database.object('trips/' + tripID + "friends/");

		let tripMemberIDs = [];
		tripMembers.forEach((member) => {
			if (member.key !== memberID) {
				tripMemberIDs.push(member.key);
			}
		});

		return new Promise((resolve, reject) => {
			tripObjectObservable
				.update(tripMemberIDs)
				.then((successRes) => {
					resolve(null);
				}).catch((errorRes) => {
					reject(errorRes);
			});
		});
	}

	public deleteTripItem(itemKey: string, tripID: string, tripItems: Array<any>): Promise<any> {
		let newTripItems = [];

		const tripObjectObservable = this.af.database.object('trips/' + tripID + "/items");

		tripItems.forEach((tripItem) => {
			if (tripItem.key !== itemKey) {
				newTripItems.push(tripItem);
			}
		});

		return new Promise((resolve, reject) => {
			tripObjectObservable
				.set(newTripItems)
				.then((successRes) => {
					resolve(null);
				}).catch((errorRes) => {
					reject(errorRes);
			});
		});
	}

	public deleteUserFromDB(userID: string): Promise<any> {
		const userObjectObservable = this.af.database.object('users/' + userID);

		return new Promise((resolve, reject) => {
			userObjectObservable.remove()
				.then((successRes) => {
					resolve(null);
				}).catch((errorRes) => {
					reject(errorRes);
			});
		});
	}

	public deleteUserFromAllTrips(userID: string, tripsUserIsOn: any, callback: any): void {
		const defaultTripPhoto = 'https://firebasestorage.googleapis.com/v0/b/mammoth-d3889.appspot.com/o/default_image%2F' +
			'placeholder-trip.jpg?alt=media&token=9774e22d-26a3-48d4-a950-8243034b5f56';

		tripsUserIsOn.forEach((trip) => {
			const tripObjectObservable = this.af.database.object('trips/' + trip.key);

			if (trip.leadOrganiser === userID) {
				const deleteTripPromise = this.deleteTrip(trip.key),
					deleteTripPhotoPromise = this.deleteTripPhotoFromStorage(trip.coverPhotoID);

				deleteTripPromise
					.then((successRes) => {
						if (trip.coverPhotoUrl !== defaultTripPhoto) {
							deleteTripPhotoPromise
								.then((successRes) => {
									callback(successRes);
								}).catch((errorRes) => {
								callback(errorRes);
							});
						}
						callback(successRes)
					}).catch((errorRes) => {
						callback(errorRes)
				});
			} else {
				trip.friends.splice(trip.friends.indexOf(userID), 1);

				tripObjectObservable.update({
					friends: trip.friends
				});
			}
		});
	}

	public deleteCurrentAsFriend(userID: string, currentUserID: string): Promise<any> {
		let friends = [];

		const userObjectObservable = this.af.database.object("users/" + userID + "/friends", {
			preserveSnapshot: true
		});

		userObjectObservable.subscribe((snapshot) => {
			friends = snapshot.val();
		});
		friends.splice(friends.indexOf(currentUserID), 1);

		return new Promise((resolve, reject) => {
			userObjectObservable
				.set(friends)
				.then((successRes) => {
					resolve(null);
				}).catch((errorRes) => {
					reject(errorRes);
			});
		});
	}

	public deleteTripPhotoFromStorage(photoID: string): Promise<any> {
		const storageRef = this._fb.storage().ref('/trip_images/');

		// Delete the file
		return new Promise((resolve, reject) => {
			storageRef.child(photoID).child("trip_image.jpeg")
				.delete()
				.then((successRes) => {
					resolve(null);
				}).catch((errorRes) => {
					reject(errorRes);
			});
		});
	}

	public deleteUserPhotoFromStorage(userID: string): Promise<any> {
		const storageRef = this._fb.storage().ref('/user_images/');

		// Delete the file
		return new Promise((resolve, reject) => {
			storageRef.child(userID).child("profile_image.jpeg").delete()
				.then((successRes) => {
					resolve(successRes);
				}).catch((errorRes) => {
					reject(errorRes);
			});
		});
	}
}
