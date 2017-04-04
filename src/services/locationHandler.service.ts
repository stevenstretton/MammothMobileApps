import { Injectable, Inject } from "@angular/core";

import { FirebasePUT } from "./firebase/put.service";
import { AuthenticationHandler } from "./authenticationHandler.service";

@Injectable()
export class LocationHandler {
	private _currentUser: any;

	constructor(public firebasePut: FirebasePUT,
				public authenticationHandler: AuthenticationHandler) {}

	private getGeolocationCurrent(callback): void {
		navigator.geolocation.getCurrentPosition((position) => {
			callback({
				lat: position.coords.latitude,
				lng: position.coords.longitude
			});
		}, (error) => {
			callback(error);
		});
	}

	private watchGeolocation(callback): void {
		navigator.geolocation.watchPosition((position) => {
			callback({
				lat: position.coords.latitude,
				lng: position.coords.longitude
			});
		}, (error)=> {
			callback(error);
		});
	}

	public checkGeolocation(getCurrent: boolean, callback): void {
		if (navigator.geolocation) {
			if (getCurrent) {
				this.getGeolocationCurrent((location) => {
					callback(location);
				});
			} else {
				this.watchGeolocation((location) => {
					callback(location);
				});
			}
		} else {
			callback({
				code: 2,
				message: "Geolocation not supported!"
			});
		}
	}

	public checkUserLocation(callback) {
		this._currentUser = this.authenticationHandler.getCurrentUser();

		if (this._currentUser.shareLocation) {
			this.checkGeolocation(true, (location) => {
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
			this.checkGeolocation(true, (location) => {
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
