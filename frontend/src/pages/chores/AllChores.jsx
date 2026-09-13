import React, { useEffect, useState } from "react";
import { useHousehold } from "../../context/HouseholdContext.jsx";
import { listChores, deleteChore } from "../../services/choreService.js";
import { Card, Badge, Button, EmptyState } from "../../components/ui/index.jsx";
import AddChoreForm from "../../components/chores/AddChoreForm.jsx";

export default function AllChores() {
  const { active } = useHousehold();
  const [chores, setChores] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    if (!active) return;
    setChores(await listChores(active.id));
  };

  useEffect(() => {
    load();
  }, [active?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!active) return null;

  const remove = async (id) => {
    await deleteChore(id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-semibold text-3xl text-cream">All chores</h1>
        <Button variant="outline" onClick={() => setShowForm((s) => !s)}>
          {showForm ? "Close" : "+ Add chore"}
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 mb-6">
          <AddChoreForm
            householdId={active.id}
            onCreated={() => {
              setShowForm(false);
              load();
            }}
            onCancel={() => setShowForm(false)}
          />
        </Card>
      )}

      {chores.length === 0 ? (
        <EmptyState
          title="No chores yet"
          body="Add your first chore to get the household started."
          action={
            !showForm && (
              <Button variant="solid" onClick={() => setShowForm(true)}>
                + Add chore
              </Button>
            )
          }
        />
      ) : (
        <div className="space-y-2">
          {chores.map((c) => (
            <Card key={c.id} className="p-4 flex items-center justify-between">
              <div>
                <div className="font-serif text-lg text-cream">{c.title}</div>
                <div className="font-sans text-xs text-creamDim mt-0.5">
                  {c.category ? `${c.category} · ` : ""}
                  {c.frequency} · {c.est_minutes} min
                  {c.latest_assignment
                    ? ` · currently ${c.latest_assignment.status}`
                    : " · unassigned"}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge tone="gold">{c.difficulty}</Badge>
                <Badge tone="muted">{c.priority}</Badge>
                <Button variant="danger" onClick={() => remove(c.id)}>
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}