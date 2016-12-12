import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

@Injectable()
export class FirebaseGET {
	constructor(private af: AngularFire) {}

	getAllTrips(): FirebaseListObservable<any> {
		return this.af.database.list('/trips');
	}

	getAllUsers(): FirebaseListObservable<any> {
		return this.af.database.list('/users');
	}
}
