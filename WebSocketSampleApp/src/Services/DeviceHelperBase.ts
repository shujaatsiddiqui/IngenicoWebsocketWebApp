import { Injectable } from '@angular/core';
import { RequestSession } from 'src/Services/RequestSession';

@Injectable({
  providedIn: 'root'
})
export class DeviceHelperBase {
  // ResetRequestSession: RequestSession | undefined;
  // ManualTransactionRequestSession: RequestSession | undefined;
  //requestSessionArray: RequestSession[] | undefined;

  // constructor() {
  //   this.requestSessionArray = [];
  // }

  // Reset(onReceive: ((evt: any) => void) | null, onSend: ((evt: any) => void) | null) {
  //   //debugger;
  //   let resetRequestSession = new RequestSession("/upp/v1/device", onReceive, onSend, null);
  //   this.requestSessionArray?.push(resetRequestSession);
  //   resetRequestSession.send(this.buildResetResource());
  // }



  getBeepResource(): any {
    //debugger;
    const res: any = { "type": "beep" };
    res["tone"] = "low";
    res["duration"] = "click_length";
    return res;
  }

  getResetResource(): any {
    //debugger;
    const res: any = { "type": "reset" };
    res["keep_form"] = false;
    return res;
  }

  // PerformManualTransaction(amount: number, onReceive: ((evt: any) => void) | null, onSend: ((evt: any) => void) | null): any {
  //   let manualTransactionRequestSession = new RequestSession("/upp/v1/transaction", onReceive, onSend, null);
  //   this.requestSessionArray?.push(manualTransactionRequestSession);
  //   manualTransactionRequestSession.send(this.buildManualTransactionResource(amount));
  // }

  getManualTransactionResource(amount: number): any {
    const res: any = { "type": "manual_entry" };
    res["amount"] = amount;
    res["fields"] = ["pan", "exp"];
    return res;
  }

  getSwipeResource(): any {
    const res: any = { "type": "sale" };
    res["enable_readers"] = ["msr"];
    return res;
  }

  getDisplayFormResource(form: string): any {
    const res: any = { "form": form };
    return res;
  }

  getVariableValueResource(csvVarValues: string): any {
    const res: any = { "type": "variables" };
    res["get"] = csvVarValues.split(",");
    return res;
  }

}
