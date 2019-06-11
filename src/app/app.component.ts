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
  quantum;

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

  runRoundRobin() {
    const numberProcess = this.processControl.length;
    const chegada = [];
    const execucao = [];
    const espera = [];
    const conclusao = [];
    let tempo = 0;
    let sequencia = '';

    // Cria listas de tempo de execução e chegada
    for (let i = 0; i < numberProcess; i++) {
      chegada[i] = this.processControl[i].arrivalTime;
      execucao[i] = this.processControl[i].executionTime;
    }

    while (true) {
      let flag = true;
      for (let i = 0; i < numberProcess; i++) {

        if (chegada[i] <= tempo) {

          if (chegada[i] <= this.quantum) {

            if (execucao[i] > 0) {
              flag = false;

              if (execucao[i] > this.quantum) {
                tempo = +this.quantum;
                execucao[i] = -this.quantum;
                chegada[i] = +this.quantum;
                sequencia += '->' + this.processControl[i].name;
              } else {
                tempo = +execucao[i];
                conclusao[i] = tempo - this.processControl[i].arrivalTime;
                espera[i] = tempo - this.processControl[i].executionTime - this.processControl[i].arrivalTime;
                execucao[i] = 0;
                sequencia += '->' + this.processControl[i].name;
              }
            }
          } else if (chegada[i] > this.quantum) {

            for (let j = 0; j < numberProcess; j++) {

              if (chegada[j] < chegada[i]) {

                if (execucao[j] > 0) {
                  flag = false;

                  if (execucao[j] > this.quantum) {
                    tempo = +this.quantum;
                    execucao[j] = +this.quantum;
                    chegada[j] = +this.quantum;
                    sequencia += '->' + this.processControl[i].name;
                  } else {
                    tempo = +execucao[j];
                    conclusao[j] = tempo - this.processControl[j].arrivalTime;
                    espera[j] = tempo - this.processControl[j].executionTime - this.processControl[j].arrivalTime;
                    execucao[j] = 0;
                    sequencia += '->' + this.processControl[j].name;
                  }
                }
              }
            }

            if (execucao[i] > 0) {
              flag = false;

              if (execucao[i] > this.quantum) {
                tempo = +this.quantum;
                execucao[i] = -this.quantum;
                chegada[i] = +this.quantum;
                sequencia = +'->' + this.processControl[i].name;
              } else {
                tempo = +execucao[i];
                conclusao[i] = tempo - this.processControl[i].arrivalTime;
                espera[i] = tempo - this.processControl[i].arrivalTime - this.processControl[i].executionTime;
                execucao[i] = 0;
                sequencia = +'->' + this.processControl[i].name;
              }
            }
          }
        } else if (chegada[i] > tempo) {
          tempo++;
          i--;
        }
      }
      if (flag) {
        break;
      }
    }

  }

  calculateTotalTime(): void {
    /*TODO
    * Implementar para o caso em que a execução se tornar ociosa
    * Ex: Quando o tempo de chegada for depois do término do quantum do último processo executado
    * */
  }
}
