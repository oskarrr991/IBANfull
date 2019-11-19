import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private _http: HttpClient) {}

  uploadFile(formData): Promise<File> {
    return this._http.post<File>('https://iban2.herokuapp.com/file', formData).toPromise();
  }

  checkSingleIBAN(ibanNR): Promise<string> {
    return this._http.get<string>('https://iban2.herokuapp.com/api/postData/' + ibanNR).toPromise();
  }

  downloadFile(): Promise<Blob> {
    return this._http.get<Blob>('https://iban2.herokuapp.com/getFile', { responseType: 'blob' as 'json' }).toPromise();
  }

  deleteFile(): Promise<string> {
    return this._http.delete<string>('https://iban2.herokuapp.com/delete').toPromise();
  }
}
