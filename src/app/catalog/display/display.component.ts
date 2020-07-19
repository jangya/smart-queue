import { Component, OnInit } from '@angular/core';
import { NavbarService } from 'src/app/core/navbar.service';
import { Observable } from 'rxjs';
import { FirestoreService } from 'src/app/core/firestore.service';

declare var $: any;

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss']
})
export class DisplayComponent implements OnInit {
  opd1Token: Observable<Object>;
  opd2Token: Observable<Object>;
  synth = window.speechSynthesis;

  constructor(
    public nav: NavbarService,
    private db: FirestoreService
  ) { }

  ngOnInit(): void {
    // $('body').css({
    //   "background-color": "#FBAB7E",
    //   "background-image": "linear-gradient(62deg, #FBAB7E 0%, #F7CE68 100%"
    // });
    $('body').css("background-color", "#FFFF33");
    // $('body').addClass('bg-warning');
    this.nav.hide();
    this.opd1Token = this.db.doc$('opd/opd1');
    this.opd2Token = this.db.doc$('opd/opd2');
    this.opd1Token.subscribe((data) => {
      this.speak(data, 'OPD1');
    });
    this.opd2Token.subscribe((data) => {
      this.speak(data, 'OPD2');
    });
  }

  speak(data: any, opd: string): void {
    let voice = this.synth.getVoices().find((voice) => voice.lang === 'hi-IN' && voice.voiceURI === 'Google हिन्दी');
    if (this.synth.speaking) {
        console.error('speechSynthesis.speaking');
        return;
    }
    if (!voice || !data || !opd ) return;

    let utterThis = new SpeechSynthesisUtterance('Token number ' + data.token + ' at ' + opd);
    utterThis.onend = function (event) {
        console.log('SpeechSynthesisUtterance.onend');
    }
    utterThis.onerror = function (event) {
        console.error('SpeechSynthesisUtterance.onerror');
    }
    utterThis.voice = voice;
    utterThis.pitch = 1;
    utterThis.rate = 1;
    utterThis.volume = 1;
    this.synth.speak(utterThis);
  }
}
