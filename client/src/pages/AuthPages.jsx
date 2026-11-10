import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BookOpen, Eye, EyeOff, MapPin, Megaphone, MessageCircle, PackageSearch } from "lucide-react";
import Button from "../components/common/Button";
import BrandLogo from "../components/common/BrandLogo";
import useAuth from "../hooks/useAuth";
import useToast from "../hooks/useToast";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const departments = ["Computer Science", "Business", "Design", "Engineering", "Liberal Arts", "Sciences"];

function AuthShell({ children }) {
  const features = [
    [Megaphone, "Campus announcements and updates."],
    [MessageCircle, "Student community and discussions."],
    [PackageSearch, "Lost & Found assistance."],
    [MapPin, "Campus locations and navigation."],
    [BookOpen, "AI-powered campus assistance."],
  ];
  return (
    <div className="auth-page auth-split">
      <section className="auth-intro">
        <BrandLogo showFullForm showTagline />
        <p className="auth-tagline">Your campus life, connected. Discover announcements, engage with your community, find lost belongings, and explore campus through one platform.</p>
        <div className="auth-features">
          {features.map(([Icon, text]) => <div key={text}><Icon size={17} />{text}</div>)}
        </div>
      </section>
      <section className="card auth-card">{children}</section>
    </div>
  );
}

function Field({ label, children }) {
  return <label className="field">{label}{children}</label>;
}

function PasswordField({ label = "Password", value, onChange }) {
  const [visible, setVisible] = useState(false);
  return (
    <Field label={label}>
      <span className="input-with-action">
        <input className="input" type={visible ? "text" : "password"} value={value} onChange={(event) => onChange(event.target.value)} required minLength={8} />
        <button type="button" className="input-action" onClick={() => setVisible((current) => !current)} aria-label={visible ? "Hide password" : "Show password"}>
          {visible ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </span>
    </Field>
  );
}

export function LoginPage() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (!emailPattern.test(form.email)) return setError("Enter a valid email address.");
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success("Welcome back to S.H.I.E.L.D.");
      navigate(location.state?.from || "/dashboard", { replace: true });
    } catch (requestError) {
      setError(requestError.message);
      toast.error("Unable to sign in.", { description: requestError.message });
    } finally {
      setLoading(false);
    }
  };
  return (
    <AuthShell>
      <BrandLogo compact />
      <h1>Welcome back</h1>
      <p className="muted">Sign in to continue your campus experience.</p>
      <form className="auth-form" onSubmit={submit}>
        <Field label="Email"><input className="input" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required /></Field>
        <PasswordField value={form.password} onChange={(password) => setForm({ ...form, password })} />
        {error && <p className="form-error">{error}</p>}
        <Button type="submit" loading={loading} loadingText="Signing in...">Sign in</Button>
      </form>
      <div className="auth-footer">New to S.H.I.E.L.D.? <Link to="/register">Create an account</Link></div>
    </AuthShell>
  );
}

export function RegisterPage() {
  const { signup } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", department: "", studentId: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (!form.name || !form.department || !form.studentId || !emailPattern.test(form.email)) return setError("Complete all fields with a valid email.");
    if (form.password.length < 8) return setError("Password must be at least 8 characters.");
    if (form.password !== form.confirm) return setError("Passwords do not match.");
    setLoading(true);
    try {
      const result = await signup({ name: form.name, email: form.email, department: form.department, studentId: form.studentId, password: form.password });
      toast.success("Verification code sent.", { description: "Check your email to continue." });
      navigate("/verify-otp", { state: { email: result.email, registrationToken: result.registrationToken } });
    } catch (requestError) {
      setError(requestError.message);
      toast.error("Unable to create account.", { description: requestError.message });
    } finally {
      setLoading(false);
    }
  };
  return (
    <AuthShell>
      <BrandLogo compact />
      <h1>Create your account</h1>
      <p className="muted">Join your campus network and stay connected.</p>
      <form className="auth-form" onSubmit={submit}>
        <Field label="Full name"><input className="input" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required /></Field>
        <Field label="College email"><input className="input" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required /></Field>
        <Field label="Student ID"><input className="input" value={form.studentId} onChange={(event) => setForm({ ...form, studentId: event.target.value })} required /></Field>
        <Field label="Department"><select className="select" value={form.department} onChange={(event) => setForm({ ...form, department: event.target.value })} required><option value="">Select department</option>{departments.map((department) => <option key={department}>{department}</option>)}</select></Field>
        <PasswordField value={form.password} onChange={(password) => setForm({ ...form, password })} />
        <PasswordField label="Confirm password" value={form.confirm} onChange={(confirm) => setForm({ ...form, confirm })} />
        {error && <p className="form-error">{error}</p>}
        <Button type="submit" loading={loading} loadingText="Creating account...">Create account</Button>
      </form>
      <div className="auth-footer">Already have an account? <Link to="/login">Sign in</Link></div>
    </AuthShell>
  );
}

export function VerifyOtpPage() {
  const { verifyOtp, resendOtp } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const registrationToken = location.state?.registrationToken;
  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (!/^\d{6}$/.test(code)) return setError("Enter the six-digit verification code.");
    setLoading(true);
    try {
      await verifyOtp(code, registrationToken);
      toast.success("Email verified successfully.");
      navigate("/dashboard", { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };
  const resend = async () => {
    setResending(true);
    try {
      await resendOtp(registrationToken);
      toast.success("A new verification code was sent.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setResending(false);
    }
  };
  return (
    <AuthShell>
      <BrandLogo compact />
      <h1>Verify your email</h1>
      <p className="muted">Enter the six-digit code sent to {location.state?.email || "your email"}.</p>
      <form className="auth-form" onSubmit={submit}>
        <Field label="Verification code"><input className="input" inputMode="numeric" pattern="\d{6}" maxLength={6} value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))} required /></Field>
        {error && <p className="form-error">{error}</p>}
        <Button type="submit" loading={loading} loadingText="Verifying...">Verify email</Button>
        <Button type="button" variant="outline" loading={resending} loadingText="Resending..." onClick={resend}>Resend code</Button>
      </form>
      <div className="auth-footer"><Link to="/register">Start registration again</Link></div>
    </AuthShell>
  );
}
