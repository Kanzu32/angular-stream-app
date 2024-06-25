import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { VideoComponent } from '../video/video.component';
import { StreamComponent } from '../stream/stream.component';


@Component({
  selector: 'app-read',
  standalone: true,
  imports: [ReactiveFormsModule, StreamComponent],
  templateUrl: './read.component.html',
  styleUrl: './read.component.scss'
})
export class ReadComponent {
    constructor(private apiService: ApiService) {}

    @ViewChild(StreamComponent) childStreamComponent:StreamComponent;

    readForm = new FormGroup({
        address: new FormControl('127.0.0.1:1234', [Validators.required,
            Validators.pattern(/\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?):\d{1,5}\b/)]),
        name: new FormControl('video', Validators.required),
        format: new FormControl('mp4', Validators.required),
        resolution: new FormControl('720x1280', [Validators.required, Validators.pattern(/\d+x\d+/)]),
    });
          
    handleSubmit() {
        this.apiService.postReadStart(
            this.readForm.value.address ?? "127.0.0.1:1234",
            this.readForm.value.name ?? "video",
            this.readForm.value.format ?? "mp4",
            this.readForm.value.resolution ?? "720x1280",)
        .subscribe({
            next: () => {
                // this.childStreamComponent.changeSource("http://localhost:5000/live.ts")
                console.log("OK");
            },
            error: (error) => {
                console.log(error);
            },
        }); 
    }
    
    reload() {
        console.log("RELOAD");
        this.childStreamComponent.reload();
    }

    endRecord() {
        this.apiService.postReadStop();
    }
  
      
}
