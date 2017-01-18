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

		let pushCurrentToArray = () => {
			usersToSeeLoc.push({
				trip: tripID,
				users: usersIDsToSeeLoc
			});
		};

		this.firebaseGet.getUserWithID(userID, (user) => {
			if (typeof user.usersToSeeLocation !== "undefined") {
				user.usersToSeeLocation.forEach((tripUserPair) => {
					if (tripID !== tripUserPair.trip) {
						usersToSeeLoc.push({
							trip: tripUserPair.trip,
							users: tripUserPair.users
						});
					} else {
						pushCurrentToArray();
					}
				});
			} else {
				pushCurrentToArray();
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
