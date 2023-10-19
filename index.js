import { WebSocketServer } from 'ws';                                           // Pour les WebSockets
import chalk from 'chalk';                                                      // Pour print en couleur dans la console
import ical from 'node-ical';                                                   // Pour parser les fichiers ICS/iCAL
import { downloadCalendar, downloadCalendarBackup, getCalendarBackup  } from './src/downloader.js';                         // Fonctions pour télécharger le calendrier
import { makeCalendarArray } from './src/ics-parser.js';                        // Fonctions pour parser des éléments dans un évênement
import * as chokidar from 'chokidar';                                           // Librairie pour watch un dossier et ses sous-dossiers
import { sleep, makeErrorResponse, duplicateObject } from './src/utils.js';     // Fonctions utiles
import { makePath } from './src/path-parser.js';                                // Fonctions pour la création du path
import * as fs from 'fs';                                                       // Pour lire les fichiers (PDF)
import path from 'path';                                                        // Pour extraire le nom du fichier dans un path donné

// On démarre le WebSocket sur le port 8080
const wss = new WebSocketServer({ port: 8080 });

// Variable pour faire attendre l'annonce du chokidar - permet de lui laisse le temps de découvrir le fichier?
var chokidarReady = false;

// Variable pour stocker le path actuel
var cachePath = null;

// Objet de réponse
var objReponse = {
    type: "",
    error: null,
    content: null
}

// On écoute les changements effectués dans le dossier "data"
var watchedPath = chokidar.watch('./data/').on('all', async (event, target_path) => {

    var sendObj = duplicateObject(objReponse);

    try {
        var path = makePath(watchedPath.getWatched());
    } catch (e) {
        let errObj = makeErrorResponse(duplicateObject(objReponse), `Can't create PATH`);
        ws.send(JSON.stringify(errObj));
        return;
    }

    // On met le path dans le cache pour les clients qui se connectent pour la première fois au serveur
    cachePath = path;
    if (chokidarReady === false) return;

    // On créé l'objet de réponse
    sendObj.type = "directory";
    sendObj.error = false;
    sendObj.content = path;

    // On broadcast à tous les clients le path modifié
    wss.clients.forEach((ws) => {
        ws.send(sendObj);
    })
    console.log(`Modification du PATH détecté (${event}  - "${target_path}"), broadcast du nouveau PATH effectué au clients.`);
});

// On écoute si un client se connecte
wss.on('connection', (ws) => {
    console.log(chalk.yellow(`Client connecté.`));

    // On attends 10 secondes et on envoie le PATH au client
    (async () => {
        await sleep(10000);

        // Construction de l'objet de réponse
        let sendObj = duplicateObject(objReponse);
        sendObj.type = "directory";
        sendObj.error = false;
        sendObj.content = cachePath;

        ws.send(JSON.stringify(sendObj));
    })();

    // Quand le WebSocket reçoit un message
    ws.on('message', async (msg) => {

        // On stocke le template de l'objet de réponse dans un objet temporaire
        var sendObj = duplicateObject(objReponse);

        // On tente de parser la requête
        try {
            var request = JSON.parse(`${msg}`);
        } catch (e) {
            console.error(chalk.red(`Can't parse JSON string : "${msg}"`));
            return;
        }

        // Si dans la requête il n'y a pas la mention du type
        if (typeof request.type === 'undefined') {
            let errObj = makeErrorResponse(duplicateObject(objReponse), 'Empty or non-existant ressource object field');
            ws.send(JSON.stringify(errObj));
            return;
        }

        // Si dans la requête il n'y a pas la mention de la ressource
        if (typeof request.content === 'undefined' || typeof request.content.resource === 'undefined') {
            let errObj = makeErrorResponse(duplicateObject(objReponse), 'Empty or non-existant ressource object field');
            ws.send(JSON.stringify(errObj));
            return;
        }

        // Switch case pour voir le type de la requête
        switch (request.type) {
            case 'calendar':
                // On essaie de télécharger le calendrier actuel
                try {
                    const icsFile = await downloadCalendar(request.content.resource);           // On télécharge le fichier iCAL/ICS
                    if (icsFile === false) throw new Error();                                   // Si le téléchargeur a return false, il y a eu un problème dans le téléchargement
                    const parsedICS = ical.sync.parseICS(icsFile);                              // On passe le fichier dans le parser
                    var events = makeCalendarArray(parsedICS);                                  // On simplifie la sortie du parser pour le client
                } catch (e) {
                    // Si le téléchargement a échoué, on essaie de trouver une backup locale
                    console.log('Erreur lors du téléchargement. ' + request.content.resource);
                    const backupICS = getCalendarBackup(request.content.resource);
                    if (backupICS === false) {
                        let errObj = makeErrorResponse(duplicateObject(objReponse, `Couldn't download and get backup calendar.`));
                        ws.send(errObj);
                        return;
                    }
                }

                // On construit l'objet de réponse
                sendObj.type = "calendar";
                sendObj.error = false;
                sendObj.content = events;

                console.log(JSON.stringify(sendObj) + ' ' + request.content.resource);

                // On envoie la réponse au client
                ws.send(JSON.stringify(sendObj));
                break;

            case 'pdf':
                // On essaie de lire le fichier PDF
                try {
                    var file = fs.readSync(request.content.resource)
                } catch (e) {
                    let errObj = makeErrorResponse(duplicateObject(objReponse), `PDF file does not exists or can't be read`);
                    ws.send(JSON.stringify(errObj));
                    return;
                }

                // On encode le fichier dans un string en Base64
                var encodedPdf = btoa(file);

                // On construit l'objet de réponse
                sendObj.type = "pdf";
                sendObj.error = false;
                sendObj.content = {
                    name: path.basename(request.content.resource),
                    data: encodedPdf
                };

                // On envoie la réponse au client
                ws.send(JSON.stringify(sendObj));
                break;

            default:
                console.error(chalk.red(`Wrong request type given.`));
                let errObj = makeErrorResponse(duplicateObject(objReponse), 'Wrong type request');
                ws.send(JSON.stringify(errObj));
                return;
        }
    });

});

// Laisser la découverte
(async () => {
    // On laisse 10 secondes à Chokidar le temps qu'il découvre les sous-dossiers/fichiers du dossier "data"
    await sleep(10000);
    chokidarReady = true;
    console.log(`Chokidar peux désormais broadcast.`);
})();

console.log('Le serveur a été initialisé');
