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
	private _currentUserMarker: any;
	private _allTripMembers: Array<any> = [];
	private _usersToDisplay: Array<any> = [];
	private _directionDisplay: any;
	private _directionsService: any;
	private _markers: Array<any> = [];
	private _isOnMap: boolean;
	private _tabsElement: any;

	private _pushLocationInterval: any = Observable
				.interval(5000)
				.timeInterval()
				.takeWhile(() => {
					return this._isOnMap;
				});

	private _updateInterval: any = Observable
				.interval(10000)
				.timeInterval()
				.takeWhile(() => {
					return this._isOnMap;
				});

	private _updateCurrentPosition: any = Observable
				.interval(1000)
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

		this._tabsElement = document.querySelector(".tabbar.show-tabbar");
		this._currentUser = navParams.get('currentUser');
		this._allTripMembers = navParams.get('allTripMembers');
	}

	public presentModal(): void {
		let membersToShow = [];

		this._allTripMembers.forEach((member) => {
			if (member.key !== this._currentUser.key) {
				membersToShow.push(member);
			}
		});

		let modal = this.modalCtrl.create(MapModal, {
			tripMembers: membersToShow
		});
		modal.present();

		modal.onDidDismiss((memberID) => {
			if (memberID) {
				this.createRoute(memberID);
			}
		});
	}

	public ionViewDidLoad(): void {
		this._tabsElement.style.display = "none";
		this._isOnMap = true;
		this.initLoadMap();

		this._updateCurrentPosition
			.subscribe(() => {
				this.watchLocation();
			});

		this._pushLocationInterval
			.subscribe(() => {
				this.pushLocation();
			});

		this._updateInterval
			.subscribe(() => {
				this.updateAllTripMembers();
				this.updateMarkers();
			});
	}

	private watchLocation(): void {
		this.locationHandler.checkGeolocation(false, (location) => {
			if ((location.lat) && (location.lng)) {
				this.updateCurrentUserMarker();
			} else {
				this.showErrorAlert(location.message);
			}
		});
	}

	public ionViewWillLeave(): void {
		this._isOnMap = false;
		this._tabsElement.style.display = "flex";
	}

	private pushLocation(): void {
		this.locationHandler.checkGeolocation(true, (location) => {
			if ((location.lat) && (location.lng)) {
				this.firebasePut.putUserLocation(this._currentUser.key, location);
			} else {
				this.showErrorAlert(location.message);
			}
		});
	}

	private updateAllTripMembers(): void {
		let tmp = [];

		this._allTripMembers.forEach((member) => {
			this.firebaseGet.getUserWithID(member.key, (user) => {
				tmp.push(user);
			});
		});
		this._allTripMembers = tmp;
		this._usersToDisplay = this._allTripMembers;
	}

	private updateCurrentUserMarker(): void {

	}

	private updateMarkers(): void {
		this._markers.forEach((marker) => {
			this._usersToDisplay.forEach((user) => {
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

	private initLoadMap(): void {
		const mapOptions = {
			center: new google.maps.LatLng(this._currentUser.location),
			zoom: 15,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		this._map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

		this._allTripMembers.forEach((tripMember) => {
			this.pushTripMember(tripMember);
		});

		this._usersToDisplay.forEach((user) => {
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

	private pushTripMember(tripMember): void {
		this._usersToDisplay.push({
			username: tripMember.username,
			firstName: tripMember.firstName,
			lastName: tripMember.lastName,
			location: tripMember.location,
			image: tripMember.photoUrl
		});
	}

	private createRoute(memberId): void {
		const src = new google.maps.LatLng(this._currentUser.location);

		//Loop and Draw Path Route between the Points on MAP
		if (src) {
			if (this._usersToDisplay[memberId + 1].location) {
				const des = new google.maps.LatLng(this._usersToDisplay[memberId + 1].location);
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
		const icon = {
			url: user.image,
			size: new google.maps.Size(40, 40),
			scaledSize: new google.maps.Size(40, 40)
		};

		const marker = new google.maps.Marker({
			map: this._map,
			position: user.location,
			icon: icon,
			optimized: false
		});
		marker.set("id", user.username);
		this._markers.push(marker);

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
