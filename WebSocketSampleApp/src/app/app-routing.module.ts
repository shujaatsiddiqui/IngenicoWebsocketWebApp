import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeviceManagerComponent } from './device-manager/device-manager.component';

const routes: Routes = [
  { path: 'device', component: DeviceManagerComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
