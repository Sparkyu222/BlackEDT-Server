import paparse from 'papaparse';
import fs from 'fs';

function makeFiles (files, path) {
    var items = [];
    for (const file of files) {
        let extension = file.slice(file.length-3, file.length);
        let hostPath = path + '/' + file;

        switch (extension) {
            case 'csv':
                
                let rawCSV = fs.readFileSync(hostPath).toString();
                let csv = paparse.parse(rawCSV).data;

                for (const line of csv) {
                    if (line.length < 3) continue;
                    let obj = {
                        name: line[0],
                        type: "calendar",
                        ressource: line[1],
                        tts: line[2]
                    }
                    items.push(obj);
                }

                break;
            case 'pdf':
                    let obj = {
                        name: file.slice(0, file.length-4),
                        type: "pdf",
                        ressource: hostPath
                    }

                    items.push(obj);

                break;
            default:
                throw new Error(`Error : Wrong extension (makefile)`);
        }
    }
    return items;

}

export function makePath(watcherPath) {
    var directoryTree = watcherPath;
    var finalPath = [];                                                     // Path final

    delete directoryTree[Object.keys(directoryTree)[0]];                    // On supprimer le premier objet et le deuxième objet du tableau qui correspond à la racine
    delete directoryTree[Object.keys(directoryTree)[0]];

    var directoryTreeKeys = Object.keys(directoryTree);

    for (const actualPath of directoryTreeKeys) {
        
        let everyFiles = directoryTree[actualPath];
        let files = everyFiles.filter(file => file.match(/(\.csv|\.pdf)/));

        let splitArray = actualPath.split('/');
        let arrayPath = splitArray.splice(splitArray.indexOf('data')+1, splitArray.length);
        
        /*
        for (let i=0; i < arrayPath.length; i++){
            arrayPath[i][arrayPath[i].length-1] = arrayPath[i][arrayPath[i].length-1].toUpperCase() + arrayPath[i][arrayPath[i].length-1].slice(1);
        }
        */

        if (arrayPath.length === 1) {

            let obj = {
                name: arrayPath[0],
                type: "folder",
                content: []
            };

            try {
                if (files.length > 0) {
                    var fileArray = makeFiles(files, directoryTreeKeys[directoryTreeKeys.indexOf(actualPath)]);
                    for (const item of fileArray) {
                        obj.content.push(item);
                    }
                }
            } catch (e) {
                // Erreur lors de la lecture de fichier ?
            }

            finalPath.push(obj);

        } else {
            var currentPath = null;

            // Première itération pour le root de l'objet
            for (const obj of finalPath) {
                if (obj.name === arrayPath[0] && obj.type === 'folder') {
                    currentPath = obj.content;
                    break;
                }
            }

            // On boucle sur les sous-fichiers jusqu'à atteindre le dossier souhaité
            for (let i=1; i < arrayPath.length; i++) {
                for (const obj of currentPath) {
                    if (obj.name === arrayPath[i] && obj.type === 'folder') {
                        currentPath = obj.content;
                        break;
                    }
                }
            }

            let obj = {
                name: arrayPath[arrayPath.length-1],
                type: "folder",
                content: []
            };

            try {
                if (files.length > 0) {
                    var fileArray = makeFiles(files, directoryTreeKeys[directoryTreeKeys.indexOf(actualPath)]);
                    for (const item of fileArray) {
                        obj.content.push(item);
                    }
                }
            } catch (e) {
                // Erreur lors de la lecture de fichier ?
            }

            // Lorsqu'on est arrivé dans l'objet on push le fichiers
            currentPath.push(obj);

        }
    }

    return finalPath;
}