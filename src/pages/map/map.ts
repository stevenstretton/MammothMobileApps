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
    public navParams: NavParams  ) {
    
    this._currentUser = navParams.get('currentUser');
    this._tripMembers = navParams.get('tripMembers');
  }

  ionViewDidLoad() {
    this.loadMap();
  }

  loadMap() {

    let mapOptions = {
      center: new google.maps.LatLng(53.376853, -1.467352),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    var users = [
      {
        username: this._currentUser.username,
        firstName: this._currentUser.firstName,
        lastName: this._currentUser.lastName,
        position: this._currentUser.location,
        image: this._currentUser.photoUrl
      }
    ];

    for(var i = 0, tripMember; tripMember = this._tripMembers[i]; i++ ){
      var member = {
        username:  tripMember.username,
        firstName: tripMember.firstName,
        lastName: tripMember.lastName,
        position: tripMember.location,
        image: tripMember.photoUrl
      }
      users.push(member);    
    };

    for (var i = 0, user; user = users[i]; i++) {
      this.addMarker(user);
    }

     var myoverlay = new google.maps.OverlayView();
     myoverlay.draw = function () {
         this.getPanes().markerLayer.id='markerLayer';
     };
     myoverlay.setMap(this.map); 
  }

  addMarker(user) {

    var icon = {
      url: user.image, 
      size: new google.maps.Size(40, 40),
      scaledSize: new google.maps.Size(40, 40),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(0, 0)      
    };

    let marker = new google.maps.Marker({ 
      map: this.map,      
      position: user.position,
      icon: icon, 
      optimized: false
    });

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