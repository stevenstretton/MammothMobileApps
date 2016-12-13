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

		let currentUser = this.authenticationHandler.getCurrentUser(),
			allUsers = this.firebaseGet.getAllUsers();

		console.log(allUsers);
		console.log(currentUser);

		allUsers.forEach((user) => {
			console.log(user);
			console.log(user.$key);
			console.log(currentUser.uid);
			console.log("===============");

			if (user.$key === currentUser.uid) {
				this.currentUser.setEmail(user.email);
				this.currentUser.setFirstName(user.firstName);
				this.currentUser.setLastName(user.lastName);
				this.currentUser.setPhotoUrl(user.photoUrl);
				this.currentUser.setUid(user.$key);
				this.currentUser.setUsername(user.username);
			}
		});
	}

	getTheCurrentUser(): aUser {
		return this.currentUser;
	}
}
