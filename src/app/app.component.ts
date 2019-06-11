import {Component} from '@angular/core';
import {Process} from './shared/models/process.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  private processControl: Process[] = [];
  private inputProcess: Process = new Process(this.processControl.length, '', 0, 0);
  private totalTime = 0;
  quantum = 2;

  constructor() {
  }

  addProcess(): void {
    this.processControl.push(this.inputProcess);
    this.processControl.sort(
      (a, b) => a.arrivalTime >= b.arrivalTime ? 1 : -1
    );
    console.log(this.processControl);
    this.totalTime += this.inputProcess.executionTime;
    this.inputProcess = new Process(this.processControl.length, '', 0, 0);
  }

  runRoundRobin() {
    /* quantum
    *  tempo
    *  fila_de_execucao
    *  fila de espera
    *  fila_concluido
    *  matriz_de_execucao[processos,tempo]
    *
    * enquanto conclusao.length != numero_de_processos
    *   checa_processos_espera_pronto
    *   executa_quantum_processo marcando matriz_execucao[processo,tempo]
    *   caso processo terminado
    *     move -> fila_concluido
    *   caso contrario
    *     move -> final da fila_execucao
    *   incrementa tempo
    * */

    let tempo = 0;
    let filaDeEspera = [...this.processControl];
    let filaDeExecucao: Process[] = [];
    let filaDeConcluido: Process[] = [];
    let matrizExecucao = [...this.processControl.map(() => [])];

    while (filaDeConcluido.length !== this.processControl.length) {
      this.checaProcessosProntos(filaDeEspera, filaDeExecucao, tempo);

      this.executaQuantum(filaDeExecucao, tempo, matrizExecucao);

      filaDeExecucao[0].executionTime === 0 ?
        filaDeConcluido.push(filaDeExecucao.shift()) :
        filaDeExecucao.push(filaDeExecucao.shift());
    }

    console.log(matrizExecucao);

    /*const numeroDeProcessos = this.processControl.length;
    const chegada = [];
    const execucao = [];
    const espera = [];
    const conclusao = [];
    //let tempo = 0;
    let sequencia = '';

    // Cria listas de tempo de execução e chegada
    for (let i = 0; i < numeroDeProcessos; i++) {
      chegada[i] = this.processControl[i].arrivalTime;
      execucao[i] = this.processControl[i].executionTime;
    }

    // Calcula os dados do Round Robin
    while (true) {
      let flag = true;
      for (let i = 0; i < numeroDeProcessos; i++) {

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

            for (let j = 0; j < numeroDeProcessos; j++) {

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
      console.log(sequencia);
      if (flag) {
        break;
      }
    }*/

  }

  private checaProcessosProntos(filaDeEspera: Process[], filaDeExecucao: Process[], tempo: number) {
    filaDeEspera.forEach((process, index, fila) => {
      if (process.arrivalTime <= tempo) {
        filaDeExecucao.push(fila.shift());
      }
    });
  }

  private executaQuantum(filaDeExecucao: Process[], tempo: number, matrizExecucao: any[][]) {
    if (filaDeExecucao.length > 0) {
      let quantumRestante = this.quantum;
      while (quantumRestante > 0 && filaDeExecucao[0].executionTime > 0) {
        // Marca Matriz no tempo, 1 quando executar, 0 caso contrario
        matrizExecucao.forEach((linhaDoTempoProcesso, index) => {
          console.log(linhaDoTempoProcesso);
          index === filaDeExecucao[0].pid ?
            linhaDoTempoProcesso[tempo] = 1 :
            linhaDoTempoProcesso[tempo] = 0;
        });
        filaDeExecucao[0].executionTime--;
        quantumRestante--;
        tempo++;
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
