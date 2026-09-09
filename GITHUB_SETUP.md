# Publish TurfBook to GitHub

This project was provided as a ZIP file, so it did not contain the original `.git` repository or a GitHub `origin` remote. A new local Git repository has now been initialized on the `main` branch.

## Publish once

1. In GitHub, create a **new empty repository** called `turfbook`. Do not add a README, `.gitignore`, or license there.
2. Copy its HTTPS URL, for example `https://github.com/YOUR-USERNAME/turfbook.git`.
3. From the project folder run:

   ```powershell
   git add .
   git commit -m "Build TurfBook full-stack application"
   git remote add origin https://github.com/YOUR-USERNAME/turfbook.git
   git push -u origin main
   ```

GitHub may open a browser window for sign-in. Approve it to complete the push.

## Later updates

```powershell
git add .
git commit -m "Describe your change"
git push
```

The `.env`, backend build output, Node dependencies, and local Maven tool folder are ignored, so passwords and generated files are not uploaded.
