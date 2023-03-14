export class SettingsDTO
{
  public app : string = "";
  public host: string  = "ws://192.168.86.47:50000/";
  public version: string  = "v1";
  public esponseTimeoutSec = "5";
  public endpointMode : number   = EndpointModeEnum.SINGLE;
  public protocol : number       = ProtocolEnum.UPP;
  public flowIdLength : number  = 6;
  public jwtToken : string   = "";
}


var EndpointModeEnum = {
  SINGLE:    0,
  MULTIPLE:  1
};

var ProtocolEnum = {
 UPP:   0,
 USI:   1
};