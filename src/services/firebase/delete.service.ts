import { Injectable } from '@angular/core';
import { AngularFire, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';

@Injectable()
export class FirebaseDELETE {

	constructor(private af: AngularFire) {}

	deleteTrip(tripID): void {
		const tripObjectObservable = this.af.database.object('trips/' + tripID).remove();

		tripObjectObservable
			.then(_ => console.log("Success!"))
			.catch(err => console.log(err));
	}

	deleteTripMember(memberID, tripID, tripMembers): void {
		const tripObjectObservable = this.af.database.object('trips/' + tripID);

		let tripMemberIDs = [];
		tripMembers.forEach((member) => {
			tripMemberIDs.push(member.key);
		});

		tripMemberIDs.splice(tripMemberIDs.indexOf(memberID), 1);

		tripObjectObservable.update({
			friends: tripMemberIDs
		});
	}

	deleteTripItem(itemID, tripID, tripItems): void {
		const tripObjectObservable = this.af.database.object('trips/' + tripID);

		let tripItemIDs = [];
		tripItems.forEach((item) => {
			tripItemIDs.push(item.key);
		});

		tripItemIDs.splice(tripItemIDs.indexOf(itemID), 1);

		tripObjectObservable.update({
			items: tripItemIDs
		});
	}
}
