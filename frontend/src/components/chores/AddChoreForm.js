import React, { useState } from "react";
import { createChore } from "../../services/choreService.js";
import { Button, Input, Select } from "../ui/index.jsx";

const DEFAULT = {
  title: "",
  description: "",
  category: "",
  difficulty: "medium",
  priority: "medium",
  frequency: "weekly",
  estMinutes: 30,
};

export default function AddChoreForm({ householdId, onCreated, onCancel }) {
  const [form, setForm] = useState(DEFAULT);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await createChore(householdId, form);
      setForm(DEFAULT);
      onCreated?.();
    } catch (err) {
      setError(err.response?.data?.error || "Couldn't create that chore.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="font-sans text-xs text-creamDim block mb-1.5">Title</label>
        <Input required value={form.title} onChange={set("title")} placeholder="Clean kitchen" />
      </div>
      <div>
        <label className="font-sans text-xs text-creamDim block mb-1.5">Description</label>
        <Input
          value={form.description}
          onChange={set("description")}
          placeholder="Counters, dishes, stovetop"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="font-sans text-xs text-creamDim block mb-1.5">Category</label>
          <Input value={form.category} onChange={set("category")} placeholder="Kitchen" />
        </div>
        <div>
          <label className="font-sans text-xs text-creamDim block mb-1.5">Frequency</label>
          <Select value={form.frequency} onChange={set("frequency")}>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="biweekly">Biweekly</option>
            <option value="monthly">Monthly</option>
          </Select>
        </div>
        <div>
          <label className="font-sans text-xs text-creamDim block mb-1.5">Difficulty</label>
          <Select value={form.difficulty} onChange={set("difficulty")}>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </Select>
        </div>
        <div>
          <label className="font-sans text-xs text-creamDim block mb-1.5">Priority</label>
          <Select value={form.priority} onChange={set("priority")}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </Select>
        </div>
      </div>
      <div>
        <label className="font-sans text-xs text-creamDim block mb-1.5">Estimated minutes</label>
        <Input type="number" min="5" step="5" value={form.estMinutes} onChange={set("estMinutes")} />
      </div>
      {error && <p className="font-sans text-xs text-danger">{error}</p>}
      <div className="flex gap-2 pt-1">
        <Button type="submit" variant="solid" disabled={busy}>
          Create chore
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}