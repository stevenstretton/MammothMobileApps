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

	public deleteTripItem(item: any, tripID: string, tripItems: Array<any>): Promise<any> {
		let notMatchedYet = false,
			newTripItems = [];

		const tripObjectObservable = this.af.database.object('trips/' + tripID + "/items");

		tripItems.forEach((tripItem) => {
			if ((tripItem.name !== item.name) && (tripItem.description !== item.description)) {
				newTripItems.push(tripItem);
			} else {
				if (!notMatchedYet) {
					newTripItems.push(tripItem);
				}
				// This is needed as will delete multiple items if have same name and description otherwise
				// as items do not have IDs
				notMatchedYet = true;
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
		console.log("deleteUserFromAllTrips");
		tripsUserIsOn.forEach((trip) => {
			const tripObjectObservable = this.af.database.object('trips/' + trip.key);

			if (trip.leadOrganiser === userID) {

				// This cannot return a promise here as it would return to the loop
				tripObjectObservable.remove()
					.then((successRes) => {
						console.log("Succeeding here");
						console.log(successRes);
						callback(successRes);
					}).catch((errorRes) => {
						console.log("Failing here");
						console.log(errorRes);
						callback(errorRes);
					});
			} else {
				trip.friends.splice(trip.friends.indexOf(userID), 1);

				tripObjectObservable.update({
					friends: trip.friends
				});
			}
		});
	}

	public deleteTripPhotoFromStorage(photoID: string): Promise<any> {
		const storageRef = this._fb.storage().ref('/trip_images/');

		// Delete the file
		return new Promise((resolve, reject) => {
			storageRef.child(photoID).child("trip_image.jpeg").delete()
				.then((successRes) => {
					resolve(successRes);
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
