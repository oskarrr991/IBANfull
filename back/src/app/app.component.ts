import { FileService } from './services/file-service.service';
import { Component, OnInit } from '@angular/core';
import * as fileSaver from 'file-saver';
import { noop } from 'rxjs';
import { MatDialog } from '@angular/material';
import { DialogComponent } from './dialog/dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  fileName: string;
  uploaded: File;
  answer = false;
  show = false;
  constructor(private fileService: FileService,  private _dialog: MatDialog) {}

  ngOnInit() {}

  getValue(ibanNr) {
    this.fileService.checkSingleIBAN(ibanNr).then((response) => {
      if (response) {
        this.answer = true;
      }
      console.log(response);
      this.opendialog();
    }, (error) => {
        console.log('error during post is ', error);
    });
  }
  opendialog() {
    if (this.answer) {
      this._dialog.open(DialogComponent, {
        data: {
          str: 'Your IBAN is valid'
        }
      });
    } else {
      this._dialog.open(DialogComponent, {
        data: {
          str: 'Your IBAN is invalid'
        }
      });
    }
  }
  selectFile(event) {
    console.log(event);
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.uploaded = file;
      this.fileName = event.target.files[0].name;
    }
    this.upload();
  }

  upload() {
    const formData = new FormData();
    formData.append('file', this.uploaded);
    this.fileService.uploadFile(formData).then(() => noop(), err => noop());
    this.show = true;
  }

  download() {
    return this.fileService.downloadFile()
      .then(data => {
        console.log(data);
        const file = new File([data], 'txt.out');
        fileSaver.saveAs(file, 'txt.out');
        this.fileService.deleteFile().then(() => noop(), err => noop());
        }, err => {
            console.log('file download error ' + JSON.stringify(err));
        }
      );
  }
}
