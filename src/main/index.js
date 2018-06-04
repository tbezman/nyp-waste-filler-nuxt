import Excel from "../../Excel";
import _ from 'lodash';
import moment from 'moment';
import fs from 'fs'

process.env.NODE_ENV = process.env.NODE_ENV || 'production'
/*
** Electron app
*/
const electron = require('electron')

const app = electron.app
const bw = electron.BrowserWindow

const newWin = () => {
    let win = new bw({
        width: 800,
        height: 600
    })
    return win.loadURL("http://localhost:3000")
};

app.on('ready', newWin);
app.on('window-all-closed', () => app.quit());
app.on('activate', () => win === null && newWin());


electron.ipcMain.on('headers', async (event, path) => {
    let excel = await Excel.fromPath(path);

    try {
        let worksheets = ([].concat.apply([], excel.worksheets.map(sheet => {
            return {
                path,
                headers: sheet.headers,
                worksheet: sheet.worksheet.id,
                mappings: {}
            };
        })));

        event.sender.send('headers', worksheets);
    } catch (e) {
        event.sender.send('headersFailed');
    }
});

electron.ipcMain.on('import', async (event, worksheets) => {
    let files = _.groupBy(worksheets, 'path');

    try {
        const logs = [];
        let id = 0;

        for (const path in files) {
            let excel = await Excel.fromPath(path);
            let worksheets = files[path];

            worksheets.forEach(worksheet => {
                let found = excel.worksheets.find(it => it.worksheet.id === worksheet.worksheet);

                if (!found) return;

                found.worksheet.eachRow(row => {
                    let wasteRecord = {_id: (id++).toString(), type: 'waste'};

                    for (const key in worksheet.mappings) {
                        let index = found.headers.indexOf(worksheet.mappings[key]);
                        let cell = row.getCell(index);

                        wasteRecord[key] = cell.result || cell.value;
                    }

                    let justDate = moment(wasteRecord.date);
                    let date = moment(justDate.format('M/D/YYYY') + ' ' + wasteRecord.time, 'M/D/YYYY h:mma');

                    wasteRecord.when = date.format();

                    delete wasteRecord.date;
                    delete wasteRecord.time;

                    logs.push(wasteRecord);
                })
            })
        }

        event.sender.send('imported', logs);
    } catch (e) {
        event.sender.send('imported');
    }
});

electron.ipcMain.on('base64', async (event, paths) => {
    let data = await Promise.all(paths.map(async path => {
        let file = fs.readFileSync(path);

        return file.toString('base64');
    }));

    event.sender.send('base64', data);
});
