import { Injectable, Inject } from '@angular/core';
import { AngularFire, FirebaseApp } from 'angularfire2';

@Injectable()
export class FirebaseDELETE {
private _fb: any;
	constructor(private af: AngularFire,
	@Inject(FirebaseApp) firebaseApp: any) {
		this._fb = firebaseApp;
	}

	deleteTrip(tripID): void {
		const tripObjectObservable = this.af.database.object('trips/' + tripID).remove();

		tripObjectObservable
			.then(_ => console.log("Success!"))
			.catch(err => console.log(err));
	}

	deleteTripMember(memberID, tripID, tripMembers): void {
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

	deleteTripItem(itemID, tripID, tripItems): void {
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

	deleteTripPhotoFromStorage(photoID): void {
		
		var storageRef = this._fb.storage().ref('/trip_images/');

		// Delete the file
		storageRef.child(photoID).child("trip_image.jpeg").delete().then(function() {
		// File deleted successfully
		}).catch(function(error) {
		// Uh-oh, an error occurred!
		});
	}

	deleteUserPhotoFromStorage(userID): void {
		
		var storageRef = this._fb.storage().ref('/user_images/');

		// Delete the file
		storageRef.child(userID).child("profile_image.jpeg").delete().then(function() {
		// File deleted successfully
		}).catch(function(error) {
		// Uh-oh, an error occurred!
		});
	}
}
