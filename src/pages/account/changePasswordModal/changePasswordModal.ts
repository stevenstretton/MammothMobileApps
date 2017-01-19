import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ViewController, Platform, NavParams } from 'ionic-angular';

@Component({
	selector: 'page-changePasswordModal',
	templateUrl: 'changePasswordModal.html'
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
