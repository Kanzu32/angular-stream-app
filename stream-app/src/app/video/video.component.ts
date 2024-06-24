import { Component } from '@angular/core';
import { VgApiService, VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { VgStreamingModule } from '@videogular/ngx-videogular/streaming';

@Component({
  selector: 'app-video',
  standalone: true,
  imports: [VgCoreModule, VgControlsModule, VgOverlayPlayModule, VgBufferingModule, VgStreamingModule],
  templateUrl: './video.component.html',
  styleUrl: './video.component.scss'
})
export class VideoComponent {
    preload: string = 'auto';
    api: VgApiService;
    videoSource = ""
    constructor() {}

    changeSource(newSource: string) {
        this.api.pause();
        this.videoSource = newSource;

        this.api.getDefaultMedia().currentTime = 0;
    }

    onPlayerReady(api: VgApiService) {
        this.api = api;
        
        this.api.getDefaultMedia().subscriptions.ended.subscribe(
            () => {
                // Set the video to the beginning
                this.api.getDefaultMedia().currentTime = 0;
            }
        );
    }
}
