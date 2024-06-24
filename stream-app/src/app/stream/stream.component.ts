import { Component } from '@angular/core';
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
    preload: string = 'auto';
    api: VgApiService;
    streamSource: string = "http://127.0.0.1:5000/live.mpd";

    restart() {
        this.api.pause();
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
