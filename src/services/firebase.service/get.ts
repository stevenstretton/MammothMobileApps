import { Injectable } from '@angular/core';
import { AngularFire, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';

@Injectable()
export class FirebaseGET {
	private _allUsers: Array<any>;
	private _allTrips: Array<any>;

	constructor(private af: AngularFire) {
		this._allUsers = [];
		this._allTrips = [];
	}

	setAllTrips(): void {
		let tripListObservable = this.af.database.list('/trips', {
			preserveSnapshot: true
		});

		tripListObservable.subscribe((snapshots) => {
			snapshots.forEach((snapshot) => {
				let snapKey = snapshot.key,
					snapVal = snapshot.val();

				this._allTrips.push({
					key: snapKey,
					name: snapVal.name,
					leadOrganiser: snapVal.leadOrganiser,
					description: snapVal.description,
					location: snapVal.location,
					start: {
						time: snapVal.start.time,
						date: snapVal.start.date
					},
					end: {
						date: snapVal.end.date
					},
					coverPhotoUrl: snapVal.coverPhotoUrl,
					friends: snapVal.friends,
					transport: snapVal.transport,
					items: snapVal.items
				});
			});
		});
	}

	getAllTrips(): Array<any> {
		return this._allTrips;
	}

	setAllUsers(): void {
		let userListObservable = this.af.database.list('/users', {
			preserveSnapshot: true
		});

		userListObservable.subscribe((snapshots) => {
			snapshots.forEach((snapshot) => {
				let snapKey = snapshot.key,
					snapVal = snapshot.val();

				this._allUsers.push({
					key: snapKey,
					email: snapVal.email,
					firstName: snapVal.firstName,
					lastName: snapVal.lastName,
					username: snapVal.username,
					shareLocation: snapVal.shareLocation,
					photoUrl: snapVal.photoUrl,
					usersToSeeLocation: snapVal.usersToSeeLocation,
					friends: snapVal.friends,
					location: snapVal.location
				});
			});
		});
	}

	getAllUsers(): Array<any> {
		console.log("\n\n====================");
		console.log("this._allUsers:");
		console.log(this._allUsers);
		console.log("====================");
		return this._allUsers;
	}

	getUserWithID(userID, callback): void {
		let userObjectObservable = this.af.database.object('users/' + userID, {
			preserveSnapshot: true
		});

		userObjectObservable.subscribe((snapshot) => {
			let snapVal = snapshot.val(),
				snapKey = snapshot.key;

			callback({
				key: snapKey,
				email: snapVal.email,
				firstName: snapVal.firstName,
				lastName: snapVal.lastName,
				username: snapVal.username,
				shareLocation: snapVal.shareLocation,
				photoUrl: snapVal.photoUrl,
				usersToSeeLocation: snapVal.usersToSeeLocation,
				friends: snapVal.friends,
				location: snapVal.location
			});
		});
	}

	getTripWithID(tripID, callback): void {
		let tripObjectObservable = this.af.database.object('trips/' + tripID, {
			preserveSnapshot: true
		});

		tripObjectObservable.subscribe((snapshot) => {
			let snapVal = snapshot.val(),
				snapKey = snapshot.key;

			callback({
				key: snapKey,
				name: snapVal.name,
				leadOrganiser: snapVal.leadOrganiser,
				location: snapVal.location,
				description: snapVal.description,
				start: {
					time: snapVal.start.time,
					date: snapVal.start.date
				},
				end: {
					date: snapVal.end.date
				},
				coverPhotoUrl: snapVal.coverPhotoUrl,
				friends: snapVal.friends,
				transport: snapVal.transport,
				items: snapVal.items
			});
		});
	}
}
