import { Component, ElementRef, ViewChild } from '@angular/core';
import Mpegts from 'mpegts.js';

@Component({
  selector: 'app-video',
  standalone: true,
  imports: [],
  templateUrl: './video.component.html',
  styleUrl: './video.component.scss'
})
export class VideoComponent {
    @ViewChild("videoElement") videoElement: ElementRef
    videoSource = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"

    constructor() {}

    player: Mpegts.Player;

    // ngAfterViewInit() {
    //     this.player = Mpegts.createPlayer({
    //         type: 'mpegts',  // could also be mpegts, m2ts, flv
    //         isLive: false,
    //         url: this.videoSource,
    //     });
    //     this.player.attachMediaElement(this.videoElement.nativeElement);
    //     this.player.load();
    //     this.player.play();
    // }
}
