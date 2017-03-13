import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams) {

    this._currentUser = navParams.get('currentUser');
    this._tripMembers = navParams.get('tripMembers');
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

    var users = [
      {
        username: this._currentUser.username,
        firstName: this._currentUser.firstName,
        lastName: this._currentUser.lastName,
        position: this._currentUser.location,
        image: this._currentUser.photoUrl
      }
    ];

    for (var i = 0, tripMember; tripMember = this._tripMembers[i]; i++) {
      var member = {
        username: tripMember.username,
        firstName: tripMember.firstName,
        lastName: tripMember.lastName,
        position: tripMember.location,
        image: tripMember.photoUrl
      }
      users.push(member);
    };

    //*********** ADD MARKERS ****************//

    for (var i = 0, user; user = users[i]; i++) {
      this.addMarker(user);
    }

    //*********** OVERLAY TO STYLE MARKERS ****************//

    var myoverlay = new google.maps.OverlayView();
    myoverlay.draw = function () {
      this.getPanes().markerLayer.id = 'markerLayer';
    };
    myoverlay.setMap(this.map);

    //*********** ROUTING ****************//

    //Initialize the Direction Services
    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(this.map);
    directionsDisplay.setOptions( { suppressMarkers: true } );

    var src = new google.maps.LatLng(users[0].position);

    //Loop and Draw Path Route between the Points on MAP
    for (var i = 1; i < users.length; i++) {

      var des = new google.maps.LatLng(users[i].position);
      var route = {
        origin: src,
        destination: des,
        travelMode: google.maps.DirectionsTravelMode.WALKING
      };

      directionsService.route(route, function (result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(result);
        } else {
          alert("couldn't get directions:" + status);
        }
      });
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
      position: user.position,
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