import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { Login } from '../pages/login/login';
import { Register } from '../pages/register/register';

import { MyTrips } from '../pages/myTrips/myTrips';
import { Notifications } from '../pages/notifications/notifications';

import { NewTrip } from '../pages/newTrip/newTrip';
import { ViewTrip } from '../pages/viewTrip/viewTrip';

import { Friends } from '../pages/friends/friends';

import { Account } from '../pages/account/account';
import { LocationModal } from '../pages/account/locationModal/locationModal';

import { TabsPage } from '../pages/tabs/tabs';

@NgModule({
  declarations: [
    Login,
    Register,
    MyApp,
    MyTrips,
    Notifications,
    NewTrip,
    ViewTrip,
    Friends,
    Account,
    LocationModal,
    TabsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    Login,
    Register,
    MyApp,
    MyTrips,
    ViewTrip,
    Notifications,
    NewTrip,
    LocationModal,
    Friends,
    Account,
    TabsPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
