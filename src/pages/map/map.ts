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
	private _isMoving: boolean = false;
	private _currentUserMarker: any;
	private _tripMembers: Array<any> = [];
	private _usersToDisplay: Array<any> = [];
	private _directionDisplay: any;
	private _directionsService: any;
	private _markers: Array<any> = [];
	private _isOnMap: boolean;
	private _tabsElement: any;
	private _tripLead: any;
	private _tripKey: any;
	private _membersExceptCurrent: Array<any> = [];

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

	constructor(private navParams: NavParams,
	            private modalCtrl: ModalController,
				private alertCtrl: AlertController,
				private locationHandler: LocationHandler,
				private firebasePut: FirebasePUT,
				private firebaseGet: FirebaseGET) {
		this._tabsElement = document.querySelector(".tabbar.show-tabbar");

		this._currentUser = navParams.get('currentUser');
		this._tripMembers = navParams.get('tripMembers');
		this._tripLead = navParams.get("tripLead");
		this._tripKey = navParams.get("tripKey");
	}

	public presentModal(): void {
		let modal = this.modalCtrl.create(MapModal, {
			tripMembers: this._membersExceptCurrent,
			isMoving: this._isMoving,
			tripKey: this._tripKey
		});
		modal.present();

		modal.onDidDismiss((memberID, isMoving) => {
			this._isMoving = isMoving;
			this.checkIfMoving();
			if (memberID) {
				this.createRoute(memberID);
			}
		});
	}

	private checkIfMoving(): void {
		if (this._isMoving) {
			this.startCurrentUserLocationIntervals();
		}
		this.startMemberLocationIntervals();
	}

	public ionViewDidLoad(): void {
		this.initMap();
		this.askIfStaticOrMoving();
		this._tabsElement.style.display = "none";
		this._isOnMap = true;
	}

	private askIfStaticOrMoving(): void {
		this.alertCtrl.create({
			title: 'Position',
			message: 'Are you stationary or moving?',
			buttons: [
				{
					text: 'Static',
					handler: () => {
						this._isMoving = false;
						this.startMemberLocationIntervals();
					}
				}, {
					text: 'Moving',
					handler: () => {
						this._isMoving = true;
						this.startCurrentUserLocationIntervals();
						this.startMemberLocationIntervals();
					}
				}
			]
		}).present();
	}

	private startCurrentUserLocationIntervals(): void {
		this.watchLocation();

		this._pushLocationInterval
			.subscribe(() => {
				this.pushLocation();
			});
	}

	private startMemberLocationIntervals(): void {
		this._updateInterval
			.subscribe(() => {
				this.updateAllTripMembers();
				this.updateMarkers();
			});
	}

	private watchLocation(): void {
		this.locationHandler.checkGeolocation(false, (location) => {
			if ((location.lat) && (location.lng)) {
				this.updateCurrentUserMarker(location);
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

		this._usersToDisplay = [];

		this._tripMembers.forEach((member) => {
			this.firebaseGet.getUserWithID(member.key, (user) => {
				tmp.push(user);

				if (user.key !== this._currentUser.key) {
					this._usersToDisplay.push(user);
				}
			});
		});
		this._tripMembers = tmp;

		if (this._tripLead.key !== this._currentUser.key) {
			this._usersToDisplay.push(this._tripLead);
		}
	}

	private updateCurrentUserMarker(location): void {
		this._currentUserMarker.setPosition(location);
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

	private initMap(): void {
		const mapOptions = {
			center: new google.maps.LatLng(this._currentUser.location),
			zoom: 15,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		this._map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

		this.buildMembersExceptCurrent();
		this.filterMembersToSeeLoc();
		this.addMapOverlay();
		this.initRouters();
	};

	private filterMembersToSeeLoc(): void {
		this._membersExceptCurrent.forEach((user) => {
			if (user.location) {
				this.checkIfSharingLocation(user, (allowedToSee) => {
					if (allowedToSee) {
						this.addMemberMarker(user);
					}
				});
			}
		});
		this.addMemberMarker(this._currentUser);
	}

	private addMapOverlay(): void {
		const overlay = new google.maps.OverlayView();
		overlay.draw = function() {
			this.getPanes().markerLayer.id = 'markerLayer';
		};
		overlay.setMap(this._map);
	}

	private buildMembersExceptCurrent(): void {
		this._tripMembers.forEach((member) => {
			if (member.key !== this._currentUser.key) {
				this._membersExceptCurrent.push(member);
			}
		});

		if (this._tripLead.key !== this._currentUser.key) {
			this._membersExceptCurrent.push(this._tripLead);
		}
	}

	private checkIfSharingLocation(user, callback): void {
		if (user.usersToSeeLocation) {
			user.usersToSeeLocation.forEach((trip) => {
				if (this._tripKey === trip.trip) {
					callback(trip.users.indexOf(this._currentUser.key) > -1);
				}
			});
		}
	}

	private initRouters(): void {
		this._directionDisplay = new google.maps.DirectionsRenderer();
		this._directionDisplay.setMap(this._map);
		this._directionDisplay.setOptions({suppressMarkers: true});
		this._directionsService = new google.maps.DirectionsService();
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
						this.showErrorAlert("Couldn't get directions");
					}
				});
			}
		}
	}

	private addMemberMarker(user): void {
		const icon = {
			url: user.photoUrl,
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

		if (user.key === this._currentUser.key) {
			this._currentUserMarker = marker;
		} else {
			this._markers.push(marker);
		}

		const content = '<div class="marker-content">' +
							'<h2 style="text-align: center" *ngIf="user.isLead">Lead</h2>' +
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
