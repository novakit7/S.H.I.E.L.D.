import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Heart,
  MapPin,
  Megaphone,
  MessageCircle,
  PackageSearch,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import Button from "../components/common/Button";
import PageHeader from "../components/common/PageHeader";
import SearchBar from "../components/common/SearchBar";
import StatCard from "../components/common/StatCard";
import EmptyState from "../components/common/EmptyState";
import PostCard from "../components/cards/PostCard";
import AnnouncementCard from "../components/cards/AnnouncementCard";
import LostFoundCard from "../components/cards/LostFoundCard";
import Footer from "../components/layout/Footer";
import useConfirm from "../hooks/useConfirm";
import useToast from "../hooks/useToast";
import BrandLogo from "../components/common/BrandLogo";
import { chatWithAssistant } from "../services/assistantService";

const announcements = [
  {
    title: "Spring semester town hall",
    category: "Events",
    department: "Student Affairs",
    date: "Mar 18, 2026",
    pinned: true,
  },
  {
    title: "Library hours extended during exams",
    category: "Campus",
    department: "University Library",
    date: "Mar 15, 2026",
  },
  {
    title: "Career fair registration is now open",
    category: "Career",
    department: "Career Services",
    date: "Mar 12, 2026",
  },
];
const posts = [
  {
    alias: "Curious Cardinal",
    title: "Best quiet places to study?",
    body: "Looking for recommendations near the north quad for a group project.",
    category: "Academics",
    time: "2h ago",
    likes: 18,
  },
  {
    alias: "Orange Owl",
    title: "Welcome to the new semester!",
    body: "What clubs is everyone excited to join this term?",
    category: "Campus life",
    time: "5h ago",
    likes: 32,
  },
];
const items = [
  {
    title: "Blue water bottle",
    category: "Accessories",
    location: "Science building",
    date: "Today",
    status: "Lost",
    description: "Matte blue bottle with a silver cap.",
  },
  {
    title: "Student ID card",
    category: "Documents",
    location: "Central library",
    date: "Yesterday",
    status: "Found",
    description: "Found near the second-floor printers.",
  },
  {
    title: "Wireless earbuds",
    category: "Electronics",
    location: "North quad",
    date: "Mar 12",
    status: "Lost",
    description: "Black case with a small orange sticker.",
  },
];

function PublicNav() {
  return (
    <nav className="landing-nav">
      <div className="container">
        <Link className="brand" to="/">
          <BrandLogo />
        </Link>
        <div className="nav-links">
          <a href="#features">Features</a>
          <Link to="/login">Sign in</Link>
          <Link className="btn btn-primary btn-sm" to="/register">
            Get started
          </Link>
        </div>
      </div>
    </nav>
  );
}
export function LandingPage() {
  const features = [
    [
      Users,
      "Community",
      "Find your people, share ideas and stay connected anonymously.",
    ],
    [
      PackageSearch,
      "Lost & Found",
      "Help campus belongings find their way home.",
    ],
    [
      Megaphone,
      "Announcements",
      "Never miss important updates from your campus.",
    ],
    [
      MapPin,
      "Campus Map",
      "Discover helpful places and services around campus.",
    ],
    [
      Bot,
      "AI Assistant",
      "Get quick answers grounded in approved campus information.",
    ],
  ];
  return (
    <div className="app-shell">
      <PublicNav />
      <main>
        <section className="hero">
          <div className="container">
            <div className="eyebrow">Smart campus technology</div>
            <h1>
              S.H.I.E.L.D. — Your Campus, <span>Connected.</span>
            </h1>
            <p>
              One intelligent platform for campus communication, student
              engagement, discovery and assistance.
            </p>
            <div className="hero-tagline">
              One Campus. One Network. Infinite Connections.
            </div>
            <div className="hero-actions">
              <Link className="btn btn-primary" to="/register">
                Get started <ArrowRight size={17} />
              </Link>
              <Link className="btn btn-outline" to="/dashboard">
                Explore campus
              </Link>
            </div>
          </div>
        </section>
        <section id="features" className="landing-section">
          <div className="container grid-3">
            {features.map(([Icon, title, text]) => (
              <div className="card feature-card" key={title}>
                <Icon className="feature-icon" size={24} />
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
function AuthPage({ register = false }) {
  return (
    <div className="auth-page">
      <div className="card auth-card">
        <Link className="brand" to="/">
          <span className="brand-mark">C</span> S.H.I.E.L.D.
        </Link>
        <h1>{register ? "Create your account" : "Welcome back"}</h1>
        <p className="muted">
          {register
            ? "Join your campus community."
            : "Sign in to continue to your campus."}
        </p>
        <form
          className="auth-form"
          onSubmit={(event) => event.preventDefault()}
        >
          {register && (
            <>
              <label className="field">
                Full name
                <input className="input" placeholder="Jordan Davis" />
              </label>
              <label className="field">
                Department
                <input className="input" placeholder="Computer Science" />
              </label>
            </>
          )}
          <label className="field">
            {register ? "College email" : "Email"}
            <input
              className="input"
              type="email"
              placeholder="you@college.edu"
            />
          </label>
          <label className="field">
            Password
            <input className="input" type="password" placeholder="••••••••" />
          </label>
          {register && (
            <label className="field">
              Confirm password
              <input className="input" type="password" placeholder="••••••••" />
            </label>
          )}
          <Button type="submit">
            {register ? "Create account" : "Log in"}
          </Button>
        </form>
        <div className="auth-footer">
          {register ? (
            <>
              Already have an account? <Link to="/login">Log in</Link>
            </>
          ) : (
            <>
              New to S.H.I.E.L.D.? <Link to="/register">Create an account</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
export function LoginPage() {
  return <AuthPage />;
}
export function RegisterPage() {
  return <AuthPage register />;
}
function DashboardPageContent() {
  return (
    <>
      <PageHeader
        eyebrow="Tuesday, March 17"
        title="Good morning, Jordan."
        description="Here is what is happening around campus today."
        action={
          <div className="search-box">
            <Search size={16} /> <input
            className="input"
            type="text"
            placeholder="Search campus..."
            aria-label="Search campus"
  />
          </div>
        }
      />
      <div className="grid-4">
        <StatCard label="Community posts" value="248" icon={MessageCircle} />
        <StatCard label="Active listings" value="36" icon={PackageSearch} />
        <StatCard label="Announcements" value="12" icon={Megaphone} />
        <StatCard label="Saved places" value="8" icon={MapPin} />
      </div>
      <div className="grid-2" style={{ marginTop: 20 }}>
        <section className="card">
          <div className="section-title">
            <h2>Quick access</h2>
          </div>
          <div className="grid-2">
            <Link className="card quick-card" to="/community">
              <Users size={20} /> Community
            </Link>
            <Link className="card quick-card" to="/assistant">
              <Bot size={20} /> Ask assistant
            </Link>
            <Link className="card quick-card" to="/lost-found">
              <PackageSearch size={20} /> Lost & Found
            </Link>
            <Link className="card quick-card" to="/campus-map">
              <MapPin size={20} /> Campus map
            </Link>
          </div>
        </section>
        <section className="card">
          <div className="section-title">
            <h2>Recent announcements</h2>
            <Link className="muted" to="/announcements">
              View all
            </Link>
          </div>
          <div className="list">
            {announcements.slice(0, 3).map((item) => (
              <AnnouncementCard key={item.title} announcement={item} />
            ))}
          </div>
        </section>
      </div>
      <div className="grid-2" style={{ marginTop: 20 }}>
        <section>
          <div className="section-title">
            <h2>Community pulse</h2>
            <Link className="muted" to="/community">
              View all
            </Link>
          </div>
          <div className="stack">
            {posts.map((post) => (
              <PostCard key={post.title} post={post} />
            ))}
          </div>
        </section>
        <section>
          <div className="section-title">
            <h2>Lost & Found</h2>
            <Link className="muted" to="/lost-found">
              View all
            </Link>
          </div>
          <div className="card list">
            {items.map((item) => (
              <LostFoundCard key={item.title} item={item} onClick={() => {}} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
export function DashboardPage() {
  return (
    <div className="content">
      <DashboardPageContent />
    </div>
  );
}
export function CommunityPage() {
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [text, setText] = useState("");
  const filtered = posts.filter(
    (post) =>
      (filter === "All" || post.category === filter) &&
      `${post.title} ${post.body}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <div className="content">
      <PageHeader
        eyebrow="Community"
        title="What is happening on campus?"
        description="A space for students to connect using anonymous aliases."
        action={
          <Button>
            <Plus size={16} /> Create post
          </Button>
        }
      />
      <div className="card stack" style={{ marginBottom: 20 }}>
        <label className="field">
          Share something with campus
          <textarea
            className="textarea"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Start a conversation..."
          />
        </label>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span className="muted">Posting as Curious Cardinal</span>
          <Button disabled={!text.trim()}>Post anonymously</Button>
        </div>
      </div>
      <div className="filters">
        {["All", "Academics", "Campus life"].map((name) => (
          <button
            className={`filter ${filter === name ? "active" : ""}`}
            key={name}
            onClick={() => setFilter(name)}
          >
            {name}
          </button>
        ))}
      </div>
      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search posts..."
      />
      <div className="stack" style={{ marginTop: 20 }}>
        {filtered.map((post) => (
          <PostCard key={post.title} post={post} />
        ))}
        {!filtered.length && (
          <div className="card">
            <EmptyState message="No matching posts found." />
          </div>
        )}
      </div>
    </div>
  );
}
export function LostFoundPage() {
  const [tab, setTab] = useState("All");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const filtered = items.filter(
    (item) =>
      (tab === "All" || item.status === tab) &&
      `${item.title} ${item.location}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <div className="content">
      <PageHeader
        eyebrow="Lost & Found"
        title="Help things find their way home."
        description="Demo listings for the campus community."
        action={
          <Button>
            <Plus size={16} /> Create listing
          </Button>
        }
      />
      <div className="filters">
        {["All", "Lost", "Found"].map((name) => (
          <button
            className={`filter ${tab === name ? "active" : ""}`}
            key={name}
            onClick={() => setTab(name)}
          >
            {name}
          </button>
        ))}
      </div>
      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search items or locations..."
      />
      <div className="stack" style={{ marginTop: 20 }}>
        {filtered.map((item) => (
          <LostFoundCard
            key={item.title}
            item={item}
            onClick={() => setSelected(item)}
          />
        ))}
      </div>
      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div
            className="card modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="section-title">
              <h2>{selected.title}</h2>
              <button className="icon-button" onClick={() => setSelected(null)}>
                <X size={18} />
              </button>
            </div>
            <span
              className={`badge ${selected.status === "Found" ? "success" : "warning"}`}
            >
              {selected.status}
            </span>
            <p className="muted" style={{ marginTop: 18 }}>
              {selected.description}
            </p>
            <p className="muted" style={{ marginTop: 10 }}>
              <MapPin size={15} /> {selected.location} · {selected.date}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
export function AnnouncementsPage() {
  const [query, setQuery] = useState("");
  const filtered = announcements.filter((item) =>
    `${item.title} ${item.department}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  return (
    <div className="content">
      <PageHeader
        eyebrow="Announcements"
        title="Stay in the loop."
        description="Important updates from across campus."
      />
      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search announcements..."
      />
      <div className="stack" style={{ marginTop: 20 }}>
        {filtered.map((item) => (
          <AnnouncementCard key={item.title} announcement={item} />
        ))}
      </div>
    </div>
  );
}
export function CampusMapPage() {
  return (
    <div className="content">
      <PageHeader
        eyebrow="Campus map"
        title="Find your way around."
        description="Map integration is prepared for a future Leaflet and OpenStreetMap connection."
      />
      <SearchBar
        value=""
        onChange={() => {}}
        placeholder="Search locations..."
      />
      <div className="grid-2" style={{ marginTop: 20 }}>
        <div className="map-panel card">
          <div>
            <MapPin size={36} />
            <h2>Campus map preview</h2>
            <p>Interactive map coming soon. Demo area only.</p>
          </div>
        </div>
        <div className="card">
          <div className="section-title">
            <h2>Popular locations</h2>
          </div>
          <div className="list">
            {[
              "Central library",
              "North quad",
              "Student union",
              "Science building",
            ].map((place) => (
              <div className="list-row" key={place}>
                <div>
                  <h4>{place}</h4>
                  <p>Demo campus location</p>
                </div>
                <MapPin size={17} className="muted" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export function AssistantPage() {
  const [messages, setMessages] = useState(() => [
    {
      id: "welcome",
      role: "assistant",
      text: "Hi! I can help you find approved campus information. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  const send = async (event, retryText = null) => {
    event.preventDefault();
    const messageText = (retryText || text).trim();
    if (!messageText || isSending) return;
    const retrying = Boolean(retryText);
    const visibleMessages = retrying
      ? messages.filter((message) => !message.error)
      : messages;
    const nextMessages = retrying
      ? visibleMessages
      : [
          ...visibleMessages,
          {
            id: `user-${Date.now()}`,
            role: "user",
            text: messageText,
            timestamp: new Date(),
          },
        ];
    const conversationHistory = visibleMessages
      .filter((message) => message.id !== "welcome" && !message.error)
      .map(({ role, text: content }) => ({ role, content }));
    setMessages(nextMessages);
    setText("");
    setIsSending(true);
    try {
      const result = await chatWithAssistant({
        message: messageText,
        conversationHistory,
      });
      setMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          text: result.reply,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          text: error.message,
          timestamp: new Date(),
          error: true,
          retryText: messageText,
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };
  return (
    <div className="content">
      <PageHeader
        eyebrow="Campus assistant"
        title="Ask S.H.I.E.L.D.."
        description="Ask questions grounded in verified campus information."
        action={
        <Button
          variant="outline"
          onClick={() =>
            setMessages([
              {
                id: "welcome",
                role: "assistant",
                text: "Hi! I can help you find approved campus information. What would you like to know?",
                timestamp: new Date(),
              },
            ])
          }
          disabled={isSending}
        >
          Clear conversation
        </Button>
        }
      />
      <div className="card chat">
        <div className="messages">
          {messages.map((message, index) => (
            <div
              className={`message ${message.role}`}
              key={message.id || `${message.text}-${index}`}
            >
              {message.text}
              <span className="message-time">
                {message.timestamp.toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </span>
              {message.error && (
                <button
                  className="retry-button"
                  type="button"
                  onClick={(event) => send(event, message.retryText)}
                  disabled={isSending}
                >
                  Retry
                </button>
              )}
            </div>
          ))}
          {isSending && (
            <div className="message assistant typing-indicator">
              S.H.I.E.L.D. is thinking...
            </div>
          )}
          <div ref={messagesEndRef} />
          {!messages.length && (
            <EmptyState message="Start a new conversation." />
          )}
        </div>
        <div className="filters">
          {[
            "Where is the library?",
            "What events are happening?",
            "How do I report a lost item?",
          ].map((suggestion) => (
            <button
              type="button"
              className="filter"
              key={suggestion}
              onClick={() => setText(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
        <form className="chat-form" onSubmit={send}>
          <textarea
            className="input chat-textarea"
            value={text}
            onChange={(event) => setText(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                event.currentTarget.form.requestSubmit();
              }
            }}
            placeholder="Ask a campus question..."
            maxLength={2000}
            rows={2}
            disabled={isSending}
          />
          <Button type="submit" loading={isSending} loadingText="Sending...">
            Send <ArrowRight size={16} />
          </Button>
        </form>
      </div>
    </div>
  );
}
export function ProfilePage() {
  return (
    <div className="content">
      <PageHeader
        eyebrow="Account"
        title="Your profile"
        action={
          <Button variant="outline">
            <Pencil size={16} /> Edit profile
          </Button>
        }
      />
      <div className="grid-2">
        <div className="card">
          <div className="post-meta">
            <span
              className="avatar"
              style={{ width: 70, height: 70, fontSize: "1.4rem" }}
            >
              JD
            </span>
            <div>
              <h2>Jordan Davis</h2>
              <p>Computer Science · Student</p>
            </div>
          </div>
          <div className="list" style={{ marginTop: 26 }}>
            <div className="list-row">
              <span className="muted">Email</span>
              <span>jordan@college.edu</span>
            </div>
            <div className="list-row">
              <span className="muted">Member since</span>
              <span>September 2025</span>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="section-title">
            <h2>Activity overview</h2>
          </div>
          <div className="grid-2">
            <StatCard label="Posts" value="24" icon={MessageCircle} />
            <StatCard label="Helpful likes" value="86" icon={Heart} />
          </div>
        </div>
      </div>
    </div>
  );
}
function AdminPage({ type }) {
  const labels = {
    announcements: [
      "Manage announcements",
      "Create, edit and publish campus updates.",
    ],
    reports: ["Manage reports", "Review content reports from the community."],
    users: ["Manage users", "View demo student accounts and roles."],
  };
  const [title, description] = labels[type] || [
    "Admin overview",
    "Keep S.H.I.E.L.D. running smoothly.",
  ];
  if (type === "announcements")
    return (
      <AdminTable
        title={title}
        description={description}
        columns={["Title", "Department", "Status", "Actions"]}
        rows={announcements.map((item) => [
          item.title,
          item.department,
          "Published",
          "Edit · Delete",
        ])}
      />
    );
  if (type === "reports")
    return (
      <AdminTable
        title={title}
        description={description}
        columns={["Content", "Reason", "Status", "Actions"]}
        rows={posts.map((item) => [
          item.title,
          "Community guidelines",
          "Pending",
          "Review",
        ])}
      />
    );
  if (type === "users")
    return (
      <AdminTable
        title={title}
        description={description}
        columns={["Name", "Department", "Role", "Status"]}
        rows={[
          ["Jordan Davis", "Computer Science", "Student", "Active"],
          ["Morgan Lee", "Design", "Student", "Active"],
          ["Admin User", "Student Affairs", "Admin", "Active"],
        ]}
      />
    );
  return (
    <div className="content">
      <PageHeader
        eyebrow="Administration"
        title={title}
        description={description}
      />
      <div className="grid-4">
        <StatCard label="Total students" value="2,481" icon={Users} />
        <StatCard label="Announcements" value="128" icon={Megaphone} />
        <StatCard label="Pending reports" value="14" icon={ShieldCheck} />
        <StatCard label="Active today" value="842" icon={CheckCircle2} />
      </div>
      <div className="grid-3" style={{ marginTop: 20 }}>
        <Link className="card quick-card" to="/admin/announcements">
          <Megaphone size={20} /> Manage announcements
        </Link>
        <Link className="card quick-card" to="/admin/reports">
          <ShieldCheck size={20} /> Review reports
        </Link>
        <Link className="card quick-card" to="/admin/users">
          <Users size={20} /> Manage users
        </Link>
      </div>
    </div>
  );
}
function AdminTable({ title, description, columns, rows }) {
  const { confirm } = useConfirm();
  const toast = useToast();
  const handleAction = async (label, row) => {
    const destructive = /delete|dismiss|disable/i.test(label);
    if (destructive) {
      const accepted = await confirm({
        title: `${label}?`,
        description:
          "This demo action changes the displayed administration state.",
        confirmText: label,
        variant: "danger",
        onConfirm: async () => {},
      });
      if (!accepted) return;
    }
    toast.success(`${label} completed.`, { description: row[0] });
  };
  return (
    <div className="content">
      <PageHeader
        eyebrow="Administration"
        title={title}
        description={description}
        action={
          <Button>
            <Plus size={16} /> Create
          </Button>
        }
      />
      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>
                    {cellIndex === row.length - 1 ? (
                      <Button
                        variant="outline"
                        className="btn-sm"
                        onClick={() => handleAction(cell, row)}
                      >
                        {cell}
                      </Button>
                    ) : (
                      cell
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export function AdminDashboardPage() {
  return <AdminPage />;
}
export function ManageAnnouncementsPage() {
  return <AdminPage type="announcements" />;
}
export function ManageReportsPage() {
  return <AdminPage type="reports" />;
}
export function ManageUsersPage() {
  return <AdminPage type="users" />;
}
export function NotFoundPage() {
  return (
    <div className="not-found">
      <div>
        <div className="eyebrow">404</div>
        <h1 className="page-title">Page not found</h1>
        <p className="muted" style={{ margin: "12px 0 22px" }}>
          The page you are looking for does not exist.
        </p>
        <Link className="btn btn-primary" to="/">
          Return home
        </Link>
      </div>
    </div>
  );
}
export function AccessDeniedPage() {
  return (
    <div className="not-found">
      <div>
        <div className="eyebrow">Access denied</div>
        <h1 className="page-title">Admin access required</h1>
        <p className="muted" style={{ margin: "12px 0 22px" }}>
          This demo area is limited to administrator accounts.
        </p>
        <Link className="btn btn-primary" to="/dashboard">
          Return to dashboard
        </Link>
      </div>
    </div>
  );
}
