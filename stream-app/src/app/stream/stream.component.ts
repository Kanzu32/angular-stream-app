import { Component } from '@angular/core';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgApiService, VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgStreamingModule } from '@videogular/ngx-videogular/streaming';
import * as config from '../../assets/config.json'

@Component({
  selector: 'app-stream',
  standalone: true,
  imports: [VgCoreModule, VgControlsModule, VgOverlayPlayModule, VgBufferingModule, VgStreamingModule],
  templateUrl: './stream.component.html',
  styleUrl: './stream.component.scss'
})
export class StreamComponent {
    api: VgApiService;
    streamSource: string = config.serverBaseUrl + "/live.mpd";
    src: string;

    // по готовности плеера зафикситовать скорость проигрования на x1 
    onPlayerReady(api: VgApiService) {
        this.api = api;
        this.api.getMasterMedia().subscriptions.rateChange.subscribe(() => {this.api.playbackRate = 1});
    }

    // перезагрузка страницы для обновления плеера
    reload() {
        window.location.reload();
        
    }
}
