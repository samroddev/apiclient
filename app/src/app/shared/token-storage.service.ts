import { Injectable } from '@angular/core';

const TOKEN_KEY = 'auth-token';
const ROLES_KEY = 'auth-roles';
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
   * Retourne les roles de l'utilisateur actuellement connecté.
   * @returns array|null
   */
  public getUserRoles() {
    let rolesString = sessionStorage.getItem(ROLES_KEY);
    if (rolesString === null) {
      return [];
    } else {
      let roles = JSON.parse(rolesString);
      return roles;
    }
  }


  /**
   * Retourne vrai si l'utilisateur possède le role fourni en parametre
   */
  public hasRole(role: string): boolean 
  {
    let roles = this.getUserRoles();
    return roles.includes(role);
  }

  /**
   * Enregistre les informations utilisateur
   * @returns void
   */
  public setUser(data: any): void {
    sessionStorage.setItem(USER_KEY, data.user.email);
    sessionStorage.setItem(ROLES_KEY, JSON.stringify(data.user.roles));
    sessionStorage.setItem(TOKEN_KEY, data.token);
  }

}
