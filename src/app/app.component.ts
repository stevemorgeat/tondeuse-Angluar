import { ReadInstructionService } from './services/read-instruction.service';
import { Component } from '@angular/core';
import { ExecuteInstructionService } from './services/execute-instruction.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public title: string = 'Project Mowers';
  private fileRead: any;
  private arrayBuffer: any;

  // private fakeFileUploaded: string = "55\n44 S\nGADDAAGADAA\n22 N\nAADGGDADGA";

  public message: string;
  public aZoneVertiY: Array<number> = [];
  public aZoneHorizX: Array<number> = [];
  public aMowers: Array<object> = [];
  public bCanStarted: boolean = false;

  //CONSTRUCTOR
  constructor(private snackBar: MatSnackBar, private readService: ReadInstructionService, private executeService: ExecuteInstructionService) {
  }

  //####METHODS####
  // methode/évenement lancée par angular à l'ouverture du component
  ngOnInit() {
    // for test develpement
    // console.log(this.fakeFileUploaded)
    // this.initInstruction(this.fakeFileUploaded);
  }
  public isCanStart(){
    // desactive le bouton pour eviter des lancement intempestif
    return !this.bCanStarted;
  }

  private isGoodInstruction(pInstruction: string) {
    //todo verifier que le fichier donne des instructions conformes
    return true;
  }

  private resetGarden() {
    this.bCanStarted = false;
    this.message = "";
    this.aZoneHorizX = [];
    this.aZoneVertiY = [];
    this.aMowers = [];
  }

  //stockage temporaire du fichier
  public incomingfile(event: any) {
    this.fileRead = event.target.files[0];
  }

  public Upload() {
    // reset du plan de travail
    this.resetGarden();
    // start reading
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
      // transformation de la string en JSON
      this.initInstruction(bstr);
    }
    fileReader.readAsArrayBuffer(this.fileRead);
  }

  private initInstruction(pInstruction: string) {
    this.message = "";
    if (this.isGoodInstruction(pInstruction)) {
      let oInstruction: object = this.readService.translateInstruction(pInstruction);
      console.log(oInstruction);
      for (let x = 0; x <= parseInt(oInstruction['sizeZone']['x']); x++) {
        this.aZoneHorizX.push(x);
      }
      for (let y = parseInt(oInstruction['sizeZone']['y']); y >= 0; y--) {
        this.aZoneVertiY.push(y);
      }
      this.aMowers = oInstruction['mowers'];
      console.log(this.aMowers);
      this.snackBar.open("successful reading of instructions! there are " + this.aMowers.length + " mowers", null, {
        duration: 3000,
      });
      this.bCanStarted = true;
    } else {
      this.message = "Instruction Iznogoud"
    }
  }


  public startInstruction() {
    if (this.aMowers && Array.isArray(this.aMowers) && this.aMowers.length > 0) {
      this.bCanStarted = false;
      // timer est incrémenté pour faire demarrer de manière sequentiel les tondeuses, une gestion avec des promesses auraient été possible également
      let nTimer = 1
      // boucle sur les tondeuses
      for (let y = 0; y < this.aMowers.length; y++) {
        let oMower = this.aMowers[y];
        if (oMower['instruction'] && typeof oMower['instruction'] === "string") {
          console.log('instruction is "' + oMower['instruction'] + '"')
          let aInstruction = oMower['instruction'].split('');
          for (let i = 0; i < aInstruction.length; i++) {
            const sInstruction = aInstruction[i];
            setTimeout(() => {
              oMower = this.executeService.applyInstruction(sInstruction, oMower, this.aZoneHorizX.length - 1, this.aZoneVertiY.length - 1);
            }, nTimer * 1000)
            nTimer++
          }
          setTimeout(() => {
            this.snackBar.open(oMower['name'] + " is in position : (" + oMower['position']['x'] + "," + oMower['position']['y'] + " " + oMower['position']['direction'] + ")", null, {
              duration: 2000,
            });
          }, nTimer * 1000)
        } else {
          this.message += "Can't read instruction of " + oMower['name'] + "\n";
        }
      }
    } else {
      this.message = "No Mowers in this instruction"
    }
  }

}// end class