/**
 * Permet de valider les informations d'une catégorie avant de les enregistrer.
 * @param name Le nom de l'équipe à valider
 * @param acronym L'acronyme de l'équipe à valider
 * @returns string[] Un tableau contenant les messages d'erreur.
 * @author Breno Gomes - H26
 */

export function validateCategoriesInfos(name: string, acronym: string): string[] {
    const errors: string[] = [];   
    //Nom de la catégorie
    if (!name || name.trim() === "") {
        errors.push(" Le nom et l'acronyme de la catégorie sont requis.");
    } else if (name.length < 3) {
        errors.push("Le nom de la catégorie doit contenir au moins 3 caractères.");
    }

    //Acronyme de la catégorie
    if (!acronym || acronym.trim() === "") {
        errors.push(" Le nom et l'acronyme de la catégorie sont requis.");
    } else if (acronym.length < 3) {
        errors.push("L'acronyme de la catégorie doit contenir au moins 3 caractères.");
    }
    return errors;
} 