const fs = require('fs');
const express = require('express');
const cors = require('cors');
const app = express();
const fileUpload = require('express-fileupload');
var checkedData = '', result;

var countries = [
  { name: 'AD', ln: 24 },
  { name: 'AE', ln: 23 },
  { name: 'AL', ln: 28 },
  { name: 'AT', ln: 20 },
  { name: 'AZ', ln: 28 },
  { name: 'BA', ln: 20 },
  { name: 'BE', ln: 16 },
  { name: 'BG', ln: 22 },
  { name: 'BH', ln: 22 },
  { name: 'BR', ln: 29 },
  { name: 'BY', ln: 28 },
  { name: 'CH', ln: 21 },
  { name: 'CR', ln: 22 },
  { name: 'CY', ln: 28 },
  { name: 'CZ', ln: 24 },
  { name: 'DE', ln: 22 },
  { name: 'DK', ln: 18 },
  { name: 'DO', ln: 28 },
  { name: 'EE', ln: 20 },
  { name: 'ES', ln: 24 },
  { name: 'FI', ln: 18 },
  { name: 'FO', ln: 18 },
  { name: 'FR', ln: 27 },
  { name: 'GB', ln: 22 },
  { name: 'GE', ln: 22 },
  { name: 'GI', ln: 23 },
  { name: 'GL', ln: 18 },
  { name: 'GR', ln: 27 },
  { name: 'GT', ln: 28 },
  { name: 'HR', ln: 21 },
  { name: 'HU', ln: 28 },
  { name: 'IE', ln: 22 },
  { name: 'IL', ln: 23 },
  { name: 'IS', ln: 26 },
  { name: 'IT', ln: 27 },
  { name: 'IQ', ln: 23 },
  { name: 'JO', ln: 30 },
  { name: 'KW', ln: 30 },
  { name: 'KZ', ln: 20 },
  { name: 'LB', ln: 28 },
  { name: 'LC', ln: 32 },
  { name: 'LI', ln: 21 },
  { name: 'LT', ln: 20 },
  { name: 'LU', ln: 20 },
  { name: 'LV', ln: 21 },
  { name: 'MC', ln: 27 },
  { name: 'MD', ln: 24 },
  { name: 'ME', ln: 22 },
  { name: 'MK', ln: 19 },
  { name: 'MR', ln: 27 },
  { name: 'MT', ln: 31 },
  { name: 'MU', ln: 30 },
  { name: 'NL', ln: 18 },
  { name: 'NO', ln: 15 },
  { name: 'PK', ln: 24 },
  { name: 'PL', ln: 28 },
  { name: 'PS', ln: 29 },
  { name: 'PT', ln: 25 },
  { name: 'QA', ln: 29 },
  { name: 'RO', ln: 24 },
  { name: 'RS', ln: 22 },
  { name: 'SA', ln: 24 },
  { name: 'SC', ln: 31 },
  { name: 'SE', ln: 24 },
  { name: 'SI', ln: 19 },
  { name: 'SK', ln: 24 },
  { name: 'SM', ln: 27 },
  { name: 'ST', ln: 25 },
  { name: 'SV', ln: 28 },
  { name: 'TL', ln: 23 },
  { name: 'TN', ln: 24 },
  { name: 'TR', ln: 26 },
  { name: 'UA', ln: 29 },
  { name: 'VA', ln: 22 },
  { name: 'VG', ln: 24 },
  { name: 'XK', ln: 20 },
]

var letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

app.use(cors({ origin: '*' }));
app.use(fileUpload());

let port = process.env.PORT || 3000;
app.listen(port);

app.post('/file', (req, res) => {
  const file = req.file || req.files;
  if (!file) {
    const error = new Error('No File')
    error.httpStatusCode = 400
    return next(error)
  }
  checkIfValid(file);
  res.send('OK');
})

app.get('/getFile', (req, res) => {
  fs.writeFile('txt.out', checkedData, function (err) {
    if (err) throw err;
    console.log('File is created successfully.');
    res.sendFile(__dirname + '/txt.out');
  });
});

app.delete('/delete', (req, res) => {
  checkedData = '';
  fs.unlink('txt.out', function (err) {
    if (err) throw err;
    console.log('File is deleted successfully.');
    res.send('OK');
  });
})

app.get('/api/postData/:id', function(req, res) {
  let ibanNr = req.params.id.toString();
  const answer = checkSingle(ibanNr);
  res.send(answer);
});

function checkSingle(ibanNr) {
  let modRES;
  let countryName = ibanNr.slice(0, 2);
  let ibanLength = ibanNr.length;

  for(let country of countries) {
    if(countryName == country.name && ibanLength == country.ln) {
      ibanNr = ibanNr.substr(4) + ibanNr.slice(0, 4);
      console.log('all good :)');
      ibanNr = ibanNr.split('');
      result = true;
      break;
    } else {
        result = false;
      }
  }

  if(result) {
    for (let i = 0; i < ibanNr.length; i ++) {
      for (let j = 0; j < letters.length; j ++) 
        if (ibanNr[i] == letters[j]) {
          ibanNr[i] = (j + 10).toString();
        }
    }
    ibanNr = ibanNr.join('');
    const parts = ibanNr.match(/.{1,6}/g); 
    modRES = parts.reduce((prev, curr) => Number(prev + curr) % 97, '');
  }

  if(modRES != 1) {
    return false;
  } else {
      return true;
    }
}

function checkIfValid(res) {
  const data = res.file.data.toString();
  let ibanNr = data.split('\r\n');
  for(let i = 0; i < ibanNr.length; i++) {
    let answer = checkSingle(ibanNr[i]);
    checkedData += ibanNr[i] + ';' + answer + '\n';
  }
}	