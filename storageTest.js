import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Alert } from "react-native";
import {
  storage,
  signInAnonymouslyRN,
  getAuthInstance,
  storageBucketName,
} from "./firebase"; // firebase.js is in the same folder as this file

export async function runStorageSmokeTest() {
  try {
    // Ensure we're authenticated (many Storage rules require auth)
    try {
      const auth = await getAuthInstance();
      if (!auth.currentUser) {
        await signInAnonymouslyRN();
      }
    } catch (authErr) {
      // Continue anyway; rules might allow unauthenticated in dev
    }

    const path = `smoke-tests/${Date.now()}.txt`;
    const fileRef = ref(storage, path);
    // Create a Blob from a string using the Response API (works well in RN/Expo)
    const blob = await new Response("hello from emulator").blob();

    // First try SDK upload
    try {
      await uploadBytes(fileRef, blob, { contentType: "text/plain" });
    } catch (sdkErr) {
      // Fallback: REST upload (works when SDK networking/polyfills misbehave)
      const auth = await getAuthInstance();
      const idToken = await auth.currentUser?.getIdToken?.();
      const url = `https://firebasestorage.googleapis.com/v0/b/${storageBucketName}/o?uploadType=media&name=${encodeURIComponent(path)}`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
          ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
        },
        body: "hello from emulator",
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(
          `REST upload failed: ${res.status} ${res.statusText} ${text}`,
        );
      }
    }

    // Verify we can get a download URL
    await getDownloadURL(fileRef);

    console.log("✅ SMOKE OK — Firebase Storage upload succeeded");
    Alert.alert("Storage smoke test", "✅ Upload succeeded");
  } catch (e) {
    console.log("❌ SMOKE FAIL");
    const code = e?.code || "unknown";
    const server = e?.customData?.serverResponse || e?.serverResponse || "";
    console.log("code:", code);
    console.log("message:", e?.message);
    console.log("serverResponse:", server);
    Alert.alert(
      "Storage smoke test failed",
      `Code: ${code}\nMessage: ${e?.message || e}\nServer: ${server}`.trim(),
    );
  }
}
