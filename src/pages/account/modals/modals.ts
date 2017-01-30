import { Component } from '@angular/core';

import { ViewController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
	selector: 'page-locationModal',
	templateUrl: './templates/locationModal.html'
})
export class LocationModal {
	private _tripName: string;
	private _tripMembers: Array<any>;

	private _usersToSeeLocation: Array<any>;

	constructor(public viewCtrl: ViewController,
	            public params: NavParams) {
		this._usersToSeeLocation = [];

		this._tripName = params.get('name');
		this._tripMembers = params.get('members');

		this._tripMembers.forEach((member) => {
			if (member.canAlreadySee) {
				this._usersToSeeLocation.push(member.user.key);
			}
		});
	}

	dismiss() {
		this.viewCtrl.dismiss(this._usersToSeeLocation);
	}

	ifInArray(userID): boolean {
		return (this._usersToSeeLocation.indexOf(userID) > -1);
	}

	toggleClicked(memberID, check): void {
		if (check) {
			if (!this.ifInArray(memberID)) {
				this._usersToSeeLocation.push(memberID);
			}
		} else {
			if (this.ifInArray(memberID)) {
				this._usersToSeeLocation.splice(this._usersToSeeLocation.indexOf(memberID), 1);
			}
		}
	}
}

@Component({
	selector: 'page-changePasswordModal',
	templateUrl: './templates/changePasswordModal.html'
})
export class ChangePasswordModal {
	private _changePasswordForm: FormGroup;
	private _error: string;

	constructor(public viewCtrl: ViewController,
	            public params: NavParams,
	            public formBuilder: FormBuilder) {
		this._changePasswordForm = this.formBuilder.group({
			oldPassword: ['', Validators.required],
			newPassword: ['', Validators.required],
			confirmPassword: ['', Validators.required]
		})
	}

	dismiss() {
		this.viewCtrl.dismiss();
	}

	onFormSubmit(formData): void {
		if (formData.newPassword === formData.confirmPassword) {
			this.viewCtrl.dismiss(formData);
		} else {
			this._error = "Passwords must match!"
		}
	}
}

