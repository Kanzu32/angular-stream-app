import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import Mpegts from 'mpegts.js';

@Component({
  selector: 'app-video',
  standalone: true,
  imports: [],
  templateUrl: './video.component.html',
  styleUrl: './video.component.scss'
})

// http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4

// http://localhost:5000/download/video.ts

export class VideoComponent {
    @ViewChild("videoElement") videoElement: ElementRef;
    @Input() isStream: boolean;
    videoSource = "";
    format: string;

    player: Mpegts.Player;

    constructor() {
        this.player = Mpegts.createPlayer({
            type: 'mpegts',  // could also be mpegts, m2ts, flv
            isLive: false,
            url: this.videoSource,
            withCredentials: false,
        });
    }

    changeSource(videoSource: string) {
        this.player.unload();

        console.log(this.isStream);
        console.log("VIDEO link", videoSource);

        this.format = videoSource.split(".").slice(-1)[0];
        this.videoSource = videoSource;
        
        // this.videoElement.nativeElement.currentTime = 0;
        if (this.format == "ts") {
            console.log("VIDEO TS");
            this.player = Mpegts.createPlayer({
                type: 'mpegts',  // could also be mpegts, m2ts, flv
                isLive: this.isStream,
                url: this.videoSource,
                withCredentials: false,
            });
            this.player.attachMediaElement(this.videoElement.nativeElement);
            this.player.load();
        }
    }
}
