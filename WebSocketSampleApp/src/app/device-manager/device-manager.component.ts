import { Component } from '@angular/core';
import { FlowId } from 'src/Helper/FlowIdHelper';
import { BeepRequestDTO, BeepResourceDTO, RequestDTO, RequestRoot, ResetResourceDTO, ResourceDTO, ManualTransactionResourceDTO } from 'src/models/RequestDTO';
import { SettingsDTO } from 'src/models/SettingsDTO.model';
import { WebsocketService } from 'src/Services/websocket.service';

@Component({
  selector: 'app-device-manager',
  templateUrl: './device-manager.component.html',
  styleUrls: ['./device-manager.component.scss']
})
export class DeviceManagerComponent {

  settings: SettingsDTO = new SettingsDTO();
  constructor(private websocketService: WebsocketService) {


  }

  Beep() {

    var root = new RequestRoot();
    var requestObj = new BeepRequestDTO();
    requestObj.endpoint = "/upp/v1/device";
    requestObj.flow_id = FlowId.generate();
    requestObj.resource = new BeepResourceDTO();
    requestObj.resource.duration = "click_length";
    requestObj.resource.tone = "low";
    requestObj.resource.type = "beep";
    root.request = requestObj;

    this.websocketService.receiveMessage().subscribe({
      next: msg => alert('message received: ' + JSON.stringify(msg)), // Called whenever there is a message from the server.
      error: err => console.log(err), // Called if at any point WebSocket API signals some kind of error.
      complete: () => console.log('complete') // Called when connection is closed (for whatever reason).
    });

    this.websocketService.sendMessage(root);
  }

  GetDirectoryListings() {
    debugger;
    var root = new RequestRoot();
    var requestObj = new RequestDTO();
    requestObj.flow_id = FlowId.generate();
    requestObj.resource = new ResourceDTO();
    root.request = requestObj;

    this.websocketService.receiveMessage().subscribe({
      next: msg => alert('message received: ' + JSON.stringify(msg)), // Called whenever there is a message from the server.
      error: err => console.log(err), // Called if at any point WebSocket API signals some kind of error.
      complete: () => console.log('complete') // Called when connection is closed (for whatever reason).
    });

    this.websocketService.sendMessage(root);
  }

  Reset()
  {
    //{"request":{"flow_id":"915323","resource":{"type":"reset","keep_form":false}}}

    var root = new RequestRoot();
    var requestObj = new RequestDTO();
    requestObj.endpoint = "/upp/v1/device";
    requestObj.flow_id = FlowId.generate();
    requestObj.resource = new ResetResourceDTO();
    root.request = requestObj;

    this.websocketService.receiveMessage().subscribe({
      next: msg => alert('Reset message received: ' + JSON.stringify(msg)), // Called whenever there is a message from the server.
      error: err => console.log(err), // Called if at any point WebSocket API signals some kind of error.
      complete: () => console.log('complete') // Called when connection is closed (for whatever reason).
    });

    this.websocketService.sendMessage(root);
  }

  Transaction()
  {
    //{"request":{"endpoint":"\/upp\/v1\/transaction","flow_id":"6442528","resource":{"type":"manual_entry","amount":"2501","fields":["pan","exp"]}}}
    var root = new RequestRoot();
    var requestObj = new RequestDTO();
    requestObj.endpoint = "/upp/v1/transaction";
    requestObj.flow_id = FlowId.generate();
    var transactionRequestDTO = new ManualTransactionResourceDTO();
    transactionRequestDTO.amount = 1000;
    requestObj.resource = transactionRequestDTO;
    root.request = requestObj;

    this.websocketService.receiveMessage().subscribe({
      next: msg => alert('Transaction message received: ' + JSON.stringify(msg)), // Called whenever there is a message from the server.
      error: err => console.log(err), // Called if at any point WebSocket API signals some kind of error.
      complete: () => console.log('complete') // Called when connection is closed (for whatever reason).
    });

    this.websocketService.sendMessage(root);
  }

}






