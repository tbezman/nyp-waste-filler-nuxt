import Excel from "../../Excel";

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
}

app.on('ready', newWin);
app.on('window-all-closed', () => app.quit())
app.on('activate', () => win === null && newWin())


electron.ipcMain.on('headers', async (event, path) => {
    let excel = await Excel.fromPath(path);

    let worksheets = ([].concat.apply([], excel.worksheets.map(sheet => {
        return {
            path,
            headers: sheet.headers,
            worksheet: sheet.worksheet.id
        };
    })));

    event.sender.send('headers', worksheets
    );
});
