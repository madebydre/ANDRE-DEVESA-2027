# 🎬 Portfolio Monteur Vidéo - Persona 5 Style

> Un site portfolio moderne, interactif et fortement inspiré de Persona 5, pour promouvoir votre activité de monteur vidéo freelance.

![Persona 5 Inspired](https://img.shields.io/badge/Inspiration-Persona%205-blueviolet)
![HTML/CSS/JS](https://img.shields.io/badge/Stack-HTML%2FCSS%2FJS-blue)
![Responsive](https://img.shields.io/badge/Responsive-Mobile%20Ready-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## ✨ Fonctionnalités

### 🎮 Navigation Immersive
- ✅ 4 écrans interconnectés (Intro → Menu → Vidéo/Contact)
- ✅ Système de "caméra" fluide avec transitions Persona 5
- ✅ Barres animées + flash blanc + texte transitoire
- ✅ Navigation interne sans rechargement de page

### 🎨 Design Distinctive
- ✅ Palette de couleurs Persona 5 (vert néon + rose)
- ✅ Curseur personnalisé qui grandit au survol
- ✅ Typographie impactante (Anton + Space Grotesk)
- ✅ Bruit de texture authentique
- ✅ Animations fluides à 60fps

### 🎬 Sections Principales
1. **Écran Intro** - Titre animé + prompt d'interaction
2. **Menu Principal** - Navigation vers Video Editing et Contact
3. **Video Editing** - Galerie de projets avec onglets (Reels/YouTube)
4. **Contact** - Formulaire + liens sociaux

### 🔧 Code Maintenable
- ✅ HTML séparé du CSS (modularité)
- ✅ Variables CSS pour les couleurs (édition facile)
- ✅ Commentaires détaillés pour les modifications
- ✅ SVG placeholders pour les illustrations
- ✅ Structure de dossiers organisée

---

## 📁 Structure du Projet

```
BUILD V1/
├── 📄 index.html                 # Fichier principal
├── 📁 public/
│   └── styles.css                # Tous les styles
├── 📁 assets/
│   └── svg/
│       ├── figure-main.svg        # Placeholder menu
│       ├── figure-video.svg       # Placeholder vidéo
│       └── figure-contact.svg     # Placeholder contact
└── 📚 Documentation
    ├── README.md                  # Ce fichier
    ├── QUICK_START.md             # Démarrage rapide
    ├── GUIDE_MODIFICATION.md      # Guide complet
    ├── GUIDE_HTML.md              # HTML pour débutants
    ├── PALETTES_COULEURS.md       # Palettes prêtes
    └── ARCHITECTURE.md            # Optimisations avancées
```

---

## 🚀 Démarrage Rapide

### 1️⃣ Ouvrir le Site

```bash
# Simple : double-click sur index.html
# Ou avec serveur local :
python -m http.server 8000
# Puis accédez à http://localhost:8000
```

### 2️⃣ Remplacer les 3 Illustrations (2 min)

Créez le dossier `assets/images/` et ajoutez 3 images PNG:
- `figure-main.png`
- `figure-video.png`
- `figure-contact.png`

Puis remplacez dans `index.html` les 3 balises `<object>` par `<img>` (voir GUIDE_MODIFICATION.md)

### 3️⃣ Changer votre Nom

Remplacez "André Devesa" par votre nom dans 2 endroits:
- Ligne 6 : `<title>`
- Ligne 220 : `.hud-name`

### 4️⃣ Tester! 🎉

```bash
# Ouvrez index.html dans votre navigateur
# Cliquez sur l'écran pour explorer
# Naviguez entre les sections
```

---

## 📝 Documentation

| Document | Description |
|----------|-------------|
| **QUICK_START.md** | 5 minutes pour démarrer ⚡ |
| **GUIDE_MODIFICATION.md** | Guide complet des modifications 📖 |
| **GUIDE_HTML.md** | HTML pour débutants 👶 |
| **PALETTES_COULEURS.md** | 8 palettes prêtes à l'emploi 🎨 |
| **ARCHITECTURE.md** | Optimisations et bonnes pratiques 🔧 |

👉 **Commencez par QUICK_START.md!**

---

## 🎨 Personnalisation

### Changer les Couleurs (30 secondes)

Ouvrez `public/styles.css` et modifiez `:root`:

```css
:root {
  --green: #00FF41;      /* Couleur primaire */
  --magenta: #FF00A8;    /* Couleur d'accent */
  /* ... autres variables ... */
}
```

8 palettes prêtes dans **PALETTES_COULEURS.md**!

### Ajouter vos Projets Vidéo

Section "Video Editing" dans `index.html`:

```html
<div class="reel-item">
  <div class="reel-title">Votre Projet</div>
  <div class="reel-meta">Type · Année</div>
</div>
```

### Configurer Contact/Socials

Ligne ~186 dans `index.html`:

```html
<a href="https://instagram.com/votre_compte" class="social-link">
  Instagram
</a>
```

---

## 🌐 Déploiement

### GitHub Pages (Gratuit)
1. Créez un repo : `votrelogin.github.io`
2. Push vos fichiers
3. Site live à `https://votrelogin.github.io`

### Netlify (Gratuit + simple)
1. Allez sur [netlify.com](https://netlify.com)
2. Drag & drop votre dossier
3. Déploiement instant ✨

### Vercel (Gratuit + rapide)
1. Importez votre repo GitHub
2. Configuration auto
3. Déploiement à chaque push

---

## ✅ Checklist de Lancement

- [ ] Illustrations remplacées
- [ ] Nom et infos personnalisés
- [ ] Couleurs ajustées
- [ ] Projets vidéo listés
- [ ] Liens sociaux configurés
- [ ] Testé sur mobile
- [ ] Testé sur desktop
- [ ] Performance vérifiée
- [ ] Prêt à déployer!

---

## 🎮 Navigation

### Clavier
- `Clic` - Naviguer / Activer
- `Survol` - Voir les animations

### Souris
- Curseur personnalisé (vert)
- Devient magenta au survol des éléments
- Lisse et fluide

---

## 🔍 Caractéristiques Techniques

| Aspect | Détails |
|--------|---------|
| **Framework** | Vanilla JS (aucune dépendance) |
| **CSS** | Pur CSS3, variables CSS, animations |
| **Images** | SVG + PNG/JPG support |
| **Polices** | Google Fonts (Anton, Space Grotesk) |
| **Responsive** | Desktop, tablet, mobile |
| **Performance** | ~100KB total, pas de CMS |
| **Browser** | Chrome, Firefox, Safari, Edge (moderne) |

---

## 📊 Performance

- ⚡ **Time to First Paint**: < 1s
- 🎬 **Animations**: 60fps
- 📱 **Mobile**: Optimisé
- ♿ **Accessibilité**: Basique

---

## 🐛 Troubleshooting

| Problème | Solution |
|----------|----------|
| SVG ne s'affiche pas | Créer les fichiers dans `assets/svg/` |
| Images ne s'affichent pas | Vérifier chemin et format |
| Transitions sautent | Vider cache (Ctrl+Shift+R) |
| Curseur ne fonctionne pas | JavaScript doit être activé |
| Formulaire ne fonctionne pas | C'est normal, interface uniquement (pas de backend) |

---

## 💡 Tips & Tricks

### Déboguer rapidement
```javascript
// Console du navigateur (F12)
// Changer les couleurs en temps réel :
document.documentElement.style.setProperty('--green', '#FF1493')
```

### Exporter une palette
```javascript
// Copier vos couleurs actuelles
const root = window.getComputedStyle(document.documentElement);
console.log(root.getPropertyValue('--green'))
```

### Tester sur mobile local
```bash
python -m http.server 8000
# Accédez via : http://<IP_LOCAL>:8000 (sur votre phone)
```

---

## 🤝 Contribution

Amélioration suggérées?
- Ajouter des animations
- Améliorer l'accessibilité
- Supporter plus de langues
- Ajouter un backend pour le formulaire

---

## 📄 License

MIT License - Libre d'utilisation et de modification

---

## 📞 Support

Pour les questions:
1. Consulter **QUICK_START.md** (démarrage)
2. Consulter **GUIDE_MODIFICATION.md** (édition)
3. Consulter **GUIDE_HTML.md** (HTML)
4. Consulter **ARCHITECTURE.md** (avancé)

---

## 🎬 Galerie

*Vous allez ajouter vos images ici!*

- Écran intro avec titre animé ✨
- Menu de navigation fluide 🎮
- Galerie de projets vidéo 🎞️
- Formulaire de contact 📧
- Transitions Persona 5 style 🔄

---

## 📊 Statistiques

- ⏱️ **Temps de mise en place**: ~10 minutes
- 🎨 **Couleurs personnalisables**: ∞
- 🖼️ **Emplacements illustrations**: 3
- 🎬 **Projets vidéo listables**: ∞
- 📱 **Points de rupture responsive**: 3

---

## 🚀 Prochaines Étapes

**Phase 1 (Immédiate):**
- [ ] Ajouter vos illustrations
- [ ] Personnaliser le contenu
- [ ] Tester localement

**Phase 2 (Court terme):**
- [ ] Déployer le site
- [ ] Partager sur les réseaux
- [ ] Collecter les retours

**Phase 3 (Futur):**
- [ ] Ajouter un backend pour le formulaire
- [ ] Intégrer YouTube/Vimeo
- [ ] Analytics
- [ ] Blog/Articles

---

## 🎯 Crédits

- **Design** : Inspiré par Persona 5
- **Fonts** : Google Fonts (Anton, Space Grotesk)
- **Code** : Vanilla JavaScript, CSS3 pures

---

<div align="center">

**Bon montage et bienvenue dans votre nouveau portfolio! 🎬✨**

[QUICK_START.md](QUICK_START.md) • [GUIDE_MODIFICATION.md](GUIDE_MODIFICATION.md) • [PALETTES_COULEURS.md](PALETTES_COULEURS.md)

Made with 💚 for video creators

</div>
