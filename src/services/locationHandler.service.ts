import { Injectable } from '@angular/core';
import { BackgroundGeolocation } from "ionic-native";

@Injectable()
export class LocationHandler {
	constructor() {}

	startLoggingLocation(): void {
		BackgroundGeolocation.start();

		console.log(BackgroundGeolocation.getLocations());
	}

	stopLoggingLocation(): void {
		BackgroundGeolocation.stop();
	}
}
