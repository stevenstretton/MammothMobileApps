import { Component } from '@angular/core';

import { aUser } from "./user.class"

@Component({
	selector: 'page-account',
	templateUrl: 'account.html'
})
export class aTrip {
	private _friends: Array<aUser>;
	private _leadOrganiser: string;
	private _location: Object;
	private _name: string;
	private _coverPhoto: string;
	private _startDate: Date;
	private _endDate: Date;

	constructor() {
		this._friends = null;
		this._leadOrganiser = null;
		this._location = null;
		this._name = null;
		this._coverPhoto = null;
		this._startDate = null;
		this._endDate = null;
	}

	addFriend(friend): void {
		this._friends.push(friend);
	}

	setFriends(friends): void {
		this._friends = friends;
	}

	getFriends(): Array<aUser> {
		return this._friends;
	}

	getLeadOrganiser(): string {
		return this._leadOrganiser;
	}

	setLeadOrganiser(leadOrganiser): void {
		this._leadOrganiser = leadOrganiser;
	}

	setLocation(location): void {
		this._location = location;
	}

	getLocation(): Object {
		return this._location;
	}

	setStartDate(startDate): void {
		this._startDate = startDate;
	}

	getStartDate(): Date {
		return this._startDate;
	}

	setEndDate(endDate): void {
		this._endDate = endDate;
	}

	getEndDate(): Date {
		return this._endDate;
	}

	setName(name): void {
		this._name = name
	}

	getName(): string {
		return this._name;
	}

	setCoverPhoto(coverPhoto): void {
		this._coverPhoto = coverPhoto;
	}

	getCoverPhoto(): string {
		return this._coverPhoto;
	}
}
