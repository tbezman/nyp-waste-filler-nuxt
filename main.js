/*
**  Nuxt
*/
const Excel = require('./Excel');
const moment = require('moment');
const fs = require('fs');
const _ = require('lodash');

const http = require('http')
const { Nuxt, Builder } = require('nuxt')
let config = require('./nuxt.config.js')
config.rootDir = __dirname // for electron-builder
// Init Nuxt.js
const nuxt = new Nuxt(config)
const builder = new Builder(nuxt)
const server = http.createServer(nuxt.render)
// Build only in dev mode
if (config.dev) {
	builder.build().catch(err => {
		console.error(err) // eslint-disable-line no-console
		process.exit(1)
	})
}

nuxt.hook('error', e => {
    console.log(arguments);
});
// Listen the server
server.listen(3000);
const _NUXT_URL_ = `http://localhost:${server.address().port}`
console.log(`Nuxt working on ${_NUXT_URL_}`)

/*
** Electron
*/
let win = null // Current window
const electron = require('electron')
const path = require('path')
const app = electron.app
const newWin = () => {
	win = new electron.BrowserWindow({
		icon: path.join(__dirname, 'static/icon.png')
	})
	win.maximize()
	win.on('closed', () => win = null)
    // Wait for nuxt to build
    const pollServer = () => {
        http.get(_NUXT_URL_, (res) => {
            if (res.statusCode === 200) { win.loadURL(_NUXT_URL_) } else { setTimeout(pollServer, 300) }
        }).on('error', pollServer)
    }
    pollServer()

    win.webContents.openDevTools()
}
app.on('ready', newWin)
app.on('window-all-closed', () => app.quit())
app.on('activate', () => win === null && newWin())

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
            let worksheets = _.uniqBy(files[path], it => it.worksheet);

            worksheets.forEach(worksheet => {
                console.log(`Processing worksheet ${worksheet.worksheet}`);

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
                    date.add(1, 'day');

                    wasteRecord.when = date.format();

                    delete wasteRecord.date;
                    delete wasteRecord.time;

                    logs.push(wasteRecord);
                })
            })
        }

        event.sender.send('imported', logs);
    } catch (e) {
        console.log(e);
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
