import React, { useState } from "react";
import API from "../services/api";
import heroImg from "../assets/hero.png";

function AuthPage({ onAuth }) {
  const [mode, setMode] = useState("login");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: ""
  });

  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [anim, setAnim] = useState("aScaleIn");

  const switchMode = (m) => {
    if (m === mode) return;

    setAnim(m === "signup" ? "aSlideL" : "aSlideR");

    setMode(m);

    setErr("");

    setForm({
      name: "",
      email: "",
      password: "",
      confirm: ""
    });
  };

  const validate = () => {
    if (mode === "signup") {
      if (!form.name.trim()) {
        return "Full name is required.";
      }

      if (form.name.trim().length < 2) {
        return "Name must be at least 2 characters.";
      }
    }

    if (!form.email.trim()) {
      return "Email is required.";
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      return "Enter a valid email address.";
    }

    if (!form.password) {
      return "Password is required.";
    }

    if (form.password.length < 6) {
      return "Password must be at least 6 characters.";
    }

    if (
      mode === "signup" &&
      form.password !== form.confirm
    ) {
      return "Passwords do not match.";
    }

    return null;
  };

  const submit = async () => {
    const e = validate();

    if (e) {
      setErr(e);
      setAnim("aShake");
      return;
    }

    try {
      setLoading(true);
      setErr("");

      // LOGIN
      if (mode === "login") {
       const res = await API.post(
         "/auth/login",
          {
            email: form.email,
            password: form.password
          }
        );

        // SAVE TOKEN
        localStorage.setItem(
          "token",
          res.data.token
        );

        // SAVE USER
        localStorage.setItem(
          "user",
          JSON.stringify(res.data.user)
        );

        onAuth(res.data.user);
      }

      // SIGNUP
      else {
        await API.post(
          "/auth/register",
          {
            name: form.name,
            email: form.email,
            password: form.password
          }
        );

        setErr(
          "Account created successfully! Please login."
        );

        setMode("login");

        setForm({
          name: "",
          email: "",
          password: "",
          confirm: ""
        });
      }
    } catch (error) {
      setErr(
        error.response?.data?.message ||
          "Something went wrong"
      );

      setAnim("aShake");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        position: "relative",
        overflow: "hidden",
        background: "var(--bg)"
      }}
    >
      {/* Background blobs */}
      <div
        className="blob"
        style={{
          width: 500,
          height: 500,
          background: "#4f9eff",
          top: "-20%",
          left: "-15%",
          animationDelay: "0s"
        }}
      />

      <div
        className="blob"
        style={{
          width: 400,
          height: 400,
          background: "#a78bfa",
          bottom: "-15%",
          right: "-10%",
          animationDelay: "4s"
        }}
      />

      <div
        className="blob"
        style={{
          width: 280,
          height: 280,
          background: "#34d399",
          top: "55%",
          left: "25%",
          animationDelay: "7s",
          opacity: 0.1
        }}
      />

      {/* Grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px)",
          backgroundSize: "44px 44px",
          pointerEvents: "none"
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: 440,
          position: "relative",
          zIndex: 1
        }}
      >
        <img
          src={heroImg}
          alt="Finance illustration"
          style={{
            position: "absolute",
            right: -36,
            top: -18,
            width: 180,
            opacity: 0.15,
            pointerEvents: "none",
            filter:
              "drop-shadow(0 20px 40px rgba(0,0,0,.18))"
          }}
        />

        {/* Logo */}
        <div
          className="aFadeUp aPulse"
          style={{
            textAlign: "center",
            marginBottom: 36
          }}
        >
          <div
            style={{
              position: "relative",
              display: "inline-block",
              marginBottom: 18
            }}
          >
            <div
              style={{
                position: "absolute",
                width: 80,
                height: 80,
                borderRadius: "50%",
                border:
                  "1px solid rgba(79,158,255,.35)",
                top: -10,
                left: -10,
                animation:
                  "ring 2.5s ease-out infinite"
              }}
            />

            <div
              style={{
                position: "absolute",
                width: 80,
                height: 80,
                borderRadius: "50%",
                border:
                  "1px solid rgba(79,158,255,.2)",
                top: -10,
                left: -10,
                animation:
                  "ring 2.5s ease-out infinite",
                animationDelay: "1.2s"
              }}
            />

            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: 20,
                background:
                  "linear-gradient(135deg,#4f9eff,#a78bfa)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                boxShadow:
                  "0 8px 32px rgba(79,158,255,.4)",
                animation:
                  "float 4s ease-in-out infinite"
              }}
            >
              💰
            </div>
          </div>

          <h1
            style={{
              fontSize: 30,
              fontWeight: 900
            }}
          >
            <span className="shimmer">
              Smart Finance Tracker
            </span>
          </h1>

          <p
            style={{
              color: "var(--muted)",
              fontSize: 14
            }}
          >
            Your personal financial intelligence
            platform
          </p>
        </div>

        {/* Card */}
        <div
          className={`${anim} d1`}
          style={{
            background: "rgba(14,17,23,.88)",
            backdropFilter: "blur(28px)",
            border:
              "1px solid rgba(255,255,255,.1)",
            borderRadius: 24,
            padding: 32,
            boxShadow:
              "0 28px 70px rgba(0,0,0,.55)"
          }}
        >
          <div style={{ marginBottom: 24 }}>
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                marginBottom: 12,
                textAlign: "center"
              }}
            >
              {mode === "login"
                ? "💬 Login"
                : "🚀 Create Account"}
            </div>

            <div
              style={{
                display: "flex",
                gap: 8,
                background:
                  "rgba(255,255,255,.05)",
                borderRadius: 12,
                padding: 4
              }}
            >
              <button
                onClick={() =>
                  switchMode("login")
                }
                style={{
                  flex: 1,
                  padding: "10px 16px",
                  borderRadius: 8,
                  background:
                    mode === "login"
                      ? "rgba(79,158,255,.15)"
                      : "transparent",
                  border:
                    mode === "login"
                      ? "1px solid rgba(79,158,255,.3)"
                      : "none",
                  color:
                    mode === "login"
                      ? "var(--accent)"
                      : "var(--muted)",
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: "pointer",
                  transition: "all .2s"
                }}
              >
                Login
              </button>

              <button
                onClick={() =>
                  switchMode("signup")
                }
                style={{
                  flex: 1,
                  padding: "10px 16px",
                  borderRadius: 8,
                  background:
                    mode === "signup"
                      ? "rgba(167,139,250,.15)"
                      : "transparent",
                  border:
                    mode === "signup"
                      ? "1px solid rgba(167,139,250,.3)"
                      : "none",
                  color:
                    mode === "signup"
                      ? "var(--accent2)"
                      : "var(--muted)",
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: "pointer",
                  transition: "all .2s"
                }}
              >
                Sign Up
              </button>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14
            }}
          >
            {mode === "signup" && (
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 600,
                    marginBottom: 6,
                    color: "var(--muted)"
                  }}
                >
                  Full Name
                </label>

                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value
                    })
                  }
                  placeholder="John Doe"
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: 10,
                    background:
                      "rgba(255,255,255,.05)",
                    border:
                      "1px solid rgba(255,255,255,.1)",
                    color: "var(--text)",
                    fontSize: 14,
                    outline: "none"
                  }}
                />
              </div>
            )}

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 600,
                  marginBottom: 6,
                  color: "var(--muted)"
                }}
              >
                Email
              </label>

              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value
                  })
                }
                placeholder="you@example.com"
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: 10,
                  background:
                    "rgba(255,255,255,.05)",
                  border:
                    "1px solid rgba(255,255,255,.1)",
                  color: "var(--text)",
                  fontSize: 14,
                  outline: "none"
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 600,
                  marginBottom: 6,
                  color: "var(--muted)"
                }}
              >
                Password
              </label>

              <div
                style={{
                  position: "relative"
                }}
              >
                <input
                  type={
                    showPw
                      ? "text"
                      : "password"
                  }
                  value={form.password}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password: e.target.value
                    })
                  }
                  placeholder="••••••••"
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    paddingRight: 40,
                    borderRadius: 10,
                    background:
                      "rgba(255,255,255,.05)",
                    border:
                      "1px solid rgba(255,255,255,.1)",
                    color: "var(--text)",
                    fontSize: 14,
                    outline: "none"
                  }}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPw(!showPw)
                  }
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform:
                      "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "var(--muted)",
                    cursor: "pointer",
                    fontSize: 16
                  }}
                >
                  {showPw ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            {mode === "signup" && (
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 600,
                    marginBottom: 6,
                    color: "var(--muted)"
                  }}
                >
                  Confirm Password
                </label>

                <input
                  type={
                    showPw
                      ? "text"
                      : "password"
                  }
                  value={form.confirm}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      confirm: e.target.value
                    })
                  }
                  placeholder="••••••••"
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: 10,
                    background:
                      "rgba(255,255,255,.05)",
                    border:
                      "1px solid rgba(255,255,255,.1)",
                    color: "var(--text)",
                    fontSize: 14,
                    outline: "none"
                  }}
                />
              </div>
            )}

            {err && (
              <div
                style={{
                  padding: "12px 14px",
                  borderRadius: 10,
                  background:
                    "rgba(248,113,113,.1)",
                  border:
                    "1px solid rgba(248,113,113,.3)",
                  color: "var(--red)",
                  fontSize: 13,
                  lineHeight: 1.5
                }}
              >
                {err}
              </div>
            )}

            <button
              onClick={submit}
              disabled={loading}
              style={{
                padding: "12px 16px",
                borderRadius: 12,
                background:
                  "linear-gradient(135deg,var(--accent),var(--accent2))",
                border: "none",
                color: "white",
                fontWeight: 700,
                fontSize: 14,
                cursor: loading
                  ? "not-allowed"
                  : "pointer",
                opacity: loading ? 0.6 : 1,
                transition: "all .2s",
                marginTop: 4
              }}
            >
              {loading
                ? "⏳ Loading..."
                : mode === "login"
                ? "Login"
                : "Create Account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;