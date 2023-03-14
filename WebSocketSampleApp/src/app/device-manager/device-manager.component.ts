import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { FlowId } from 'src/Helper/FlowIdHelper';
import { RequestDTO, RequestRoot, ResourceDTO } from 'src/models/RequestDTO';
import { SettingsDTO } from 'src/models/SettingsDTO.model';
import { Message, WebsocketService } from 'src/Services/websocket.service';

@Component({
  selector: 'app-device-manager',
  templateUrl: './device-manager.component.html',
  styleUrls: ['./device-manager.component.scss']
})
export class DeviceManagerComponent {

  settings: SettingsDTO = new SettingsDTO();
  constructor(private websocketService: WebsocketService) {

    // this.websocketService.messages.subscribe({
    //   next: msg => console.log('message received: ' + JSON.stringify(msg)), // Called whenever there is a message from the server.
    //   error: err => console.log(err), // Called if at any point WebSocket API signals some kind of error.
    //   complete: () => console.log('complete') // Called when connection is closed (for whatever reason).
    // });

  }

  //url: string = "ws://192.168.86.47:50000/";

  Beep() {

    //this.websocketService.connect(this.settings.host);

    var message = new Message();
    var root = new RequestRoot();
    var requestObj = new RequestDTO() ;
    requestObj.endpoint = "/upp/v1/device";
    requestObj.flow_id = FlowId.generate();
    requestObj.resource = new ResourceDTO();
    requestObj.resource.duration = "click_length";
    requestObj.resource.tone = "low";
    requestObj.resource.type = "beep";
    root.request = requestObj;
    message.content = root;

    //this.websocketService.messages.next(message.content);

    // without service
    const subject = webSocket(this.settings.host);

    subject.subscribe({
      next: msg => console.log('message received: ' + JSON.stringify(msg)), // Called whenever there is a message from the server.
      error: err => console.log(err), // Called if at any point WebSocket API signals some kind of error.
      complete: () => console.log('complete') // Called when connection is closed (for whatever reason).
    });

    subject.next(root);


  }

}




