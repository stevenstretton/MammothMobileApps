import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

@Component({
	selector: 'page-mapmodal',
	templateUrl: './templates/mapModal.html'
})
export class MapModal {
	private _tripMembers: any;
	private _isMoving: boolean;
	private _checkedID: number = 0;

	constructor(public viewCtrl: ViewController,
	            public params: NavParams) {
		this._tripMembers = params.get('tripMembers');
		this._isMoving = params.get("isMoving");
	}

	dismiss(): void {
		this.viewCtrl.dismiss(this._checkedID, this._isMoving);
	}
}
