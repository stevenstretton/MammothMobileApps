import { Injectable } from '@angular/core';
import { AngularFire, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';

@Injectable()
export class FirebaseDELETE {

	constructor(private af: AngularFire) {}

	deleteTrip(tripID): void {
		const promise = this.af.database.object('/trips/' + tripID).remove();

		promise
			.then(_ => console.log("Success!"))
			.catch(err => console.log(err));
	}
}
