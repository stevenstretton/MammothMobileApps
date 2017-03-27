import { Injectable, Inject } from "@angular/core";

import { FirebasePUT } from "./firebase/put.service";
import { AuthenticationHandler } from "./authenticationHandler.service";

@Injectable()
export class LocationHandler {
	private _currentUser: any;

	constructor(public firebasePut: FirebasePUT,
				public authenticationHandler: AuthenticationHandler) {}

	private getGeolocation(callback): void {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition((position) => {
				callback({
					lat: position.coords.latitude,
					lng: position.coords.longitude
				});
			}, (error) => {
				callback(error);
			});
		} else {
			callback("Geolocation not supported");
		}
	}

	public checkUserLocation(callback) {
		this._currentUser = this.authenticationHandler.getCurrentUser();

		if (this._currentUser.shareLocation) {
			this.getGeolocation((location) => {
				if ((location.lat) && (location.lng)) {
					this.firebasePut.putUserLocation(this._currentUser.key, location);
				} else {
					callback(location);
				}
			});
		} else {
			this.firebasePut.putUserLocation(this._currentUser.key, null);
		}
	}

	public logLocation(whetherToLog: boolean, callback): void {
		if (whetherToLog) {
			this.getGeolocation((location) => {
				if ((location.lat) && (location.lng)) {
					this.firebasePut.putUserLocation(this._currentUser.key, location);
				} else {
					callback(location);
				}
			});
		} else {
			this.firebasePut.putUserLocation(this._currentUser.key, null);
		}
	}
}
