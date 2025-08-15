"use client";

import { useState } from "react";
import Sidebar, { ModelKey } from "./components/Sidebar";
import ModelPanel from "./components/ModelPanel";

export default function Page() {
  const [active, setActive] = useState<ModelKey>("chatgpt");

  return (
    <div className="app-shell">
      {/* Left nav */}
      <Sidebar active={active} onSelect={setActive} />

      {/* Main column */}
      <div className="main">
        {/* Top ad banner (placeholder) */}
        <div className="adbar">
          <span>Ad banner slot (970×90 / 728×90 / responsive)</span>
        </div>

        {/* Active model panel (native-ish look) */}
        <ModelPanel model={active} />
      </div>
    </div>
  );
}
