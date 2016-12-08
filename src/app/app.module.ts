import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { MyTrips } from '../pages/myTrips/myTrips';
import { Notifications } from '../pages/notifications/notifications';
import { NewTrip } from '../pages/newTrip/newTrip';
import { Friends } from '../pages/friends/friends';
import { Account } from '../pages/account/account';
import { TabsPage } from '../pages/tabs/tabs';

@NgModule({
  declarations: [
    MyApp,
    MyTrips,
    Notifications,
    NewTrip,
    Friends,
    Account,
    TabsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MyTrips,
    Notifications,
    NewTrip,
    Friends,
    Account,
    TabsPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
