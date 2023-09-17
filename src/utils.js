/**
 * Fontion sleep, besoin de la directive "await" pour fonctionner
 * @param {*} ms
 */
export async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}