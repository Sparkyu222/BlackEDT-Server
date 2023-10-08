import * as fs from 'fs';

// Fonction pour télécharger le calendrier (2 semaines) - À TERMINER
/**
 * Télécharge le calendrier actuel, contient deux semaine d'évênements
 * @param {string} ressource
 * @returns {string}
 */
export async function downloadCalendar(ressource) {
    const request = await fetch(`https://emploidutemps.univ-reunion.fr/jsp/custom/modules/plannings/anonymous_cal.jsp?resources=${ressource}&projectId=3&calType=ical&nbWeeks=2&displayConfigId=8`);
    if (request.ok !== true) {   // La requête à échouée
        return false;
    }
    const rawICS = await request.text();
    return rawICS;
}

// Fonction pour télécharger le calendrier de backup - À TERMINER
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