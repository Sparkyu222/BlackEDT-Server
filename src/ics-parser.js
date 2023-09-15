// Parse et retourne le prof les groupes et l'exam dans la description
function extractDesc(description) {
    // Objet qui contiendra les éléments retournés par la fonction
    const obj = {
        groups: [],
        teacher: [],
        exam: null
    };

    // On commence par voir si l'évênement est un exam
    const controlRegex = /controle|examen/gi;
    obj.exam = controlRegex.test(description);

    // On tente de récupérer les groupes affilié à l'évênement et le professeur
    const array = description.split('\n').slice(0, -2); // Remplace le array.pop()*2 par slice
    for (const item of array) {
        if (item.search(/RT\d+/g) !== -1) {
            obj.groups.push(item);
        } else if (item !== '') {
            obj.teacher.push(item);
        }
    }
    return obj;

}

// Permet de convertir le contenu orginal de l'évênement et de le simplifier pour le client dans un tableau contenant des objets
export function makeCalendarArray(parsedICS) {
    var eventArray = [];
    
    for (const event of Object.keys(parsedICS)) {
        if ((event) === 'vcalendar') continue;
        let description = extractDesc(parsedICS[event].description);
        eventArray.push({
            subject: parsedICS[event].summary,
            location: parsedICS[event].location,
            start_time: parsedICS[event].start,
            duration: parsedICS[event].end.getHours() - parsedICS[event].start.getHours(),
            teacher: description.teacher,
            groups: description.groups,
            exam: description.exam
        });
    }

    return eventArray;
}

/*
//const events = ics.sync.parseFile('anonymous_cal.ical');
console.log(events[Object.keys(events)[0]].uid);
console.log(events[Object.keys(events)[0]].end.getHours() - events[Object.keys(events)[0]].start.getHours())

// On cycle à travers les events et on print ce que l'on veux
for (const event of Object.keys(events)) {

    if (event === 'vcalendar') continue;

    if (hasExam(events[event].description)) {
        console.log(events[event].summary + ' --- '  + events[event].start.toISOString() + ' --- ' + JSON.stringify(extractDesc(events[event].description)));
    }

}
*/