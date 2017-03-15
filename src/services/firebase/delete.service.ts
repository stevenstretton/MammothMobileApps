import { Injectable, Inject } from '@angular/core';
import { AngularFire, FirebaseApp } from 'angularfire2';

@Injectable()
export class FirebaseDELETE {
	private _fb: any;

	constructor(private af: AngularFire,
	            @Inject(FirebaseApp) firebaseApp: any) {
		this._fb = firebaseApp;
	}

	deleteTrip(tripID: string): void {
		const tripObjectObservable = this.af.database.object('trips/' + tripID).remove();

		tripObjectObservable
			.then(_ => console.log("Success!"))
			.catch(err => console.log(err));
	}

	deleteTripMember(memberID: string, tripID: string, tripMembers): void {
		const tripObjectObservable = this.af.database.object('trips/' + tripID);

		let tripMemberIDs = [];
		tripMembers.forEach((member) => {
			tripMemberIDs.push(member.key);
		});

		tripMemberIDs.splice(tripMemberIDs.indexOf(memberID), 1);

		tripObjectObservable.update({
			friends: tripMemberIDs
		});
	}

	deleteTripItem(itemID: string, tripID: string, tripItems): void {
		const tripObjectObservable = this.af.database.object('trips/' + tripID);

		let tripItemIDs = [];
		tripItems.forEach((item) => {
			tripItemIDs.push(item.key);
		});

		tripItemIDs.splice(tripItemIDs.indexOf(itemID), 1);

		tripObjectObservable.update({
			items: tripItemIDs
		});
	}

	deleteUserFromDB(userID: string): void {
		const userObjectObservable = this.af.database.object('users/' + userID).remove();

		userObjectObservable
			.then(_ => console.log("Success!"))
			.catch(err => console.log(err));
	}

	deleteUserFromAllTrips(userID: string, tripsUserIsOn): void {
		let tripObjectObservable;

		tripsUserIsOn.forEach((trip) => {
			tripObjectObservable = this.af.database.object('trips/' + trip.key);
			if (trip.leadOrganiser === userID) {
				tripObjectObservable.remove().then(() => {
					console.log("Success");
				});
			} else {
				trip.friends.splice(trip.friends.indexOf(userID), 1);

				tripObjectObservable.update({
					friends: trip.friends
				});
			}
		});
	}

	deleteTripPhotoFromStorage(photoID: string): void {
		const storageRef = this._fb.storage().ref('/trip_images/');

		// Delete the file
		storageRef.child(photoID).child("trip_image.jpeg").delete().then(() => {
			// File deleted successfully
		}).catch((error) => {
			// Uh-oh, an error occurred!
			console.log("photo in storage does not exist");
		});
	}

	deleteUserPhotoFromStorage(userID: string): void {
		const storageRef = this._fb.storage().ref('/user_images/');

		// Delete the file
		storageRef.child(userID).child("profile_image.jpeg").delete().then(() => {
			// File deleted successfully
		}).catch((error) => {
			// Uh-oh, an error occurred!
			console.log("photo in storage does not exist");
		});
	}
}
