import { Injectable } from '@angular/core';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor() { }

  /**
   * Supprime les informations de session (déconnexion)
   */
  public clear(): void {
    sessionStorage.clear();
  }

  /**
   * Retourne le token courant, ou null si non-connecté
   * @returns string|null
   */
  public getToken(): string|null {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  /**
   * Retourne l email de l'utilisateu courant si connecté.
   * @returns string|null
   */
  public getUserEmail(): string|null {
    return sessionStorage.getItem(USER_KEY);
  }

  /**
   * Enregistre les informations utilisateur
   * @returns void
   */
  public setUser(email: string, token: string): void {
    sessionStorage.setItem(USER_KEY, email);
    sessionStorage.setItem(TOKEN_KEY, token);
  }

}
