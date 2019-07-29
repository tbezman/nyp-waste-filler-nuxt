class Worksheet {
    static async fromWorksheet(worksheet) {
        worksheet = new Worksheet(worksheet);

        await worksheet.process();

        return worksheet;
    }

    constructor(worksheet) {
        this.headers = [];

        this.worksheet = worksheet;
    }

    process() {
        let row = this.worksheet.getRow(1);

        this.headers = row.values;
    }
}

module.exports = Worksheet;