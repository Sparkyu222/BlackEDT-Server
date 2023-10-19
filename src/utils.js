import chalk from 'chalk';
/**
 * Fontion sleep, besoin de la directive "await" pour fonctionner
 * @param {*} ms
 */
export async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Créé des réponses contenant un message d'erreur
 * @param {object} sendObj 
 * @param {string} string 
 * @returns {object}
 */
export function makeErrorResponse(sendObj, ErrorString) {
    sendObj.error = true;
    sendObj.content = {
        why: ErrorString
    };

    console.error(chalk.red(`Error: `) + chalk.yellow(ErrorString));
    return sendObj;
}

/**
 * Duplique un objet pour éviter de modfier l'objet originel
 * @param {Object} obj
 * @returns {Object}
 */
export function duplicateObject(obj) {
    return JSON.parse(JSON.stringify(obj));
}