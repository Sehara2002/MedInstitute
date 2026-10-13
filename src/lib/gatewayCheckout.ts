// Commercial Bank (MPGS) hosted checkout in the browser. The LMS backend creates
// the session and says where the gateway's checkout.js lives; this loads it once
// and hands over to the bank's payment page.

declare global {
  interface Window {
    Checkout?: {
      configure: (config: { session: { id: string }; version?: string }) => void;
      showPaymentPage: () => void;
    };
  }
}

const loadedScripts = new Map<string, Promise<void>>();

function loadScript(src: string): Promise<void> {
  const existing = loadedScripts.get(src);
  if (existing) return existing;
  const promise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      loadedScripts.delete(src);
      reject(new Error("Could not load the payment page. Please check your connection and try again."));
    };
    document.head.appendChild(script);
  });
  loadedScripts.set(src, promise);
  return promise;
}

export async function showGatewayPaymentPage(checkoutScriptUrl: string, sessionId: string): Promise<void> {
  await loadScript(checkoutScriptUrl);
  if (!window.Checkout) throw new Error("The payment page could not be started. Please try again.");
  window.Checkout.configure({ session: { id: sessionId }, version: "100" });
  window.Checkout.showPaymentPage();
}
