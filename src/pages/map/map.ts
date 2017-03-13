import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { MapModal } from "./modals/modals";

declare var google;

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class Map {

  @ViewChild('map') mapElement: ElementRef;
  map: any;

  _currentUser: any;
  _tripMembers: any;
  _users : any;
  _directionDisplay : any;
  _directionsService : any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController) {

    this._currentUser = navParams.get('currentUser');
    this._tripMembers = navParams.get('tripMembers');
  }

  presentModal() {
    let modal = this.modalCtrl.create(MapModal, {
      tripMembers: this._tripMembers
    });
    modal.present();

    modal.onDidDismiss(memberId => {
      
      if(memberId != null){
        this.createRoute(memberId);
      }
    });
  }

  ionViewDidLoad() {
    this.loadMap();
  }

  loadMap() {

    //*********** MAP OPTIONS ****************//

    let mapOptions = {
      center: new google.maps.LatLng(53.376853, -1.467352),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    //*********** ARRAY OF MEMBER OBJECTS ****************//

    this._users = [
      {
        username: this._currentUser.username,
        firstName: this._currentUser.firstName,
        lastName: this._currentUser.lastName,
        location: this._currentUser.location,
        image: this._currentUser.photoUrl
      }
    ];

    for (var i = 0, tripMember; tripMember = this._tripMembers[i]; i++) {
      var member = {
        username: tripMember.username,
        firstName: tripMember.firstName,
        lastName: tripMember.lastName,
        location: tripMember.location,
        image: tripMember.photoUrl
      }
      this._users.push(member);
    };

    //*********** ADD MARKERS ****************//

    for (var i = 0, user; user = this._users[i]; i++) {
      if (this._users[i].location != null) {
        this.addMarker(user);
      }
    };

    //*********** OVERLAY TO STYLE MARKERS ****************//

    var myoverlay = new google.maps.OverlayView();
    myoverlay.draw = function () {
      this.getPanes().markerLayer.id = 'markerLayer';
    };
    myoverlay.setMap(this.map);

    //*********** INITIALISE ROUTERS ****************//

    this._directionDisplay = new google.maps.DirectionsRenderer();
    this._directionDisplay.setMap(this.map);
    this._directionDisplay.setOptions({ suppressMarkers: true });
    this._directionsService = new google.maps.DirectionsService();
  };
  

  createRoute(memberId) {

    //*********** ROUTING ****************//
    
    // location services source should always be current user
    var src = new google.maps.LatLng(this._users[0].location);

    //Loop and Draw Path Route between the Points on MAP

    if (src != null) {

      if (this._users[memberId + 1].location != null) {

        var des = new google.maps.LatLng(this._users[memberId + 1].location);
        var route = {
          origin: src,
          destination: des,
          travelMode: google.maps.DirectionsTravelMode.WALKING
        };

        this._directionsService.route(route, (result, status) => {
          if (status == google.maps.DirectionsStatus.OK) {
            
            this._directionDisplay.setDirections(result);
          } else {
            alert("couldn't get directions:" + status);
          }
        });
      }
    }
  }
  addMarker(user) {

    //*********** STYLE MARKER ****************//

    var icon = {
      url: user.image,
      size: new google.maps.Size(40, 40),
      scaledSize: new google.maps.Size(40, 40)
    };

    //*********** POSITION MARKER ****************//

    let marker = new google.maps.Marker({
      map: this.map,
      position: user.location,
      icon: icon,
      optimized: false
    });

    //*********** SET INFO WINDOW ****************//

    let content = '<div class="marker-content">' +
      '<h5 style="font-size:12px;">' + user.username + '</h5>' +
      '<h5 style="font-size:12px;">' + user.firstName + ' ' + user.lastName + '</h5>'
    '</div>';
    this.addInfoWindow(marker, content);
  }

  addInfoWindow(marker, content) {

    let infoWindow = new google.maps.InfoWindow({
      content: content
    });
    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
  }
}