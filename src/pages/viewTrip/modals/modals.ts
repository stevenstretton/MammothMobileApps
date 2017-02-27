import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ViewController, NavParams } from 'ionic-angular';
import { FirebaseGET } from "../../../services/firebase/get.service";
import { AuthenticationHandler } from "../../../services/authenticationHandler.service";

export class EditModal {
	protected _title: string;
	protected _editForm: FormGroup;

	constructor(public viewCtrl: ViewController,
	            public navParams: NavParams,
	            public formBuilder: FormBuilder) {
		this._title = this.navParams.get('title');

		this._editForm = this.formBuilder.group({
			oldValue: [{
				value: this.navParams.get('oldValue'),
				disabled: true
			},
				Validators.required],
			newValue: [{
				value: this.navParams.get('oldValue'),
				disabled: false
			},
				 Validators.required]
		});
	}

	protected dismiss(): void {
		this.viewCtrl.dismiss();
	}

	protected onFormSubmit(formData): void {
		this.viewCtrl.dismiss(formData);
	}
}

@Component({
	selector: 'modal-editDateModal',
	templateUrl: './templates/editDateModal.html'
})
export class EditDateModal extends EditModal {
	private _minDate: any;
	constructor(public viewCtrl: ViewController,
	            public navParams: NavParams,
	            public formBuilder: FormBuilder) {
		super(viewCtrl, navParams, formBuilder);
		this._minDate = this.navParams.get('minDate')
	}
}

@Component({
	selector: 'modal-editInputModal',
	templateUrl: './templates/editInputModal.html'
})
export class EditInputModal extends EditModal {

	constructor(public viewCtrl: ViewController,
	            public navParams: NavParams,
	            public formBuilder: FormBuilder) {
		super(viewCtrl, navParams, formBuilder);
	}
}

@Component({
	selector: 'modal-editTextareaModal',
	templateUrl: './templates/editTextareaModal.html'
})
export class EditTextareaModal extends EditModal {

	constructor(public viewCtrl: ViewController,
	            public navParams: NavParams,
	            public formBuilder: FormBuilder) {
		super(viewCtrl, navParams, formBuilder);
	}
}

@Component({
	selector: 'modal-editTimeModal',
	templateUrl: './templates/editTimeModal.html'
})
export class EditTimeModal extends EditModal {

	constructor(public viewCtrl: ViewController,
	            public navParams: NavParams,
	            public formBuilder: FormBuilder) {
		super(viewCtrl, navParams, formBuilder);
	}
}

@Component({
	selector: 'modal-addMembersModal',
	templateUrl: 'templates/addMembersModal.html'
})
export class AddMembersModal {
	private _friendsNotOnTrip: Array<any>;
	private _currentUser: any;
	private _friendsToBeOnTrip: Array<any>;

	constructor(public viewCtrl: ViewController,
	            public navParams: NavParams,
				public firebaseGet: FirebaseGET,
				public authenticationHandler: AuthenticationHandler) {
		let friendsOnTrip = this.navParams.get('oldValue'),
			allUsers = this.firebaseGet.getAllUsers();

		this._currentUser = this.authenticationHandler.getCurrentUser();
		this._friendsNotOnTrip = [];
		this._friendsToBeOnTrip = [];

		allUsers.forEach((user) => {
			if ((friendsOnTrip.map(u => u.key).indexOf(user.key) <= -1) && (this._currentUser.friends.indexOf(user.key) > -1)) {
				this._friendsNotOnTrip.push(user);
			}
		});

		if (friendsOnTrip != null)
		{
			friendsOnTrip.forEach((friend) => {
				this._friendsToBeOnTrip.push(friend);
			});
		}
	}

	dismiss(): void {
		this.viewCtrl.dismiss(this._friendsToBeOnTrip);
	}

	ifInArray(person): boolean {
		return (this._friendsToBeOnTrip.indexOf(person) > -1);
	}

	toggleClicked(person, check): void {
		if (check) {
			if (!this.ifInArray(person)) {
				this._friendsToBeOnTrip.push(person);
			}
		} else {
			if (this.ifInArray(person)) {
				this._friendsToBeOnTrip.splice(this._friendsToBeOnTrip.indexOf(person), 1);
			}
		}
	}
}

@Component({
	selector: 'modal-addItemsModal',
	templateUrl: 'templates/addItemsModal.html'
})
export class AddItemsModal {
	private _itemsForTrip: Array<any>;
	private _itemsForTripForm: FormGroup;

	constructor(public viewCtrl: ViewController,
	            public navParams: NavParams,
	            public firebaseGet: FirebaseGET,
	            public authenticationHandler: AuthenticationHandler,
				public formBuilder: FormBuilder) {
		let itemsForTrip = this.navParams.get('oldValue');

		this._itemsForTrip = [];

		this._itemsForTripForm = this.formBuilder.group({
			name: ['', Validators.required],
			description: ['', Validators.required]
		});

		if (itemsForTrip != null){
			itemsForTrip.forEach((item) => {
				this._itemsForTrip.push(item);
			});
				}
	}

	addItemFormSubmit(formData): void {
		this._itemsForTrip.push(formData);
	}

	dismiss(): void {
		this.viewCtrl.dismiss(this._itemsForTrip);
	}

	ifInArray(person): boolean {
		return (this._itemsForTrip.indexOf(person) > -1);
	}

	toggleClicked(person, check): void {
		if (check) {
			if (!this.ifInArray(person)) {
				this._itemsForTrip.push(person);
			}
		} else {
			if (this.ifInArray(person)) {
				this._itemsForTrip.splice(this._itemsForTrip.indexOf(person), 1);
			}
		}
	}
}


