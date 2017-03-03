import { Injectable, Inject } from "@angular/core";

import { FirebasePUT } from "./firebase/put.service";
import { AuthenticationHandler } from "./authenticationHandler.service";

@Injectable()
export class LocationHandler {
	private _currentUser: any;

	constructor(public firebasePut: FirebasePUT,
				public authenticationHandler: AuthenticationHandler) {}

	getGeolocation(callback): void {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition((position) => {
				callback({
					lat: position.coords.latitude,
					lng: position.coords.longitude
				});
			}, (error) => {
				console.log(error);
			});
		} else {
			console.log("Geolocation not supported");
		}
	}

	checkUserLocation() {
		this._currentUser = this.authenticationHandler.getCurrentUser();

		if (this._currentUser.shareLocation) {
			this.getGeolocation((location) => {
				this.firebasePut.putUserLocation(this._currentUser.key, location);
			});
		} else {
			this.firebasePut.putUserLocation(this._currentUser.key, null);
		}
	}

	logLocation(whetherToLog): void {
		if (whetherToLog) {
			this.getGeolocation((location) => {
				this.firebasePut.putUserLocation(this._currentUser.key, location);
			});
		} else {
			this.firebasePut.putUserLocation(this._currentUser.key, null);
		}
	}
}
