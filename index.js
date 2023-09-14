import { WebSocketServer } from 'ws';                               // Pour les WebSockets
import chalk from 'chalk';                                          // Pour print en couleur dans la console
import ical from 'node-ical';                                       // Pour parser les fichiers ICS/iCAL
import { downloadCalendar } from './src/downloader.js';             // Fonctions pour télécharger le calendrier
import * as parser from './src/ics-parser.js';                      // Fonctions pour parser des éléments dans un évênement
import * as chokidar from 'chokidar';                               // Librairie pour watch un dossier et ses sous-dossiers
import { sleep } from './src/utils.js';

// On démarre le WebSocket sur le port 8080
const wss = new WebSocketServer({ port: 8080 });

// Objet de réponse
var objReponse = {
    type: "",
    error: null,
    content: null
}

var directory2 = {
    name: "Calendrier",
    type: "folder",
    content: [
        {
            name: "RT1",
            type: "folder",
            content: [
                {
                    name: "TD1",
                    type: "folder",
                    content: [
                        {
                            name: "TP1",
                            type: "file",
                            uid: 4096
                        },
                        {
                            name: "TP2",
                            type: "file",
                            uid: 4095
                        }
                    ]
                },
                {
                    name: "TD2",
                    type: "folder",
                    content: [
                        {
                            name: "TP3",
                            type: "file",
                            uid: 4097
                        },
                        {
                            name: "TP4",
                            type: "file",
                            uid: 4099
                        }
                    ]
                }
            ]
        },
        {
            name: "RT2",
            type: "folder",
            content: [
                {
                    name: "TD1",
                    type: "folder",
                    content: [
                        {
                            name: "TP1",
                            type: "file",
                            uid: 4093
                        },
                        {
                            name: "TP2",
                            type: "file",
                            uid: 4032
                        }
                    ]
                },
                {
                    name: "TD2",
                    type: "folder",
                    content: [
                        {
                            name: "TP3",
                            type: "file",
                            uid: 40432
                        },
                        {
                            name: "TP4",
                            type: "file",
                            uid: 4012
                        }
                    ]
                }
            ]
        }
    ]
}

// Initiation des fonctions d'écoute de sockets
wss.on('connection', (ws) => {  
    console.log(chalk.yellow(`Un client s'est connecté`));

    // Quand le Websocket reçoit un message
    ws.on('message', async (data) => {
        console.log(`Message reçu : ${data}`);
    });

    (async () => {
        /*const icsFile = await downloadCalendar();
        const parsedICS = ical.sync.parseICS(icsFile);
    
        var obj = {};
    
        for (const event of Object.keys(parsedICS)) {
            if ((event) === 'vcalendar') continue;
            let description = parser.extractDesc(parsedICS[event].description);
            obj[event] = {
                subject: parsedICS[event].summary,
                location: parsedICS[event].location,
                start_time: parsedICS[event].start,
                duration: parsedICS[event].end.getHours() - parsedICS[event].start.getHours(),
                teacher: description.teacher,
                groups: description.groups,
                exam: description.exam
            }
        }*/

        var sendObj = objReponse;

        sendObj.type = "directory";
        sendObj.error = false;
        sendObj.content = directory2;

        ws.send(JSON.stringify(sendObj));

    })();

});

var watchedPath = chokidar.watch('./data/').on('all', (event, path) => {
    
});

(async () => {
    await sleep(5000);
    console.log(watchedPath.getWatched());

})();

console.log('Le serveur a été initialisé');