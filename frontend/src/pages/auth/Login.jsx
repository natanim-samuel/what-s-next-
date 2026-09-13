import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { Button, Input } from "../../components/ui/index.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Couldn't log in. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="font-sans text-xs text-creamDim block mb-1.5">Email</label>
        <Input
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </div>
      <div>
        <label className="font-sans text-xs text-creamDim block mb-1.5">Password</label>
        <Input
          type="password"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
      </div>
      {error && <p className="font-sans text-xs text-danger">{error}</p>}
      <Button type="submit" variant="solid" className="w-full" disabled={loading}>
        {loading ? "Logging in..." : "Log in"}
      </Button>
      <p className="font-sans text-xs text-creamDim text-center pt-2">
        No account? <Link to="/register" className="text-gold">Create one</Link>
      </p>
    </form>
  );
}