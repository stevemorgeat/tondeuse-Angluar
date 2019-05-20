import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReadInstructionService {

  constructor() { }


  public translateInstruction(pInstruction: string) {
    let nNameOfTheMower: number = 1;
    let aInstruction = pInstruction.split("\n" || "\r" || "\n\r");
    let returnInstruction: object = {};
    // premiere ligne pour la zone à tondre
    returnInstruction["sizeZone"] = {
      x: aInstruction[0].split("")[0],
      y: aInstruction[0].split("")[1]
    };
    // boucle sur la suite des instruction
    returnInstruction["mowers"] = [];
    for (let i = 1; i < aInstruction.length; i = i + 2) {
      // chaque tondeuse est stocké dans un object
      returnInstruction["mowers"].push({
        name: "mower n°" + nNameOfTheMower,
        color: this.getRandomColor(),
        position: {
          x: parseInt(aInstruction[i].split(" ")[0].split("")[0]),
          y: parseInt(aInstruction[i].split(" ")[0].split("")[1]),
          direction: aInstruction[i].split(" ")[1].trim()
        },
        instruction: aInstruction[i + 1].trim()
      });
      nNameOfTheMower++;
    }
    return returnInstruction;
  }


  private getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

}/// end service
