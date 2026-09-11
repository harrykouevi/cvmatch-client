import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { API_URL, NotFoundPage } from "../components/Routes";

import {
  SoftGlow,
  COLORS,
  Container,
  Card,
  Button,
  StatusIcon,
  CreditSummary,
  InfoStep,
  PrimaryButton,
  PrimaryLink,
  SecondaryButton,
  Icon,
} from "./Ui";
import { trackMeta } from "../context/AuthContext";

const SUPPORT_EMAIL = "assistance@cvmatchai.us";
const API_BASE = `${API_URL}/v1`;
const GOOGLE_ADS_PURCHASE_CONVERSION = "AW-18241901593/Al_LCI3C078cEJmotfpD";

const getPricingConfig = (payload) => payload?.meta?.pricing_config || payload?.pricing_config || null;

const formatCurrencyValue = (value) => {
  const amount = Number(value);
  return Number.isFinite(amount) ? `$${amount.toFixed(2)}` : null;
};

const getPlanPricingDisplay = (plan, pricingConfig) => {
  const regularPrice = plan?.price || formatCurrencyValue(pricingConfig?.base_single_price);
  const isSingleUnlock = Number(plan?.credits) === 1;
  const promoPrice = pricingConfig?.promo_enabled && isSingleUnlock
    ? formatCurrencyValue(pricingConfig?.promo_price)
    : null;

  return {
    price: promoPrice || regularPrice,
    regularPrice,
    promoEnabled: Boolean(promoPrice),
    promoLabel: pricingConfig?.promo_label,
    expiredMessage: pricingConfig?.promo_expired ? pricingConfig?.promo_expired_message : null,
  };
};

const getStoredItem = (key) => (
  typeof window !== "undefined" ? window.localStorage.getItem(key) : null
);

const buildAuthHeaders = (json = false) => {
  const token = getStoredItem("token");
  const guestToken = getStoredItem("guest_token");
  const headers = { Accept: "application/json" };

  if (json) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  } else if (guestToken) {
    headers["X-Guest-Token"] = guestToken;
  }

  return headers;
};

const parseSelectedPlan = () => {
  const stored = getStoredItem("selected_plan");
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

const isVerifiedPayment = (payload) => {
  const status = String(payload?.status || payload?.payment_status || payload?.paymentStatus || "").toLowerCase();
  return (
    payload?.verified === true ||
    payload?.paid === true ||
    ["paid", "complete", "completed", "succeeded"].includes(status)
  );
};

const buildPurchaseSummary = (verification) => {
  const stored = parseSelectedPlan();
  return {
    plan: verification?.plan_name || verification?.plan?.name || stored?.name,
    price: verification?.price || verification?.amount_display || stored?.price,
    creditsAdded: verification?.credits_added || verification?.credits || stored?.credits,
  };
};

const sendGoogleAdsPurchaseConversion = (verification, sessionId) => {
  if (typeof window === "undefined" || !window.gtag) return;

  const transactionId = verification?.payment_id || verification?.transaction_id || sessionId;
  if (!transactionId) return;

  const storageKey = `google_ads_purchase_conversion_sent_${transactionId}`;
  if (window.sessionStorage.getItem(storageKey)) return;

  let convValue = 5.0;
  const verifiedAmount = Number(verification?.value || verification?.amount || verification?.amount_total);
  if (Number.isFinite(verifiedAmount) && verifiedAmount > 0) {
    convValue = verifiedAmount > 100 ? verifiedAmount / 100 : verifiedAmount;
  }

  window.gtag("event", "conversion", {
    send_to: GOOGLE_ADS_PURCHASE_CONVERSION,
    value: convValue,
    currency: "USD",
    transaction_id: transactionId,
  });
  window.sessionStorage.setItem(storageKey, "1");
};

const LaravelAPI = {
  async createStripeSession(productId) {
    const formData = new FormData();
    formData.append("product_id", productId);

    const res = await fetch(`${API_BASE}/payments/stripe/session`, {
      method: "POST",
      headers: buildAuthHeaders(),
      body: formData,
      credentials: "include",
    });

    if (res.status === 401) {
      const error = new Error("Payment authentication required");
      error.status = 401;
      throw error;
    }
    if (!res.ok) {
      throw new Error("Unable to create Stripe session");
    }

    return res.json();
  },

  async verifyStripeSession(sessionId) {
    const res = await fetch(`${API_BASE}/payments/stripe/session/verify`, {
      method: "POST",
      headers: buildAuthHeaders(true),
      credentials: "include",
      body: JSON.stringify({ session_id: sessionId }),
    });

    if (res.status === 401) {
      const error = new Error("Payment verification requires authentication");
      error.status = 401;
      throw error;
    }
    if (!res.ok) {
      throw new Error("Payment verification failed");
    }

    const data = await res.json();
    const payload = data?.data || data;
    if (!isVerifiedPayment(payload)) {
      throw new Error("Payment is not verified");
    }

    return payload;
  },
};

export function PaymentSuccess() {
  const [purchase, setPurchase] = useState(null);
  const [verifyState, setVerifyState] = useState("verifying");
  const [message, setMessage] = useState("We are verifying your payment with the server.");

  useEffect(() => {
    const run = async () => {
      const params = new URLSearchParams(window.location.search);
      const sessionId = params.get("session_id");

      trackMeta("redirectFromPaymentPage", { method: "google", location: "site_CVMatchApp" }, true);

      if (!sessionId) {
        setVerifyState("failed");
        setMessage("Missing Stripe session id. We cannot verify this payment from the browser.");
        return;
      }

      try {
        const verification = await LaravelAPI.verifyStripeSession(sessionId);
        setPurchase(buildPurchaseSummary(verification));
        setVerifyState("verified");
        setMessage("Your payment was verified and your account update is being confirmed.");
        trackMeta("purchase_completed", { location: "payment_success", status: "completed" }, true);
        sendGoogleAdsPurchaseConversion(verification, sessionId);
      } catch (error) {
        setVerifyState(error.status === 401 ? "unauthorized" : "failed");
        setMessage(
          error.status === 401
            ? "We could not verify this payment because your session is not authenticated."
            : "We could not verify this payment yet. Your purchase may still be processing."
        );
      }
    };

    run();
  }, []);

  const verified = verifyState === "verified";
  const verifying = verifyState === "verifying";

  return (
    <div className="relative min-h-[calc(100vh-88px)] overflow-hidden bg-[#F8F7F3] px-4 py-16 flex items-center justify-center">
      <SoftGlow type={verified ? "success" : "cancel"} />

      <div className="relative w-full max-w-4xl overflow-hidden rounded-[2.4rem] bg-white/90 shadow-2xl shadow-slate-950/10 border border-white backdrop-blur-xl">
        <div
          className="relative overflow-hidden px-8 py-12 text-center text-white"
          style={{ background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.navy2} 52%, #064E5F)` }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,.28),transparent_42%)]" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent" />

          <div className="relative">
            <StatusIcon type={verified ? "success" : "cancel"} />

            <div className={`mx-auto mt-7 inline-flex rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[.18em] ${
              verified
                ? "border-emerald-300/20 bg-emerald-400/10 text-emerald-200"
                : "border-orange-300/20 bg-orange-400/10 text-orange-200"
            }`}>
              {verified ? "Payment verified" : verifying ? "Verifying payment" : "Verification needed"}
            </div>

            <h1 className="mt-5 text-4xl md:text-6xl font-black tracking-tight">
              {verified ? "Payment Successful" : verifying ? "Verifying Payment" : "Payment Not Verified"}
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-white/65 text-lg leading-8">
              {message}
            </p>
          </div>
        </div>

        <div className="px-7 py-10 md:px-10 text-center">
          {verified ? (
            <>
              <div className="mx-auto max-w-xl">
                <p className="text-xl font-black text-slate-900">
                  Thank you for your purchase.
                </p>

                <p className="mt-3 leading-7 text-slate-500">
                  Your payment was verified by the server. Your credits will appear in your account as soon as the purchase confirmation process is completed.
                </p>
              </div>

              {purchase && <CreditSummary purchase={purchase} />}

              <div className="mt-8 grid gap-4">
                <InfoStep
                  number="1"
                  color="green"
                  title="Purchase verification"
                  text="Your payment was verified with the server."
                />

                <InfoStep
                  number="2"
                  title="Credits added to your account"
                  text="Once account confirmation is complete, your credits will be available immediately."
                />
              </div>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <PrimaryButton onClick={() => { localStorage.setItem("changemode", "dashboard"); window.location.replace("/"); }}>Go to Dashboard</PrimaryButton>
                <SecondaryButton onClick={() => { localStorage.setItem("changemode", "app"); trackMeta("getFreeScore", { method: "google", location: "site_header_or_landing" }, true); window.location.replace("/"); }}>Optimize Resume</SecondaryButton>
              </div>
            </>
          ) : (
            <>
              <div className="mx-auto max-w-xl">
                <p className="text-xl font-black text-slate-900">
                  We cannot confirm this payment yet.
                </p>

                <p className="mt-3 leading-7 text-slate-500">
                  No purchase event has been recorded from this page. If you completed payment, please wait a moment, return to your dashboard, or contact support.
                </p>
              </div>

              <div className="mt-8 rounded-3xl border border-orange-100 bg-orange-50 p-6 text-left">
                <p className="font-black text-orange-900">Verification status</p>
                <p className="mt-2 text-sm leading-6 text-orange-800">{message}</p>
              </div>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <PrimaryLink href="/#pricing" tone="dark">Return to Pricing</PrimaryLink>
                <SecondaryButton onClick={() => { localStorage.setItem("changemode", "dashboard"); window.location.replace("/"); }}>Go to Dashboard</SecondaryButton>
              </div>
            </>
          )}

          <SupportBox muted={!verified} />
        </div>
      </div>
    </div>
  );
}

export function PaymentCancel() {
  return (
    <div className="relative min-h-[calc(100vh-88px)] overflow-hidden bg-[#F8F7F3] px-4 py-16 flex items-center justify-center">
      <SoftGlow type="cancel" />

      <div className="relative w-full max-w-3xl overflow-hidden rounded-[2.4rem] bg-white/90 shadow-2xl shadow-slate-950/10 border border-white backdrop-blur-xl">
        <div
          className="relative overflow-hidden px-8 py-12 text-center text-white"
          style={{ background: `linear-gradient(135deg, ${COLORS.navy}, #1F2937 55%, #7C2D12)` }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,.25),transparent_42%)]" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-orange-300/50 to-transparent" />

          <div className="relative">
            <StatusIcon type="cancel" />

            <div className="mx-auto mt-7 inline-flex rounded-full border border-orange-300/20 bg-orange-400/10 px-4 py-2 text-xs font-black uppercase tracking-[.18em] text-orange-200">
              Checkout not completed
            </div>

            <h1 className="mt-5 text-4xl md:text-6xl font-black tracking-tight">
              Payment Cancelled
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-white/65 text-lg leading-8">
              Your payment was not completed and no credits were added to your account.
            </p>
          </div>
        </div>

        <div className="px-7 py-10 md:px-10 text-center">
          <div className="mx-auto max-w-xl">
            <p className="text-xl font-black text-slate-900">
              You have not been charged.
            </p>

            <p className="mt-3 leading-7 text-slate-500">
              You can return to pricing and choose a credit pack whenever you are ready.
              Your resume analysis progress may remain available if you are still logged in.
            </p>
          </div>

          <div className="mt-8 rounded-3xl border border-orange-100 bg-orange-50 p-6 text-left">
            <p className="font-black text-orange-900">What happened?</p>

            <p className="mt-2 text-sm leading-6 text-orange-800">
              The checkout was closed or cancelled before payment confirmation.
              You can safely try again or continue reviewing your free analysis.
            </p>
          </div>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <PrimaryLink href="/#pricing" tone="dark">Return to Pricing</PrimaryLink>
            <SecondaryButton onClick={() => { localStorage.setItem("changemode", "app"); trackMeta("getFreeScore", { method: "google", location: "site_header_or_landing" }, true); window.location.replace("/"); }}>Continue Analysis</SecondaryButton>
          </div>

          <SupportBox muted />
        </div>
      </div>
    </div>
  );
}

export function CheckoutPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const parsed = parseSelectedPlan();
    if (parsed) setProduct(parsed);
  }, []);

  const pay = async () => {
    setLoading(true);
    try {
      const response = await LaravelAPI.createStripeSession(id || product?.id);
      if (response?.data?.url) {
        window.location.href = response.data.url;
        return;
      }
      throw new Error("Stripe checkout URL missing");
    } catch {
      console.error("Unable to start Stripe checkout.");
      setLoading(false);
    }
  };

  if (!product) return <Container>Loading...</Container>;

  return (
    <Container>
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h1 className="text-xl font-bold mb-2">Order Summary</h1>
          <p className="text-gray-600">Product: {product.name}</p>
          <p className="mt-2 font-semibold">{product.price}</p>
          <p className="text-sm mt-2">{product.credits} credits</p>
        </Card>

        <Card>
          <h1 className="font-bold mb-4">Payment (Laravel to Stripe API)</h1>

          <Button onClick={pay} disabled={loading}>
            {loading ? "Redirecting to Stripe..." : "Pay now"}
          </Button>
        </Card>
      </div>
    </Container>
  );
}

export function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [pricingConfig, setPricingConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/credit-plans/${id}`, {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("API error");
        }

        const data = await res.json();
        const plan = data?.data?.custom_ui;
        const config = getPricingConfig(data);

        if (!plan) {
          throw new Error("Invalid product format");
        }

        const productData = {
          id: plan.id,
          name: plan.name,
          price: plan.price,
          credits: data.data.credits,
        };
        const pricingDisplay = getPlanPricingDisplay(productData, config);

        setProduct(productData);
        setPricingConfig(config);

        localStorage.setItem("selected_plan", JSON.stringify({
          id: productData.id,
          name: productData.name,
          price: pricingDisplay.price,
          credits: productData.credits,
        }));
      } catch {
        setPricingConfig(null);
        console.error("Error loading pricing plans.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [id]);

  const pay = async (productId) => {
    trackMeta("checkout_started", { location: "payment", status: "started", plan_id: productId }, true);
    setLoading(true);
    try {
      const response = await LaravelAPI.createStripeSession(productId);
      if (response?.data?.url) {
        window.location.href = response.data.url;
        return;
      }
      throw new Error("Stripe checkout URL missing");
    } catch {
      console.error("Unable to start Stripe checkout.");
      setLoading(false);
    }
  };

  if (loading) return <Container><div className="max-w-2xl mx-auto py-20 text-center min-h-[68vh] flex flex-col justify-center px-4"><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="h-24 w-24 rounded-[2rem] bg-cyan-50 text-cyan-600 flex items-center justify-center mx-auto shadow-xl"><Icon name="sparkles" size={40} /></motion.div><h2 className="text-4xl md:text-5xl font-black mt-8">Opening Payment Page...</h2><p className="text-slate-600 mt-3">Your secure payment form will be available in a few moments.</p><div className="mt-8"></div><div className="grid grid-cols-4 gap-3 mt-6 text-xs text-slate-500"></div></div></Container>;

  if (!product) return (
    <NotFoundPage />
  );

  const pricingDisplay = getPlanPricingDisplay(product, pricingConfig);

  return (
    <Container>
      <div className="grid md:grid-cols gap-6">
        <Card>
          <h1 className="text-xl font-bold mb-4">Payment Details</h1>
          <p className="text-gray-600">Product: {product.name}</p>
          <p className="mt-2 font-semibold">Price: {pricingDisplay.price}</p>
          {pricingDisplay.promoEnabled && <p className="mt-1 text-sm font-bold text-cyan-600">{pricingDisplay.promoLabel}</p>}
          {pricingDisplay.promoEnabled && <p className="mt-1 text-sm text-slate-500">Regular price: {pricingDisplay.regularPrice}</p>}
          {pricingDisplay.expiredMessage && <p className="mt-1 text-sm text-slate-500">{pricingDisplay.expiredMessage}</p>}
          <p className="text-sm mt-2 mb-4">{product.credits} credits</p>
          <Button onClick={async () => { pay(product.id); }} disabled={loading}>
            {loading ? "Redirecting to Stripe..." : "Pay now"}
          </Button>
        </Card>
      </div>
    </Container>
  );
}

export function SupportBox({ muted = false }) {
  return (
    <div
      className={`mx-auto mt-8 max-w-lg rounded-3xl px-5 py-4 text-sm text-slate-600 ${
        muted
          ? "border border-slate-200 bg-slate-50"
          : "border border-cyan-100 bg-cyan-50/70"
      }`}
    >
      Need help? Contact{" "}
      <a href={`mailto:${SUPPORT_EMAIL}`} className="font-black text-cyan-700">
        {SUPPORT_EMAIL}
      </a>
    </div>
  );
}
