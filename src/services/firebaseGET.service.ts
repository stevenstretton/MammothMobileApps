import { Injectable } from '@angular/core';
import { AngularFire, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';

@Injectable()
export class FirebaseGET {
	private _allUsers: Array<any>;
	private _allTrips: Array<any>;

	constructor(private af: AngularFire) {}

	setAllTrips(callback): void {
		this.af.database.list('/trips').forEach((trip) => {
			this._allTrips = trip;
			callback();
		});
	}

	getAllTrips(): Array<any> {
		return this._allTrips;
	}

	setAllUsers(callback): void {
		this.af.database.list('/users').forEach((user) => {
			this._allUsers = user;
			callback();
		});
	}

	getAllUsers(): Array<any> {
		return this._allUsers;
	}

	getUserWithID(userID, callback): void {
		this.af.database.object('users/' + userID).forEach((user) => {
			callback(user);
		});
	}

	getTripWithID(tripID, callback): void {
		this.af.database.object('trips/' + tripID).forEach((trip) => {
			callback(trip);
		});
	}
}
