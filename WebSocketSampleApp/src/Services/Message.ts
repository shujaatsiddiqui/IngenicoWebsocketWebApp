export class Message {
  private response: boolean;
  private request: boolean;
  private event: boolean;
  private event_ack: boolean = false;
  private flowId: string;
  private status_: string;
  private endpoint: string;
  private type_: string;
  private message: any;
  private binary: boolean = false;

  constructor(message: any) {
    this.response = false;
    this.request = false;
    this.event = false;
    this.flowId = "";
    this.status_ = "";
    this.endpoint = "";
    this.type_ = "";
    if (message) {
      if (typeof message === "string") {
        try {
          this.message = JSON.parse(message);
        } catch (error) {
          console.log("Message: failed to parse JSON");
          return;
        }
        this.binary = false;
        if (this.message.hasOwnProperty("response")) {
          this.response = true;
          this.flowId = this.message.response.flow_id;
          this.status_ = this.message.response.resource.status;
        } else if (this.message.hasOwnProperty("event")) {
          this.event = true;
          this.flowId = this.message.event.flow_id;
          this.status_ = this.message.event.resource.status;
          this.endpoint = this.message.event.endpoint;
          this.type_ = this.message.event.resource.type;
        } else if (this.message.hasOwnProperty("event_ack")) {
          this.event_ack = true;
          this.flowId = this.message.event_ack.flow_id;
          this.status_ = this.message.event_ack.status;
        } else if (this.message.hasOwnProperty("request")) {
          this.request = true;
          this.flowId = this.message.request.flow_id;
        }
      } else {
        this.message = message;
        this.binary = true;
      }
    }
  }

  public setMessage(msg: any): void {
    this.message = msg;
    this.binary = false;
    if (this.message.hasOwnProperty("response")) {
      this.response = true;
      this.flowId = this.message.response.flow_id;
      this.status_ = this.message.response.resource.status;
    } else if (this.message.hasOwnProperty("event")) {
      this.event = true;
      this.flowId = this.message.event.flow_id;
      this.status_ = this.message.event.resource.status;
      this.endpoint = this.message.event.endpoint;
      this.type_ = this.message.event.resource.type;
    } else if (this.message.hasOwnProperty("event_ack")) {
      this.event_ack = true;
      this.flowId = this.message.event_ack.flow_id;
      this.status_ = this.message.event_ack.status;
    } else if (this.message.hasOwnProperty("request")) {
      this.request = true;
      this.flowId = this.message.request.flow_id;
    }
  }

  public get status(): string {
    return this.status_;
  }

  public isEvent(): boolean {
    return this.event;
  }

  public isEventAck(): boolean {
    return this.event_ack;
  }

  public isResponse(): boolean {
    return this.response;
  }

  public isRequest(): boolean {
    return this.request;
  }

  public getFlowId(): string {
    return this.flowId;
  }

  public isValid(): boolean {
    return this.event || this.response || this.event_ack || this.request;
  }

  public isBinary(): boolean {
    return this.binary;
  }

  public get(): any {
    return this.message;
  }

  public get jsonObject(): any {
    return this.message;
  }

  public getEndpoint(): string {
    return this.endpoint;
  }

  public getType(): string {
    return this.type_;
  }
}
