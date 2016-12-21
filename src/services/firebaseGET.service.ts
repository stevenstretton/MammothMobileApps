import { Injectable } from '@angular/core';
import { AngularFire, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';

@Injectable()
export class FirebaseGET {
	private allUsers: Array<any>;
	private allTrips: Array<any>;

	private singleUser: any;

	constructor(private af: AngularFire) {}

	setAllTrips(): void {
		this.af.database.list('/trips').forEach((trip) => {
			this.allTrips = trip;
		});
	}

	getAllTrips(): Array<any> {
		return this.allTrips;
	}

	setAllUsers(): void {
		this.af.database.list('/users').forEach((user) => {
			this.allUsers = user;
		});
	}

	getAllUsers(): Array<any> {
		return this.allUsers;
	}

	getUserWithID(userID, callback): void {
		this.af.database.object('users/' + userID).forEach((user) => {
			callback(user);
		});
	}

	getTripWithID(tripID): FirebaseListObservable<any> {
		return this.af.database.list('trips/' + tripID);
	}
}
