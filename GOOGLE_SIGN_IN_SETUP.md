# Enable real Google sign-in

The customer login page already contains the real Google Identity Services button. To activate it, create one Google OAuth **Web application** client and place its Client ID in the two environment files.

1. In [Google Cloud Console](https://console.cloud.google.com/apis/credentials), create or select a project, configure the OAuth consent screen, then create an **OAuth client ID** for a **Web application**.
2. Add these Authorized JavaScript origins for local testing:
   - `http://localhost:8080`
   - `http://localhost:8081`
3. Copy the Client ID ending in `.apps.googleusercontent.com`. Create `backend/.env` by copying `backend/.env.example`, then update the following lines:

   ```text
   .env: VITE_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID
   backend/.env: GOOGLE_CLIENT_ID=YOUR_CLIENT_ID
   ```

4. Restart the frontend and run `backend/start-local.ps1` once. Clicking **Continue with Google** then opens Google's account chooser and signs the customer into TurfBook.

The administrator account never uses Google sign-in. It remains available only through `/admin/login`.
