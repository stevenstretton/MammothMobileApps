import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

@Injectable()
export class FirebaseGET {
	private allUsers: Array<any>;
	private allTrips: Array<any>;

	constructor(private af: AngularFire) {}

	setAllTrips(callback): void {
		this.af.database.list('/trips').forEach((trip) => {
			this.allTrips = trip;
			callback();
		});
	}


	setAllUsers(callback): void {
		this.af.database.list('/users').forEach((user) => {
			this.allUsers = user;
			callback();
		});
	}

	getAllTrips(): Array<any> {
		return this.allTrips;
	}

	getAllUsers(): Array<any> {
		return this.allUsers;
	}
}
