const Worksheet = require('./Worksheet');
const excel = require('exceljs');
const moment = require('moment');

class Excel {
    static async fromPath(path) {
        let excel = new Excel(path);

        await excel.readFromPath();

        return excel;
    }

    constructor(path) {
        this.worksheets = [];
        this.path = path;
    }

    async readFromPath() {
        this.workbook = new excel.Workbook();

        await this.workbook.xlsx.readFile(this.path);

        await this.setupWorksheets();
    }

    async setupWorksheets() {
        let worksheets = this.workbook.worksheets;

        this.worksheets = await Promise.all(worksheets.map(Worksheet.fromWorksheet));
    }
}

module.exports = Excel;
