import { Component } from '@angular/core';
import { FlowId } from 'src/Helper/FlowIdHelper';
import { RequestDTO, RequestRoot, ResourceDTO } from 'src/models/RequestDTO';
import { SettingsDTO } from 'src/models/SettingsDTO.model';
import { WebsocketService } from 'src/Services/websocket.service';

@Component({
  selector: 'app-device-manager',
  templateUrl: './device-manager.component.html',
  styleUrls: ['./device-manager.component.scss']
})
export class DeviceManagerComponent {

  settings: SettingsDTO = new SettingsDTO();
  constructor(private websocketService: WebsocketService) { }

  Beep() {

    var root = new RequestRoot();
    var requestObj = new RequestDTO();
    requestObj.endpoint = "/upp/v1/device";
    requestObj.flow_id = FlowId.generate();
    requestObj.resource = new ResourceDTO();
    requestObj.resource.duration = "click_length";
    requestObj.resource.tone = "low";
    requestObj.resource.type = "beep";
    root.request = requestObj;

    this.websocketService.receiveMessage().subscribe({
      next: msg => console.log('message received: ' + JSON.stringify(msg)), // Called whenever there is a message from the server.
      error: err => console.log(err), // Called if at any point WebSocket API signals some kind of error.
      complete: () => console.log('complete') // Called when connection is closed (for whatever reason).
    });
    this.websocketService.sendMessage(root);
  }
}




