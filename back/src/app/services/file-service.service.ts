import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private _http: HttpClient) {}

  uploadFile(formData): Promise<File> {
    return this._http.post<File>('http://localhost:3000/file', formData).toPromise();
  }

  checkSingleIBAN(ibanNR): Promise<string> {
    return this._http.get<string>('http://localhost:3000/api/postData/' + ibanNR).toPromise();
  }

  downloadFile(): Promise<Blob> {
    return this._http.get<Blob>('http://localhost:3000/getFile', { responseType: 'blob' as 'json' }).toPromise();
  }

  deleteFile(): Promise<string> {
    return this._http.delete<string>('http://localhost:3000/delete').toPromise();
  }
}
