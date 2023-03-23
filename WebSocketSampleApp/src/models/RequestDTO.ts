import { FlowId } from "src/Helper/FlowIdHelper";

export class RequestRoot {
  constructor() {
    this.request = new RequestDTO();
  }
  public request!: RequestDTO;
}

export class RequestDTO {
  public flow_id: string = FlowId.generate();
  public resource!: any
  public endpoint: string = ""
}

export class BeepRequestDTO extends RequestDTO {
}


export class ResourceDTO {

}

export class BeepResourceDTO extends ResourceDTO {
  public type: string = ""
  public tone: string = ""
  public duration: string = ""
}

export class ResetResourceDTO extends ResourceDTO {
  public type: string = "reset"
  public keep_form: boolean = false
}

export class ManualTransactionResourceDTO extends ResourceDTO {
  public type: string = "manual_entry"
  public amount : number = 0
  public fields: string[] =  ["pan", "exp"];
}


