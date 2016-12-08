import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FirebaseGET } from '../../services/firebaseGET.service';
import { FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

@Component({
	selector: 'page-myTrips',
	templateUrl: 'myTrips.html'
})
export class MyTrips {
	trips: FirebaseListObservable<any>;

	constructor(public navCtrl: NavController, public firebaseGet: FirebaseGET) {
		this.trips = this.firebaseGet.getAllTrips();
	}
}
