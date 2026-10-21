import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import AuthShell, { Field, inputClass } from "@/components/AuthShell";
import Button from "@/components/Button";
import { useApp } from "@/store/AppStore";
import { authApi } from "@/lib/api";
import GoogleSignInButton from "@/components/GoogleSignInButton";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim();

function GoogleIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5"><path fill="#4285F4" d="M21.35 12.23c0-.71-.06-1.4-.18-2.05H12v3.88h5.24a4.48 4.48 0 0 1-1.94 2.94v2.52h3.15c1.84-1.69 2.9-4.18 2.9-7.29Z"/><path fill="#34A853" d="M12 21.75c2.63 0 4.84-.87 6.45-2.23L15.3 17c-.87.59-1.98.94-3.3.94-2.53 0-4.67-1.71-5.44-4H3.3v2.6A9.75 9.75 0 0 0 12 21.75Z"/><path fill="#FBBC05" d="M6.56 13.94A5.85 5.85 0 0 1 6.25 12c0-.67.12-1.31.31-1.94v-2.6H3.3A9.75 9.75 0 0 0 2.25 12c0 1.58.38 3.08 1.05 4.54l3.26-2.6Z"/><path fill="#EA4335" d="M12 6.06c1.43 0 2.71.49 3.72 1.45l2.8-2.8C16.83 3.13 14.63 2.25 12 2.25a9.75 9.75 0 0 0-8.7 5.21l3.26 2.6c.77-2.29 2.91-4 5.44-4Z"/></svg>;
}

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — TurfBook | Book. Play. Enjoy." },
      {
        name: "description",
        content:
          "Log in to your TurfBook account to manage bookings and reserve your favourite turf slots.",
      },
      { property: "og:title", content: "Login to TurfBook" },
      {
        property: "og:description",
        content: "Access your TurfBook account and book turfs in seconds.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { login, googleLogin } = useApp();
  const [values, setValues] = useState({ email: "", password: "" });
  const [remember, setRemember] = useState(true);
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSubmitting, setResetSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);

  const set = (key) => (e) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    setErrors((x) => ({ ...x, [key]: "" }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!values.email.trim()) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim()))
      next.email = "Enter a valid email address";
    if (!values.password) next.password = "Password is required";
    else if (values.password.length < 6)
      next.password = "Password must be at least 6 characters";

    setErrors(next);
    if (Object.keys(next).length) {
      toast.error("Please fix the highlighted fields");
      return;
    }
    setSubmitting(true);
    try {
      await login({ email: values.email.trim(), password: values.password });
      toast.success("Welcome back to TurfBook!");
      navigate({ to: "/" });
    } catch (error) {
      toast.error(error.message || "Unable to log in. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const onForgotPassword = async (e) => {
    e.preventDefault();
    const email = resetEmail.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      toast.error("Enter a valid email address.");
      return;
    }
    setResetSubmitting(true);
    try {
      await authApi.forgotPassword(email);
      toast.success("If an account exists, password-reset instructions have been sent.");
      setForgotMode(false);
      setResetEmail("");
    } catch (error) {
      toast.error(error.message || "Unable to start password reset.");
    } finally {
      setResetSubmitting(false);
    }
  };
  const onGoogleCredential = async (credential) => {
    if (googleSubmitting) return;
    setGoogleSubmitting(true);
    try {
      await googleLogin(credential);
      toast.success("Welcome to TurfBook!");
      navigate({ to: "/" });
    } catch (error) {
      toast.error(error.message || "Google sign-in could not be completed.");
    } finally {
      setGoogleSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Book Your Perfect Turf,"
      highlight="Anytime!"
      subtitle="Find and book the best turfs near you. Real-time availability • Easy booking • Best experience"
    >
      <h2 className="text-center text-3xl font-extrabold">{forgotMode ? "Reset password" : "Welcome Back!"}</h2>
      <p className="text-muted-foreground mt-2 text-center text-sm">
        {forgotMode ? "Enter your email and we’ll send secure reset instructions." : "Login to your account and continue"}
      </p>

      {forgotMode ? <form onSubmit={onForgotPassword} className="mt-8 space-y-5" noValidate>
        <Field label="Email Address" icon={Mail}>
          <input type="email" maxLength={255} value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} placeholder="Enter your account email" className={inputClass} />
        </Field>
        <Button type="submit" size="lg" className="w-full" disabled={resetSubmitting}>{resetSubmitting ? "Sending..." : "Send reset instructions"}</Button>
        <Button type="button" variant="outline" className="w-full" onClick={() => setForgotMode(false)}>Back to login</Button>
      </form> : <>
        <div className={`mt-8 ${googleSubmitting ? "pointer-events-none opacity-60" : ""}`}>
          {GOOGLE_CLIENT_ID ? <GoogleSignInButton clientId={GOOGLE_CLIENT_ID} onCredential={onGoogleCredential} /> : <Button type="button" variant="outline" size="lg" className="w-full" aria-disabled="true" title="Google sign-in will activate when Google setup is complete"><GoogleIcon />Continue with Google</Button>}
        </div>
        <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground"><span className="bg-border h-px flex-1" />or continue with email<span className="bg-border h-px flex-1" /></div>
        <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <Field label="Email Address" icon={Mail} error={errors.email}>
          <input
            type="email"
            maxLength={255}
            value={values.email}
            onChange={set("email")}
            placeholder="Enter your email"
            className={inputClass}
          />
        </Field>

        <Field label="Password" icon={Lock} error={errors.password}>
          <input
            type={show ? "text" : "password"}
            maxLength={72}
            value={values.password}
            onChange={set("password")}
            placeholder="Enter your password"
            className={`${inputClass} pr-11`}
          />
          <button
            type="button"
            aria-label={show ? "Hide password" : "Show password"}
            onClick={() => setShow((s) => !s)}
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3.5 -translate-y-1/2 cursor-pointer"
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </Field>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="accent-primary size-4 cursor-pointer"
            />
            Remember Me
          </label>
          <button
            type="button"
            onClick={() => setForgotMode(true)}
            className="text-primary cursor-pointer text-sm font-semibold hover:underline"
          >
            Forgot Password?
          </button>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting ? "Logging in..." : "Login"}
        </Button>
        </form>
      </>}

      {!forgotMode && <p className="text-muted-foreground mt-7 text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link to="/register" className="text-primary font-semibold hover:underline">
          Sign Up
        </Link>
      </p>}
      {!forgotMode && <p className="mt-3 text-center text-xs text-muted-foreground">Administrator? <Link to="/admin/login" className="font-semibold text-foreground hover:text-primary hover:underline">Use the secure admin sign-in</Link></p>}
    </AuthShell>
  );
}
