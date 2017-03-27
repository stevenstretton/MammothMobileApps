import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { MapModal } from "./modals/modals";

declare let google;

@Component({
	selector: 'page-',
	templateUrl: '.html'
})
export class Map {
	@ViewChild('') mapElement: ElementRef;

	private _map: any;
	private _currentUser: any;
	private _tripMembers: any;
	private _users: any;
	private _directionDisplay: any;
	private _directionsService: any;

	constructor(public navParams: NavParams,
	            public modalCtrl: ModalController) {

		this._currentUser = navParams.get('currentUser');
		this._tripMembers = navParams.get('tripMembers');
	}

	presentModal(): void {
		let modal = this.modalCtrl.create(MapModal, {
			tripMembers: this._tripMembers
		});
		modal.present();

		modal.onDidDismiss((memberID) => {
			if (memberID) {
				this.createRoute(memberID);
			}
		});
	}

	ionViewDidLoad(): void {
		this.loadMap();
	}

	loadMap(): void {
		const mapOptions = {
			center: new google.maps.LatLng(53.376853, -1.467352),
			zoom: 15,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		this._map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

		// Could the current user be duplicated here?
		this._users = [
			{
				username: this._currentUser.username,
				firstName: this._currentUser.firstName,
				lastName: this._currentUser.lastName,
				location: this._currentUser.location,
				image: this._currentUser.photoUrl
			}
		];

		this._tripMembers.forEach((tripMember) => {
			this._users.push({
				username: tripMember.username,
				firstName: tripMember.firstName,
				lastName: tripMember.lastName,
				location: tripMember.location,
				image: tripMember.photoUrl
			});
		});

		this._users.forEach((user) => {
			if (user.location) {
				this.addMarker(user);
			}
		});

		const overlay = new google.maps.OverlayView();
		overlay.draw = function() {
			this.getPanes().markerLayer.id = 'markerLayer';
		};
		overlay.setMap(this._map);

		// init routers
		this._directionDisplay = new google.maps.DirectionsRenderer();
		this._directionDisplay.setMap(this._map);
		this._directionDisplay.setOptions({suppressMarkers: true});
		this._directionsService = new google.maps.DirectionsService();
	};

	createRoute(memberId): void {
		const src = new google.maps.LatLng(this._currentUser.location);

		//Loop and Draw Path Route between the Points on MAP
		if (src) {
			if (this._users[memberId + 1].location) {
				const des = new google.maps.LatLng(this._users[memberId + 1].location);
				const route = {
					origin: src,
					destination: des,
					travelMode: google.maps.DirectionsTravelMode.WALKING
				};

				this._directionsService.route(route, (result, status) => {
					if (status === google.maps.DirectionsStatus.OK) {

						this._directionDisplay.setDirections(result);
					} else {
						alert("couldn't get directions:" + status);
					}
				});
			}
		}
	}

	addMarker(user): void {
		//*********** STYLE MARKER ****************//

		const icon = {
			url: user.image,
			size: new google.maps.Size(40, 40),
			scaledSize: new google.maps.Size(40, 40)
		};

		//*********** POSITION MARKER ****************//

		const marker = new google.maps.Marker({
			map: this._map,
			position: user.location,
			icon: icon,
			optimized: false
		});

		//*********** SET INFO WINDOW ****************//

		const content = '<div class="marker-content">' +
							'<h5 style="font-size: 12px;">' + user.username + '</h5>' +
							'<h5 style="font-size: 12px;">' + user.firstName + ' ' + user.lastName + '</h5>' +
						'</div>';
		this.addInfoWindow(marker, content);
	}

	addInfoWindow(marker, content): void {
		const infoWindow = new google.maps.InfoWindow({
			content: content
		});

		google.maps.event.addListener(marker, 'click', () => {
			infoWindow.open(this._map, marker);
		});
	}
}
