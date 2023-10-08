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

    console.error(chalk.red(`Error: `) + chalk.orange(ErrorString));
    return sendObj;
}