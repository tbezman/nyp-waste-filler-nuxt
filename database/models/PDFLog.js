import sequelize from "../sequelize";
import Sequelize from 'sequelize';

export default sequelize.define('pdf_log', {
    file: {
        type: Sequelize.STRING
    },
    page: {
        type: Sequelize.INTEGER
    },
    only_patient: {
        type: Sequelize.BOOLEAN
    },
    problematic: {
        type: Sequelize.BOOLEAN
    }
}, {
    classMethods: {
        readyLogs() {
            return new Promise((resolve, reject) => {
                this.findAll({include: [WasteLog]})
                    .then(logs => {
                        resolve(logs.filter(log => !log.problematic && log.waste_log));
                    });
            });
        }
    }
});