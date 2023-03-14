import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { AnonymousSubject } from 'rxjs/internal/Subject';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { SettingsDTO } from "../models/SettingsDTO.model"


export class Message {
  public source: string = "";
  public content: any = "";
}

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private subject = new AnonymousSubject<MessageEvent>;
  public messages: Subject<Message>;
  setting: SettingsDTO = new SettingsDTO();

  constructor() {
    debugger;
    this.messages = <Subject<Message>>this.connect(this.setting.host).pipe(
      map(
        (response: MessageEvent): Message => {
          console.log(response.data);
          let data = JSON.parse(response.data)
          return data;
        }
      )
    );
  }

  public connect(url: string): AnonymousSubject<MessageEvent> {
    //if (!this.subject) {
    this.subject = this.create(url);
    console.log("Successfully connected: " + url);
    // }
    return this.subject;
  }

  private create(url: string): AnonymousSubject<MessageEvent> {
    let ws = new WebSocket(url);

    // observable is an object that is being observed and notifies its observers when a change occurs
    let observable = new Observable((obs: Observer<MessageEvent>) => {
      ws.onmessage = obs.next.bind(obs);
      ws.onerror = obs.error.bind(obs);
      ws.onclose = obs.complete.bind(obs);
      return ws.close.bind(ws);
    });

    //  object that wants to be notified when a particular event occurs
    let observer = {
      error: () => { },
      complete: () => {},
      next: (data: Object) => {
        console.log('Message sent to websocket: ', data);
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(data));
        }
      }
    };
    return new AnonymousSubject<MessageEvent>(observer, observable);
  }
}
