// Issues:
// When switching from manual to swipe transaction directly without cancelling the form is not working and vice versa (fixed)
// When switching from manual to swipe transaction directly without reset the form is not working and vice versa (fixed)
// When switching from manual to swipe transaction directly without hard refresh (f5) the form is not working and vice versa (fixed)

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

  displayFormTransaction!: RequestSession;
  beepRequestSession!: RequestSession;
  ResetRequestSession!: RequestSession;
  ManualTransactionRequestSession!: RequestSession;
  swipeRequestSession!: RequestSession;
  getVariableRequestSession!: RequestSession;
  swipeFlowId: string = '';
  manualTransactionFlowId: string = '';
  requestresponsetext: string = '';
  settings: SettingsDTO = new SettingsDTO();
  isSwipe: boolean = false;
  isManual: boolean = false;
  resetSwipeFlowId: string = "";
  resetManualFlowId: string = "";
  constructor(private deviceHelperBase: DeviceHelperBase) {
  }

  ngOnDestroy(): void {
    var compMsg = new Date() + " | " + "Calling ngOnDestroy \r\n\r\n";
    this.requestresponsetext += compMsg;
    this.beepRequestSession?.getSession()?.closeSocket();
    this.ResetRequestSession?.getSession()?.closeSocket();
    this.ManualTransactionRequestSession?.getSession()?.closeSocket();
    this.swipeRequestSession?.getSession()?.closeSocket();
    this.displayFormTransaction?.getSession()?.closeSocket();
  }

  Beep() {
    this.beepRequestSession = new RequestSession("/upp/v1/device", this.onResponseReceived.bind(this), this.onSend.bind(this), this.onComplete.bind(this), this.onTimeOut.bind(this));
    this.beepRequestSession.send(this.deviceHelperBase.getBeepResource());
  }

  Disconnect() {
    let dcSession = new RequestSession("/upp/v1/device", this.onResponseReceived.bind(this), this.onSend.bind(this), this.onComplete.bind(this), this.onTimeOut.bind(this));
    dcSession.send(this.deviceHelperBase.getDisconnectResource());
  }

  Reset() {
    this.ResetRequestSession = new RequestSession("/upp/v1/device", this.onResponseReceived.bind(this), this.onSend.bind(this), this.onComplete.bind(this), this.onTimeOut.bind(this));
    this.ResetRequestSession.send(this.deviceHelperBase.getResetResource());
    return this.ResetRequestSession;
  }

  ManualTransaction() {
    this.isManual = true;
    this.resetManualFlowId = this.Reset().flowId_;
  }

  Swipe() {
    this.isSwipe = true;
    this.resetSwipeFlowId = this.Reset().flowId_;
  }

  getVariable(csvVarValues: string): any {
    this.getVariableRequestSession = new RequestSession("/upp/v1/device", this.onResponseReceived.bind(this), this.onSend.bind(this), this.onComplete.bind(this), this.onTimeOut.bind(this));
    this.getVariableRequestSession.send(this.deviceHelperBase.getVariableValueResource(csvVarValues));
  }

  DisplayForm(formName: any): any {
    var displayFormRequestSession!: RequestSession;
    displayFormRequestSession = new RequestSession("/upp/v1/form", this.onResponseReceived.bind(this), this.onSend.bind(this), this.onComplete.bind(this), this.onTimeOut.bind(this));
    displayFormRequestSession.send(this.deviceHelperBase.getDisplayFormResource(formName));
    return displayFormRequestSession;
  }

  async onResponseReceived(msg: any) {
    var compMsg = new Date() + " | " + "Terminal -> Client" + " | " + JSON.stringify(msg) + "\r\n\r\n";
    this.requestresponsetext += compMsg;
    var msgObj = new Message(JSON.stringify(msg));
    // reset is successful before calling swipe
    if (this.resetSwipeFlowId == msgObj.getFlowId()
      && this.isSwipe && msgObj.isEvent() && msgObj.status == "completed") {
      debugger;
      //await new Promise(resolve => setTimeout(resolve, 1000));
      this.swipeRequestSession = new RequestSession("/upp/v1/transaction", this.onResponseReceived.bind(this), this.onSend.bind(this), this.onComplete.bind(this), this.onTimeOut.bind(this));
      this.swipeFlowId = this.swipeRequestSession.flowId_;
      this.swipeRequestSession.send(this.deviceHelperBase.getSwipeResource());
      this.displayFormTransaction = this.DisplayForm("LAF_SWIPE0.k3z");
      this.isSwipe = !this.isSwipe;
    }
    else if (this.resetManualFlowId == msgObj.getFlowId()
      && this.isManual && msgObj.isEvent() && msgObj.status == "completed") {
      debugger;
      //await new Promise(resolve => setTimeout(resolve, 1000));
      this.ManualTransactionRequestSession = new RequestSession("/upp/v1/transaction", this.onResponseReceived.bind(this), this.onSend.bind(this), this.onComplete.bind(this), this.onTimeOut.bind(this));
      this.manualTransactionFlowId = this.ManualTransactionRequestSession.flowId_;
      this.ManualTransactionRequestSession.send(this.deviceHelperBase.getManualTransactionResource(1000));
      this.isManual = !this.isManual;
    }
    else if (
      (msgObj.getFlowId() == this.swipeFlowId
        || msgObj.getFlowId() == this.manualTransactionFlowId
        || msgObj.getFlowId() == this.displayFormTransaction?.flowId_)
      && msgObj.isEvent() && msgObj.status == "completed") {
          var compMsg = new Date() + " | " + "Client -> Terminal | Reset once everything is completed \r\n\r\n";
          this.requestresponsetext += compMsg;
          this.Reset();
          this.swipeFlowId = this.manualTransactionFlowId = "";
    }
  }

  onSend(msg: any) {
    var compMsg = new Date() + " | " + "Client -> Terminal" + " | " + JSON.stringify(msg) + "\r\n\r\n";
    this.requestresponsetext += compMsg;
  }

  onTimeOut(msg: any) {
    var compMsg = new Date() + " | " + "Terminal->Client" + " | " + msg + "\r\n\r\n";
    this.requestresponsetext += compMsg;
  }

  onComplete(msg: any) {
    var compMsg = new Date() + " | " + "Client <-> Terminal" + " | " + msg + "\r\n\r\n";
    this.requestresponsetext += compMsg;
  }



  ClearAll() {
    this.requestresponsetext = "";
  }

}






