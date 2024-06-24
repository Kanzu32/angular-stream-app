import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    constructor(
        private httpClient: HttpClient
    ) { }

    postReadStart(address: string, name: string, format: string, resolution: string){
           
        const body = {address: address, name: name, format: format, resolution: resolution};
        return this.httpClient.post("http://localhost:5000/read/start", body); 
    }

    postReadStop() {
        return this.httpClient.post("http://localhost:5000/read/stop", {}).subscribe({
            next: () => {
              console.log("OK");
            },
            error: (error) => {
              console.log(error);
            },
          }); 
    }

    postCropOptions(sectionMode: boolean, begin: string, end: string, fileName: string) {
        const body = {sectionMode: sectionMode, begin: begin, end: end, fileName: fileName};
        return this.httpClient.post("http://localhost:5000/crop", body, {responseType: 'blob'}).subscribe(data => {
            console.log(data);
            return data;
        });
    }

    getFilesList(){
        return this.httpClient.get("http://localhost:5000/files", {responseType: 'text'});
    }
}
