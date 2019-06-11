import {Component} from '@angular/core';
import {Process} from './shared/models/process.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  private inputProcess: Process = new Process('', 0, 0);
  private processControl: Process[] = [];
  private totalTime = 0;

  constructor() {
  }

  addProcess(): void {
    this.processControl.push(this.inputProcess);
    this.processControl.sort(
      (a, b) => a.arrivalTime >= b.arrivalTime ? 1 : -1
    );
    console.log(this.processControl);
    this.totalTime += this.inputProcess.executionTime;
    this.inputProcess = new Process('', 0, 0);
  }

  calculateTotalTime(): void {
    /*TODO
    * Implementar para o caso em que a execução se tornar ociosa
    * Ex: Quando o tempo de chegada for depois do término do quantum do último processo executado
    * */
  }
}
