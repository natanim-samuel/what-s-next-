import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useHousehold } from "../../context/HouseholdContext.jsx";
import { listAssignments, updateAssignment, householdStatistics } from "../../services/choreService.js";
import { Card, Badge, Button, EmptyState } from "../../components/ui/index.jsx";
import Onboarding from "./Onboarding.jsx";

export default function Dashboard() {
  const { user } = useAuth();
  const { active, loading: hLoading } = useHousehold();
  const [assignments, setAssignments] = useState([]);
  const [stats, setStats] = useState(null);

  const load = async () => {
    if (!active) return;
    const [mine, s] = await Promise.all([
      listAssignments(active.id, { mine: true, status: "pending" }),
      householdStatistics(active.id),
    ]);
    setAssignments(mine);
    setStats(s.summary);
  };

  useEffect(() => {
    load();
  }, [active?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!hLoading && !active) return <Onboarding />;
  if (!active) return null;

  const markDone = async (id) => {
    await updateAssignment(id, { status: "done" });
    load();
  };

  const rate = stats ? stats.rate : 0;

  return (
    <div>
      <h1 className="font-display font-semibold text-3xl text-cream mb-1">
        Good to see you, {user?.name?.split(" ")[0]}
      </h1>
      <p className="font-sans text-sm text-creamDim mb-8">{active.name}</p>

      {stats && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="p-5 text-center">
            <div className="font-display text-3xl text-gold">{stats.assigned}</div>
            <div className="font-sans text-xs text-creamDim uppercase tracking-wider mt-1">
              Total this week
            </div>
          </Card>
          <Card className="p-5 text-center">
            <div className="font-display text-3xl text-gold">{stats.completed}</div>
            <div className="font-sans text-xs text-creamDim uppercase tracking-wider mt-1">
              Done
            </div>
          </Card>
          <Card className="p-5 text-center">
            <div className="font-display text-3xl text-gold">{stats.pending}</div>
            <div className="font-sans text-xs text-creamDim uppercase tracking-wider mt-1">
              Pending
            </div>
          </Card>
        </div>
      )}

      <h2 className="font-display font-semibold text-xl text-gold mb-4">Your chores</h2>
      {assignments.length === 0 ? (
        <EmptyState
          title="Nothing on your plate"
          body="You're all caught up for now."
        />
      ) : (
        <div className="space-y-2 mb-8">
          {assignments.map((a) => (
            <Card key={a.id} className="p-4 flex items-center justify-between">
              <div>
                <div className="font-serif text-lg text-cream">{a.chore_title}</div>
                <div className="font-sans text-xs text-creamDim mt-0.5">
                  {a.due_date ? `Due ${new Date(a.due_date).toLocaleDateString()}` : "No due date"}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge tone="gold">{a.difficulty}</Badge>
                <Button variant="outline" onClick={() => markDone(a.id)}>
                  Mark complete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {stats && (
        <>
          <h2 className="font-display font-semibold text-xl text-gold mb-3">Weekly progress</h2>
          <div className="h-2 bg-card rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-goldDim to-gold transition-all"
              style={{ width: `${rate}%` }}
            />
          </div>
          <div className="font-sans text-xs text-creamDim mt-2">{rate}% complete</div>
        </>
      )}
    </div>
  );
}