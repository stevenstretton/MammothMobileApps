import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavParams, ModalController, AlertController } from 'ionic-angular';
import { MapModal } from "./modals/modals";
import { LocationHandler } from "../../services/locationHandler.service";
import { Observable } from "rxjs";
import { FirebasePUT } from "../../services/firebase/put.service";
import { FirebaseGET } from "../../services/firebase/get.service";

declare let google;

@Component({
	selector: 'page-map',
	templateUrl: 'map.html'
})
export class Map {
	@ViewChild('map') mapElement: ElementRef;

	private _map: any;
	private _currentUser: any;
	private _tripMembers: Array<any>;
	private _users: Array<any>;
	private _directionDisplay: any;
	private _directionsService: any;
	private _markers: Array<any>;
	private _isOnMap: boolean;

	private _pushLocationInterval: any = Observable
				.interval(2000)
				.timeInterval()
				.takeWhile(() => {
					return this._isOnMap;
				});

	private _updateInterval: any = Observable
				.interval(5000)
				.timeInterval()
				.takeWhile(() => {
					return this._isOnMap;
				});

	constructor(private navParams: NavParams,
	            private modalCtrl: ModalController,
				private alertCtrl: AlertController,
				private locationHandler: LocationHandler,
				private firebasePut: FirebasePUT,
				private firebaseGet: FirebaseGET) {

		this._currentUser = navParams.get('currentUser');
		this._tripMembers = navParams.get('tripMembers');

		this._markers = [];
	}

	public presentModal(): void {
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

	public ionViewDidLoad(): void {
		this._isOnMap = true;
		this.loadMap();

		//this._pushLocationInterval
		//	.subscribe(() => {
		//		this.pushLocation();
		//	});

		this._updateInterval
			.subscribe(() => {
				this.updateTripMembers();
				this.updateMarkers();
			});
	}

	public ionViewWillLeave(): void {
		this._isOnMap = false;
	}

	private pushLocation(): void {
		this.locationHandler.checkGeolocation((location) => {
			if ((location.lat) && (location.lng)) {
				this.firebasePut.putUserLocation(this._currentUser.key, location);
			} else {
				this.showErrorAlert(location.message);
			}
		});
	}

	private updateTripMembers(): void {
		let tmp = [];

		this._tripMembers.forEach((member) => {
			this.firebaseGet.getUserWithID(member.key, (user) => {
				if (this._currentUser.key === user.key) {
					this._currentUser = user;
				}
				tmp.push(user);
			});
		});
		this._tripMembers = tmp;

		this.updateCurrentUser(() => {
			this._users = this._tripMembers;
			this._users.push(this._currentUser);
		});
		console.log(this._tripMembers);
	}

	private updateCurrentUser(callback): void {
		this.firebaseGet.getUserWithID(this._currentUser.key, (currentUser) => {
			this._currentUser = currentUser;
			callback();
		});
	}

	private updateMarkers(): void {
		this._markers.forEach((marker) => {
			this._users.forEach((user) => {
				if (user.username === marker.get("id")) {
					marker.setPosition(user.location);
				}
			});
		});
	}

	private showErrorAlert(errMessage: string): void {
		this.alertCtrl.create({
			title: 'Error',
			message: errMessage,
			buttons: ['Dismiss']
		}).present();
	}

	private loadMap(): void {
		const mapOptions = {
			center: new google.maps.LatLng(this._currentUser.location),
			zoom: 15,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		this._map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

		// Could the current user be duplicated here?
		this._users = [{
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

	private createRoute(memberId): void {
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
						this.alertCtrl.create({
							title: 'Error',
							message: "Couldn't get directions",
							buttons: ['Dismiss']
						}).present();
					}
				});
			}
		}
	}

	private addMarker(user): void {
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
		marker.set("id", user.username);
		this._markers.push(marker);

		//*********** SET INFO WINDOW ****************//

		const content = '<div class="marker-content">' +
							'<h5 style="font-size: 12px;">' + user.username + '</h5>' +
							'<h5 style="font-size: 12px;">' + user.firstName + ' ' + user.lastName + '</h5>' +
						'</div>';
		this.addInfoWindow(marker, content);
	}

	private addInfoWindow(marker, content): void {
		const infoWindow = new google.maps.InfoWindow({
			content: content
		});

		google.maps.event.addListener(marker, 'click', () => {
			infoWindow.open(this._map, marker);
		});
	}
}
