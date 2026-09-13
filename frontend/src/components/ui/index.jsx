import React from "react";

export function Button({ variant = "outline", className = "", ...props }) {
  const base =
    "font-sans text-sm tracking-wide rounded transition-all duration-150 px-5 py-2.5 disabled:opacity-40 disabled:cursor-not-allowed";
  const variants = {
    outline:
      "border border-goldDim text-gold bg-transparent hover:bg-gold hover:text-bg",
    solid: "bg-gold text-bg border border-gold hover:bg-goldDim",
    ghost: "text-creamDim hover:text-cream border border-transparent",
    danger:
      "border border-danger/50 text-danger bg-transparent hover:bg-danger hover:text-cream",
  };
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}

export function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full bg-bg border border-hairline rounded px-3 py-2 text-cream font-sans text-sm outline-none focus:border-goldDim placeholder:text-creamDim/50 ${className}`}
      {...props}
    />
  );
}

export function Select({ className = "", children, ...props }) {
  return (
    <select
      className={`w-full bg-bg border border-hairline rounded px-3 py-2 text-cream font-sans text-sm outline-none focus:border-goldDim ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

export function Card({ className = "", children }) {
  return (
    <div className={`bg-raised border border-hairline rounded ${className}`}>{children}</div>
  );
}

export function SectionTitle({ children, className = "" }) {
  return (
    <h2 className={`font-display font-semibold text-xl text-gold mb-4 ${className}`}>
      {children}
    </h2>
  );
}

export function Badge({ children, tone = "gold" }) {
  const tones = {
    gold: "text-gold border-goldDim/60 bg-card",
    success: "text-success border-success/40 bg-card",
    danger: "text-danger border-danger/40 bg-card",
    muted: "text-creamDim border-hairline bg-card",
  };
  return (
    <span
      className={`inline-block font-sans text-[11px] uppercase tracking-wider border rounded-full px-2.5 py-1 ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function EmptyState({ title, body, action }) {
  return (
    <div className="text-center py-16 border border-dashed border-hairline rounded">
      <p className="font-display text-xl text-gold mb-2">{title}</p>
      <p className="font-sans text-sm text-creamDim mb-5">{body}</p>
      {action}
    </div>
  );
}