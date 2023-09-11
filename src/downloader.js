import * as fs from 'fs';

export async function downloadCalendar() {
        const request = await fetch('https://emploidutemps.univ-reunion.fr/jsp/custom/modules/plannings/anonymous_cal.jsp?resources=10487&projectId=3&calType=ical&nbWeeks=1&displayConfigId=8');
        if (request.ok !== true) {   // La requête à échouée
            return false;
        }
        const rawICS = await request.text();
        return rawICS;
}

export async function downloadCalendarBackup(link, filename) {
    const request = await fetch(link)
    if (request.ok !== true) {   // La requête à échouée
        return false;
    } 
    const calendartxt = await request.text()

    fs.writeFile(filename, calendartxt, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });
}