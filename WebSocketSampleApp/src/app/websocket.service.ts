// // src\app\services\websocket.service.ts
// import { Injectable } from "@angular/core";
// import { Observable, Observer } from 'rxjs';
// import { AnonymousSubject } from 'rxjs/internal/Subject';
// import { Subject } from 'rxjs';
// import { map } from 'rxjs/operators';

// const CHAT_URL = "ws://localhost:5000";

// export class WebSocketService {
//   private socket$  = new WebSocket(CHAT_URL);
//   public messages$ = this.socket$();

//   public sendMessage(msg: any) {
//     this.socket$.next(msg);
//   }
// }

// export interface Message {
//   source: string;
//   content: string;
// }

// @Injectable()
// export class WebsocketService {
//   private subject: AnonymousSubject<MessageEvent> | undefined;
//   public messages: Subject<Message>;

//   constructor() {
//     this.messages = <Subject<Message>>this.connect(CHAT_URL).pipe(
//       map(
//         (response: MessageEvent): Message => {
//           console.log(response.data);
//           let data = JSON.parse(response.data)
//           return data;
//         }
//       )
//     );
//   }

//   public connect(url: string): AnonymousSubject<MessageEvent> {
//     if (!this.subject) {
//       this.subject = this.create(url);
//       console.log("Successfully connected: " + url);
//     }
//     return this.subject;
//   }

//   private create(url: string): AnonymousSubject<MessageEvent> {
//     let ws = new WebSocket(url);
//     let observable = new Observable((obs: Observer<MessageEvent>) => {
//       ws.onmessage = obs.next.bind(obs);
//       ws.onerror = obs.error.bind(obs);
//       ws.onclose = obs.complete.bind(obs);
//       return ws.close.bind(ws);
//     });
//     let observer = {
//       error: null,
//       complete: null,
//       next: (data: Object) => {
//         console.log('Message sent to websocket: ', data);
//         if (ws.readyState === WebSocket.OPEN) {
//           ws.send(JSON.stringify(data));
//         }
//       }
//     };

//     return new AnonymousSubject<MessageEvent>(observer, observable);
//   }
// }






// // https://tutorialedge.net/typescript/angular/angular-websockets-tutorial/



// // import { Injectable } from "@angular/core";
// // import * as Rx from "rxjs";

// // const wsURL = "ws://localhost:5000";

// // @Injectable()
// // export class WebsocketService {
// //   constructor() {}

// //   private subject: Rx.Subject<MessageEvent> | undefined;

// //   public connect(): Rx.Subject<MessageEvent> {
// //     if (!this.subject) {
// //       this.subject = this.create();
// //       console.log("Successfully connected: " + wsURL);
// //     }
// //     return this.subject;
// //   }

// //   private create(): Rx.Subject<MessageEvent> {
// //     let ws = new WebSocket(wsURL);

// //     let observable = Rx.Observable.create((obs: Rx.Observer<MessageEvent>) => {
// //       ws.onmessage = obs.next.bind(obs);
// //       ws.onerror = obs.error.bind(obs);
// //       ws.onclose = obs.complete.bind(obs);
// //       return ws.close.bind(ws);
// //     });
// //     let observer = {
// //       next: (data: Object) => {
// //         if (ws.readyState === WebSocket.OPEN) {
// //           ws.send(JSON.stringify(data));
// //         }
// //       }
// //     };
// //     return  new Rx.Subject(observer, observable);
// //   }
// // }
