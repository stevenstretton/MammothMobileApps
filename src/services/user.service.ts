import { Injectable } from '@angular/core';

import { aUser } from "../classes/user.class";
import { AuthenticationHandler } from "../services/authenticationHandler.service";
import { FirebaseGET } from "../services/firebaseGET.service";


@Injectable()
export class UserService {
	private currentUser: aUser;

	constructor(private authenticationHandler: AuthenticationHandler,
				private firebaseGet: FirebaseGET) {}

	setTheCurrentUser(): void {
		this.currentUser = new aUser();

		let currentUser = this.authenticationHandler.getCurrentFirebaseUser(),
			allUsers = this.firebaseGet.getAllUsers(),
			allTrips = this.firebaseGet.getAllTrips();

		allUsers.forEach((user) => {
			if (user.$key === currentUser.uid) {
				this.currentUser.setEmail(user.email);
				this.currentUser.setFirstName(user.firstName);
				this.currentUser.setLastName(user.lastName);
				this.currentUser.setPhotoUrl(user.photoUrl);
				this.currentUser.setUid(user.$key);
				this.currentUser.setUsername(user.username);
				this.currentUser.setIsSharingLocation(user.shareLocation);
			}
		});

		allTrips.forEach((trip) => {
			trip.friends.forEach((friend) => {
				if (friend === currentUser.uid) {
					this.currentUser.addTrip({
						trip: trip,
						lead: false
					});
				}
			});

			if (trip.leadOrganiser === currentUser.uid) {
				this.currentUser.addTrip({
					trip: trip,
					lead: true
				});
			}
		});
	}

	getTheCurrentUser(): aUser {
		return this.currentUser;
	}
}
