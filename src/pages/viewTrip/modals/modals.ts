import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ViewController, Platform, NavParams } from 'ionic-angular';

export class editModal {
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
			newValue: ['', Validators.required]
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
export class EditDateModal extends editModal {
	constructor(public viewCtrl: ViewController,
	            public navParams: NavParams,
	            public formBuilder: FormBuilder) {
		super(viewCtrl, navParams, formBuilder);
	}
}

@Component({
	selector: 'modal-editInputModal',
	templateUrl: './templates/editInputModal.html'
})
export class EditInputModal extends editModal {

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
export class EditTextareaModal extends editModal {

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
export class EditTimeModal extends editModal {

	constructor(public viewCtrl: ViewController,
	            public navParams: NavParams,
	            public formBuilder: FormBuilder) {
		super(viewCtrl, navParams, formBuilder);
	}
}
