import { WebsocketService } from "./websocket.service";
import { Message } from "./Message";
import { SettingsDTO } from "src/models/SettingsDTO.model";
import { FlowId } from "src/Helper/FlowIdHelper";

export class RequestSession {

  websocketService!: WebsocketService;
  flowId_!: string;
  settings: SettingsDTO = new SettingsDTO();
  responseTimeout: any;

  constructor(private endpoint: string, private onReceive: ((evt: any) => void) | null, private onSend: ((evt: any) => void) | null,
    private onComplete: ((evt: any) => void) | null, private onTimeout: ((evt: any) => void) | null) {

    this.websocketService = new WebsocketService();
    this.flowId_ = FlowId.generate();
    this.subscribe();
  }

  getSession() {
    return this.websocketService;
  }

  onSessionReceive(evt: any) {
    var msg = new Message(JSON.stringify(evt));
    if (msg.isResponse() || msg.isEventAck()) {
      if (msg.getFlowId() == this.flowId_) {
        clearTimeout(this.responseTimeout);
      }
    }

    if (this.onReceive) this.onReceive(evt);

    if (msg.isEvent()) {
      if ((this.settings.endpointMode == 0)) {
        var evtFlowId = msg.getFlowId();
        var evtEndpoint = msg.getEndpoint();
        var ack = { "event_ack": { "flow_id": evtFlowId, "endpoint": evtEndpoint, "resource": { "status": "ok" } } };
        this.websocketService.sendMessage(ack);
        if (this.onSend) this.onSend(ack);
      }
      else {
        if (msg.getFlowId() == this.flowId_) {
          let ack = { "event_ack": { "flow_id": this.flowId_, "resource": { "status": "ok" } } };
          this.websocketService.sendMessage(ack);
          if (this.onSend) this.onSend(ack);
        }
      }
      if (msg.status == "error") {
        var error_info = msg.jsonObject.event.resource.error_info;
        if (typeof error_info.text == 'undefined') {
          alert('Error: ' + error_info.facility);
        } else {
          alert('Error: ' + error_info.text);
        }
      }
    }
  }

  subscribe() {
    this.websocketService.receiveMessage().subscribe({
      next: msg => this.onSessionReceive(msg), // Called whenever there is a message from the server.
      error: err => console.log(err), // Called if at any point WebSocket API signals some kind of error.
      complete: () => { if(this.onComplete) this.onComplete(this.flowId_ + " | completed") } // Called when connection is closed (for whatever reason).
    });
  }

  send(resource: any) {
    //var that = this;
    var request = (this.settings.endpointMode == 0)
      ? { "request": { "flow_id": this.flowId_, "endpoint": this.endpoint, "resource": resource } }
      : { "request": { "flow_id": this.flowId_, "resource": resource } };
    this.websocketService.sendMessage(request);
    if (this.onSend) this.onSend(request);

    this.responseTimeout = setTimeout(() => {
      this.websocketService.closeSocket();
      if (this.onTimeout) this.onTimeout(this.flowId_ +" | Transaction timeout!");
    }, this.settings.responseTimeoutSec * 1000);
  }



  sendEvent(resource: any) {
    //var that = this;
    var request = (this.settings.endpointMode == 0)
      ? { "event": { "flow_id": this.flowId_, "endpoint": this.endpoint, "resource": resource } }
      : { "event": { "flow_id": this.flowId_, "resource": resource } };
    this.websocketService.sendMessage(request);
    if (this.onSend) this.onSend(request);

    this.responseTimeout = setTimeout(() => {
      this.websocketService.closeSocket();
      if (this.onTimeout) this.onTimeout(this.flowId_ +" | Transaction timeout!");
    }, this.settings.responseTimeoutSec * 1000);
  }



  // setTimeout(function() {
  //   console.log("Error: Event Ack Response Timeout", that.connectionUrl_, request);
  //   that.disconnect();
  // }, Settings.responseTimeoutSec * 1000);

}
