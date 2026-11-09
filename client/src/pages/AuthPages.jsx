import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  BookOpen,
  Eye,
  EyeOff,
  MapPin,
  Megaphone,
  MessageCircle,
  PackageSearch,
  ShieldCheck,
} from "lucide-react";
import Button from "../components/common/Button";
import BrandLogo from "../components/common/BrandLogo";
import useAuth from "../hooks/useAuth";
import useToast from "../hooks/useToast";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const departments = [
  "Computer Science",
  "Electronics And Communication ",
  "Electrical",
  "Electronics And Instrumentation",
  "Mechanical",
  "Civil",
];
const features = [
  [Megaphone, "Campus announcements and updates."],
  [MessageCircle, "Student community and discussions."],
  [PackageSearch, "Lost & Found assistance."],
  [MapPin, "Campus locations and navigation."],
  [BookOpen, "AI-powered campus assistance."],
];

function AuthShell({ children }) {
  return (
    <div className="auth-page auth-split">
      <section className="auth-intro">
        <BrandLogo showFullForm showTagline />
        <p className="auth-tagline">
          Your campus life, connected. Discover important announcements, engage
          with your student community, find lost belongings and explore
          everything happening across your campus — all through one intelligent
          platform.
        </p>
        <div className="auth-features">
          {features.map(([Icon, text]) => (
            <div key={text}>
              <Icon size={17} />
              {text}
            </div>
          ))}
        </div>
      </section>
      <section className="card auth-card">{children}</section>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="field">
      {label}
      {children}
    </label>
  );
}

function PasswordField({ label = "Password", value, onChange }) {
  const [visible, setVisible] = useState(false);
  return (
    <Field label={label}>
      <span className="input-with-action">
        <input
          className="input"
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={
            label === "Password"
              ? "Create a strong password"
              : "Confirm your password"
          }
        />
        <button
          type="button"
          className="input-action"
          onClick={() => setVisible(!visible)}
          aria-label={visible ? "Hide password" : "Show password"}
        >
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
  const [form, setForm] = useState({
    email: "student@shield.demo",
    password: "S.H.I.E.L.D.123!",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (!emailPattern.test(form.email) || !form.password)
      return setError("Enter a valid college email and password.");
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
      <div className="demo-note">
        <ShieldCheck size={16} />
        <span>Demo: student@shield.demo / S.H.I.E.L.D.123!</span>
      </div>
      <form className="auth-form" onSubmit={submit}>
        <Field label="College email">
          <input
            className="input"
            type="email"
            value={form.email}
            onChange={(event) =>
              setForm({ ...form, email: event.target.value })
            }
            placeholder="Enter your institutional email"
          />
        </Field>
        <PasswordField
          value={form.password}
          onChange={(password) => setForm({ ...form, password })}
        />
        <label className="check">
          <input type="checkbox" /> Remember me{" "}
          <a className="form-link" href="#forgot">
            Forgot password?
          </a>
        </label>
        {error && <p className="form-error">{error}</p>}
        <Button type="submit" loading={loading} loadingText="Signing in...">
          Sign in
        </Button>
      </form>
      <div className="auth-footer">
        New to S.H.I.E.L.D.? <Link to="/register">Create an account</Link>
      </div>
    </AuthShell>
  );
}


//register and verify otp pages are in this file, but the rest of the code is in AppRoutes.jsx.
export function RegisterPage() {
  const { signup } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
    studentId: "",
    password: "",
    confirm: "",
    terms: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (
      !form.name ||
      !form.department ||
      !form.studentId ||
      !emailPattern.test(form.email)
    )
      return setError(
        "Complete all required fields with a valid college email.",
      );
    if (form.password.length < 8)
      return setError("Password must be at least 8 characters.");
    if (form.password !== form.confirm)
      return setError("Passwords do not match.");
    if (!form.terms)
      return setError(
        "Accept the Terms of Service and Privacy Policy to continue.",
      );
    setLoading(true);
    try {
      const otp = await signup({
        name: form.name,
        email: form.email,
        department: form.department,
        studentId: form.studentId,
        password: form.password,
      });
      toast.success("Registration started.", {
        description: "Continue with the simulated verification code.",
      });
      navigate("/verify-otp", { state: { demoOtp: otp } });
    } catch (requestError) {
      setError(requestError.message);
      toast.error("Unable to create account.", {
        description: requestError.message,
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <AuthShell>
      <BrandLogo compact />
      <h1>Create your account</h1>
      <p className="muted">
        Join your campus network and stay connected with everything happening
        around you.
      </p>
      <form className="auth-form" onSubmit={submit}>
        <Field label="Full name">
          <input
            className="input"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            placeholder="Enter your full name"
            required
          />
        </Field>
        <Field label="College email">
          <input
            className="input"
            type="email"
            value={form.email}
            onChange={(event) =>
              setForm({ ...form, email: event.target.value })
            }
            placeholder="Enter your institutional email"
            required
          />
        </Field>
        <Field label="Department">
          <select
            className="select"
            value={form.department}
            onChange={(event) =>
              setForm({ ...form, department: event.target.value })
            }
            required
          >
            <option value="">Select your department</option>
            {departments.map((department) => (
              <option key={department}>{department}</option>
            ))}
          </select>
        </Field>
        <Field label="Student ID / Registration Number">
          <input
            className="input"
            value={form.studentId}
            onChange={(event) =>
              setForm({ ...form, studentId: event.target.value })
            }
            placeholder="Enter your student ID"
            required
          />
        </Field>
        <PasswordField
          value={form.password}
          onChange={(password) => setForm({ ...form, password })}
        />
        <div className="password-meter">
          <span
            style={{ width: `${Math.min(form.password.length * 12.5, 100)}%` }}
          />
        </div>
        <PasswordField
          label="Confirm Password"
          value={form.confirm}
          onChange={(confirm) => setForm({ ...form, confirm })}
        />
        <label className="check terms">
          <input
            type="checkbox"
            checked={form.terms}
            onChange={(event) =>
              setForm({ ...form, terms: event.target.checked })
            }
          />{" "}
          I agree to the{" "}
          <a className="form-link" href="#terms">
            Terms of Service
          </a>{" "}
          and{" "}
          <a className="form-link" href="#privacy">
            Privacy Policy
          </a>
          .
        </label>
        {error && <p className="form-error">{error}</p>}
        <Button type="submit" loading={loading} loadingText="Creating account...">
          Create account
        </Button>
      </form>
      <div className="auth-footer">
        Already have an account? <Link to="/login">Sign in</Link>
      </div>
    </AuthShell>
  );
}

export function VerifyOtpPage() {
  const { verifyOtp, resendOtp, demoOtp } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [code, setCode] = useState(Array(6).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [seconds, setSeconds] = useState(30);
  const refs = useRef([]);
  useEffect(() => {
    const timer = setInterval(
      () => setSeconds((value) => (value > 0 ? value - 1 : 0)),
      1000,
    );
    return () => clearInterval(timer);
  }, []);
  const update = (index, value) => {
    const next = [...code];
    next[index] = value.replace(/\D/g, "").slice(-1);
    setCode(next);
    if (value && index < 5) refs.current[index + 1]?.focus();
  };
  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await verifyOtp(code.join(""));
      toast.success("Email verified successfully.");
      navigate("/dashboard", { replace: true });
    } catch (requestError) {
      setError(requestError.message);
      toast.error("Verification failed.", {
        description: requestError.message,
      });
    } finally {
      setLoading(false);
    }
  };
  const resend = async () => {
    const next = await resendOtp();
    setSeconds(30);
    setCode(Array(6).fill(""));
    setError("New simulated code generated.");
    toast.info("A new simulated OTP was generated.");
    navigate("/verify-otp", { replace: true, state: { demoOtp: next } });
  };
  return (
    <AuthShell>
      <BrandLogo compact />
      <div className="otp-icon">
        <ShieldCheck size={23} />
      </div>
      <h1>Verify your email</h1>
      <p className="muted">
        We sent a verification code to your registered college email. Enter the
        six-digit code to activate your account.
      </p>
      <div className="demo-note">
        <ShieldCheck size={16} />
        <span>
          Simulated OTP: <strong>{location.state?.demoOtp || demoOtp()}</strong>
        </span>
      </div>
      <form className="auth-form" onSubmit={submit}>
        <div className="otp-grid">
          {code.map((value, index) => (
            <input
              key={index}
              ref={(element) => {
                refs.current[index] = element;
              }}
              className="otp-input"
              inputMode="numeric"
              value={value}
              onChange={(event) => update(index, event.target.value)}
              onKeyDown={(event) =>
                event.key === "Backspace" &&
                !value &&
                refs.current[index - 1]?.focus()
              }
            />
          ))}
        </div>
        {error && <p className="form-error">{error}</p>}
        <Button type="submit" loading={loading} disabled={code.join("").length !== 6} loadingText="Verifying...">
          Verify account
        </Button>
      </form>
      <button className="text-button" disabled={seconds > 0} onClick={resend}>
        {seconds > 0 ? `Resend code in ${seconds}s` : "Resend code"}
      </button>
    </AuthShell>
  );
}
