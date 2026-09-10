# Portfolio — Noah Gauthier

Site personnel présentant mes projets de développement de jeux vidéo.

**En ligne :** https://odg747.github.io/Portfolio/

Écrit en HTML, CSS et JavaScript, sans framework et sans étape de compilation.
Aucun outil à installer : on ouvre un fichier, on modifie, on envoie.

---

## Ce qu'il y a dans le dossier

```
index.html              la page d'accueil (intro, cartes projets, outils, contact)
assets/style.css        toute la mise en forme
assets/site.js          bouton clair/sombre, maillage 3D de l'en-tête, images absentes
projets/                une page par projet
  _modele.html          modèle à copier pour ajouter un projet
images/                 les captures d'écran + l'image d'aperçu (og.png)
.nojekyll               nécessaire pour que GitHub Pages publie _modele.html
```

---

## Ajouter un projet

### 1. Copier le modèle

Dans `projets/`, duplique `_modele.html` et renomme la copie. Le nom du fichier
devient l'adresse de la page, donc : en minuscules, sans accent, sans espace.

```
projets/_modele.html   →   projets/mon-nouveau-projet.html
```

### 2. Remplir la page

Ouvre le fichier et remplace ce qui est indiqué en haut, dans le commentaire.
Il y a quatre endroits à ne pas oublier :

| Où | Quoi mettre |
|---|---|
| `<title>` | Le titre du projet, suivi de ` — Noah Gauthier` |
| `<meta name="description">` et `og:description` | Une phrase de résumé : c'est le texte affiché quand tu colles le lien sur Discord |
| `canonical` et `og:url` | Remplace `mon-projet.html` par le vrai nom de ton fichier |
| Le corps de la page | Les sections `<section>`, dans l'ordre que tu veux |

**Le statut du projet** se change à un seul endroit :

```html
<span class="statut" data-statut="en-cours">En cours</span>
```

Trois valeurs possibles pour `data-statut` :
`termine`, `en-cours`, `demarrage`. Le texte à l'intérieur de la balise est
libre — écris ce que tu veux (« Terminé — arrêté », « Prototype », etc.).

Les sections dont tu n'as pas besoin, tu les supprimes. Une section vide fait
plus mauvais effet qu'une section absente.

### 3. Ajouter la carte sur la page d'accueil

Ouvre `index.html`, va au bloc `<div class="projets">`. Chaque projet est un bloc
`<article class="carte">` séparé par un commentaire. Copie un bloc entier, colle-le
là où tu veux que le projet apparaisse, et modifie :

- le lien `href` de `<h3><a href="projets/…">`
- le titre, le texte de résumé
- le statut (même principe que ci-dessus)
- la liste `<ul class="technos">`
- le chemin de l'image et son texte alternatif

L'ordre des projets sur la page d'accueil est simplement l'ordre des blocs dans
le fichier. Pour remonter un projet, déplace son bloc plus haut.

### 4. Déposer la capture

Mets ton image dans `images/`, en `.webp`, avec exactement le nom écrit dans
l'attribut `src`. Voir `images/LISEZMOI.txt`.

Tant que l'image n'existe pas, le site affiche proprement « Capture à venir »
au lieu d'une image cassée — donc rien ne casse si tu ajoutes la page avant la photo.

### 5. Relier la fiche précédente

En bas de chaque fiche, le bloc `fiche__suite` renvoie au projet suivant. Si tu
insères un projet au milieu, pense à corriger ce lien sur la fiche d'avant.

### 6. Envoyer en ligne

```bash
git add .
git commit -m "Ajout du projet : mon nouveau projet"
git push
```

GitHub Pages met le site à jour tout seul, en une minute environ.

---

## Modifier les images

Les captures doivent rester légères, sinon le site devient lent.

- Format : **WebP**
- Taille : **1600 × 900 pixels** suffit largement
- Poids visé : **moins de 200 Ko** par image

Pour convertir une capture PNG en WebP sans installer de logiciel :
[squoosh.app](https://squoosh.app) → glisser l'image → choisir *WebP*,
qualité 80 → télécharger.

### L'image d'aperçu (`images/og.png`)

C'est l'image qui s'affiche quand on colle le lien du site sur Discord, WhatsApp
ou Instagram. Elle fait 1200 × 630 pixels. Si tu la remplaces, garde ces
dimensions et ce nom de fichier.

---

## Changer les couleurs ou la typographie

Tout est regroupé en haut de `assets/style.css`, dans la section « JETONS ».

```css
--accent:        #d9541e;   /* la couleur d'accent, thème clair */
--accent-encre:  #a83c0c;   /* la même, assombrie pour rester lisible en texte */
```

Le thème sombre redéfinit les mêmes noms plus bas dans le fichier. Si tu changes
l'accent, change-le **aux trois endroits** : `:root`, le bloc
`@media (prefers-color-scheme: dark)` et le bloc `:root[data-theme="dark"]`.

Attention à la lisibilité : `--accent-encre` sert au texte et doit rester
suffisamment contrasté avec le fond. Vérifie sur
[webaim.org/resources/contrastchecker](https://webaim.org/resources/contrastchecker/)
— il faut au moins 4,5.

---

## Voir le site sur son ordinateur avant de publier

Dans le dossier du projet :

```bash
python3 -m http.server 8000
```

Puis ouvrir http://localhost:8000 dans le navigateur.

---

## Détails techniques

- **Aucune dépendance.** Pas de framework, pas de npm, pas de compilation.
- **Deux polices** chargées depuis Google Fonts : Instrument Serif (titres) et
  JetBrains Mono (données, étiquettes). Si elles ne se chargent pas, le site
  bascule sur Georgia et la police monospace du système.
- **Thème clair/sombre** : suit le réglage du système, le bouton force un choix,
  et ce choix est retenu dans le navigateur.
- **Le maillage animé** de l'en-tête est dessiné en canvas 2D, sans librairie.
  Il se coupe tout seul si l'appareil demande moins d'animations
  (`prefers-reduced-motion`), quand l'en-tête sort de l'écran, ou quand l'onglet
  passe à l'arrière-plan.
- **Accessibilité** : lien d'évitement, navigation au clavier, contours de focus
  visibles, textes alternatifs sur les images, contrastes vérifiés.
- **`.nojekyll`** est indispensable : sans ce fichier, GitHub Pages ignore
  `projets/_modele.html` parce que son nom commence par un tiret bas.
