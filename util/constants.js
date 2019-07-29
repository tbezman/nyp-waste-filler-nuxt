const rawTitles = {
    'patient_number': 'Patient Number',
    'mrn': 'MRN',
    'account_number': 'Account Number',
    'charge_code': 'Charge Code',
    'charge_code_descriptor': 'Charge Code Descriptor',
    'units': 'Units',
    'rate': 'Rate',
    'date': 'Date',
    'time': 'Time'
};

const specialTitles = {
    'charge': "Charge",
    'vial_config': 'Vial Config',
    'entered_waste': 'Entered Waste'
};

const ignoredPerCampus = {
    'east': [],
    'west': ['patient_number']
};

const rawTitlesForCampus = (campus) => {
    const filtered = {};

    for (const key in rawTitles) {
        if (ignoredPerCampus[campus].indexOf(key) === -1)
            filtered[key] = rawTitles[key];
    }

    return filtered;
};

const converToTitle = (prop) => rawTitles[prop] || specialTitles[prop] || '';

export {
    specialTitles,
    converToTitle,
    rawTitlesForCampus,
    rawTitles,
    ignoredPerCampus
}
