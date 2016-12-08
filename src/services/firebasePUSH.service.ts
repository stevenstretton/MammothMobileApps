import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

@Injectable()
export class FirebasePUSH {
	constructor(private af: AngularFire) {}

	pushNewTrip(trip): void {
		const promise = this.af.database.list('/trips').push(trip);

		promise
			.then(_ => console.log("success!"))
			.catch(err => console.log(err));
	}

	getAllUsers(): FirebaseListObservable<any> {
		return this.af.database.list('/users');
	}
}
