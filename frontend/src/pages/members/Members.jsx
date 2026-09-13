import React, { useEffect, useState } from "react";
import { useHousehold } from "../../context/HouseholdContext.jsx";
import { listMembers, updateMemberRole, removeMember } from "../../services/householdService.js";
import { Card, Badge, Button } from "../../components/ui/index.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Members() {
  const { active } = useHousehold();
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [copied, setCopied] = useState(false);

  const load = async () => {
    if (!active) return;
    setMembers(await listMembers(active.id));
  };

  useEffect(() => {
    load();
  }, [active?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!active) return null;

  const myRole = members.find((m) => m.id === user?.id)?.role;
  const canManage = myRole === "owner" || myRole === "admin";

  const promote = async (userId, role) => {
    await updateMemberRole(active.id, userId, role);
    load();
  };

  const kick = async (userId) => {
    await removeMember(active.id, userId);
    load();
  };

  const copyCode = () => {
    navigator.clipboard.writeText(active.invite_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-semibold text-3xl text-cream">Household members</h1>
        <Button variant="outline" onClick={copyCode}>
          {copied ? "Copied!" : `Invite code: ${active.invite_code}`}
        </Button>
      </div>

      <div className="space-y-2">
        {members.map((m) => (
          <Card key={m.id} className="p-4 flex items-center justify-between">
            <div>
              <div className="font-serif text-lg text-cream">
                {m.name} {m.id === user?.id && <span className="text-creamDim text-sm">(you)</span>}
              </div>
              <div className="font-sans text-xs text-creamDim mt-0.5">
                {m.completed_chores} completed chores
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge tone={m.role === "owner" ? "gold" : "muted"}>{m.role}</Badge>
              {canManage && myRole === "owner" && m.role !== "owner" && (
                <Button
                  variant="ghost"
                  onClick={() => promote(m.id, m.role === "admin" ? "member" : "admin")}
                >
                  {m.role === "admin" ? "Demote" : "Make admin"}
                </Button>
              )}
              {canManage && m.role !== "owner" && m.id !== user?.id && (
                <Button variant="danger" onClick={() => kick(m.id)}>
                  Remove
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}