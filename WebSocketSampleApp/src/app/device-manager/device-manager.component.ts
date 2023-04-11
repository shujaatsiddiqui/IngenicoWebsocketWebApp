import { Component, OnDestroy } from '@angular/core';
import { FlowId } from 'src/Helper/FlowIdHelper';
import { BeepRequestDTO, BeepResourceDTO, RequestDTO, RequestRoot, ResetResourceDTO, ResourceDTO, ManualTransactionResourceDTO } from 'src/models/RequestDTO';
import { SettingsDTO } from 'src/models/SettingsDTO.model';
import { DeviceHelperBase } from 'src/Services/DeviceHelperBase';
import { Message } from 'src/Services/Message';
import { RequestSession } from 'src/Services/RequestSession';
import { WebsocketService } from 'src/Services/websocket.service';

@Component({
  selector: 'app-device-manager',
  templateUrl: './device-manager.component.html',
  styleUrls: ['./device-manager.component.scss']
})
export class DeviceManagerComponent implements OnDestroy {

  swipeFlowId: string = '';
  manualTransactionFlowId: string = '';
  requestresponsetext: string = '';
  settings: SettingsDTO = new SettingsDTO();
  beepRequestSession!: RequestSession;
  ResetRequestSession!: RequestSession;
  ManualTransactionRequestSession!: RequestSession;
  swipeRequestSession!: RequestSession;
  displayFormRequestSession!: RequestSession;
  getVariableRequestSession!: RequestSession;
  constructor(private deviceHelperBase: DeviceHelperBase) {
  }

  ngOnDestroy(): void {
    this.beepRequestSession.getSession().closeSocket();
    this.ResetRequestSession.getSession().closeSocket();
    this.ManualTransactionRequestSession.getSession().closeSocket();
    this.swipeRequestSession.getSession().closeSocket();
    this.displayFormRequestSession.getSession().closeSocket();
    //this.websocketService.closeSocket();
  }

  Beep() {
    this.beepRequestSession = new RequestSession("/upp/v1/device", this.onResponseReceived.bind(this), this.onSend.bind(this), null, this.onTimeOut.bind(this));
    this.beepRequestSession.send(this.deviceHelperBase.getBeepResource());
  }

  Reset() {
    this.ResetRequestSession = new RequestSession("/upp/v1/device", this.onResponseReceived.bind(this), this.onSend.bind(this), null, this.onTimeOut.bind(this));
    this.ResetRequestSession.send(this.deviceHelperBase.getResetResource());
  }

  async ManualTransaction(): Promise<any> {
    this.Reset();
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.ManualTransactionRequestSession = new RequestSession("/upp/v1/transaction", this.onResponseReceived.bind(this), this.onSend.bind(this), null, this.onTimeOut.bind(this));
    this.manualTransactionFlowId = this.ManualTransactionRequestSession.flowId_;
    this.ManualTransactionRequestSession.send(this.deviceHelperBase.getManualTransactionResource(1000));
    //this.DisplayForm("LAF_CARDNUM.k3z");
  }

  async Swipe(): Promise<any> {
    this.Reset();
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.DisplayForm("LAF_swipe0.k3z");
    this.swipeRequestSession = new RequestSession("/upp/v1/transaction", this.onResponseReceived.bind(this), this.onSend.bind(this), null, this.onTimeOut.bind(this));
    this.swipeFlowId = this.swipeRequestSession.flowId_;
    this.swipeRequestSession.send(this.deviceHelperBase.getSwipeResource());
  }

  getVariable(csvVarValues: string): any {
    this.getVariableRequestSession = new RequestSession("/upp/v1/device", this.onResponseReceived.bind(this), this.onSend.bind(this), null, this.onTimeOut.bind(this));
    this.getVariableRequestSession.send(this.deviceHelperBase.getVariableValueResource(csvVarValues));
  }

  DisplayForm(formName: any): any {
    this.displayFormRequestSession = new RequestSession("/upp/v1/form", this.onResponseReceived.bind(this), this.onSend.bind(this), null, this.onTimeOut.bind(this));
    this.displayFormRequestSession.send(this.deviceHelperBase.getDisplayFormResource(formName));
  }

  onResponseReceived(msg: any) {
    var compMsg = new Date() + " | " + "Terminal -> Client" + " | " + JSON.stringify(msg) + "\r\n\r\n";
    this.requestresponsetext += compMsg;
    var msgObj = new Message(JSON.stringify(msg));
    if ((msgObj.getFlowId() == this.swipeFlowId || msgObj.getFlowId() == this.manualTransactionFlowId)
      && msgObj.isEvent() && msgObj.status == "completed") {
      this.DisplayForm("LAF_Welcome.k3z");
    }
  }

  onSend(msg: any) {
    var compMsg = new Date() + " | " + "Client -> Terminal" + " | " + JSON.stringify(msg) + "\r\n\r\n";
    this.requestresponsetext += compMsg;
  }

  onTimeOut(msg: any) {
    var compMsg = new Date() + " | " + "Client -> Terminal" + " | " + msg + "\r\n\r\n";
    this.requestresponsetext += compMsg;
  }



  ClearAll() {
    this.requestresponsetext = "";
  }

  // Beep() {

  //   // var root = new RequestRoot();
  //   // var requestObj = new BeepRequestDTO();
  //   // requestObj.endpoint = "/upp/v1/device";
  //   // requestObj.flow_id = FlowId.generate();
  //   // requestObj.resource = new BeepResourceDTO();
  //   // requestObj.resource.duration = "click_length";
  //   // requestObj.resource.tone = "low";
  //   // requestObj.resource.type = "beep";
  //   // root.request = requestObj;

  //   // this.websocketService.receiveMessage().subscribe({
  //   //   next: msg => alert('message received: ' + JSON.stringify(msg)), // Called whenever there is a message from the server.
  //   //   error: err => console.log(err), // Called if at any point WebSocket API signals some kind of error.
  //   //   complete: () => console.log('complete') // Called when connection is closed (for whatever reason).
  //   // });

  //   // this.websocketService.sendMessage(root);
  // }

  // GetDirectoryListings() {
  //   debugger;
  //   var root = new RequestRoot();
  //   var requestObj = new RequestDTO();
  //   requestObj.flow_id = FlowId.generate();
  //   requestObj.resource = new ResourceDTO();
  //   root.request = requestObj;

  //   // this.websocketService.receiveMessage().subscribe({
  //   //   next: msg => alert('message received: ' + JSON.stringify(msg)), // Called whenever there is a message from the server.
  //   //   error: err => console.log(err), // Called if at any point WebSocket API signals some kind of error.
  //   //   complete: () => console.log('complete') // Called when connection is closed (for whatever reason).
  //   // });

  //   // this.websocketService.sendMessage(root);
  // }

  // Reset() {

  //   var root = new RequestRoot();
  //   var requestObj = new RequestDTO();
  //   requestObj.endpoint = "/upp/v1/device";
  //   requestObj.flow_id = FlowId.generate();
  //   requestObj.resource = new ResetResourceDTO();
  //   root.request = requestObj;

  //   let obj = new WebsocketService();

  //   obj.receiveMessage().subscribe({
  //     next: msg => this.onMessageReceive(msg), // Called whenever there is a message from the server.
  //     error: err => console.log(err), // Called if at any point WebSocket API signals some kind of error.
  //     complete: () => obj.closeSocket() // Called when connection is closed (for whatever reason).
  //   });

  // }



  // private onMessageReceive(msg: string) {
  //   debugger;
  //   this.requestresponsetext += new Date() + " | " + "Terminal -> Client" + " | " + JSON.stringify(msg) + "\r\n\r\n";

  // }

  // Transaction() {
  //   //{"request":{"endpoint":"\/upp\/v1\/transaction","flow_id":"6442528","resource":{"type":"manual_entry","amount":"2501","fields":["pan","exp"]}}}
  //   var root = new RequestRoot();
  //   var requestObj = new RequestDTO();
  //   requestObj.endpoint = "/upp/v1/transaction";
  //   requestObj.flow_id = FlowId.generate();
  //   var transactionRequestDTO = new ManualTransactionResourceDTO();
  //   transactionRequestDTO.amount = 1000;
  //   requestObj.resource = transactionRequestDTO;
  //   root.request = requestObj;

  //   let obj = new WebsocketService();

  //   obj.receiveMessage().subscribe({
  //     next: msg => this.onMessageReceive(msg), // Called whenever there is a message from the server.
  //     error: err => console.log(err), // Called if at any point WebSocket API signals some kind of error.
  //     complete: () => obj.closeSocket() // Called when connection is closed (for whatever reason).
  //   });

  // }

}






