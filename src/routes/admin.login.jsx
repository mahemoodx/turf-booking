import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import AuthShell, { Field, inputClass } from "@/components/AuthShell";
import Button from "@/components/Button";
import { useApp } from "@/store/AppStore";

const ADMIN_EMAIL = "admin@gmail.com";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "Administrator sign-in | TurfBook" }, { name: "description", content: "Secure administrator access for TurfBook." }] }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const { login, logout } = useApp();
  const [values, setValues] = useState({ email: "", password: "" });
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const set = (key) => (event) => { setValues((current) => ({ ...current, [key]: event.target.value })); setErrors((current) => ({ ...current, [key]: "" })); };
  const onSubmit = async (event) => {
    event.preventDefault();
    const email = values.email.trim().toLowerCase();
    const next = {};
    if (email !== ADMIN_EMAIL) next.email = "Use the administrator email for this portal.";
    if (!values.password) next.password = "Password is required";
    setErrors(next);
    if (Object.keys(next).length) return;
    setSubmitting(true);
    try {
      const account = await login({ email, password: values.password });
      if (!account.roles?.includes("ADMIN")) {
        await logout();
        throw new Error("This account is not authorised for the administrator portal.");
      }
      toast.success("Administrator access granted.");
      navigate({ to: "/admin" });
    } catch (error) {
      toast.error(error.message || "Unable to sign in.");
    } finally { setSubmitting(false); }
  };

  return <AuthShell title="Manage TurfBook," highlight="Securely." subtitle="This private portal is for the TurfBook administrator only.">
    <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><ShieldCheck size={25} /></div>
    <h2 className="mt-4 text-center text-3xl font-extrabold">Administrator sign-in</h2>
    <p className="mt-2 text-center text-sm text-muted-foreground">Use your private administrator credentials to manage bookings.</p>
    <form onSubmit={onSubmit} className="mt-8 space-y-5" noValidate>
      <Field label="Administrator email" icon={Mail} error={errors.email}>
        <input type="email" value={values.email} maxLength={255} onChange={set("email")} placeholder="Enter administrator email" className={inputClass} autoComplete="username" />
      </Field>
      <Field label="Password" icon={LockKeyhole} error={errors.password}>
        <input type={show ? "text" : "password"} value={values.password} maxLength={72} onChange={set("password")} placeholder="Enter administrator password" className={`${inputClass} pr-11`} autoComplete="current-password" />
        <button type="button" aria-label={show ? "Hide password" : "Show password"} onClick={() => setShow((current) => !current)} className="absolute top-1/2 right-3.5 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground">{show ? <EyeOff size={16} /> : <Eye size={16} />}</button>
      </Field>
      <Button type="submit" size="lg" className="w-full" disabled={submitting}>{submitting ? "Signing in..." : "Sign in to admin"}</Button>
    </form>
    <p className="mt-7 text-center text-sm text-muted-foreground">Customer account? <Link to="/login" className="font-semibold text-primary hover:underline">Go to customer login</Link></p>
  </AuthShell>;
}
