import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

import { message, Modal } from "antd";
import {
  CATEGORIES,
  COMPONENTS,
  BUDGET_MAX,
  Category,
  PCComponent,
} from "../components/data";

type BuildState = Record<string, string>;

type BuildContextType = {
  selected: BuildState;
  totalSpent: number;
  history: BuildState[];
  historyIndex: number;
  isDark: boolean;
  setIsDark: (v: boolean) => void;

  handleSelect: (component: PCComponent) => void;
  handleUndo: () => void;
  handleRedo: () => void;
  handleRemove: (category: Category) => void;
  handleClear: () => void;
  handleExportPDF: () => void;
  handleCompleteBuild: () => void;

  canUndo: boolean;
  canRedo: boolean;
};

const BuildContext = createContext<BuildContextType | null>(null);

export const useBuild = () => {
  const ctx = useContext(BuildContext);
  if (!ctx) throw new Error("useBuild must be used within BuildProvider");
  return ctx;
};

export function BuildProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved === "dark";
  });

  const [history, setHistory] = useState<BuildState[]>([{}]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const [messageApi, contextHolder] = message.useMessage();

  const selected = history[historyIndex];

  const totalSpent = Object.values(selected).reduce((sum, id) => {
    const comp = COMPONENTS.find((c) => c.id === id);
    return sum + (comp?.price ?? 0);
  }, 0);

  const handleSelect = useCallback(
    (component: PCComponent) => {
      const current = history[historyIndex];
      const isAlreadySelected = current[component.category] === component.id;

      let next: BuildState;

      if (isAlreadySelected) {
        next = { ...current };
        delete next[component.category];
      } else {
        next = { ...current, [component.category]: component.id };
      }

      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(next);

      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);

      if (!isAlreadySelected) {
        messageApi.success(`${component.name} added to build`);
      }
    },
    [history, historyIndex],
  );

  const handleUndo = () => {
    if (historyIndex > 0) setHistoryIndex((i) => i - 1);
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) setHistoryIndex((i) => i + 1);
  };

  const handleRemove = (category: Category) => {
    const current = history[historyIndex];
    const next = { ...current };
    delete next[category];

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(next);

    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);

    messageApi.info(`${category} removed from build`);
  };

  const handleClear = () => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({});

    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);

    messageApi.info("All components cleared");
  };

  const handleExportPDF = () => {
    const lines = CATEGORIES.map((cat) => {
      const id = selected[cat as Category];
      const comp = COMPONENTS.find((c) => c.id === id);

      return comp
        ? `${cat}: ${comp.name} - $${comp.price}`
        : `${cat}: Not selected`;
    });

    const content = [
      "Smart Bundle Builder - PC Build Summary",
      "",
      ...lines,
      "",
      `Total: $${totalSpent} / $${BUDGET_MAX}`,
      `Remaining: $${BUDGET_MAX - totalSpent}`,
    ].join("\n");

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "pc-build.txt";
    a.click();

    URL.revokeObjectURL(url);
    messageApi.success("Build exported!");
  };

  const handleCompleteBuild = () => {
    Modal.success({
      title: "🎉 Build Complete!",
      content: (
        <div>
          <p>Your PC build is complete and within budget!</p>
          <p>
            <strong>Total: ${totalSpent}</strong>
          </p>
        </div>
      ),
    });
  };

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return (
    <BuildContext.Provider
      value={{
        selected,
        totalSpent,
        history,
        historyIndex,
        isDark,
        setIsDark,

        handleSelect,
        handleUndo,
        handleRedo,
        handleRemove,
        handleClear,
        handleExportPDF,
        handleCompleteBuild,

        canUndo,
        canRedo,
      }}
    >
      {contextHolder}
      {children}
    </BuildContext.Provider>
  );
}
