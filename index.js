import { WebSocketServer } from 'ws';                               // Pour les WebSockets
import chalk from 'chalk';                                          // Pour print en couleur dans la console
import ical from 'node-ical';                                       // Pour parser les fichiers ICS/iCAL
import { downloadCalendar } from './src/downloader.js';             // Fonctions pour parser des éléments dans un évênement
import * as parser from './src/ics-parser.js';

const wss = new WebSocketServer({ port: 8080 });

// Objet de réponse
var objReponse = {
    type: "calendar",
    error: false,
    content: {}
}

wss.on('connection', (ws) => {  
    console.log(chalk.yellow(`Un client s'est connecté`));

    ws.on('message', async (data) => {
        console.log(`Message reçu : ${data}`);
    });

    (async () => {
        const icsFile = await downloadCalendar();
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
        }

        var sendObj = objReponse;

        sendObj.content = obj;

        ws.send(JSON.stringify(sendObj));

    })();

});

/*
(async () => {
    const icsFile = await downloadCalendar();
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
    }
    console.log(obj);
})();

var directory2 = {
    calendar: {
        name: "Calendrier",
        type: "folder",
        content: {

                item1: {
                    name: "RT1",
                    type: "folder",
                    content: {},
                },
                item2: {
                    name: "RT2",
                    type: "folder",
                    content: {
                        folder21: {
                            name: "RT2",
                            type: "folder",
                            content: {
                                file1: {
                                    name: "TP1",
                                    type: "calendar",
                                    uid: 4096
                                },
                                file2: {
                                    name: "notes",
                                    type: "pdf",
                                    uid
                                }
                            }
                        }
                    }
                }

        }

    }
}

var obj = {
    item1: {
        item21: true,
        item22: false,
        item23: null
    },
    item2: false,
    item3: null
}

*/
console.log('Le serveur a été initialisé');