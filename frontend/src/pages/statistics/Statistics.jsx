import React, { useEffect, useState } from "react";
import { useHousehold } from "../../context/HouseholdContext.jsx";
import { householdStatistics } from "../../services/choreService.js";
import { Card } from "../../components/ui/index.jsx";

export default function Statistics() {
  const { active } = useHousehold();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!active) return;
    householdStatistics(active.id).then(setData);
  }, [active?.id]);

  if (!active || !data) return null;

  const maxTotal = Math.max(1, ...data.byMember.map((m) => Number(m.total)));
  const maxDay = Math.max(1, ...data.byDay.map((d) => Number(d.completed)));

  return (
    <div>
      <h1 className="font-display font-semibold text-3xl text-cream mb-6">Statistics</h1>

      <div className="grid grid-cols-3 gap-4 mb-10">
        <Card className="p-5 text-center">
          <div className="font-display text-3xl text-gold">{data.summary.assigned}</div>
          <div className="font-sans text-xs text-creamDim uppercase tracking-wider mt-1">
            Assigned
          </div>
        </Card>
        <Card className="p-5 text-center">
          <div className="font-display text-3xl text-gold">{data.summary.completed}</div>
          <div className="font-sans text-xs text-creamDim uppercase tracking-wider mt-1">
            Completed
          </div>
        </Card>
        <Card className="p-5 text-center">
          <div className="font-display text-3xl text-gold">{data.summary.rate}%</div>
          <div className="font-sans text-xs text-creamDim uppercase tracking-wider mt-1">
            Completion rate
          </div>
        </Card>
      </div>

      <h2 className="font-display font-semibold text-xl text-gold mb-4">Weekly completion</h2>
      <div className="flex items-end gap-3 h-32 mb-10">
        {data.byDay.length === 0 && (
          <p className="font-sans text-sm text-creamDim">No completions yet this week.</p>
        )}
        {data.byDay.map((d) => (
          <div key={d.day} className="flex flex-col items-center gap-2 flex-1">
            <div
              className="w-full bg-gradient-to-t from-goldDim to-gold rounded-t"
              style={{ height: `${(Number(d.completed) / maxDay) * 100}%` }}
            />
            <span className="font-sans text-[11px] text-creamDim">{d.day}</span>
          </div>
        ))}
      </div>

      <h2 className="font-display font-semibold text-xl text-gold mb-4">Member workload</h2>
      <div className="space-y-3">
        {data.byMember.map((m) => (
          <div key={m.name} className="flex items-center gap-3">
            <span className="font-sans text-sm text-cream w-24 shrink-0">{m.name}</span>
            <div className="flex-1 h-2 bg-card rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-goldDim to-gold"
                style={{ width: `${(Number(m.total) / maxTotal) * 100}%` }}
              />
            </div>
            <span className="font-sans text-xs text-creamDim w-10 text-right">{m.total}</span>
          </div>
        ))}
      </div>
    </div>
  );
}