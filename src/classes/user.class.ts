import { Component } from '@angular/core';

import { FirebaseGET } from "../../services/firebaseGET.service"

@Component({
	selector: 'page-account',
	templateUrl: 'account.html'
})
export class aUser {
	private _uid: string;
	private _username: string;
	private _password: string;
	private _email: string;
	private _photoUrl: string;
	private _firstName: string;
	private _lastName: string;

	constructor() {
		this._uid = null;
		this._username = null;
		this._password = null;
		this._email = null;
		this._photoUrl = null;
		this._firstName = null;
		this._lastName = null;
	}

	setUid(uid): void {
		this._uid = uid;
	}

	getUid(): string {
		return this._uid;
	}

	setUsername(username): void {
		this._username = username;
	}

	getUsername(): string {
		return this._username;
	}

	setPassword(password): void {
		this._password = password;
	}

	getPassword(): string {
		return this._password;
	}

	setEmail(email): void {
		this._email = email
	}

	getEmail(): string {
		return this._email;
	}

	setPhotoUrl(photoUrl): void {
		this._photoUrl = photoUrl;
	}

	getPhotoUrl(): string {
		return this._photoUrl;
	}

	setFirstName(firstName): void {
		this._firstName = firstName;
	}

	getFirstName(): string {
		return this._firstName;
	}

	setLastName(lastName): void {
		this._lastName = lastName;
	}

	getLastName(): string {
		return this._lastName;
	}
}
