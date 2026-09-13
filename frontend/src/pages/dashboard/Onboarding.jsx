import React, { useState } from "react";
import { createHousehold, joinHousehold } from "../../services/householdService.js";
import { useHousehold } from "../../context/HouseholdContext.jsx";
import { Button, Input, Card } from "../../components/ui/index.jsx";

export default function Onboarding() {
  const { refresh, setActive } = useHousehold();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const create = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const household = await createHousehold(name);
      await refresh();
      setActive(household.id);
    } catch (err) {
      setError(err.response?.data?.error || "Couldn't create the household.");
    } finally {
      setBusy(false);
    }
  };

  const join = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const household = await joinHousehold(code);
      await refresh();
      setActive(household.id);
    } catch (err) {
      setError(err.response?.data?.error || "Couldn't join with that code.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-md mx-auto pt-10">
      <h1 className="font-display font-semibold text-3xl text-gold text-center mb-8">
        Set up your household
      </h1>
      <Card className="p-6 mb-5">
        <form onSubmit={create} className="space-y-3">
          <label className="font-sans text-xs text-creamDim block">Start a new household</label>
          <Input
            placeholder="Our apartment"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Button type="submit" variant="solid" className="w-full" disabled={busy}>
            Create household
          </Button>
        </form>
      </Card>
      <Card className="p-6">
        <form onSubmit={join} className="space-y-3">
          <label className="font-sans text-xs text-creamDim block">Join with an invite code</label>
          <Input
            placeholder="CHR-82XK"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            required
          />
          <Button type="submit" variant="outline" className="w-full" disabled={busy}>
            Join household
          </Button>
        </form>
      </Card>
      {error && <p className="font-sans text-xs text-danger text-center mt-4">{error}</p>}
    </div>
  );
}