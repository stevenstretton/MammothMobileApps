import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

@Component({
	selector: 'page-mapmodal',
	templateUrl: './templates/mapModal.html'
})
export class MapModal {
	
	_tripMembers: any;	
	_checkedId : 0;


	constructor(public viewCtrl: ViewController,
		public params: NavParams) {
				this._tripMembers = params.get('tripMembers');
	}
	dismiss() {
		let data = this._checkedId;
		this.viewCtrl.dismiss(data);		
	}
}
