import { Injectable } from '@angular/core';
import { AngularFire } from 'angularfire2';
import _ from 'lodash';

@Injectable()
export class FirebaseGET {
	private _allUsers: Array<any>;
	private _allTrips: Array<any>;
	private _allPresets: Array<any>;

	constructor(private af: AngularFire) {
		this._allUsers = [];
		this._allTrips = [];
		this._allPresets = [];
	}

	public setAllTrips(callback): void {
		this._allTrips = [];

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
					coverPhotoID: snapVal.coverPhotoID,
					friends: snapVal.friends,
					transport: snapVal.transport,
					items: snapVal.items
				});
			});
			callback();
		});
	}

	public getAllTrips(): Array<any> {
		return _.uniqBy(this._allTrips, 'key');
	}

	public setAllUsers(callback): void {
		this._allUsers = [];

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
					location: snapVal.location,
                    notifications: snapVal.notifications
				});
			});
			callback();
		});
	}

	public getAllUsers(): Array<any> {
		return _.uniqBy(this._allUsers, "key");
	}

	public getUserWithID(userID: string, callback): void {
		let userObjectObservable = this.af.database.object('users/' + userID, {
			preserveSnapshot: true
		});

		userObjectObservable.subscribe((snapshot) => {
			let snapVal = snapshot.val(),
				snapKey = snapshot.key;

			if (snapVal) {
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
					location: snapVal.location,
					notifications: snapVal.notifications
				});
			}
		});
	}


	// TODO: This is never actually used...shall we either use it or remove it?
	public getTripWithID(tripID: string, callback): void {
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

	public setAllPresets(): void {
		this._allPresets = [];

		let presetListObservable = this.af.database.list('/tripPresets', {
			preserveSnapshot: true
		});

		presetListObservable.subscribe((snapshots) => {
			snapshots.forEach((snapshot) => {
				let snapKey = snapshot.key,
					snapVal = snapshot.val();

				this._allPresets.push({
					key: snapKey,
					name: snapVal.name,
					description: snapVal.description,
					coverPhotoUrl: snapVal.coverPhotoUrl,
					coverPhotoID: snapVal.coverPhotoID,
					transport: snapVal.transport,
					items: snapVal.items
				});
			});
		});
	}

	public getAllPresets(): Array<any> {
		return this._allPresets;
	}
}
