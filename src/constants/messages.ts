export const ERROR_MESSAGES = {
  RATE_LIMIT: 'Limite de requêtes GitHub atteinte. Réessaie dans quelques instants.',
  VALIDATION: "La requête de recherche n'est pas valide pour l'API GitHub.",
  NETWORK: "Erreur réseau lors de l'appel à l'API GitHub.",
  SERVER: (status: number) => `Erreur serveur GitHub (${status}).`,
} as const;

export const UI_MESSAGES = {
  LOADING: 'Loading…',
  NO_RESULTS: (query: string) => `Aucun utilisateur trouvé pour "${query}"`,
  EMPTY_QUERY: 'Saisissez au moins 2 caractères pour rechercher',
} as const;
