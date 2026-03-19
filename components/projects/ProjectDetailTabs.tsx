"use client";

import { useState } from "react";
import type { Project } from "@/lib/types";

type TabId = "context" | "solution" | "technologies" | "results";

const tabs: { id: TabId; label: string }[] = [
  { id: "context", label: "Contexte" },
  { id: "solution", label: "Solution" },
  { id: "technologies", label: "Technologies" },
  { id: "results", label: "Résultats" },
];

type ProjectDetailTabsProps = {
  project: Project;
};

export function ProjectDetailTabs({ project }: ProjectDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("context");

  return (
    <div className="rounded-xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] overflow-hidden shadow-sm">
      <div className="flex border-b border-[hsl(var(--color-surface-muted))] overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`min-w-[120px] px-4 py-3 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[hsl(var(--color-accent))] ${
              activeTab === tab.id
                ? "border-b-2 border-[hsl(var(--color-accent))] text-[hsl(var(--color-accent))] bg-[hsl(var(--color-surface-muted))]/30"
                : "text-[hsl(var(--color-muted))] hover:bg-[hsl(var(--color-surface-muted))]/50 hover:text-[hsl(var(--color-foreground))]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="p-6">
        {activeTab === "context" && (
          <div>
            <h4 className="font-display text-sm font-semibold text-[hsl(var(--color-muted))] uppercase tracking-wide">
              Problématique
            </h4>
            <p className="mt-2 text-[hsl(var(--color-foreground))] leading-relaxed">
              {project.problem}
            </p>
          </div>
        )}
        {activeTab === "solution" && (
          <div>
            <h4 className="font-display text-sm font-semibold text-[hsl(var(--color-muted))] uppercase tracking-wide">
              Solution proposée
            </h4>
            <p className="mt-2 text-[hsl(var(--color-foreground))] leading-relaxed">
              {project.solution}
            </p>
          </div>
        )}
        {activeTab === "technologies" && (
          <div>
            <h4 className="font-display text-sm font-semibold text-[hsl(var(--color-muted))] uppercase tracking-wide">
              Technologies utilisées
            </h4>
            <ul className="mt-3 flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <li
                  key={tech.id}
                  className="rounded-lg bg-[hsl(var(--color-accent))]/10 px-3 py-1.5 text-sm font-medium text-[hsl(var(--color-accent))]"
                >
                  {tech.name}
                </li>
              ))}
            </ul>
          </div>
        )}
        {activeTab === "results" && (
          <div>
            <h4 className="font-display text-sm font-semibold text-[hsl(var(--color-muted))] uppercase tracking-wide">
              Résultats
            </h4>
            <p className="mt-2 text-[hsl(var(--color-foreground))] leading-relaxed">
              {project.results}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
