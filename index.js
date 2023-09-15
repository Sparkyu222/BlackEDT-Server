import { WebSocketServer } from 'ws';                               // Pour les WebSockets
import chalk from 'chalk';                                          // Pour print en couleur dans la console
import ical from 'node-ical';                                       // Pour parser les fichiers ICS/iCAL
import { downloadCalendar } from './src/downloader.js';             // Fonctions pour télécharger le calendrier
import { makeCalendarArray } from './src/ics-parser.js';                      // Fonctions pour parser des éléments dans un évênement
import * as chokidar from 'chokidar';                               // Librairie pour watch un dossier et ses sous-dossiers
import { sleep } from './src/utils.js';
import{ makePath } from './src/path-parser.js'; 

// On démarre le WebSocket sur le port 8080
const wss = new WebSocketServer({ port: 8080 });

// Objet de réponse
var objReponse = {
    type: "",
    error: null,
    content: null
}

var watchedPath = chokidar.watch('./data/').on('all', (event, path) => {
    
});

// Initiation des fonctions d'écoute de sockets
wss.on('connection', (ws) => {
    console.log(chalk.yellow(`Un client s'est connecté`));

    // Quand le Websocket reçoit un message
    ws.on('message', async (msg) => {
        console.log(msg);
    });

    /*
    (async () => {
        const icsFile = await downloadCalendar();               // On télécharge le fichier iCAL/ICS
        const parsedICS = ical.sync.parseICS(icsFile);          // On passe le fichier dans le parser
        const events = makeCalendarArray(parsedICS);            // On simplifie la sortie du parser pour le client

        var sendObj = objReponse;

        sendObj.type = "calendar";
        sendObj.error = false;
        sendObj.content = events;

        ws.send(JSON.stringify(sendObj));

    })();
    */

    (async () => {
        await sleep(5000);
        let path = makePath(watchedPath.getWatched());

        let sendObj = objReponse;

        sendObj.type = "directory";
        sendObj.error = false;
        sendObj.content = path;

        ws.send(JSON.stringify(sendObj));

        console.log(JSON.stringify(path));
    })();

});



console.log('Le serveur a été initialisé');
