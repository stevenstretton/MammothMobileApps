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
		let userObjectObservable = this.af.database.object('users/' + userID, {
			preserveSnapshot: true
		});

		userObjectObservable.subscribe(snapshot => {
			callback(snapshot.val());
		});
	}

	getTripWithID(tripID, callback): void {
		let tripObjectObservable = this.af.database.object('trips/' + tripID, {
			preserveSnapshot: true
		});

		tripObjectObservable.subscribe(snapshot => {
			callback(snapshot.val());
		});
	}
}
