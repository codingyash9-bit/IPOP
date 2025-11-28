# Production Deployment Guide: Automated IPO Data Sync

This guide provides a step-by-step process for deploying the IPO data synchronization logic as a scheduled Firebase Cloud Function. This will automate the process of fetching new IPO data, analyzing it with AI, and updating your Firestore database.

---

### Prerequisites

- You have a Firebase project created.
- You have Node.js installed on your machine (v18 or later is recommended).

---

### Step 1: Upgrade to the Blaze Plan

Scheduled functions require your project to be on the "Blaze" (pay-as-you-go) billing plan. The free tier is generous, so you are unlikely to incur costs for a small-scale app.

1.  Navigate to the [Firebase Console](https://console.firebase.google.com/).
2.  Select your project.
3.  In the bottom-left corner of the sidebar, click on **"Upgrade"**.
4.  Follow the on-screen instructions to select the Blaze plan and link a billing account.

---

### Step 2: Install Firebase Tools

The Firebase CLI (Command Line Interface) is used to manage and deploy your Firebase projects. If you don't have it installed, open your terminal and run:

```bash
npm install -g firebase-tools
```

After installation, log in to your Firebase account:

```bash
firebase login
```

---

### Step 3: Initialize Cloud Functions in Your Project

In your project's root directory (the same level as `package.json`), run the following command to set up a dedicated `functions` folder for your backend code:

```bash
firebase init functions
```

You will be asked a series of questions. Use these answers:

- **What language would you like to use to write Cloud Functions?**
  - `TypeScript`
- **Do you want to use ESLint to catch probable bugs and enforce style?**
  - `Yes`
- **Do you want to install dependencies with npm now?**
  - `Yes`

This will create a new `functions` directory with its own `package.json` and `tsconfig.json`.

---

### Step 4: Copy Backend Logic into the `functions` Directory

Now, you need to move the server-side logic we've created from your Next.js app into the new `functions` directory.

1.  **Delete Placeholder Files:** Inside the new `functions/src` directory, delete the default `index.ts` file.
2.  **Copy Your Logic:**
    - Copy `src/functions/index.ts` from your Next.js project to `functions/src/index.ts`.
    - Copy `src/functions/updateIpoDataLogic.ts` to `functions/src/updateIpoDataLogic.ts`.
    - Copy `src/functions/thirdPartyApi.ts` to `functions/src/thirdPartyApi.ts`.
3.  **Copy AI Flows:** Your backend logic depends on the AI flows.
    - Copy the entire `src/ai` directory from your Next.js project into `functions/src/ai`.
4.  **Install Dependencies:** Your `functions` directory has its own dependencies.
    - Open `functions/package.json`.
    - Add the necessary dependencies from your main `package.json`, such as `genkit`, `@genkit-ai/google-genai`, `zod`, and `firebase-admin`. Your `functions/package.json` dependencies should look something like this:
      ```json
      "dependencies": {
        "@genkit-ai/google-genai": "^1.20.0",
        "firebase-admin": "^12.3.0",
        "firebase-functions": "^5.0.1",
        "genkit": "^1.20.0",
        "zod": "^3.24.2"
      },
      ```
    - In your terminal, navigate into the `functions` directory (`cd functions`) and run `npm install`.

---

### Step 5: Deploy the Scheduled Function

The code in `functions/src/index.ts` is already configured to run on a schedule. All you need to do is deploy it.

Navigate back to your project's root directory (`cd ..`) and run:

```bash
firebase deploy --only functions
```

The CLI will compile your TypeScript code, upload it to Google Cloud, and automatically configure **Cloud Scheduler** and **Pub/Sub** to trigger the `scheduledFetchIPOs` function every 6 hours.

---

### Step 6: Verify Logs in the Firebase Console

You can confirm that your function deployed correctly and see its logs.

1.  Go to the **Firebase Console**.
2.  Navigate to the **Build** > **Functions** section.
3.  You should see `scheduledFetchIPOs` in the list of functions.
4.  Click on the **Logs** tab to view console output from your function runs.

---

### Step 7: Manually Test the Scheduler (Optional)

You don't have to wait 6 hours to see if it works. You can manually trigger the function from the Google Cloud Console.

1.  In the **Firebase Console**, go to the **Functions** dashboard.
2.  Find `scheduledFetchIPOs` in the list and click the three-dot menu on the right.
3.  Select **"View in Google Cloud Scheduler"**.
4.  In the Cloud Scheduler dashboard, find your job (it will have a name like `firebase-schedule-scheduledFetchIPOs...`).
5.  Click **"Run Now"**.
6.  Go back to the Firebase Functions logs tab to monitor the execution in real-time. You should see the logs you added, confirming that new IPOs are being fetched and analyzed.
