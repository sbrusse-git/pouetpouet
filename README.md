# Pouet Pouet

Site one-page Next.js pour la remorque foodtruck barbecue `Pouet Pouet`.

## Développement

```bash
npm install
npm run dev
```

## Assets

Les sources visuelles sont stockées dans `assets/source/`.

```bash
npm run process:logo
npm run generate:images
```

`generate:images` lit `FAL_KEY` depuis `.env` et génère les visuels dans `public/images/`.

## Contact

Le formulaire prépare actuellement un email à `bonjour@pouetpouet.be`.
Si une autre adresse doit être utilisée, mettre à jour `components/ContactForm.tsx`.
