import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { FirebaseGET } from "./firebaseGET.service"

@Injectable()
export class FirebasePUSH {
	constructor(private af: AngularFire,
				public firebaseGet: FirebaseGET) {}

	pushNewTrip(trip): void {
		const promise = this.af.database.list('/trips').push(trip);

		promise
			.then(_ => console.log("success!"))
			.catch(err => console.log(err));
	}

	addMemberToSeeLocation(userID, tripID, usersToSeeLocation): void {
		const userObjectObservable = this.af.database.object("users/" + userID);

		let usersToSeeLoc = [];

		// Maybe put this in a separate function with a callback
		this.firebaseGet.getUserWithID(userID, (user) => {
			if (typeof user.usersToSeeLocation !== "undefined") {
				usersToSeeLoc.push(user.usersToSeeLocation);
			}
			//user.usersToSeeLocation.forEach((item) => {
			//	if (item.trip === tripID) {
			//
			//	}
			//});
			usersToSeeLoc.push({
				trip: tripID,
				users: usersToSeeLocation
			});
		});

		// ...on callback do this
		userObjectObservable.update({
			usersToSeeLocation: usersToSeeLoc
		});
	}
}
