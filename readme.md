# 🎮 Portfolio Game Dev — Guide de déploiement

Portfolio statique prêt pour GitHub Pages.

---

## 📁 Structure des fichiers

```
portfolio/
├── index.html      ← Page principale (tout le contenu)
├── style.css       ← Styles dark mode + responsive
├── script.js       ← Animations, canvas, interactions
├── assets/         ← Dossier à créer pour vos médias
│   ├── photo.jpg       (votre photo de profil)
│   ├── project1.jpg    (capture du projet principal)
│   ├── project2.jpg    (etc.)
│   └── ...
└── README.md       ← Ce fichier
```

---

## ✏️ Personnalisation rapide

Ouvrez `index.html` et remplacez les zones en `[crochets]` :

| Zone à modifier | Exemple |
|---|---|
| `[Votre Prénom]` | Lucas |
| `[Votre Nom]` | Moreau |
| `[Votre Nom].[Votre Prénom]` | `GP` dans le logo → vos initiales |
| `votre@email.com` | lucas.moreau@gmail.com |
| `votre-pseudo` (GitHub) | lucasdev42 |
| `[Nom du projet principal]` | Dungeon Crawler 3D |
| Description des projets | Votre propre texte |

### Remplacer votre photo

```html
<!-- Cherchez cette section dans index.html -->
<div class="avatar-placeholder">
  <span class="avatar-initials">GP</span>
  ...
</div>

<!-- Remplacez-la par : -->
<div class="avatar-placeholder">
  <img src="assets/photo.jpg" alt="Lucas Moreau" />
</div>
```

### Remplacer les captures de projets

```html
<!-- Cherchez project-placeholder dans les articles projet -->
<div class="project-placeholder" ...>

<!-- Remplacez par : -->
<img src="assets/project1.jpg" alt="Aperçu du projet" />
```

### Ajuster les niveaux de compétences

Dans `index.html`, modifiez les valeurs `aria-valuenow` et `--fill` :

```html
<!-- Exemple : 65% -->
<div class="skill-bar" aria-valuenow="65" ...>
  <div class="skill-fill" style="--fill: 65%"></div>
</div>
```

---

## 🚀 Mise en ligne sur GitHub Pages (5 étapes)

### Étape 1 — Créer un dépôt GitHub

1. Allez sur [github.com](https://github.com) et connectez-vous
2. Cliquez sur **"New repository"**
3. Nommez-le : `votre-pseudo.github.io`
   *(remplacez `votre-pseudo` par votre pseudo GitHub exact)*
4. Laissez-le **Public**
5. Cliquez **"Create repository"**

### Étape 2 — Uploader vos fichiers

**Option A — via l'interface web (plus simple) :**
1. Dans le dépôt créé, cliquez **"Add file" → "Upload files"**
2. Glissez-déposez `index.html`, `style.css`, `script.js` et le dossier `assets/`
3. Cliquez **"Commit changes"**

**Option B — via Git en ligne de commande :**
```bash
git init
git add .
git commit -m "Initial commit — portfolio"
git branch -M main
git remote add origin https://github.com/votre-pseudo/votre-pseudo.github.io.git
git push -u origin main
```

### Étape 3 — Activer GitHub Pages

1. Allez dans **Settings** de votre dépôt
2. Dans le menu gauche, cliquez **Pages**
3. Sous *Source*, sélectionnez **"Deploy from a branch"**
4. Choisissez la branche **main** et le dossier **/ (root)**
5. Cliquez **Save**

### Étape 4 — Attendre le déploiement

GitHub Pages prend 1 à 3 minutes pour publier. Vous verrez un bandeau vert indiquant l'URL une fois prêt.

### Étape 5 — Accéder à votre portfolio

🎉 Votre portfolio est accessible à :

```
https://votre-pseudo.github.io
```

---

## 🔄 Mettre à jour le portfolio

Après chaque modification de fichier :
```bash
git add .
git commit -m "Mise à jour : [description de la modification]"
git push
```

GitHub Pages se mettra à jour automatiquement en quelques minutes.

---

## 💡 Conseils

- **Images** : optimisez vos images (format WebP ou JPG ≤ 300 Ko) pour un chargement rapide
- **Vidéos UE5** : préférez héberger sur YouTube et intégrer avec `<iframe>`
- **Domaine personnalisé** : GitHub Pages supporte les domaines custom (ex: `lucasmoreau.dev`) gratuitement via les paramètres DNS

---

## 🛠️ Technologies utilisées

- HTML5 sémantique
- CSS3 (variables, grid, flexbox, animations)
- JavaScript vanilla (Canvas API, IntersectionObserver)
- Google Fonts (Syne + Space Mono)
- Aucune dépendance externe · Aucun framework · Aucun build requis
