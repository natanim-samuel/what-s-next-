import React, { useState } from "react";
import { useHousehold } from "../../context/HouseholdContext.jsx";
import { runDistribution, confirmDistribution } from "../../services/choreService.js";
import { Card, Button, Badge, EmptyState } from "../../components/ui/index.jsx";

export default function Distribution() {
  const { active } = useHousehold();
  const [suggestion, setSuggestion] = useState(null);
  const [flipped, setFlipped] = useState({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  if (!active) return null;

  const run = async () => {
    setBusy(true);
    setError("");
    setConfirmed(false);
    try {
      const result = await runDistribution(active.id);
      setSuggestion(result);
      setFlipped({});
    } catch (err) {
      setError(err.response?.data?.error || "Couldn't run the distribution.");
      setSuggestion(null);
    } finally {
      setBusy(false);
    }
  };

  const confirm = async () => {
    setBusy(true);
    setError("");
    try {
      await confirmDistribution(
        active.id,
        suggestion.assignments.map((a) => ({ choreId: a.choreId, userId: a.userId })),
        `Week of ${new Date().toLocaleDateString()}`
      );
      setConfirmed(true);
    } catch (err) {
      setError(err.response?.data?.error || "Couldn't confirm the assignments.");
    } finally {
      setBusy(false);
    }
  };

  const toggleFlip = (choreId) => setFlipped((f) => ({ ...f, [choreId]: !f[choreId] }));

  return (
    <div>
      <h1 className="font-display font-semibold text-3xl text-cream mb-1">Smart distribution</h1>
      <p className="font-sans text-sm text-creamDim mb-6">
        Balances current workload, rotation, and difficulty to suggest a fair split of open
        chores.
      </p>

      <Button variant="solid" onClick={run} disabled={busy}>
        {busy ? "Working..." : "Run distribution"}
      </Button>

      {error && <p className="font-sans text-xs text-danger mt-4">{error}</p>}

      {suggestion && (
        <div className="mt-8">
          <h2 className="font-display font-semibold text-xl text-gold mb-4">
            Suggested assignments
          </h2>
          {suggestion.assignments.length === 0 ? (
            <EmptyState title="Nothing to distribute" body="No open chores right now." />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
              {suggestion.assignments.map((a) => (
                <Card
                  key={a.choreId}
                  className="p-5 text-center cursor-pointer hover:-translate-y-0.5 transition-transform"
                  onClick={() => toggleFlip(a.choreId)}
                >
                  {!flipped[a.choreId] ? (
                    <>
                      <div className="font-sans text-[10px] uppercase tracking-widest text-goldDim mb-2">
                        Chore
                      </div>
                      <div className="font-serif text-lg text-cream mb-2">{a.choreTitle}</div>
                      <div className="font-sans text-[11px] text-creamDim">Tap to reveal</div>
                    </>
                  ) : (
                    <>
                      <div className="font-sans text-[10px] uppercase tracking-widest text-goldDim mb-2">
                        Assigned to
                      </div>
                      <div className="font-display font-semibold text-xl text-gold mb-2">
                        {a.userName}
                      </div>
                      <Badge tone="gold">{a.difficulty}</Badge>
                    </>
                  )}
                </Card>
              ))}
            </div>
          )}

          {suggestion.assignments.length > 0 && !confirmed && (
            <Button variant="solid" onClick={confirm} disabled={busy}>
              Confirm assignments
            </Button>
          )}
          {confirmed && (
            <p className="font-sans text-sm text-success">
              Assignments confirmed and added to everyone's chores.
            </p>
          )}
        </div>
      )}
    </div>
  );
}