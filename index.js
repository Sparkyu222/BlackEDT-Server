import { WebSocketServer } from 'ws';
import chalk from 'chalk';
import ical from 'node-ical';
import { downloadCalendar } from './src/downloader.js';
import * as parser from './src/ics-parser.js';

const wss = new WebSocketServer({ port: 8080 });

var eventTemplate = {
    subject: '',
    location: '',
    start_time: '',
    duration: '',
    teacher: '',
    groups: [],
    exam: null
}

wss.on('connection', (ws) => {
    console.log(chalk.yellow(`Un client s'est connecté`));
    /*
    ws.on('message', async (request) => {
        const icsFile = await dwn.downloadCalendar();
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

        ws.send(JSON.stringify(obj));
    })
    */

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
        ws.send(JSON.stringify(obj));
    })();

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
    console.log(obj);
})();

console.log('Le serveur a été initialisé');