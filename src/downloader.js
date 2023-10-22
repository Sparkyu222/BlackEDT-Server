import * as fs from 'fs';
import chalk from 'chalk';
import { sleep } from './utils.js'

// Fonction pour télécharger le calendrier (2 semaines) - À TERMINER
/**
 * Télécharge le calendrier actuel, contient deux semaine d'évênements
 * @param {string} ressource
 * @returns {string}
 */
export async function downloadCalendar(resource) {
    const request = await fetch(`https://emploidutemps.univ-reunion.fr/jsp/custom/modules/plannings/anonymous_cal.jsp?resources=${resource}&projectId=3&calType=ical&nbWeeks=2&displayConfigId=8`);
    if (request.ok !== true) {   // La requête à échouée
        return false;
    }
    const rawICS = await request.text();
    return rawICS;
}

// Fonction pour télécharger le calendrier de backup - À TERMINER
/**
 * Fonction pour télécharger la backup d'un calendrier (un semestre) et la stocker dans './cache'
 * @param {*} resource 
 * @returns 
 */
export async function downloadCalendarBackup(resource) {
    const request = await fetch(`https://emploidutemps.univ-reunion.fr/jsp/custom/modules/plannings/anonymous_cal.jsp?resources=${resource}&projectId=3&calType=ical&nbWeeks=2&displayConfigId=8`)
    if (request.ok !== true) {   // La requête à échouée
        console.error(chalk.red(`downloadCalendarBackup: Can't download Backup calendar.`));
       return false;
    }

    const rawICS = await request.text();

    try {
        fs.writeFileSync(`./cache/${resource}.ics`, rawICS);
    } catch (e) {
        console.error(chalk.red(`downloadCalendarBackup: Can't write backup file.`));
        return false;
    }
}

/**
 * Fonction pour récupérer le calendrier backup
 * @param {int} resource
 * @returns {string}
 */
export function getCalendarBackup(resource) {
    try {
        var file = fs.readFileSync(`./cache/${resource}.ics`);
    } catch (e) {
        console.error(chalk.red(`getCalendarBackup: Can't read '${resource}' backup file.`));
        return false;
    }

    return file;
}

/**
 * Fonction qui initie le téléchargement de la backup du calendrier
 */
export async function initBackupDownloader() {
    console.log(`initBackupDownloader: Initiation de la backup de calendrier...`);
    for (const resource of global.resources) {
        if (await downloadCalendarBackup(resource) === false) {
            console.error(chalk.red(`initBackupDownloader: Couldn't download backup of resource ${resource}`));
        }
        console.log(`initBackupDownloader: Téléchargement de la backup de "${resource}" terminée avec succès."`);
        await sleep(5000);
    }

    console.log(`initBackupDownloader: Fin de tâche.`);
    await sleep(global.backupTimeout);
    initBackupDownloader();
}