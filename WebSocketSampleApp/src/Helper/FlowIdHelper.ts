import {SettingsDTO} from "../models/SettingsDTO.model"

export class FlowId {

  static Settings: SettingsDTO = new SettingsDTO();

  private static current: string;

  public static generate(): string {
    // if (typeof FlowId.Settings.flowIdLength === 'undefined') {
    //   FlowId.Settings.flowIdLength = 6;
    // } else if (parseInt(FlowId.Settings.flowIdLength) === 0) {
    //   FlowId.Settings.flowIdLength = 6;
    // }

    // FlowId.Settings.flowIdLength = parseInt(Settings.flowIdLength);

    let firstNum = Math.floor(Math.random() * Math.floor(10));
    if (firstNum === 0) {
      firstNum = 1;
    }

    FlowId.current = firstNum.toString();
    for (let i = 1; i < FlowId.Settings.flowIdLength; i++) {
      FlowId.current += Math.floor(Math.random() * Math.floor(10)).toString();
    }

    return FlowId.current;
  }

  public static getCurrent(): string {
    return FlowId.current;
  }

  public static setCurrent(message: any): boolean {
    if (message.request.flow_id !== undefined) {
      FlowId.current = message.request.flow_id;
      return true;
    }

    return false;
  }
}
