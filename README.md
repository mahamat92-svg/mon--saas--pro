# 🚀 mon-saas-pro — SaaS Multitenant Pro avec Next.js & Tailwind CSS

Bienvenue sur **mon-saas-pro**, une solution SaaS complète, moderne et haute performance conçue pour les équipes et entreprises gérant plusieurs organisations (tenants), projets, sprints de développement et flux de facturation Stripe.

---

## 🌟 Fonctionnalités Principales

### 1. 🏢 Architecture Multitenant Complète
- **Isolation des Workspaces** : Chaque organisation dispose de son propre périmètre sécurisé (projets, tâches, collaborateurs, facturation Stripe).
- **Sélecteur de Workspace instantané** : Basculez entre vos organisations en un clic depuis la barre latérale ou créez de nouveaux workspaces avec slug et avatar personnalisés.
- **Environnements pré-configurés** :
  - *Acme Cloud Solutions* (Forfait Pro, 8 collaborateurs)
  - *Nova Studio Digital* (Forfait Enterprise, 14 collaborateurs)
  - *Mon Startup Perso* (Forfait Starter, 2 collaborateurs)

### 2. 🔐 Authentification & Rôles RBAC
- **Écran de connexion moderne** : Inscription de nouveau workspace ou connexion existante.
- **Boutons démo 1-Clic** : Testez instantanément en tant que CEO/Owner (*Alexandre Martin*), Tech Lead/Admin (*Sarah Benali*) ou Product Designer (*Thomas Laurent*).
- **Contrôle d’accès basé sur les rôles (RBAC)** : Propriétaire (*Owner*), Administrateur (*Admin*), Membre (*Member*), Lecteur (*Viewer*).

### 3. 📊 Tableau de Bord & Analytics
- **Indicateurs KPI temps réel** : MRR Stripe, Projets actifs, Taux de complétion des tâches, Collaborateurs actifs.
- **Graphique interactif d’évolution MRR** : Croissance des revenus récurrents sur 6 mois avec infobulles dynamiques.
- **Jauge de vélocité des tâches** : Répartition visuelle par statut et indicateurs d'urgence.
- **Flux d’activités en direct** : Historique chronologique des événements du workspace.

### 4. 📁 Gestion des Projets & Sprints
- **Cartes de projets interactives** : Avancement en %, budget consommé vs. alloué, compte à rebours des échéances, tags techniques, avatars des membres assignés.
- **Modale de création & édition de projet** : Saisie complète des objectifs, dates limites et budgets.
- **Modale d’inspection détaillée** : Vue d'ensemble, métriques financières, liste des tâches rattachées et équipe projet.

### 5. ⚡ Tâches & Tableau Kanban Interactif
- **Vue Kanban 4 colonnes** : *À faire*, *En cours*, *En revue*, *Terminé*.
- **Avancement rapide des tâches** : Boutons directionnels pour changer l'état d'une tâche avec animation confetti lors du passage à *Terminé*.
- **Checklists de sous-tâches** : Cochez les critères directement sur chaque carte Kanban.
- **Vue Liste / Tableau haute densité** : Filtres croisés par projet, statut et niveau de priorité (Urgente, Haute, Moyenne, Basse).

### 6. 💳 Factures & Abonnements Stripe
- **Gestion des formules tarifaires** : Forfaits *Starter* (29€/m), *Pro* (79€/m) et *Enterprise* (199€/m) avec commutateur Mensuel/Annuel (-20%).
- **Simulateur de Stripe Checkout sécurisé** : Carte de test préremplie (`4242 4242 4242 4242`), calcul automatique de la TVA à 20% et émission immédiate de la facture après confirmation.
- **Générateur & Export de Factures PDF Conformes** : Modèle de facture proforma acquittée aux normes européennes/françaises (SIRET, TVA intracommunautaire, mentions légales) imprimable ou téléchargeable en PDF via `window.print()`.
- **Configuration des clés API Stripe** : Modal dédiée pour paramétrer la *Publishable Key*, la *Secret Key* et le secret de webhook.

### 7. 👥 Gestion d'Équipe & Paramètres
- **Liste des collaborateurs** : Attribution et modification dynamique des rôles, invitations par email, révocation d'accès.
- **Paramètres généraux du workspace** : Modification du nom, du slug URL, de la devise (€ ou $) et suppression sécurisée.

---

## 🛠️ Stack Technique

- **Framework** : [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Langage** : [TypeScript](https://www.typescriptlang.org/)
- **Styles** : [Tailwind CSS v4](https://tailwindcss.com/)
- **Icônes** : [Lucide React](https://lucide.dev/)
- **Animations & Effets** : Canvas Confetti
- **Persistance** : `localStorage` avec synchronisation réactive et fonction de réinitialisation des données de démo

---

## 🚀 Démarrage Rapide

### 1. Installation des dépendances
```bash
npm install
```

### 2. Lancement du serveur de développement
```bash
npm run dev
```

L'application est accessible sur : **`http://localhost:3000`**

### 3. Compilation pour la production
```bash
npm run build
npm start
```
