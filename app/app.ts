import {
  Component,
  OnInit
} from 'angular2/core';

@Component({
  selector: 'ng2-ws',
  template: `
    <input type="text"
           [(ngModel)]="newMsg"
           (keyup.enter)="go(newMsg)">

    <div style="position: fixed;
                right: 0;
                top: 0;
                width: 250px;
                background-color: red;
                color: #fff;
                font-size: 20px;
                padding: 10px;
                text-align:center;">
          <p>rss: {{mem.rss}}</p>
          <p>heapUsed: {{mem.heapUsed}}</p>
          <p>heapTotal: {{mem.heapTotal}}</p>
    </div>

    <p *ngFor="#msg of msgs">{{msg}}</p>
  `
})
export class App implements OnInit {
  mem: {rss?: number, heapUsed?: number, heapTotal?: number} = {};
  msgs: string[] = [];
  newMsg: string = 'yo!';
  static MAX_MSG = 100;
  private _ws: WebSocket = new WebSocket('ws://'+location.host);

  ngOnInit() {
    this._ws.onmessage = ({data}: {data: string}) => {
      let _data = <{msg: string, mem: number}>JSON.parse(data);

      this.msgs.push(_data.msg);
      this.mem = _data.mem;

      if (this.msgs.length > App.MAX_MSG) {
        this.msgs.length = 0;
      }
    };
  }

  go(txt: string) {
    this._ws.send(txt);
    this.newMsg = '';
  }
}
