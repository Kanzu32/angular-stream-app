import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VideoComponent } from '../video/video.component';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-crop',
  standalone: true,
  imports: [ReactiveFormsModule, VideoComponent], 
  templateUrl: './crop.component.html',
  styleUrls: ['./crop.component.scss']
})
export class CropComponent {
    filesList = ""
    videoSource = ""
    currentFileName = ""

    @ViewChild(VideoComponent) childVideoComponent:VideoComponent;

    constructor(private apiService: ApiService) {}
    cropForm = new FormGroup({
        sectionMode: new FormControl(false, {
            nonNullable: true,
            validators: [Validators.required]
          }),
        begin: new FormControl('00:00:00.000', [Validators.required, Validators.pattern(/^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9]).\d\d\d/)]),
        end: new FormControl('00:00:00.000', [Validators.required, Validators.pattern(/^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9]).\d\d\d/)]),
    });

    fileName = new FormControl("", {
        nonNullable: true,
        validators: [Validators.pattern(/.+\.(mp4|mkv|ts)$/)],
    });


    handleCrop() {
        this.apiService.postCropOptions(
            this.cropForm.value.sectionMode ?? true,
            this.cropForm.value.begin ?? '00:00:00.000',
            this.cropForm.value.end ?? '00:00:00.000',
            this.currentFileName);
    }

    handleLoadFiles() {
        this.apiService.getFilesList().subscribe(data => {
            this.filesList = data;
            return data;
        });
    }

    handleLoadVideo() {
        this.currentFileName = this.fileName.value;
        this.videoSource = "http://127.0.0.1:5000/recorded/" + this.currentFileName
        this.childVideoComponent.changeSource(this.videoSource);
        console.log("Video Source: ", this.videoSource);
    }
}
