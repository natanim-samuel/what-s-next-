import React, { useEffect, useState } from "react";
import { useHousehold } from "../../context/HouseholdContext.jsx";
import { listAssignments, updateAssignment } from "../../services/choreService.js";
import { Card, Badge, Button, EmptyState } from "../../components/ui/index.jsx";

const TABS = ["all", "pending", "done"];

export default function MyChores() {
  const { active } = useHousehold();
  const [tab, setTab] = useState("all");
  const [assignments, setAssignments] = useState([]);

  const load = async () => {
    if (!active) return;
    const params = { mine: true };
    if (tab !== "all") params.status = tab;
    setAssignments(await listAssignments(active.id, params));
  };

  useEffect(() => {
    load();
  }, [active?.id, tab]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!active) return null;

  const markDone = async (id) => {
    await updateAssignment(id, { status: "done" });
    load();
  };

  return (
    <div>
      <h1 className="font-display font-semibold text-3xl text-cream mb-6">My chores</h1>
      <div className="flex gap-2 mb-6">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`font-sans text-xs uppercase tracking-wider px-4 py-2 rounded-full border ${
              tab === t
                ? "border-gold text-gold bg-card"
                : "border-hairline text-creamDim hover:text-cream"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {assignments.length === 0 ? (
        <EmptyState title="Nothing here" body="No chores match this filter right now." />
      ) : (
        <div className="space-y-2">
          {assignments.map((a) => (
            <Card key={a.id} className="p-4 flex items-center justify-between">
              <div>
                <div className="font-serif text-lg text-cream">{a.chore_title}</div>
                <div className="font-sans text-xs text-creamDim mt-0.5">
                  {a.due_date ? `Due ${new Date(a.due_date).toLocaleDateString()}` : "No due date"}
                  {a.round_label ? ` · ${a.round_label}` : ""}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge tone={a.status === "done" ? "success" : "gold"}>{a.status}</Badge>
                {a.status !== "done" && (
                  <Button variant="outline" onClick={() => markDone(a.id)}>
                    Mark complete
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}