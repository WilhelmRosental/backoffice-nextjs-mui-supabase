// utils/formatFilter.ts
import _ from 'lodash';

/**
 * Formate les valeurs de filtre extraites des paramètres de l'URL en un tableau.
 * 
 * @param query - Objet contenant les paramètres de requête de l'URL.
 * @param filterName - Le nom du paramètre de filtre à extraire.
 * @returns Un tableau des valeurs de filtre ou null si aucun filtre n'est trouvé ou si le filtre est vide.
 */
export function formatFilter(query: { [key: string]: string | string[] }, filterName: string): string[] | null {
  const filterValue = query[filterName];

  // Vérifie si la valeur du filtre est un tableau et non vide
  if (_.isArray(filterValue) && !_.isEmpty(filterValue)) {
    return filterValue;
  } 
  // Si la valeur du filtre est une chaîne non vide, la retourne dans un tableau
  else if (filterValue && !_.isArray(filterValue)) {
    return [filterValue];
  } 
  // Retourne null si le filtre est vide ou non défini
  else {
    return null;
  }
}