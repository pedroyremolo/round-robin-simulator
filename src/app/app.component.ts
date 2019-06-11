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
  tempo = 0;
  matrizExecucao = [];

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
    console.log(this.quantum);
    let filaDeEspera = [...this.processControl];
    let filaDeExecucao: Process[] = [];
    let filaDeConcluido: Process[] = [];
    let matrizExecucao = [...this.processControl.map(() => [])];

    while (filaDeConcluido.length !== this.processControl.length) {
      this.checaProcessosProntos(filaDeEspera, filaDeExecucao);

      this.executaQuantum(filaDeExecucao, matrizExecucao);

      this.checaProcessosProntos(filaDeEspera, filaDeExecucao);

      filaDeExecucao[0].executionTime === 0 ?
        filaDeConcluido.push(filaDeExecucao.shift()) :
        filaDeExecucao.push(filaDeExecucao.shift());
    }

    console.log(matrizExecucao);
    this.matrizExecucao = matrizExecucao;

  }

  private checaProcessosProntos(filaDeEspera: Process[], filaDeExecucao: Process[]) {
    filaDeEspera.forEach((process, index, fila) => {
      if (process.arrivalTime <= this.tempo) {
        filaDeExecucao.push(fila.shift());
      }
    });
  }

  private executaQuantum(filaDeExecucao: Process[], matrizExecucao: any[][]) {
    if (filaDeExecucao.length > 0) {
      let quantumRestante = this.quantum;
      while (quantumRestante > 0 && filaDeExecucao[0].executionTime > 0) {
        // Marca Matriz no tempo, 1 quando executar, 0 caso contrario
        matrizExecucao.forEach((linhaDoTempoProcesso, index) => {
          console.log(linhaDoTempoProcesso);
          index === filaDeExecucao[0].pid ?
            linhaDoTempoProcesso[this.tempo] = 1 :
            linhaDoTempoProcesso[this.tempo] = 0;
        });
        filaDeExecucao[0].executionTime--;
        quantumRestante--;
        this.tempo++;
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
