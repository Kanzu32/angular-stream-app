import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgApiService, VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgStreamingModule } from '@videogular/ngx-videogular/streaming';

@Component({
  selector: 'app-stream',
  standalone: true,
  imports: [VgCoreModule, VgControlsModule, VgOverlayPlayModule, VgBufferingModule, VgStreamingModule],
  templateUrl: './stream.component.html',
  styleUrl: './stream.component.scss'
})
export class StreamComponent {
    api: VgApiService;
    streamSource: string = "http://127.0.0.1:5000/live.mpd";
    src: string;

    constructor (private router: Router) {}

    onPlayerReady(api: VgApiService) {
        this.api = api;
        this.api.getMasterMedia().subscriptions.rateChange.subscribe(() => {this.api.playbackRate = 1});
    }

    reload() {
        window.location.reload();
        
    }
}
