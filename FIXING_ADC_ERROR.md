# Guide: Fixing the Genkit Access Token Error in App Hosting

This guide provides the exact steps to resolve the "could not refresh access token" error when using Genkit with Firebase App Hosting. The root cause is that the default service account used by App Hosting does not have the necessary permissions to access Google's AI services.

---

### Step 1: Identify Your App Hosting Service Account

Every Firebase App Hosting backend has a unique service account associated with it. We need to find its email address.

1.  **Open the Google Cloud Console:**
    *   Navigate to [https://console.cloud.google.com/](https://console.cloud.google.com/).
    *   Ensure you have selected the correct Google Cloud project that corresponds to your Firebase project.

2.  **Go to the IAM Page:**
    *   In the navigation menu (☰), go to **IAM & Admin** > **IAM**.

3.  **Find the App Hosting Service Account:**
    *   In the list of principals, look for a service account with an email address that follows this pattern:
        `service-[PROJECT_NUMBER]@gcp-sa-firebaseapphost.iam.gserviceaccount.com`
    *   `[PROJECT_NUMBER]` is your project's unique number.
    *   **Copy this full email address.** This is the identity of your App Hosting backend.

---

### Step 2: Grant the Required IAM Role

Now, you will grant this service account the permissions it needs to call the AI models.

1.  **Stay on the IAM Page.**
2.  Click the **+ GRANT ACCESS** button at the top of the page.
3.  In the **New principals** field, paste the service account email address you copied in the previous step.
4.  In the **Assign roles** field, search for and select the following role:
    *   `Vertex AI User`
5.  Click **Save**.

This role grants the necessary `aiplatform.endpoints.predict` permission that Genkit needs to execute prompts against the Gemini models.

---

### Step 3: Redeploy Your App Hosting Backend

For the new IAM permissions to take effect, you need to redeploy your backend.

1.  Open your terminal in the root of your project directory.
2.  Run the following Firebase CLI command:

    ```bash
    firebase apphosting:backends:deploy [BACKEND_ID] --region [REGION]
    ```

    *   Replace `[BACKEND_ID]` with the ID of your App Hosting backend (you can find this in your `firebase.json` or by running `firebase apphosting:backends:list`).
    *   Replace `[REGION]` with the region your backend is deployed in (e.g., `us-central1`).

    Alternatively, if you are deploying via a connected GitHub repository, simply push a new commit to your repository to trigger a new build and deployment. The new deployment will automatically pick up the updated service account permissions.

---

### Step 4: Test and Verify the Fix

After the deployment is complete (which may take a few minutes), the error should be resolved.

1.  Navigate to your application's deployed URL.
2.  Go to an IPO details page.
3.  Click the **"Run New Prediction"** button.

The button should now work as expected. The AI analysis will run on the server, and the results will be saved to Firestore, with the UI updating in real-time. You can verify the successful execution by checking the logs for your App Hosting backend in the Google Cloud Console under **Logging > Log Explorer**.
