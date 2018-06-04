import { converToTitle } from './constants';

export const logToLayoutMap = (log, layout = {}) => {
    const layouts = [];

    for (const prop in layout) {
        if (!layout.hasOwnProperty(prop)) continue;

        const title = converToTitle(prop);
        const position = layout[prop];

        if (log.waste && log.waste.hasOwnProperty(prop)) {
            layouts.push({
                text: formatProp(title, log.waste[prop]),
                ...position
            });
        } else {
            const text = layoutSpecial(prop, log);

            if (text) {
                layouts.push({
                    text: formatProp(title, text),
                    ...position
                });
            }
        }
    }

    return layouts;
};

const layoutSpecial = (prop, log) => {
    switch (prop) {
        case 'charge':
            return charge(log);
        case 'entered_waste':
            return entered_waste(log);
        case 'vial_config':
            return vial_config(log);
    }

    return null;
};

const formatProp = (prop, value) => `${prop} : ${value}`;

export const wasted_units = (log) => {
    const smallest_vial_size = Math.min(...log.vial.vial_size.split(',').map(parseFloat));

    const used = (parseFloat(log.waste.units) * parseFloat(log.vial.billable_units)) + parseFloat(log.amount);
    const waste = log.config.total - used;

    console.log(smallest_vial_size, log.amount, waste);

    const not_last_patient = Math.min(smallest_vial_size, parseFloat(log.amount), waste);
    const last_patient = parseFloat(log.amount);

    const charged_waste = log.only_patient ? last_patient : not_last_patient;

    return Math.abs(charged_waste / log.vial.billable_units);
};

export const charge = (log) => {
    const wasted = wasted_units(log);

    return log.waste.charge_code + ' ' + wasted.toFixed(2) + '@' + log.waste.rate;
};

export const entered_waste = (log) => log.amount;

export const vial_config = (log) => log.config.config.toString();
