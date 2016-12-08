import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FirebaseGET } from '../../services/firebaseGET.service';
import { FirebaseListObservable } from 'angularfire2';

@Component({
  selector: 'page-friends',
  templateUrl: 'friends.html'
})
export class Friends {
  friends: FirebaseListObservable<any[]>;

  constructor(public navCtrl: NavController, private firebaseTripGet: FirebaseGET) {
    this.friends = this.firebaseTripGet.getAllTrips();
  }
}
