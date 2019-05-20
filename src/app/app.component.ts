import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public title = 'Project Mowers';
  private fileRead: any;
  private arrayBuffer: any;
  private fileUploaded: string;
  private aDirection: Array<string> = ["N", "E", "S", "W"]

  private fakeFileUploaded: string = "55\n44 S\nGADDAAGADAA\n22 N\nAADGGDADGA";

  public message: string;
  public zoneVertiY: Array<number> = [];
  public zoneHorizX: Array<number> = [];
  public aMowers: Array<object> = [];

  //CONSTRUCTOR
  constructor() {
  }

  //METHODS
  // methode lancé de angular à l'ouverture du component
  ngOnInit() {
    console.log(this.fakeFileUploaded)
    this.initInstruction(this.fakeFileUploaded);
  }

  private isGoodInstruction(pInstruction: string) {
    //todo
    return true;
  }

  private initInstruction(pInstruction: string) {
    this.message = "";
    if (this.isGoodInstruction(pInstruction)) {
      let oInstruction: object = this.translateInstruction(pInstruction);
      console.log(oInstruction);
      for (let x = 0; x <= parseInt(oInstruction["sizeZone"]["x"]); x++) {
        this.zoneHorizX.push(x);
      }
      for (let y = parseInt(oInstruction["sizeZone"]["y"]); y >= 0; y--) {
        this.zoneVertiY.push(y);
      }
      this.aMowers = oInstruction["mowers"];
      console.log(this.aMowers);
    } else {
      this.message = "Instruction Iznogoud"
    }
  }

  private translateInstruction(pInstruction: string) {
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
          direction: aInstruction[i].split(" ")[1]
        },
        instruction: aInstruction[i + 1]
      });
      nNameOfTheMower++;
    }
    return returnInstruction;
  }

  public startInstruction() {
    if (this.aMowers && Array.isArray(this.aMowers) && this.aMowers.length > 0) {
      let timer = 1
      for (let y = 0; y < this.aMowers.length; y++) {
        let mower = this.aMowers[y];
        if (mower['instruction'] && typeof mower['instruction'] === "string") {
          let aInstruction = mower['instruction'].split('');
          for (let i = 0; i < aInstruction.length; i++) {
            const sInstruction = aInstruction[i];
            setTimeout(() => {
              mower = this.applyInstruction(sInstruction, mower);
            }, timer * 1000)
            timer++
          }
        } else {
          this.message += "Can't read instruction of " + mower['name'] + "\n";
        }
      }
    } else {
      this.message = "No Mowers in this instruction"
    }
  }

  private applyInstruction(psInstruction: string, poMower: object) {
    let maxX = this.zoneHorizX.length - 1;
    let maxY = this.zoneVertiY.length - 1;
    let currentIndex = this.aDirection.findIndex(c => c == poMower['position']['direction']);
    // application de l'instruction
    switch (psInstruction) {
      case "D":
        poMower['position']['direction'] = (currentIndex + 1 === this.aDirection.length) ? this.aDirection[0] : this.aDirection[currentIndex + 1]
        break;
      case "G":
        poMower['position']['direction'] = (currentIndex - 1 === -1) ? this.aDirection[this.aDirection.length - 1] : this.aDirection[currentIndex - 1]
        break;
      case "A":
        switch (poMower['position']['direction']) {
          case "N":
            poMower['position']['y'] = (poMower['position']['y'] === maxY) ? poMower['position']['y'] : poMower['position']['y'] + 1;
            break;
          case "E":
            poMower['position']['x'] = (poMower['position']['x'] === maxX) ? poMower['position']['x'] : poMower['position']['x'] + 1;
            break;
          case "S":
            poMower['position']['y'] = (poMower['position']['y'] === 0) ? poMower['position']['y'] : poMower['position']['y'] - 1;
            break;
          case "W":
            poMower['position']['x'] = (poMower['position']['x'] === 0) ? poMower['position']['x'] : poMower['position']['x'] - 1;
            break;
        }
        break;
    }
    console.log(poMower)
    return poMower;
  }

  public incomingfile(event: any) {
    this.fileRead = event.target.files[0];
  }

  public Upload() {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      // lecture du fichier
      this.arrayBuffer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      // string représentant le fichier txt
      console.log(bstr)
    }
    fileReader.readAsArrayBuffer(this.fileRead);
  }

  private getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}
