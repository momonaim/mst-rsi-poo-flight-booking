export const formatDuree = (duree) => {
    const hours = Math.floor(duree / 60); // Heures
    const minutes = duree % 60;          // Minutes restantes
    return `${hours}h ${minutes}m`;
};