import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';

@Component({
  selector: 'app-device-manager',
  templateUrl: './device-manager.component.html',
  styleUrls: ['./device-manager.component.scss']
})
export class DeviceManagerComponent {

  url: string = "ws://192.168.86.47:50000/";

  GetDeviceInfo() {

    debugger;
    const subject = webSocket(this.url);

    subject.subscribe({
      next: msg => console.log('message received: ' + JSON.stringify(msg)), // Called whenever there is a message from the server.
      error: err => console.log(err), // Called if at any point WebSocket API signals some kind of error.
      complete: () => console.log('complete') // Called when connection is closed (for whatever reason).
    });

    // '{"request":{"flow_id":"171067","resource":{"type":"beep","tone":"low","duration":"click_length"}}}';
    var textmsg = JSON.stringify(new Root());

    subject.next(new Root());


  }

}

class Root {
  constructor()
  {
    this.request = new Request();
  }
  request!: Request
}

class Request {
  constructor()
  {
    this.resource = new Resource();
  }
  flow_id: string = "836198"
  endpoint: string = "/upp/v1/device"
  resource!: Resource
}

class Resource {
  type: string = "beep"
  tone: string = "low"
  duration: string = "click_length"
}

class MessageEventDTO {
  public type: string | undefined = "Info";
}


