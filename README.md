# COLAW — Landing page

Site statique (HTML/CSS/JS, zéro build, zéro dépendance) à la DA COLAW
(crème/chocolat, serif éditorial, inspiration « Claude »), optimisé SEO +
conversion. Thème clair + sombre (parité avec l'app COLAW desktop).

## Structure

```
index.html            Page unique — hero, souveraineté, fonctions, étapes,
                      téléchargement (Win/Mac), tarifs (toggle engagement/flex),
                      FAQ, CTA, footer + JSON-LD (Organization / SoftwareApplication+Offers / FAQPage).
assets/styles.css     DA COLAW en variables CSS, theme-aware (clair/sombre).
assets/main.js        Thème, détection OS + liens de téléchargement, toggle tarifs,
                      révélation au scroll, année footer. Défensif, sans dépendance.
assets/brand-mark.svg Logo « Sceau C + Balance » (source de vérité : legal-ai-saas).
assets/og-image.svg   Carte de partage social 1200×630 brandée.
robots.txt            Indexation + accès crawlers IA (GPTBot/PerplexityBot/ClaudeBot…).
sitemap.xml           Plan du site.
site.webmanifest      Manifeste PWA (nom, couleurs, icône).
```

## ⚠️ À REMPLIR AVANT MISE EN LIGNE (Kevin)

1. **URLs des installeurs** — `assets/main.js`, objet `DOWNLOADS` :
   ```js
   var DOWNLOADS = { mac: "…/COLAW.dmg", win: "…/COLAW-Setup.exe" };
   ```
   Tant qu'elles valent `"#"`, le clic affiche « bientôt disponible » sans erreur.
   (Cf. tâche desktop signing macOS/Windows déjà préparée côté legal-ai-saas.)

2. **Domaine** — remplacer `https://colaw.fr/` partout (balises `canonical`,
   `og:url`, JSON-LD, `sitemap.xml`, `robots.txt`) si le domaine final diffère.

3. **E-mail de contact** — `index.html` footer : `contact@colaw.fr`.

4. **(Optionnel) OG en PNG** — certains scrapers rendent mal le SVG.
   Pour une compat maximale, exporter `og-image.svg` → `og-image.png` (1200×630)
   et repointer les 2 balises `og:image` / `twitter:image`.

5. **Avis clients** — volontairement ABSENTS (aucun pour l'instant, comme demandé).
   Ajouter une section témoignages + JSON-LD `Review`/`AggregateRating` quand tu en auras.

## Prévisualiser en local

```bash
cd ~/colaw-site && python3 -m http.server 4173
# → http://localhost:4173
```

## Déploiement

Site 100 % statique → hébergeable partout. Options :

- **GitHub Pages** — pousser le dossier sur une branche `gh-pages` (gratuit, CDN).
- **Railway** (cohérent avec le reste de l'infra COLAW) — servir le dossier via
  un static server. ⚠️ Rappel : **Vercel Hobby bloque les déploiements commerciaux**
  (`readyState: BLOCKED`), même pour une landing rattachée à un produit payant —
  éviter, ou passer sur un plan payant.

Tarifs affichés (source Stripe LIVE du cockpit) : Premium 350 €/450 €,
Illimité 500 €/600 €, essai 30 j. Modifier dans `index.html` (attributs
`data-engage` / `data-flex`) si les prix évoluent.
