import { Component } from "@angular/core";
import { ViewController } from "ionic-angular";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
	selector: 'modal-forgotPassword',
	templateUrl: './templates/forgotPasswordModal.html'
})
export class ForgotPasswordModal {
	private _forgotPasswordForm: FormGroup;

	constructor(public formBuilder: FormBuilder,
				public viewCtrl: ViewController) {
		this._forgotPasswordForm = this.formBuilder.group({
			email: ['', Validators.required]
		});
	}

	dismiss() {
		this.viewCtrl.dismiss();
	}

	onFormSubmit(formData) {
		this.viewCtrl.dismiss(formData.email);
	}
}
