# Lancer le client pour les développements

## Installer node.js et npm sur votre machine de développement

Personnelement j'utilise une machine Linux Debian 10 et le gestionnaire de la distribution permet d'installer les paquets nécessaires.

```bash
$ sudo apt update
$ sudo apt install nodejs npm
```


## Installer les dépendances du projet

On peut utiliser npm pour installer les dépendances de notre projet.

```bash
$ cd app
$ npm install
```

## Lancer un serveur

Dans le cadre de développements, pour démarrer le client, on peut se passer de Docker, on utilise le serveur proposé par la commande ng:
```
$ ng serve --host=0.0.0.0
```