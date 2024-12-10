import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as config from '../../assets/config.json'

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    constructor(
        private httpClient: HttpClient
    ) { }

    // Запрос для старта записи стрима
    postReadStart(address: string, name: string, format: string, resolution: string){
        const body = {address: address, name: name, format: format, resolution: resolution};
        return this.httpClient.post(config.serverBaseUrl + "/read/start", body); 
    }

    // Запрос для окончания записи стрима
    postReadStop() {
        return this.httpClient.post(config.serverBaseUrl + "/read/stop", {}).subscribe({
            next: () => {
              console.log("OK");
            },
            error: (error) => {
              console.log(error);
            },
          }); 
    }

    // Запрос для передачи параметров обрезки видео
    postCropOptions(sectionMode: boolean, begin: string, end: string, fileName: string) {
        const body = {sectionMode: sectionMode, begin: begin, end: end, fileName: fileName};
        return this.httpClient.post(config.serverBaseUrl + "/crop", body, {responseType: 'blob'}).subscribe(data => {
            console.log(data);
            return data;
        });
    }

    // Запрос для получения списка записанных файлов
    getFilesList(){
        return this.httpClient.get(config.serverBaseUrl + "/files", {responseType: 'text'});
    }

    // Загрузка видео ресурса
    // loadVideoResource(source: string) {
    //     return this.httpClient.get(source, {responseType: 'blob'}).subscribe(data => {
    //         console.log(data);
    //         return data;
    //     });
    // }
}
