import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import AuthShell, { Field, inputClass } from "@/components/AuthShell";
import Button from "@/components/Button";
import { useApp } from "@/store/AppStore";
import { authApi } from "@/lib/api";

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
  const { login } = useApp();
  const [values, setValues] = useState({ email: "", password: "" });
  const [remember, setRemember] = useState(true);
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSubmitting, setResetSubmitting] = useState(false);

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
      </form> : <form onSubmit={onSubmit} className="mt-8 space-y-5" noValidate>
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
      </form>}

      {!forgotMode && <p className="text-muted-foreground mt-7 text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link to="/register" className="text-primary font-semibold hover:underline">
          Sign Up
        </Link>
      </p>}
    </AuthShell>
  );
}
