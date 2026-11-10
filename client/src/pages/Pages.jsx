import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Bot, MapPin, Megaphone, MessageCircle, PackageSearch, Pencil, Plus, Search, ShieldCheck, Users, X } from "lucide-react";
import Button from "../components/common/Button";
import PageHeader from "../components/common/PageHeader";
import SearchBar from "../components/common/SearchBar";
import StatCard from "../components/common/StatCard";
import EmptyState from "../components/common/EmptyState";
import PostCard from "../components/cards/PostCard";
import AnnouncementCard from "../components/cards/AnnouncementCard";
import LostFoundCard from "../components/cards/LostFoundCard";
import Footer from "../components/layout/Footer";
import ErrorState from "../components/feedback/states/ErrorState";
import DashboardSkeleton from "../components/feedback/loaders/DashboardSkeleton";
import CommunitySkeleton from "../components/feedback/loaders/CommunitySkeleton";
import LostFoundSkeleton from "../components/feedback/loaders/LostFoundSkeleton";
import AnnouncementSkeleton from "../components/feedback/loaders/AnnouncementSkeleton";
import MapSkeleton from "../components/feedback/loaders/MapSkeleton";
import ProfileSkeleton from "../components/feedback/loaders/ProfileSkeleton";
import TableSkeleton from "../components/feedback/loaders/TableSkeleton";
import useAuth from "../hooks/useAuth";
import useConfirm from "../hooks/useConfirm";
import useToast from "../hooks/useToast";
import * as userService from "../services/userService";
import * as communityService from "../services/communityService";
import * as lostFoundService from "../services/lostFoundService";
import * as announcementService from "../services/announcementService";
import * as locationService from "../services/locationService";
import * as adminService from "../services/adminService";
import { chatWithAssistant } from "../services/assistantService";

function useLoader(loader, dependencies = []) {
  const [state, setState] = useState({ loading: true, error: null, data: null });
  const reload = async () => {
    setState((current) => ({ ...current, loading: true, error: null }));
    try {
      setState({ loading: false, error: null, data: await loader() });
    } catch (error) {
      setState({ loading: false, error, data: null });
    }
  };
  useEffect(() => {
    let active = true;
    loader()
      .then((data) => active && setState({ loading: false, error: null, data }))
      .catch((error) => active && setState({ loading: false, error, data: null }));
    return () => { active = false; };
    // The caller controls the loader identity through explicit dependencies.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
  return { ...state, reload };
}

function useDebouncedValue(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

function PublicNav() {
  return <nav className="landing-nav"><div className="container"><Link className="brand" to="/"><span className="brand-mark">S</span> S.H.I.E.L.D.</Link><div className="nav-links"><a href="#features">Features</a><Link to="/login">Sign in</Link><Link className="btn btn-primary btn-sm" to="/register">Get started</Link></div></div></nav>;
}

export function LandingPage() {
  const features = [[Users, "Community", "Find your people and share ideas."], [PackageSearch, "Lost & Found", "Help belongings find their way home."], [Megaphone, "Announcements", "Never miss important campus updates."], [MapPin, "Campus Map", "Discover verified campus places."], [Bot, "AI Assistant", "Ask questions grounded in campus information."]];
  return <div className="app-shell"><PublicNav /><main><section className="hero"><div className="container"><div className="eyebrow">Smart campus technology</div><h1>S.H.I.E.L.D. — Your Campus, <span>Connected.</span></h1><p>One intelligent platform for campus communication, student engagement, discovery and assistance.</p><div className="hero-tagline">One Campus. One Network. Infinite Connections.</div><div className="hero-actions"><Link className="btn btn-primary" to="/register">Get started <ArrowRight size={17} /></Link><Link className="btn btn-outline" to="/login">Explore campus</Link></div></div></section><section id="features" className="landing-section"><div className="container grid-3">{features.map(([Icon, title, text]) => <div className="card feature-card" key={title}><Icon className="feature-icon" size={24} /><h3>{title}</h3><p>{text}</p></div>)}</div></section></main><Footer /></div>;
}

function DashboardPageContent() {
  const { data, loading, error, reload } = useLoader(userService.getDashboard);
  const { user } = useAuth();
  if (loading) return <DashboardSkeleton />;
  if (error) return <div className="content"><ErrorState message={error.message} onRetry={reload} /></div>;
  const dashboard = data || {};
  return <div className="content"><PageHeader eyebrow="Dashboard" title={`Good morning, ${dashboard.greetingName || user?.name || "there"}.`} description="Here is what is happening around campus today." action={<div className="search-box"><Search size={16} /><input className="input" placeholder="Search campus..." aria-label="Search campus" /></div>} /><div className="grid-4">{Object.entries({ "Community posts": dashboard.stats?.communityPosts || 0, "Active listings": dashboard.stats?.activeListings || 0, Announcements: dashboard.stats?.announcements || 0, "Saved places": dashboard.stats?.savedPlaces || 0 }).map(([label, value], index) => <StatCard key={label} label={label} value={value} icon={[MessageCircle, PackageSearch, Megaphone, MapPin][index]} />)}</div><div className="grid-2" style={{ marginTop: 20 }}><section className="card"><div className="section-title"><h2>Quick access</h2></div><div className="grid-2">{[["/community", Users, "Community"], ["/assistant", Bot, "Ask assistant"], ["/lost-found", PackageSearch, "Lost & Found"], ["/campus-map", MapPin, "Campus map"]].map(([path, Icon, text]) => <Link className="card quick-card" to={path} key={path}><Icon size={20} /> {text}</Link>)}</div></section><section className="card"><div className="section-title"><h2>Recent announcements</h2><Link className="muted" to="/announcements">View all</Link></div><div className="list">{(dashboard.announcements || []).map((item) => <AnnouncementCard key={item.id} announcement={item} />)}{!dashboard.announcements?.length && <EmptyState message="No announcements yet." />}</div></section></div><div className="grid-2" style={{ marginTop: 20 }}><section><div className="section-title"><h2>Community pulse</h2><Link className="muted" to="/community">View all</Link></div><div className="stack">{(dashboard.posts || []).map((post) => <PostCard key={post.id} post={post} />)}</div></section><section><div className="section-title"><h2>Lost & Found</h2><Link className="muted" to="/lost-found">View all</Link></div><div className="card list">{(dashboard.lostFoundItems || []).map((item) => <LostFoundCard key={item.id} item={item} />)}</div></section></div></div>;
}
export function DashboardPage() { return <DashboardPageContent />; }

export function CommunityPage() {
  const toast = useToast();
  const confirm = useConfirm();
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query);
  const [text, setText] = useState("");
  const [loadingAction, setLoadingAction] = useState("");
  const [refresh, setRefresh] = useState(0);
  const result = useLoader(() => communityService.getPosts({ q: debouncedQuery || undefined, category: filter, page: 1, limit: 50 }), [filter, debouncedQuery, refresh]);
  const posts = result.data?.items || [];
  const create = async () => {
    if (!text.trim()) return;
    setLoadingAction("create");
    try { await communityService.createPost({ body: text.trim(), category: filter === "All" ? "Campus life" : filter }); setText(""); toast.success("Post published."); setRefresh((value) => value + 1); } catch (error) { toast.error("Unable to publish post.", { description: error.message }); } finally { setLoadingAction(""); }
  };
  const like = async (post) => {
    setLoadingAction(`like-${post.id}`);
    try { const resultLike = await communityService.toggleLike(post.id); toast.success(resultLike.liked ? "Post liked." : "Like removed."); setRefresh((value) => value + 1); } catch (error) { toast.error("Unable to update like.", { description: error.message }); } finally { setLoadingAction(""); }
  };
  const report = async (post) => {
    const accepted = await confirm.confirm({ title: "Report this post?", description: "The moderation team will review this report.", confirmText: "Report post", variant: "warning" });
    if (!accepted) return;
    try { await communityService.reportPost(post.id, "Community guidelines"); toast.success("Post reported."); } catch (error) { toast.error("Unable to report post.", { description: error.message }); }
  };
  return <div className="content"><PageHeader eyebrow="Community" title="What is happening on campus?" description="Connect with students using anonymous aliases." action={<Button onClick={create} loading={loadingAction === "create"} loadingText="Publishing..."><Plus size={16} /> Post</Button>} /><div className="card stack" style={{ marginBottom: 20 }}><label className="field">Share something with campus<textarea className="textarea" value={text} onChange={(event) => setText(event.target.value)} placeholder="Start a conversation..." maxLength={2000} /></label><div className="list-row"><span className="muted">Your post will use a campus alias.</span><Button onClick={create} disabled={!text.trim()} loading={loadingAction === "create"} loadingText="Publishing...">Publish</Button></div></div><div className="filters">{["All", "Academics", "Campus life"].map((name) => <button className={`filter ${filter === name ? "active" : ""}`} key={name} onClick={() => setFilter(name)}>{name}</button>)}</div><SearchBar value={query} onChange={setQuery} placeholder="Search posts..." /><div className="stack" style={{ marginTop: 20 }}>{result.loading ? <CommunitySkeleton /> : result.error ? <ErrorState message={result.error.message} onRetry={result.reload} /> : posts.map((post) => <PostCard key={post.id} post={post} onLike={() => like(post)} onReport={() => report(post)} liking={loadingAction === `like-${post.id}`} />)}{!result.loading && !result.error && !posts.length && <div className="card"><EmptyState message="No matching posts found." /></div>}</div></div>;
}

export function LostFoundPage() {
  const toast = useToast();
  const [tab, setTab] = useState("All");
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", category: "", location: "", status: "Lost", description: "" });
  const [saving, setSaving] = useState(false);
  const result = useLoader(() => lostFoundService.getItems({ q: debouncedQuery || undefined, status: tab, page: 1, limit: 50 }), [tab, debouncedQuery]);
  const create = async (event) => {
    event.preventDefault(); setSaving(true);
    try { await lostFoundService.createItem(form); toast.success("Listing created."); setForm({ title: "", category: "", location: "", status: "Lost", description: "" }); setShowForm(false); result.reload(); } catch (error) { toast.error("Unable to create listing.", { description: error.message }); } finally { setSaving(false); }
  };
  return <div className="content"><PageHeader eyebrow="Lost & Found" title="Help things find their way home." description="Search active campus listings." action={<Button onClick={() => setShowForm((value) => !value)}><Plus size={16} /> Create listing</Button>} />{showForm && <form className="card stack" onSubmit={create}><div className="grid-2">{[["title", "Title"], ["category", "Category"], ["location", "Location"]].map(([key, label]) => <label className="field" key={key}>{label}<input className="input" value={form[key]} onChange={(event) => setForm({ ...form, [key]: event.target.value })} required /></label>)}<label className="field">Status<select className="select" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}><option>Lost</option><option>Found</option></select></label></div><label className="field">Description<textarea className="textarea" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} required /></label><Button type="submit" loading={saving} loadingText="Creating...">Create listing</Button></form>}<div className="filters">{["All", "Lost", "Found"].map((name) => <button className={`filter ${tab === name ? "active" : ""}`} key={name} onClick={() => setTab(name)}>{name}</button>)}</div><SearchBar value={query} onChange={setQuery} placeholder="Search items or locations..." /><div className="stack" style={{ marginTop: 20 }}>{result.loading ? <LostFoundSkeleton /> : result.error ? <ErrorState message={result.error.message} onRetry={result.reload} /> : result.data?.items?.map((item) => <LostFoundCard key={item.id} item={item} onClick={() => setSelected(item)} />)}{!result.loading && !result.error && !result.data?.items?.length && <div className="card"><EmptyState message="No listings found." /></div>}</div>{selected && <div className="modal-backdrop" onClick={() => setSelected(null)}><div className="card modal" onClick={(event) => event.stopPropagation()}><div className="section-title"><h2>{selected.title}</h2><button className="icon-button" onClick={() => setSelected(null)}><X size={18} /></button></div><span className={`badge ${selected.status === "Found" ? "success" : "warning"}`}>{selected.status}</span><p className="muted" style={{ marginTop: 18 }}>{selected.description}</p><p className="muted" style={{ marginTop: 10 }}><MapPin size={15} /> {selected.location} · {selected.date}</p></div></div>}</div>;
}

export function AnnouncementsPage() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query);
  const result = useLoader(() => announcementService.getAnnouncements({ q: debouncedQuery || undefined, page: 1, limit: 50 }), [debouncedQuery]);
  const items = result.data?.items || [];
  return <div className="content"><PageHeader eyebrow="Announcements" title="Stay in the loop." description="Important updates from across campus." /><SearchBar value={query} onChange={setQuery} placeholder="Search announcements..." /><div className="stack" style={{ marginTop: 20 }}>{result.loading ? <AnnouncementSkeleton /> : result.error ? <ErrorState message={result.error.message} onRetry={result.reload} /> : items.map((item) => <AnnouncementCard key={item.id} announcement={item} />)}{!result.loading && !result.error && !items.length && <div className="card"><EmptyState message="No announcements found." /></div>}</div></div>;
}

export function CampusMapPage() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query);
  const result = useLoader(() => locationService.getLocations({ q: debouncedQuery || undefined, page: 1, limit: 100 }), [debouncedQuery]);
  return <div className="content"><PageHeader eyebrow="Campus locations" title="Find your way around campus." description="Verified locations supplied by the S.H.I.E.L.D. API." /><SearchBar value={query} onChange={setQuery} placeholder="Search locations..." /><div className="grid-2" style={{ marginTop: 20 }}>{result.loading ? <MapSkeleton /> : result.error ? <ErrorState message={result.error.message} onRetry={result.reload} /> : result.data?.items?.map((location) => <article className="card" key={location.id}><div className="section-title"><h2>{location.name}</h2><MapPin size={18} /></div><p className="muted">{location.description}</p><p>{location.address || "Address not provided."}</p>{location.latitude == null || location.longitude == null ? <span className="badge warning">Coordinates unavailable</span> : <span className="badge success">{location.latitude}, {location.longitude}</span>}</article>)}{!result.loading && !result.error && !result.data?.items?.length && <div className="card"><EmptyState message="No verified locations found." /></div>}</div></div>;
}

export function AssistantPage() {
  const [messages, setMessages] = useState(() => [{ id: "welcome", role: "assistant", text: "Hi! I can help you find approved campus information.", timestamp: new Date() }]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const send = async (event, retryText = null) => {
    event.preventDefault();
    const content = (retryText || text).trim();
    if (!content || sending) return;
    const history = messages.filter((message) => message.id !== "welcome" && !message.error).map(({ role, text: message }) => ({ role, content: message }));
    setMessages((current) => [...current, { id: `user-${Date.now()}`, role: "user", text: content, timestamp: new Date() }]);
    setText(""); setSending(true);
    try { const result = await chatWithAssistant({ message: content, conversationHistory: history }); setMessages((current) => [...current, { id: `assistant-${Date.now()}`, role: "assistant", text: result.reply, timestamp: new Date() }]); } catch (error) { setMessages((current) => [...current, { id: `error-${Date.now()}`, role: "assistant", text: error.message, error: true, retryText: content, timestamp: new Date() }]); } finally { setSending(false); }
  };
  return <div className="content"><PageHeader eyebrow="Campus assistant" title="Ask S.H.I.E.L.D.." description="Ask questions grounded in verified campus information." action={<Button variant="outline" onClick={() => setMessages([])} disabled={sending}>Clear conversation</Button>} /><div className="card chat"><div className="messages">{messages.map((message) => <div className={`message ${message.role}`} key={message.id}>{message.text}{message.error && <button className="retry-button" onClick={(event) => send(event, message.retryText)}>Retry</button>}</div>)}{sending && <div className="message assistant typing-indicator">S.H.I.E.L.D. is thinking...</div>}</div><form className="chat-form" onSubmit={send}><textarea className="input chat-textarea" value={text} onChange={(event) => setText(event.target.value)} placeholder="Ask a campus question..." maxLength={2000} rows={2} /><Button type="submit" loading={sending} loadingText="Thinking...">Send <ArrowRight size={16} /></Button></form></div></div>;
}

export function ProfilePage() {
  const { updateUser } = useAuth();
  const toast = useToast();
  const result = useLoader(userService.getProfile);
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);
  const profile = result.data?.user;
  const form = draft || (profile ? { name: profile.name, department: profile.department, bio: profile.bio || "", avatar: profile.avatar || "" } : null);
  const save = async (event) => { event.preventDefault(); setSaving(true); try { const updated = await userService.updateProfile(form); setDraft({ ...form, ...updated.user }); updateUser?.(updated.user); toast.success("Profile updated."); } catch (error) { toast.error("Unable to update profile.", { description: error.message }); } finally { setSaving(false); } };
  if (result.loading) return <ProfileSkeleton />;
  if (result.error) return <div className="content"><ErrorState message={result.error.message} onRetry={result.reload} /></div>;
  return <div className="content"><PageHeader eyebrow="Account" title="Your profile" /><div className="grid-2"><form className="card stack" onSubmit={save}><h2>{profile.name}</h2><label className="field">Name<input className="input" value={form?.name || ""} onChange={(event) => setDraft({ ...form, name: event.target.value })} /></label><label className="field">Department<input className="input" value={form?.department || ""} onChange={(event) => setDraft({ ...form, department: event.target.value })} /></label><label className="field">Bio<textarea className="textarea" value={form?.bio || ""} onChange={(event) => setDraft({ ...form, bio: event.target.value })} maxLength={250} /></label><Button type="submit" loading={saving} loadingText="Saving..."><Pencil size={16} /> Save profile</Button></form><div className="card list"><div className="list-row"><span className="muted">Email</span><span>{profile.email}</span></div><div className="list-row"><span className="muted">Student ID</span><span>{profile.studentId}</span></div><div className="list-row"><span className="muted">Role</span><span>{profile.role}</span></div><div className="list-row"><span className="muted">Posts</span><span>{result.data.activity.posts}</span></div><div className="list-row"><span className="muted">Helpful likes</span><span>{result.data.activity.helpfulLikes}</span></div></div></div></div>;
}

function AdminPage({ type }) {
  const toast = useToast();
  const confirm = useConfirm();
  const [refresh, setRefresh] = useState(0);
  const [saving, setSaving] = useState("");
  const config = {
    announcements: { title: "Manage announcements", description: "Create and manage campus updates.", loader: adminService.getAnnouncements },
    reports: { title: "Manage reports", description: "Review community reports.", loader: adminService.getReports },
    users: { title: "Manage users", description: "Review user roles and account status.", loader: adminService.getUsers },
  }[type];
  const result = useLoader(() => config.loader({ page: 1, limit: 100 }), [type, refresh]);
  const rows = result.data?.items || [];
  const updateReport = async (id, status) => { setSaving(id); try { await adminService.reviewReport(id, status); toast.success("Report updated."); setRefresh((value) => value + 1); } catch (error) { toast.error("Unable to update report.", { description: error.message }); } finally { setSaving(""); } };
  const updateUser = async (id, status) => { setSaving(id); try { await adminService.updateUser(id, { status }); toast.success("User updated."); setRefresh((value) => value + 1); } catch (error) { toast.error("Unable to update user.", { description: error.message }); } finally { setSaving(""); } };
  const deleteAnnouncement = async (id) => { if (!(await confirm.confirm({ title: "Delete announcement?", description: "This action cannot be undone.", confirmText: "Delete", variant: "danger" }))) return; setSaving(id); try { await adminService.deleteAnnouncement(id); toast.success("Announcement deleted."); setRefresh((value) => value + 1); } catch (error) { toast.error("Unable to delete announcement.", { description: error.message }); } finally { setSaving(""); } };
  if (result.loading) return <TableSkeleton />;
  if (result.error) return <div className="content"><ErrorState message={result.error.message} onRetry={result.reload} /></div>;
  return <div className="content"><PageHeader eyebrow="Administration" title={config.title} description={config.description} /><div className="card table-wrap"><table><thead><tr>{type === "announcements" ? <><th>Title</th><th>Department</th><th>Status</th><th>Action</th></> : type === "reports" ? <><th>Content</th><th>Reason</th><th>Status</th><th>Action</th></> : <><th>Name</th><th>Department</th><th>Role</th><th>Status</th><th>Action</th></>}</tr></thead><tbody>{rows.map((row) => type === "announcements" ? <tr key={row.id}><td>{row.title}</td><td>{row.department}</td><td>{row.status}</td><td><Button variant="outline" onClick={() => deleteAnnouncement(row.id)} loading={saving === row.id} loadingText="Deleting...">Delete</Button></td></tr> : type === "reports" ? <tr key={row.id}><td>{row.content?.title || "Removed content"}</td><td>{row.reason}</td><td>{row.status}</td><td>{row.status === "pending" && <Button onClick={() => updateReport(row.id, "reviewed")} loading={saving === row.id} loadingText="Updating...">Review</Button>}</td></tr> : <tr key={row.id}><td>{row.name}</td><td>{row.department}</td><td>{row.role}</td><td>{row.status}</td><td><Button variant="outline" onClick={() => updateUser(row.id, row.status === "active" ? "inactive" : "active")} loading={saving === row.id} loadingText="Updating...">{row.status === "active" ? "Deactivate" : "Activate"}</Button></td></tr>)}</tbody></table>{!rows.length && <EmptyState message="No records found." />}</div></div>;
}

export function AdminDashboardPage() {
  const result = useLoader(adminService.getSummary);
  if (result.loading) return <TableSkeleton />;
  if (result.error) return <div className="content"><ErrorState message={result.error.message} onRetry={result.reload} /></div>;
  const summary = result.data || {};
  return <div className="content"><PageHeader eyebrow="Administration" title="Keep S.H.I.E.L.D. running smoothly." description="Live moderation and platform statistics." /><div className="grid-4">{[["Students", summary.totalStudents, Users], ["Announcements", summary.announcements, Megaphone], ["Pending reports", summary.pendingReports, ShieldCheck], ["Active today", summary.activeToday, Users]].map(([label, value, Icon]) => <StatCard key={label} label={label} value={value || 0} icon={Icon} />)}</div><div className="grid-2" style={{ marginTop: 20 }}><Link className="card quick-card" to="/admin/announcements">Manage announcements</Link><Link className="card quick-card" to="/admin/reports">Review reports</Link><Link className="card quick-card" to="/admin/users">Manage users</Link></div></div>;
}
export function ManageAnnouncementsPage() { return <AdminPage type="announcements" />; }
export function ManageReportsPage() { return <AdminPage type="reports" />; }
export function ManageUsersPage() { return <AdminPage type="users" />; }
export function NotFoundPage() { return <div className="content"><EmptyState message="The page you requested was not found." /></div>; }
export function AccessDeniedPage() { return <div className="content"><EmptyState message="You do not have permission to view this page." /></div>; }
