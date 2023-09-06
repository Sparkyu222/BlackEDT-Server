const ics = require('node-ical');
const events = ics.sync.parseFile('anonymous_cal.ical');

// Fonction pour savoir si la description contient un examen
function hasExam(description) {
    const controlRegex = /controle|examen/gi;
    return controlRegex.test(description);
}

// Parse et retourne le prof et les groupes contenus dans la description
function extractDesc(description) {
    const obj = {
        groups: [],
        teacher: ''
    };
    const array = description.split('\n').slice(0, -2); // Remplace le array.pop()*2 par slice
    for (const item of array) {
        if (item.search(/RT\d+/g) !== -1) {
            obj.groups.push(item);
        } else if (item !== '') {
            obj.teacher = item;
        }
    }
    return obj;
}

// On cycle à travers les events et on print ce que l'on veux
for (const event of Object.keys(events)) {

    if (event === 'vcalendar') continue;

    if (hasExam(events[event].description)) {
        console.log(events[event].summary + ' --- '  + events[event].start.toISOString() + ' --- ' + JSON.stringify(extractDesc(events[event].description)));
    }

}

module.exports = {
    hasExam,
    extractDesc
}