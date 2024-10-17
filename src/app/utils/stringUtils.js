// Fonction pour capitaliser la première lettre d'une chaîne
export const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };