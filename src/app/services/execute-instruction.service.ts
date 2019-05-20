import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExecuteInstructionService {

  private aDirection: Array<string> = ["N", "E", "S", "W"]

  constructor() { }

  public applyInstruction(psInstruction: string, poMower: object, pnZoneHorizX: number, pnZoneVertiY: number) {
    let currentIndex = this.aDirection.indexOf(poMower['position']['direction']);
    console.log('########Start applyInstruction########')
    console.log('current direction index of "' + poMower['position']['direction'] + '" is number : ' + currentIndex + ' => ' + this.aDirection[currentIndex])
    // application de l'instruction
    switch (psInstruction) {
      case "D":
        console.log('psinstruction : ' + psInstruction + ' case D and current direction before instruction : ' + poMower['position']['direction'])
        poMower['position']['direction'] = (currentIndex + 1 === this.aDirection.length) ? this.aDirection[0] : this.aDirection[currentIndex + 1];
        console.log("new current direction : " + poMower['position']['direction'])
        break;
      case "G":
        console.log('psinstruction : ' + psInstruction + ' case G and current direction before instruction : ' + poMower['position']['direction'])
        poMower['position']['direction'] = (currentIndex - 1 === -1) ? this.aDirection[this.aDirection.length - 1] : this.aDirection[currentIndex - 1];
        console.log("new current direction : " + poMower['position']['direction'])
        break;
      case "A":
        console.log('case A and current direction : ' + poMower['position']['direction'])
        switch (poMower['position']['direction']) {
          case "N":
            console.log('case N and current position before : (' + poMower['position']['x'] + ',' + poMower['position']['y'] + ')')
            poMower['position']['y'] = (poMower['position']['y'] === pnZoneVertiY) ? poMower['position']['y'] : poMower['position']['y'] + 1;
            console.log('case N and current position after : (' + poMower['position']['x'] + ',' + poMower['position']['y'] + ')')
            break;
          case "E":
            console.log('case E and current position before : (' + poMower['position']['x'] + ',' + poMower['position']['y'] + ')')
            poMower['position']['x'] = (poMower['position']['x'] === pnZoneHorizX) ? poMower['position']['x'] : poMower['position']['x'] + 1;
            console.log('case E and current position after : (' + poMower['position']['x'] + ',' + poMower['position']['y'] + ')')
            break;
          case "S":
            console.log('case S and current position before : (' + poMower['position']['x'] + ',' + poMower['position']['y'] + ')')
            poMower['position']['y'] = (poMower['position']['y'] === 0) ? poMower['position']['y'] : poMower['position']['y'] - 1;
            console.log('case S and current position after : (' + poMower['position']['x'] + ',' + poMower['position']['y'] + ')')
            break;
          case "W":
            console.log('case W and current position  before : (' + poMower['position']['x'] + ',' + poMower['position']['y'] + ')')
            poMower['position']['x'] = (poMower['position']['x'] === 0) ? poMower['position']['x'] : poMower['position']['x'] - 1;
            console.log('case W and current position  after : (' + poMower['position']['x'] + ',' + poMower['position']['y'] + ')')
            break;
        }
        break;
    }
    //console.log(poMower)
    return poMower;
  }

}
