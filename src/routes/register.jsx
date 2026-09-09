import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Clock,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";
import { toast } from "sonner";
import AuthShell, { Field, inputClass } from "@/components/AuthShell";
import Button from "@/components/Button";
import { useApp } from "@/store/AppStore";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Sign Up — Create Your TurfBook Account" },
      {
        name: "description",
        content:
          "Create a free TurfBook account and start booking verified turfs with real-time availability.",
      },
      { property: "og:title", content: "Create Your TurfBook Account" },
      {
        property: "og:description",
        content: "Sign up and start booking your perfect turf.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: RegisterPage,
});

const points = [
  {
    icon: ShieldCheck,
    title: "Verified Turfs",
    text: "100% trusted and verified turfs",
  },
  {
    icon: Clock,
    title: "Real-time Availability",
    text: "Live slots. Instant booking.",
  },
  { icon: Lock, title: "Secure Booking", text: "Safe payments. Peace of mind." },
];

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useApp();
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });
  const [agree, setAgree] = useState(false);
  const [show, setShow] = useState({ password: false, confirm: false });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const set = (key) => (e) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    setErrors((x) => ({ ...x, [key]: "" }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const next = {};
    const name = values.name.trim();
    const email = values.email.trim();
    const phone = values.phone.trim();

    if (!name) next.name = "Full name is required";
    else if (name.length < 3) next.name = "Name must be at least 3 characters";
    if (!email) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
      next.email = "Enter a valid email address";
    if (!phone) next.phone = "Phone number is required";
    else if (!/^[6-9]\d{9}$/.test(phone.replace(/\D/g, "").slice(-10)))
      next.phone = "Enter a valid 10-digit mobile number";
    if (!values.password) next.password = "Password is required";
    else if (values.password.length < 8)
      next.password = "Password must be at least 8 characters";
    if (values.confirm !== values.password)
      next.confirm = "Passwords do not match";
    if (!agree) next.agree = "Please accept the Terms & Conditions";

    setErrors(next);
    if (Object.keys(next).length) {
      toast.error("Please fix the highlighted fields");
      return;
    }

    setSubmitting(true);
    try {
      await register({ fullName: name, email, phone: phone.replace(/\D/g, "").slice(-10), password: values.password });
      toast.success("Account created. Welcome to TurfBook!");
      navigate({ to: "/" });
    } catch (error) {
      toast.error(error.message || "Unable to create your account.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Find. Book. Play."
      highlight="Repeat!"
      subtitle="Book the best turfs near you with real-time availability and enjoy your game without the wait."
      points={points}
    >
      <h2 className="text-center text-3xl font-extrabold">Create Your Account</h2>
      <p className="text-muted-foreground mt-2 text-center text-sm">
        Sign up and start booking your perfect turf
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-5" noValidate>
        <Field label="Full Name" icon={User} error={errors.name}>
          <input
            maxLength={60}
            value={values.name}
            onChange={set("name")}
            placeholder="Enter your full name"
            className={inputClass}
          />
        </Field>

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

        <Field label="Phone Number" icon={Phone} error={errors.phone}>
          <input
            type="tel"
            maxLength={15}
            value={values.phone}
            onChange={set("phone")}
            placeholder="Enter your phone number"
            className={inputClass}
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Password" icon={Lock} error={errors.password}>
            <input
              type={show.password ? "text" : "password"}
              maxLength={72}
              value={values.password}
              onChange={set("password")}
              placeholder="Create a password"
              className={`${inputClass} pr-11`}
            />
            <button
              type="button"
              aria-label="Toggle password visibility"
              onClick={() => setShow((s) => ({ ...s, password: !s.password }))}
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3.5 -translate-y-1/2 cursor-pointer"
            >
              {show.password ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </Field>

          <Field label="Confirm Password" icon={Lock} error={errors.confirm}>
            <input
              type={show.confirm ? "text" : "password"}
              maxLength={72}
              value={values.confirm}
              onChange={set("confirm")}
              placeholder="Confirm your password"
              className={`${inputClass} pr-11`}
            />
            <button
              type="button"
              aria-label="Toggle confirm password visibility"
              onClick={() => setShow((s) => ({ ...s, confirm: !s.confirm }))}
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3.5 -translate-y-1/2 cursor-pointer"
            >
              {show.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </Field>
        </div>

        <div>
          <label className="flex cursor-pointer items-start gap-2 text-sm">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => {
                setAgree(e.target.checked);
                setErrors((x) => ({ ...x, agree: "" }));
              }}
              className="accent-primary mt-0.5 size-4 cursor-pointer"
            />
            <span>
              I agree to the{" "}
              <span className="text-primary font-semibold">Terms &amp; Conditions</span>{" "}
              and <span className="text-primary font-semibold">Privacy Policy</span>
            </span>
          </label>
          {errors.agree && (
            <p className="text-destructive mt-1 text-xs">{errors.agree}</p>
          )}
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting ? "Creating account..." : "Create Account"}
        </Button>
      </form>

      <p className="text-muted-foreground mt-7 text-center text-sm">
        Already have an account?{" "}
        <Link to="/login" className="text-primary font-semibold hover:underline">
          Login
        </Link>
      </p>
    </AuthShell>
  );
}
