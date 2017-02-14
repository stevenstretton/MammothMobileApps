import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';
import { AuthenticationHandler } from "../../services/authenticationHandler.service";

import {
	GoogleMap,
	GoogleMapsEvent,
	GoogleMapsLatLng,
	CameraPosition,
	GoogleMapsMarkerOptions,
	GoogleMapsMarker
} from 'ionic-native';

@Component({
	selector: 'page-map',
	templateUrl: 'map.html'
})
export class Map {
	// private _currentUserLat: number;
	// private _currentUserLng: number;
	// private _tripMembers: Array<any>;
	// private _currentUser: any;
	// private _membersAllowingToSeeLocation: Array<any> = [];

	constructor(public navCtrl: NavController,
		public navParams: NavParams,
		public authenticationHandler: AuthenticationHandler) {
		// this._tripMembers = this.navParams.get('tripMembers');
		// this._currentUser = this.authenticationHandler.getCurrentUser();

		// this._currentUserLat = this._currentUser.location["lat"];
		// this._currentUserLng = this._currentUser.location["lng"];

		// this._tripMembers.forEach((tripMember) => {
		// 	// determining they have a location and that the current user is allowed to see it
		// 	if ((tripMember.location) && (tripMember.usersToSeeLocation) &&
		// 		(tripMember.usersToSeeLocation.indexOf(this._currentUser.key) > -1)) {
		// 		this._membersAllowingToSeeLocation.push(tripMember);
		// 	}
		// });
	}

	ngAfterViewInit() {
		this.loadMap();
	}

	loadMap() {

		// create a new map by passing HTMLElement
		let element: HTMLElement = document.getElementById('map');

		let map = new GoogleMap(element);

		// listen to MAP_READY event
		map.one(GoogleMapsEvent.MAP_READY).then(() => console.log('Map is ready!'));

		// create LatLng object
		let ionic: GoogleMapsLatLng = new GoogleMapsLatLng(43.0741904, -89.3809802);

		// create CameraPosition
		let position: CameraPosition = {
			target: ionic,
			zoom: 18,
			tilt: 30
		};

		// move the map's camera to position
		map.moveCamera(position);

		// create new marker
		let markerOptions: GoogleMapsMarkerOptions = {
			position: ionic,
			title: 'Ionic'
		};

		map.addMarker(markerOptions)
			.then((marker: GoogleMapsMarker) => {
				marker.showInfoWindow();
			});
	}

}
