import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VideoComponent } from '../video/video.component';
import { ApiService } from '../services/api.service';
import * as config from '../../assets/config.json'

@Component({
  selector: 'app-crop',
  standalone: true,
  imports: [ReactiveFormsModule, VideoComponent], 
  templateUrl: './crop.component.html',
  styleUrls: ['./crop.component.scss']
})
export class CropComponent {
    filesList = "";
    videoSource = "";
    downloadSource = "";
    currentFileName = "";
    beginMarker = 0;
    endMarker = 0;
    isEndMarker = false;

    // Компонент плеера видео
    @ViewChild(VideoComponent) childVideoComponent:VideoComponent;

    constructor(private apiService: ApiService) {}

    // Форма параметров обрезки видео
    cropForm = new FormGroup({
        sectionMode: new FormControl(false, {
            nonNullable: true,
            validators: [Validators.required]
          }),
        begin: new FormControl('00:00:00.000', [Validators.required, Validators.pattern(/^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9]).\d\d\d/)]),
        end: new FormControl('00:00:00.000', [Validators.required, Validators.pattern(/^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9]).\d\d\d/)]),
    });

    // Отдельный валидатор названия файла
    fileName = new FormControl("", Validators.pattern(/.+\.(mp4|mkv|ts|avi)$/));

    // Обработчик кнопки установки маркера для обрезки видео
    setMarker() {
        console.log("MARKER");
        if (this.isEndMarker) {
            this.endMarker = this.childVideoComponent.videoElement.nativeElement.currentTime;
            if (this.endMarker < this.beginMarker) {
                let tmp = this.beginMarker;
                this.beginMarker = this.endMarker;
                this.endMarker = tmp;
            }

            this.cropForm.controls.begin.setValue(new Date(this.beginMarker * 1000).toISOString().slice(11, 23));
            this.cropForm.controls.end.setValue(new Date(this.endMarker * 1000).toISOString().slice(11, 23));
            this.isEndMarker = false;
        } else {
            this.beginMarker = this.childVideoComponent.videoElement.nativeElement.currentTime;
            this.cropForm.controls.begin.setValue(new Date(this.beginMarker * 1000).toISOString().slice(11, 23));
            this.cropForm.controls.end.setValue("00:00:00.000");
            this.isEndMarker = true;
        }
    }

    // Обработчик отправки формы обрезки видео
    handleCrop() {
        this.apiService.postCropOptions(
            this.cropForm.value.sectionMode ?? true,
            this.cropForm.value.begin ?? '00:00:00.000',
            this.cropForm.value.end ?? '00:00:00.000',
            this.currentFileName);
    }

    // Обработчик кнопки загрузки списка файлов
    handleLoadFiles() {
        this.apiService.getFilesList().subscribe(data => {
            this.filesList = data;
            return data;
        });
    }

    // Обработчик кнопки загрузки видео в плеер
    handleLoadVideo() {
        this.currentFileName = this.fileName.value ?? "video.mp4";
        
        this.videoSource = config.serverBaseUrl + "/recorded/" + this.currentFileName;
        this.downloadSource = config.serverBaseUrl + "/download/" + this.currentFileName;
        console.log("LOAD: ", this.videoSource);
        this.childVideoComponent.changeSource(this.videoSource);
        console.log("Video Source: ", this.videoSource);
    }
}
