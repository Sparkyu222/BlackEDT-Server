import paparse from 'papaparse';
import * as fs from 'fs';

/**
 * Permet de prendre les fichiers contenue dans le path et de les convertir en objets
 * pour les inclure dans les dossiers de l'arborescence
 * @param {Array} files 
 * @param {Array} path 
 * @returns {Array} Tableau qui contient les fichiers sous forme d'objet pour le "content" du dossier actuel
 */
function includeFiles (files, path) {                                                                                   // Fonction pour insérer les fichiers dans le path
    var items = [];                                                                                                     // Tableau qui contiendra tous les fichiers
    for (const file of files) {
        let extension = file.slice(file.length-3, file.length);                                                         // On récupère l'extension du fichier
        let hostPath = path + '/' + file;                                                                               // On combine le path du dossier avec le fichier

        switch (extension) {                                                                                            // Switch case sur l'extension du fichier
            case 'csv':                                                                                                 // Si le fichier est un CSV
                let rawCSV = fs.readFileSync(hostPath).toString();                                                      // On parse le fichier CSV
                let csv = paparse.parse(rawCSV).data;

                for (const line of csv) {                                                                               // Pour chaque ligne du fichier CSV on créé un bouton dans le path
                    if (line.length < 3) continue;                                                                      // S'il y a moins de 3 colonnes dans la ligne actuelle, on continue sur la prochaine itération
                    
                    let obj = {                                                                                         // On met les infos des 3 colonnes dans l'objet
                        name: line[0],                                                                                  // Nom de l'objet
                        type: "calendar",                                                                               // Type calendrier
                        resource: line[1],                                                                              // L'id de la ressource sur l'EDT
                        tts: line[2]                                                                                    // Clé qui contient le texte à dire à voix haute (tts)
                    }
                    

                    let alreadyExists = false;
                    for (const id of global.resources) {                                                                // On stocke la ressource pour la fonction de backup de calendriers
                        if (id === line[1]) {
                            alreadyExists = true;
                            break;
                        }
                    }

                    if (alreadyExists !== true) global.resources.push(line[1]);


                    items.push(obj);                                                                                // On push l'objet parmis les autres items
                }

                break;

            case 'ics':
                let objLocalCalendar = {                                                                                         // On créé l'objet qui contiendra le nom du pdf ainsi le path complet vers celui-ci
                    name: file.slice(0, file.length-4),                                                             // Nom du fichier ICS
                    type: "localCalendar",                                                                          // Type localCalendar
                    resource: hostPath                                                                              // Dans le champs "resource" on met le chemin absolue vers le ICS
                }

                items.push(objLocalCalendar);                                                                                    // On push l'objet parmis les autres items
                break;

            case 'pdf':                                                                                                 // Si le fichier est un PDF
                let objPdf = {                                                                                         // On créé l'objet qui contiendra le nom du pdf ainsi le path complet vers celui-ci
                    name: file.slice(0, file.length-4),                                                             // Nom du PDF
                    type: "pdf",                                                                                    // Type PDF
                    resource: hostPath                                                                              // Dans le champs "resource" on met le chemin absolue vers le PDF
                }

                items.push(objPdf);                                                                                    // On push l'objet parmis les autres items

                break;
            
            default:                                                                                                    // Si l'extension ne correspond à rien, on throw une erreur
                console.error(`Error : Wrong extension (${hostPath})`);
                continue;
        }
    }

    return items;                                                                                                       // On return les fichiers

}
/**
 * Créé le tableau PATH qui contient l'arborescence des boutons
 * @param {Object} watcherPath 
 * @returns {Array} L'arborescence, "PATH", qui est un tableau contenant des objets
 */
export function makePath(watcherPath) {                                                                                 // Fonction pour créer le path à partir du watchedPath
    var directoryTree = JSON.parse(JSON.stringify(watcherPath));                                                        // On clone l'objet original pour éviter de le modifier (objet qui contient les paths et les fichiers)
    var finalPath = [];                                                                                                 // Path final

    delete directoryTree[Object.keys(directoryTree)[0]];                                                                // On supprimer le premier objet et le deuxième objet du tableau qui correspond à la racine
    delete directoryTree[Object.keys(directoryTree)[0]];

    var directoryTreeKeys = Object.keys(directoryTree);                                                                 // On stocke les paths dans une variable spécifique pour éviter d'utiliser "Object.keys()" dans tous les sens

    for (const actualPath of directoryTreeKeys) {                                                                       // On boucle sur chaque path
        
        let everyFiles = directoryTree[actualPath];                                                                     // On prends les fichiers du path actuel
        let files = everyFiles.filter(file => file.match(/(\.csv|\.pdf|\.ics)/));                                             // On garde seulement les fichiers finissant par ".csv" et ".pdf"

        let splitArray = actualPath.split('/');                                                                         // On éclate le string par les "/" : "/home/user/project/data/calendar/RT1" ==> ['home', 'user', 'project', 'data', 'calendar', 'RT1']
        let arrayPath = splitArray.splice(splitArray.indexOf('data')+1, splitArray.length);                             // On garde seulement les éléments après 'data' : ['home', 'user', 'project', 'data', 'calendar', 'RT1'] ==> ['calendar', 'RT1']
        

        if (arrayPath.length === 1) {                                                                                   // Si le tableau de l'arrayPath contient un seul élément, alors on peut directement opérer à la racine de l'objet sans boucler

            let obj = {                                                                                                 // Objet qui contient le dossier
                name: arrayPath[0],                                                                                     // Nom du dossier actuel
                type: "folder",                                                                                         // On indique que l'élément est un dossier
                content: []                                                                                             // Cet élément contiendra le contenu du dossier actuel
            };

            try {                                                                                                       // Au cas où si il y a une erreur de lecture
                if (files.length > 0) {                                                                                 // Si il y a au moins un fichier dans le dossier, on les transforme et les inclue dans "content"
                    var fileArray = includeFiles(files, directoryTreeKeys[directoryTreeKeys.indexOf(actualPath)]);      // On convertie les fichiers sous forme d'objet
                    for (const item of fileArray) {                                                                     // On boucle sur le tableau des fichiers pour les inclure dans l'élément "content"
                        obj.content.push(item);
                    }
                }
            } catch (e) {
                // Erreur lors de la lecture de fichier ?
            }

            finalPath.push(obj);                                                                                        // On push l'objet dans le path final

        } else {                                                                                                        // Deuxième condition du if : Si le nombre d'élément est supérieur à 1 dans l'arrayPath, c'est qu'il faudra boucler dans des sous-dossiers
            var currentPath = null;                                                                                     // Variable tampon qui contiendra le niveau actuel dans l'objet

            for (const obj of finalPath) {                                                                              // Première itération sur le root de l'objet
                if (obj.name === arrayPath[0] && obj.type === 'folder') {                                               // Quand on aura trouvé le dossier avec le même nom que l'élément actuel dans l'arrayPath, on le met dans la variable tampon pour descendre
                    currentPath = obj.content;
                    break;
                }
            }

            for (let i=1; i < arrayPath.length; i++) {                                                                  // On boucle sur les sous-fichiers jusqu'à atteindre le dossier souhaité
                for (const obj of currentPath) {
                    if (obj.name === arrayPath[i] && obj.type === 'folder') {
                        currentPath = obj.content;
                        break;
                    }
                }
            }

            let obj = {                                                                                                 // On créé l'objet à mettre dans l'élément "content" du dossier actuel
                name: arrayPath[arrayPath.length-1],
                type: "folder",
                content: []
            };

            try {
                if (files.length > 0) {                                                                                 // On vérifie s'il y a des fichiers pour les inclure
                    var fileArray = includeFiles(files, directoryTreeKeys[directoryTreeKeys.indexOf(actualPath)]);
                    for (const item of fileArray) {
                        obj.content.push(item);
                    }
                }
            } catch (e) {
                // Erreur lors de la lecture de fichier ?
            }

            
            currentPath.push(obj);                                                                                      // Lorsqu'on est arrivé dans l'objet on push le fichiers

        }
    }

    return finalPath;                                                                                                   // Lorsque la boucle principale est terminée, le path est prêt à être envoyé
}