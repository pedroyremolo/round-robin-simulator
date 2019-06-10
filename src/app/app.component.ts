import { Component } from '@angular/core';
import { Process } from './shared/models/process.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  private inputProcess: Process = new Process('', 0, 0);
  private processControl = [];

  constructor() { }

  addProcess() {
    this.processControl.push(this.inputProcess);
    console.log(this.processControl);
    this.inputProcess = new Process('', 0, 0);
  }
}
