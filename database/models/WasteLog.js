import sequelize from "../sequelize";
import Sequelize from 'sequelize';

export default sequelize.define('waste_log', {
    account_number: {
        type: Sequelize.STRING
    },
    patient_number: {
        type: Sequelize.STRING
    },
    mrn: {
        type: Sequelize.STRING
    },
    charge_code: {
        type: Sequelize.STRING
    },
    charge_code_descriptor: {
        type: Sequelize.STRING
    },
    units: {
        type: Sequelize.DOUBLE
    },
    wasted_amount: {
        type: Sequelize.DOUBLE
    },
    rate: {
        type: Sequelize.DOUBLE
    },
    when: {
        type: Sequelize.DATE
    }
}, {
    getterMethods: {
        vial() {
            return null;
            return VialService.getInstance().vialForDrug(this.charge_code_descriptor);
        },
        bestConfig() {
            if (!this.vial) {
                return null;
            }

            return null;
            // return VialService.getInstance().bestConfigForVial(this.vial, this.units * this.vial.billable_units)
        },
        vial_config() {
            if (!this.bestConfig) {
                return null;
            }

            return '[' + this.bestConfig.config.join(', ') + ']';
        },
        smallest_vial_size() {
            const vialSizes = this.vial.vial_size.split(',').map(num => {
                return parseFloat(num);
            });
            return Math.min.apply(Math, vialSizes);
        },
        charged_waste() {
            if (!this.vial) {
                return null;
            }

            // if this.pdf.only_patient -- return this.wasted_amount;

            return Math.min(this.smallest_vial_size, this.wasted_amount, this.bestConfig.waste);
        },
        wasted_units() {
            if (!this.vial) {
                return 0;
            }

            return Math.abs(this.charged_waste / this.vial.billable_units);
        },
        entered_waste() {
            if (!this.wasted_amount) {
                return '';
            }
            // console.log('waste:' + this.wasted_amount);
            return this.wasted_amount.toString();
        },
        charge() {
            return this.charge_code + ' ' + this.wasted_units.toFixed(2) + '@' + this.rate;
        }
    }
});