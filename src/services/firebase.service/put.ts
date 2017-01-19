import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { FirebaseGET } from "./get"

@Injectable()
export class FirebasePUT {
	constructor(private af: AngularFire,
	            public firebaseGet: FirebaseGET) {}

	putUserFriends(userID, friends): void {
		const userObjectObservable = this.af.database.object("users/" + userID);

		let currentFriendIDs = [];

		this.firebaseGet.getUserWithID(userID, (user) => {
			if ((typeof user.friends !== "undefined") && (user.friends.length > 0)) {
				currentFriendIDs = user.friends;
			}

			if (friends.length > 0) {
				friends.forEach((friend) => {
					currentFriendIDs.push(friend.key);
				});
			}
		});

		userObjectObservable.update({
			friends: currentFriendIDs
		});
	}

	putUserToSeeLocation(userID, tripID, usersIDsToSeeLoc): void {
		const userObjectObservable = this.af.database.object("users/" + userID);

		let usersToSeeLoc = [];

		let pushTripObjToArray = (trip, users) => {
			usersToSeeLoc.push({
				trip: trip,
				users: users
			});
		};

		this.firebaseGet.getUserWithID(userID, (user) => {
			if (typeof user.usersToSeeLocation !== "undefined") {
				user.usersToSeeLocation.forEach((tripUserPair) => {
					if (tripID !== tripUserPair.trip) {
						pushTripObjToArray(tripUserPair.trip, tripUserPair.users);
					} else {
						pushTripObjToArray(tripID, usersIDsToSeeLoc);
					}
				});
			} else {
				pushTripObjToArray(tripID, usersIDsToSeeLoc);
			}
		});

		userObjectObservable.update({
			usersToSeeLocation: usersToSeeLoc
		});
	}

	putShareLocation(userID, shareLocation): void {
		const userObjectObservable = this.af.database.object("users/" + userID);

		userObjectObservable.update({
			shareLocation: shareLocation
		});
	}
}
