import { FlowId } from "src/Helper/FlowIdHelper";

export class RequestRoot
{
  public request! : RequestDTO;
}

export class RequestDTO {
  constructor() {
    this.resource = new ResourceDTO();
  }
  public flow_id: string = FlowId.generate();
  public endpoint: string = ""
  public resource!: ResourceDTO
}

export class ResourceDTO {
  public type: string = ""
  public tone: string = ""
  public duration: string = ""
}

export class MessageEventDTO {
  public type: string | undefined = "";
}
