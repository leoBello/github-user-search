import { describe, it, expect } from 'vitest';
import { ERROR_MESSAGES, UI_MESSAGES } from './messages';

describe('messages constants', () => {
  describe('ERROR_MESSAGES', () => {
    it('RATE_LIMIT retourne le bon message', () => {
      expect(ERROR_MESSAGES.RATE_LIMIT).toBe(
        'Limite de requêtes GitHub atteinte. Réessaie dans quelques instants.',
      );
    });

    it('VALIDATION retourne le bon message', () => {
      expect(ERROR_MESSAGES.VALIDATION).toBe(
        "La requête de recherche n'est pas valide pour l'API GitHub.",
      );
    });

    it('NETWORK retourne le bon message', () => {
      expect(ERROR_MESSAGES.NETWORK).toBe(
        "Erreur réseau lors de l'appel à l'API GitHub.",
      );
    });

    it('SERVER retourne le bon message avec le status', () => {
      expect(ERROR_MESSAGES.SERVER(500)).toBe('Erreur serveur GitHub (500).');
      expect(ERROR_MESSAGES.SERVER(404)).toBe('Erreur serveur GitHub (404).');
      expect(ERROR_MESSAGES.SERVER(503)).toBe('Erreur serveur GitHub (503).');
    });
  });

  describe('UI_MESSAGES', () => {
    it('LOADING retourne le bon message', () => {
      expect(UI_MESSAGES.LOADING).toBe('Loading…');
    });

    it('NO_RESULTS retourne le bon message avec la query', () => {
      expect(UI_MESSAGES.NO_RESULTS('test')).toBe(
        'Aucun utilisateur trouvé pour "test"',
      );
      expect(UI_MESSAGES.NO_RESULTS('react')).toBe(
        'Aucun utilisateur trouvé pour "react"',
      );
    });

    it('EMPTY_QUERY retourne le bon message', () => {
      expect(UI_MESSAGES.EMPTY_QUERY).toBe(
        'Saisissez au moins 2 caractères pour rechercher',
      );
    });
  });
});
