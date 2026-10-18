
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  CircleHelp,
  ClipboardList,
  Filter,
  LayoutDashboard,
  LogOut,
  Menu,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  TrendingUp,
  UserRound,
  X,
  XCircle,
} from "lucide-react";

import {
  createApplication,
  deleteApplication,
  getApplications,
  login,
  register,
  updateApplication,
} from "./api";

import "./App.css";

const STATUSES = [
  "Applied",
  "Assessment",
  "Interview",
  "Offer",
  "Rejected",
];

const EMPTY_JOB = {
  company: "",
  role: "",
  status: "Applied",
};

function sessionFromStorage() {
  const token = localStorage.getItem("accessToken");

  return token
    ? {
        token,
        name: localStorage.getItem("userName") || "User",
        email: localStorage.getItem("userEmail") || "",
      }
    : null;
}

function Brand({ light = false }) {
  return (
    <div className={`brand ${light ? "brand-light" : ""}`}>
      <div className="brand-mark">
        <BriefcaseBusiness size={20} />
      </div>
      <span>
        Placement<span className="brand-highlight">Tracker</span>
      </span>
    </div>
  );
}

function AuthScreen({ onAuthenticated }) {
  const [mode, setMode] = useState("login");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState(null);

  const change = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setNotice(null);
  };

  function switchMode(nextMode) {
    setMode(nextMode);
    setNotice(null);
    setShowPassword(false);
  }

  async function submit(event) {
    event.preventDefault();
    setNotice(null);

    // Prevent duplicate submissions.
    if (loading) return;

    // Validate registration before calling the backend.
    if (mode === "register") {
      if (form.name.trim().length < 2) {
        setNotice({
          type: "error",
          text: "Name must contain at least 2 characters.",
        });
        return;
      }

      if (form.password.length < 8) {
        setNotice({
          type: "error",
          text: "Password must contain at least 8 characters.",
        });
        return;
      }
    }

    setLoading(true);

    try {
      if (mode === "register") {
        await register({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
        });

        // Switch to login ONLY after successful registration.
        setMode("login");
        setForm((previous) => ({
          ...previous,
          password: "",
        }));

        setNotice({
          type: "success",
          text: "Account created successfully. Please sign in.",
        });
      } else {
        const data = await login({
          email: form.email.trim(),
          password: form.password,
        });

        if (!data?.accessToken) {
          throw new Error(
            "Login response did not include an access token."
          );
        }

        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("userName", data.name || "User");
        localStorage.setItem(
          "userEmail",
          data.email || form.email.trim()
        );

        onAuthenticated(sessionFromStorage());
      }
    } catch (error) {
      // Keep the current page open when registration/login fails.
      setNotice({
        type: "error",
        text:
          error.message ||
          "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-layout">
      <section className="auth-visual">
        <div className="visual-orbit orbit-a" />
        <div className="visual-orbit orbit-b" />

        <div className="visual-content">
          <Brand light />

          <div className="visual-message">
            <span className="eyebrow">
              <span className="eyebrow-dot" />
              YOUR NEXT CHAPTER STARTS HERE
            </span>

            <h1>
              Make every
              <br />
              <span>application count.</span>
            </h1>

            <p>
              One calm, clear place to manage your job search,
              follow your progress, and prepare for the opportunity
              ahead.
            </p>

            <div className="visual-points">
              <div>
                <span className="point-icon">
                  <Check size={15} />
                </span>
                Track every application
              </div>

              <div>
                <span className="point-icon">
                  <Check size={15} />
                </span>
                See your progress at a glance
              </div>

              <div>
                <span className="point-icon">
                  <Check size={15} />
                </span>
                Keep your career goals in focus
              </div>
            </div>
          </div>

          <div className="visual-foot">
            <ShieldCheck size={16} />
            Your personal job search workspace
          </div>
        </div>
      </section>

      <section className="auth-main">
        <div className="auth-mobile-brand">
          <Brand />
        </div>

        <div className="auth-card">
          <div className="auth-kicker">
            {mode === "login"
              ? "WELCOME BACK"
              : "START YOUR JOURNEY"}
          </div>

          <h2>
            {mode === "login"
              ? "Sign in to your account"
              : "Create your account"}
          </h2>

          <p className="auth-subtitle">
            {mode === "login"
              ? "Enter your details to pick up where you left off."
              : "A few details and your job search is organized."}
          </p>

          <div className="auth-switch">
            <button
              type="button"
              className={mode === "login" ? "selected" : ""}
              onClick={() => switchMode("login")}
            >
              Sign in
            </button>

            <button
              type="button"
              className={mode === "register" ? "selected" : ""}
              onClick={() => switchMode("register")}
            >
              Create account
            </button>
          </div>

          <form onSubmit={submit} className="auth-form">
            {mode === "register" && (
              <label className="form-field">
                <span>Full name</span>

                <div className="input-shell">
                  <UserRound size={17} />

                  <input
                    name="name"
                    value={form.name}
                    onChange={change}
                    placeholder="Your full name"
                    autoComplete="name"
                    minLength={2}
                    maxLength={100}
                    required
                  />
                </div>
              </label>
            )}

            <label className="form-field">
              <span>Email address</span>

              <div className="input-shell">
                <span className="input-icon-text">@</span>

                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={change}
                  placeholder="you@example.com"
                  autoComplete="email"
                  maxLength={180}
                  required
                />
              </div>
            </label>

            <label className="form-field">
              <span>Password</span>

              <div className="input-shell">
                <ShieldCheck size={17} />

                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={change}
                  placeholder={
                    mode === "register"
                      ? "At least 8 characters"
                      : "Enter your password"
                  }
                  autoComplete={
                    mode === "login"
                      ? "current-password"
                      : "new-password"
                  }
                  minLength={
                    mode === "register" ? 8 : undefined
                  }
                  maxLength={128}
                  required
                />

                <button
                  className="show-password"
                  type="button"
                  onClick={() =>
                    setShowPassword((previous) => !previous)
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {mode === "register" && (
                <small className="password-hint">
                  Use at least 8 characters.
                </small>
              )}
            </label>

            {notice && (
              <div
                className={`notice notice-${notice.type}`}
                role="alert"
                aria-live="polite"
              >
                {notice.text}
              </div>
            )}

            <button
              className="primary-button auth-submit"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner" />
                  Please wait…
                </>
              ) : (
                <>
                  {mode === "login"
                    ? "Sign in"
                    : "Create account"}
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          <div className="auth-bottom">
            {mode === "login"
              ? "New to Placement Tracker?"
              : "Already have an account?"}

            <button
              type="button"
              onClick={() =>
                switchMode(
                  mode === "login" ? "register" : "login"
                )
              }
            >
              {mode === "login"
                ? "Create an account"
                : "Sign in instead"}
            </button>
          </div>

          <div className="auth-security">
            <ShieldCheck size={15} />
            Secured with token-based authentication
          </div>
        </div>
      </section>
    </main>
  );
}

function StatusBadge({ status }) {
  const key = (status || "Applied")
    .toLowerCase()
    .replace(/\s+/g, "-");

  return (
    <span className={`status-badge status-${key}`}>
      {status || "Applied"}
    </span>
  );
}

function StatCard({ title, value, detail, icon: Icon, tone }) {
  return (
    <article className="stat-card">
      <div className={`stat-icon ${tone}`}>
        <Icon size={19} />
      </div>

      <div className="stat-label">{title}</div>
      <div className="stat-value">{value}</div>

      <div className="stat-detail">
        <TrendingUp size={13} />
        {detail}
      </div>
    </article>
  );
}

function ApplicationModal({ initial, onClose, onSave, saving }) {
  const [form, setForm] = useState(initial || EMPTY_JOB);
  const [error, setError] = useState("");

  function submit(event) {
    event.preventDefault();

    if (!form.company.trim() || !form.role.trim()) {
      setError("Please complete all fields.");
      return;
    }

    onSave({
      company: form.company.trim(),
      role: form.role.trim(),
      status: form.status,
    });
  }

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="job-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-header">
          <div>
            <span className="modal-kicker">
              {initial?.id
                ? "UPDATE DETAILS"
                : "NEW OPPORTUNITY"}
            </span>

            <h2 id="modal-title">
              {initial?.id
                ? "Edit application"
                : "Add an application"}
            </h2>
          </div>

          <button
            type="button"
            className="icon-button"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <form className="modal-form" onSubmit={submit}>
          <label className="form-field">
            <span>Company name</span>

            <div className="input-shell">
              <Building2 size={17} />

              <input
                autoFocus
                maxLength={100}
                value={form.company}
                onChange={(event) => {
                  setForm({
                    ...form,
                    company: event.target.value,
                  });
                  setError("");
                }}
                placeholder="e.g. Infosys"
                required
              />
            </div>
          </label>

          <label className="form-field">
            <span>Job role</span>

            <div className="input-shell">
              <BriefcaseBusiness size={17} />

              <input
                maxLength={100}
                value={form.role}
                onChange={(event) => {
                  setForm({
                    ...form,
                    role: event.target.value,
                  });
                  setError("");
                }}
                placeholder="e.g. Software Engineer"
                required
              />
            </div>
          </label>

          <label className="form-field">
            <span>Application status</span>

            <div className="select-shell">
              <select
                value={form.status}
                onChange={(event) =>
                  setForm({
                    ...form,
                    status: event.target.value,
                  })
                }
              >
                {STATUSES.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>

              <ChevronDown size={16} />
            </div>
          </label>

          {error && (
            <div className="notice notice-error" role="alert">
              {error}
            </div>
          )}

          <div className="modal-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              className="primary-button"
              type="submit"
              disabled={saving}
            >
              {saving ? (
                "Saving…"
              ) : (
                <>
                  {initial?.id
                    ? "Save changes"
                    : "Add application"}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function Dashboard({ user, onLogout }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [pageError, setPageError] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [sort, setSort] = useState("newest");
  const [modal, setModal] = useState(null);
  const [notice, setNotice] = useState("");
  const [mobileNav, setMobileNav] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setPageError("");

    try {
      setApplications(await getApplications());
    } catch (error) {
      setPageError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    return applications
      .filter((item) => {
        const searchText = query.trim().toLowerCase();

        const matchesSearch =
          !searchText ||
          `${item.company || ""} ${item.role || ""}`
            .toLowerCase()
            .includes(searchText);

        const matchesStatus =
          statusFilter === "All statuses" ||
          (item.status || "").toLowerCase() ===
            statusFilter.toLowerCase();

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) =>
        sort === "company"
          ? (a.company || "").localeCompare(b.company || "")
          : Number(b.id || 0) - Number(a.id || 0)
      );
  }, [applications, query, statusFilter, sort]);

  const stats = useMemo(
    () => ({
      total: applications.length,
      interviews: applications.filter((application) =>
        (application.status || "")
          .toLowerCase()
          .includes("interview")
      ).length,
      offers: applications.filter((application) =>
        ["offer", "offered"].includes(
          (application.status || "").toLowerCase()
        )
      ).length,
      rejected: applications.filter(
        (application) =>
          (application.status || "").toLowerCase() === "rejected"
      ).length,
    }),
    [applications]
  );

  async function save(data) {
    setBusy(true);
    setPageError("");
    setNotice("");

    try {
      if (modal?.id) {
        await updateApplication(modal.id, data);
      } else {
        await createApplication(data);
      }

      setModal(null);
      setNotice(
        modal?.id
          ? "Application updated successfully."
          : "Application added successfully."
      );

      await load();
    } catch (error) {
      setPageError(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function remove(item) {
    const confirmed = window.confirm(
      `Delete the ${item.company} application? This cannot be undone.`
    );

    if (!confirmed) return;

    setPageError("");
    setNotice("");

    try {
      await deleteApplication(item.id);

      setApplications((previous) =>
        previous.filter((application) => application.id !== item.id)
      );

      setNotice("Application deleted.");
    } catch (error) {
      setPageError(error.message);
    }
  }

  return (
    <div className="dashboard-layout">
      <aside
        className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}
      >
        <div className="sidebar-brand">
          <Brand light />

          <button
            className="mobile-close icon-button"
            onClick={() => setMobileNav(false)}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <div className="sidebar-caption">WORKSPACE</div>

        <button
          className="nav-item nav-active"
          onClick={() => setMobileNav(false)}
        >
          <LayoutDashboard size={18} />
          Dashboard
        </button>

        <button
          className="nav-item"
          onClick={() => {
            setStatusFilter("All statuses");
            setQuery("");
            setMobileNav(false);
          }}
        >
          <ClipboardList size={18} />
          All applications
          <span className="nav-count">{applications.length}</span>
        </button>

        <div className="sidebar-caption sidebar-caption-spaced">
          APPLICATION STATUS
        </div>

        {STATUSES.map((status) => (
          <button
            key={status}
            className="nav-item nav-status"
            onClick={() => {
              setStatusFilter(status);
              setMobileNav(false);
            }}
          >
            <span
              className={`mini-status mini-${status.toLowerCase()}`}
            />
            {status}
          </button>
        ))}

        <div className="sidebar-bottom">
          <div className="sidebar-help">
            <CircleHelp size={17} />

            <div>
              <strong>Keep going!</strong>
              <span>Every application is progress.</span>
            </div>
          </div>

          <div className="sidebar-user">
            <div className="avatar">
              {(user.name || "U").slice(0, 1).toUpperCase()}
            </div>

            <div className="sidebar-user-info">
              <strong>{user.name}</strong>
              <span>{user.email}</span>
            </div>

            <button
              className="logout-icon"
              onClick={onLogout}
              aria-label="Log out"
            >
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <button
            className="mobile-menu icon-button"
            onClick={() => setMobileNav(true)}
            aria-label="Open menu"
          >
            <Menu size={21} />
          </button>

          <div className="breadcrumb">
            Workspace <span>/</span> <strong>Dashboard</strong>
          </div>

          <div className="topbar-right">
            <span className="topbar-date">
              <CalendarDays size={15} />
              Your placement journey
            </span>

            <div className="topbar-avatar">
              {(user.name || "U").slice(0, 1).toUpperCase()}
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          <section className="page-intro">
            <div>
              <div className="page-eyebrow">OVERVIEW</div>

              <h1>
                Good to see you, {user.name.split(" ")[0]}{" "}
                <span className="wave">✦</span>
              </h1>

              <p>Here's where your job search stands today.</p>
            </div>

            <button
              className="primary-button add-button"
              onClick={() => {
                setPageError("");
                setModal({ ...EMPTY_JOB });
              }}
            >
              <Plus size={18} />
              Add application
            </button>
          </section>

          {pageError && (
            <div
              className="notice notice-error page-notice"
              role="alert"
            >
              <XCircle size={17} />
              <span>{pageError}</span>

              <button
                onClick={() => setPageError("")}
                aria-label="Dismiss error"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {notice && (
            <div className="notice notice-success page-notice">
              <Check size={17} />
              <span>{notice}</span>

              <button
                onClick={() => setNotice("")}
                aria-label="Dismiss message"
              >
                <X size={16} />
              </button>
            </div>
          )}

          <section className="stats-grid">
            <StatCard
              title="Total applications"
              value={loading ? "—" : stats.total}
              detail="Your opportunities"
              icon={BriefcaseBusiness}
              tone="blue"
            />

            <StatCard
              title="Interviews"
              value={loading ? "—" : stats.interviews}
              detail="Interview stage"
              icon={CalendarDays}
              tone="purple"
            />

            <StatCard
              title="Offers"
              value={loading ? "—" : stats.offers}
              detail="Potential wins"
              icon={TrendingUp}
              tone="green"
            />

            <StatCard
              title="Rejected"
              value={loading ? "—" : stats.rejected}
              detail="Keep moving forward"
              icon={ArrowDownRight}
              tone="orange"
            />
          </section>

          <section className="applications-panel">
            <div className="panel-heading">
              <div>
                <h2>Your applications</h2>
                <p>Keep every opportunity in view.</p>
              </div>

              <div className="panel-total">
                <span className="live-dot" />
                {applications.length} total
              </div>
            </div>

            <div className="table-toolbar">
              <div className="search-box">
                <Search size={17} />

                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search company or role…"
                  aria-label="Search applications"
                />

                <kbd>⌘ K</kbd>
              </div>

              <label className="filter-control">
                <Filter size={16} />

                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value)
                  }
                >
                  <option>All statuses</option>

                  {STATUSES.map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>

                <ChevronDown size={15} />
              </label>

              <label className="filter-control sort-control">
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                >
                  <option value="newest">Recently added</option>
                  <option value="company">Company A–Z</option>
                </select>

                <ChevronDown size={15} />
              </label>
            </div>

            <div className="table-wrap">
              <table className="applications-table">
                <thead>
                  <tr>
                    <th>COMPANY / ROLE</th>
                    <th>STATUS</th>
                    <th>APPLICATION ID</th>
                    <th className="actions-heading">ACTIONS</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="4">
                        <div className="table-state">
                          <span className="spinner spinner-dark" />
                          Loading your applications…
                        </div>
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan="4">
                        <div className="empty-state">
                          <div className="empty-icon">
                            <BriefcaseBusiness size={23} />
                          </div>

                          <strong>
                            {applications.length
                              ? "No matching applications"
                              : "Your next opportunity starts here"}
                          </strong>

                          <span>
                            {applications.length
                              ? "Try changing your search or filter."
                              : "Add your first application to start tracking your progress."}
                          </span>

                          {!applications.length && (
                            <button
                              className="primary-button"
                              onClick={() =>
                                setModal({ ...EMPTY_JOB })
                              }
                            >
                              <Plus size={16} />
                              Add application
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="company-cell">
                            <div className="company-logo">
                              {(item.company || "?")
                                .slice(0, 1)
                                .toUpperCase()}
                            </div>

                            <div>
                              <strong>{item.company}</strong>
                              <span>{item.role}</span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <StatusBadge status={item.status} />
                        </td>

                        <td>
                          <span className="application-id">
                            #{item.id}
                          </span>
                        </td>

                        <td>
                          <div className="row-actions">
                            <button
                              className="row-action edit-action"
                              title="Edit application"
                              aria-label={`Edit ${item.company}`}
                              onClick={() => {
                                setPageError("");

                                setModal({
                                  id: item.id,
                                  company: item.company || "",
                                  role: item.role || "",
                                  status: item.status || "Applied",
                                });
                              }}
                            >
                              <Pencil size={15} />
                            </button>

                            <button
                              className="row-action delete-action"
                              title="Delete application"
                              aria-label={`Delete ${item.company}`}
                              onClick={() => remove(item)}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="panel-footer">
              <span>
                Showing <strong>{filtered.length}</strong> of{" "}
                <strong>{applications.length}</strong> applications
              </span>

              <button className="refresh-button" onClick={load}>
                <Activity size={15} />
                Refresh data
              </button>
            </div>
          </section>

          <footer className="dashboard-footer">
            <span>Placement Tracker</span>

            <span>
              <ShieldCheck size={14} />
              Your applications are private to your account
            </span>
          </footer>
        </div>
      </main>

      {mobileNav && (
        <button
          className="mobile-scrim"
          aria-label="Close navigation"
          onClick={() => setMobileNav(false)}
        />
      )}

      {modal && (
        <ApplicationModal
          key={modal.id || "new"}
          initial={modal.id ? modal : null}
          onClose={() => setModal(null)}
          onSave={save}
          saving={busy}
        />
      )}
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(sessionFromStorage);

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    setUser(null);
  };

  return user ? (
    <Dashboard user={user} onLogout={logout} />
  ) : (
    <AuthScreen onAuthenticated={setUser} />
  );
}
