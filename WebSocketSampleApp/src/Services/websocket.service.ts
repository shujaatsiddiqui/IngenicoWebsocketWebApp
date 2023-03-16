import { Injectable } from '@angular/core';
import { WebSocketSubject } from 'rxjs/webSocket';
import {SettingsDTO} from "src/models/SettingsDTO.model"

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  public socket$: WebSocketSubject<any>;
  private settings = new SettingsDTO();

  constructor() {
    this.socket$ = new WebSocketSubject(this.settings.host);
  }

  public sendMessage(message: any): void {
    this.socket$.next(message);
  }

  public receiveMessage() {
    return this.socket$.asObservable();
  }

  public closeSocket(){
    this.socket$.complete();
  }
}
