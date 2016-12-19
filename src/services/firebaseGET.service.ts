import { Injectable } from '@angular/core';
import { AngularFire } from 'angularfire2';

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

	getAllTrips(): Array<any> {
		return this.allTrips;
	}

	setAllUsers(callback): void {
		this.af.database.list('/users').forEach((user) => {
			this.allUsers = user;
			callback();
		});
	}

	getAllUsers(): Array<any> {
		return this.allUsers;
	}
}
