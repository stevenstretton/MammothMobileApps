import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

@Component({
	selector: 'page-mapmodal',
	templateUrl: './templates/mapModal.html'
})
export class MapModal {
	private _tripMembers: any;
	private _checkedID: number = 0;

	constructor(public viewCtrl: ViewController,
	            public params: NavParams) {
		this._tripMembers = params.get('tripMembers');
	}

	dismiss(): void {
		this.viewCtrl.dismiss(this._checkedID);
	}
}
