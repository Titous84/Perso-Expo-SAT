/**
 * Coordonnées d'une personne-ressource
 * Mathieu Sévégny
 */
export default interface ContactPerson{
    /**
     * Identifiant de la personne-ressource   
     */
    id?:number;
     
    /**
     * Nom complet de la personne-ressource
     */
    fullName:string;
    /**
     * Adresse courriel de la personne-ressource
     */
    email:string;
}