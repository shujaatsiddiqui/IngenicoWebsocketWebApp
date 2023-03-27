import { Component, OnDestroy } from '@angular/core';
import { FlowId } from 'src/Helper/FlowIdHelper';
import { BeepRequestDTO, BeepResourceDTO, RequestDTO, RequestRoot, ResetResourceDTO, ResourceDTO, ManualTransactionResourceDTO } from 'src/models/RequestDTO';
import { SettingsDTO } from 'src/models/SettingsDTO.model';
import { RequestSession } from 'src/Services/RequestSession';
import { WebsocketService } from 'src/Services/websocket.service';

@Component({
  selector: 'app-device-manager',
  templateUrl: './device-manager.component.html',
  styleUrls: ['./device-manager.component.scss']
})
export class DeviceManagerComponent implements OnDestroy {

  requestresponsetext: string = '';
  settings: SettingsDTO = new SettingsDTO();
  beepRequestSession!: RequestSession;
  ResetRequestSession!: RequestSession;
  ManualTransactionRequestSession!: RequestSession;
  constructor(private websocketService: WebsocketService) {
  }

  ngOnDestroy(): void {
    this.beepRequestSession.getSession().closeSocket();
    this.ResetRequestSession.getSession().closeSocket();
    this.ManualTransactionRequestSession.getSession().closeSocket();
    //this.websocketService.closeSocket();
  }


  // **************** JS *************************

  BeepJs() {
    //debugger;
    this.beepRequestSession = new RequestSession("/upp/v1/device", this.onResponseReceived.bind(this), this.onSend.bind(this),null);
    this.beepRequestSession.send(this.buildBeepResource());
  }

  buildBeepResource(): any {
    //debugger;
    const res: any = { "type": "beep" };
    res["tone"] = "low";
    res["duration"] = "click_length";
    return res;
  }

  ResetJs() {
    //debugger;
    this.ResetRequestSession = new RequestSession("/upp/v1/device", this.onResponseReceived.bind(this), this.onSend.bind(this),null);
    this.ResetRequestSession.send(this.buildResetResource());
  }

  buildResetResource(): any {
    //debugger;
    const res: any = { "type": "reset" };
    res["keep_form"] = false;
    return res;
  }

  ManualTransactionJs():any{
    this.ManualTransactionRequestSession = new RequestSession("/upp/v1/transaction", this.onResponseReceived.bind(this), this.onSend.bind(this),null);
    var transactionRequestDTO = new ManualTransactionResourceDTO();
    transactionRequestDTO.amount = 1000;
    this.ManualTransactionRequestSession.send(transactionRequestDTO);
  }

  onResponseReceived(msg: any) {
    var compMsg = new Date() + " | " + "Terminal -> Client" + " | " + JSON.stringify(msg) + "\r\n\r\n";
    this.requestresponsetext += compMsg;
  }

  onSend(msg: any) {
    //debugger;
    var compMsg = new Date() + " | " + "Client -> Terminal" + " | " + JSON.stringify(msg) + "\r\n\r\n";
    this.requestresponsetext += compMsg;
  }

  // **************** JS *************************

  ClearAll(){
    this.requestresponsetext = "";
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

  Reset() {

    var root = new RequestRoot();
    var requestObj = new RequestDTO();
    requestObj.endpoint = "/upp/v1/device";
    requestObj.flow_id = FlowId.generate();
    requestObj.resource = new ResetResourceDTO();
    root.request = requestObj;

    let obj = new WebsocketService();

    obj.receiveMessage().subscribe({
      next: msg => this.onMessageReceive(msg), // Called whenever there is a message from the server.
      error: err => console.log(err), // Called if at any point WebSocket API signals some kind of error.
      complete: () => obj.closeSocket() // Called when connection is closed (for whatever reason).
    });

  }



  private onMessageReceive(msg: string) {
    debugger;
    this.requestresponsetext += new Date() + " | " + "Terminal -> Client" + " | " + JSON.stringify(msg) + "\r\n\r\n";
  }

  Transaction() {
    //{"request":{"endpoint":"\/upp\/v1\/transaction","flow_id":"6442528","resource":{"type":"manual_entry","amount":"2501","fields":["pan","exp"]}}}
    var root = new RequestRoot();
    var requestObj = new RequestDTO();
    requestObj.endpoint = "/upp/v1/transaction";
    requestObj.flow_id = FlowId.generate();
    var transactionRequestDTO = new ManualTransactionResourceDTO();
    transactionRequestDTO.amount = 1000;
    requestObj.resource = transactionRequestDTO;
    root.request = requestObj;

    let obj = new WebsocketService();

    obj.receiveMessage().subscribe({
      next: msg => this.onMessageReceive(msg), // Called whenever there is a message from the server.
      error: err => console.log(err), // Called if at any point WebSocket API signals some kind of error.
      complete: () => obj.closeSocket() // Called when connection is closed (for whatever reason).
    });

  }

}






