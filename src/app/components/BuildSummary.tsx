import React from "react";
import {
  Card,
  Typography,
  Divider,
  Progress,
  Button,
  Alert,
  Space,
  Empty,
  Tooltip,
} from "antd";
import {
  UndoOutlined,
  RedoOutlined,
  FilePdfOutlined,
  CheckCircleOutlined,
  ShoppingCartOutlined,
  DeleteOutlined,
  ClearOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "motion/react";
import { BUDGET_MAX, CATEGORIES, COMPONENTS, Category } from "./data";

const { Title, Text } = Typography;

interface BuildSummaryProps {
  selected: Record<string, string>;
  totalSpent: number;
  canUndo: boolean;
  canRedo: boolean;
  isDark: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onExportPDF: () => void;
  onCompleteBuild: () => void;
  onRemove: (category: Category) => void;
  onClear: () => void;
}

export function BuildSummary({
  selected,
  totalSpent,
  canUndo,
  canRedo,
  isDark,
  onUndo,
  onRedo,
  onExportPDF,
  onCompleteBuild,
  onRemove,
  onClear,
}: BuildSummaryProps) {
  const budgetPercent = Math.min((totalSpent / BUDGET_MAX) * 100, 100);
  const remaining = BUDGET_MAX - totalSpent;
  const isOverBudget = totalSpent > BUDGET_MAX;

  const progressStatus =
    budgetPercent >= 95
      ? "exception"
      : budgetPercent >= 70
        ? "normal"
        : "success";
  const progressColor =
    budgetPercent >= 95
      ? "#ff4d4f"
      : budgetPercent >= 70
        ? "#fa8c16"
        : "#52c41a";

  const selectedComponents = CATEGORIES.map((cat) => {
    const id = selected[cat as Category];
    if (!id) return null;
    const comp = COMPONENTS.find((c) => c.id === id);
    if (!comp) return null;
    return { category: cat, component: comp };
  }).filter(Boolean) as {
    category: string;
    component: (typeof COMPONENTS)[0];
  }[];

  const isEmpty = selectedComponents.length === 0;

  return (
    <Card
      style={{
        borderRadius: 14,
        border: isDark ? "1px solid #303030" : "1px solid #f0f0f0",
        background: isDark ? "#1f1f1f" : "#fff",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
      }}
      styles={{ body: { padding: "20px" } }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 16,
        }}
      >
        <ShoppingCartOutlined style={{ fontSize: 18, color: "#1677ff" }} />
        <Title
          level={5}
          style={{ margin: 0, color: isDark ? "#e0e0e0" : "#141414" }}
        >
          Current Build
        </Title>
        {selectedComponents.length > 0 && (
          <Text
            style={{
              marginLeft: "auto",
              fontSize: 12,
              color: "#8c8c8c",
              background: isDark ? "#303030" : "#f5f5f5",
              padding: "2px 8px",
              borderRadius: 10,
            }}
          >
            {selectedComponents.length}/{CATEGORIES.length}
          </Text>
        )}
      </div>

      {isEmpty ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <div style={{ textAlign: "center" }}>
              <Text
                style={{ color: "#8c8c8c", display: "block", marginBottom: 4 }}
              >
                Start building your dream setup
              </Text>
              <Text style={{ fontSize: 12, color: "#bfbfbf" }}>
                Choose one component from each category to begin.
              </Text>
            </div>
          }
          style={{ margin: "16px 0" }}
        />
      ) : (
        <div
          className="md:max-h-50 overflow-y-auto"
          style={{ marginBottom: 12 }}
        >
          <AnimatePresence>
            {selectedComponents.map(({ category, component }) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  padding: "8px 0",
                  borderBottom: isDark
                    ? "1px solid #303030"
                    : "1px solid #f5f5f5",
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Text
                    style={{
                      fontSize: 11,
                      color: "#8c8c8c",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      display: "block",
                    }}
                  >
                    {category}
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      color: isDark ? "#d0d0d0" : "#262626",
                      display: "block",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {component.name}
                  </Text>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Text
                    strong
                    style={{
                      fontSize: 13,
                      color: isDark ? "#fff" : "#141414",
                      flexShrink: 0,
                    }}
                  >
                    ${component.price}
                  </Text>
                  <Tooltip title="Remove from build">
                    <Button
                      type="text"
                      size="small"
                      icon={<DeleteOutlined />}
                      onClick={() => onRemove(category as Category)}
                      style={{
                        color: "#8c8c8c",
                        padding: "4px 6px",
                        height: "auto",
                        minWidth: "auto",
                      }}
                      aria-label={`Remove ${category} from build`}
                    />
                  </Tooltip>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <Divider
        style={{
          margin: "12px 0",
          borderColor: isDark ? "#303030" : "#f0f0f0",
        }}
      />

      <div style={{ marginBottom: 16 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 4,
          }}
        >
          <Text style={{ fontSize: 13, color: isDark ? "#bfbfbf" : "#595959" }}>
            Total Cost
          </Text>
          <motion.div
            key={totalSpent}
            initial={{ scale: 1.1, color: "#1677ff" }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Text
              strong
              style={{
                fontSize: 15,
                color: isOverBudget ? "#ff4d4f" : isDark ? "#fff" : "#141414",
              }}
            >
              ${totalSpent}
            </Text>
          </motion.div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <Text style={{ fontSize: 13, color: isDark ? "#bfbfbf" : "#595959" }}>
            Remaining
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: isOverBudget ? "#ff4d4f" : "#52c41a",
              fontWeight: 600,
            }}
          >
            {isOverBudget ? `-$${Math.abs(remaining)}` : `$${remaining}`}
          </Text>
        </div>

        <Progress
          percent={budgetPercent}
          showInfo={false}
          strokeColor={progressColor}
          railColor={isDark ? "#303030" : "#f0f0f0"}
          style={{ marginBottom: 6 }}
        />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Text style={{ fontSize: 11, color: "#8c8c8c" }}>$0</Text>
          <Text style={{ fontSize: 11, color: "#8c8c8c" }}>
            Budget: ${BUDGET_MAX}
          </Text>
        </div>
      </div>

      {isOverBudget && (
        <Alert
          type="error"
          message={`⚠️ This selection exceeds your $${BUDGET_MAX} budget.`}
          style={{ borderRadius: 8, marginBottom: 12, fontSize: 12 }}
          showIcon={false}
        />
      )}

      <Divider
        style={{
          margin: "12px 0",
          borderColor: isDark ? "#303030" : "#f0f0f0",
        }}
      />

      <Space orientation="vertical" style={{ width: "100%" }} size={10}>
        <div style={{ display: "flex", gap: 8 }}>
          <Tooltip
            title={
              !canUndo ? "No more actions available." : "Undo last selection"
            }
          >
            <span style={{ flex: 1 }}>
              <Button
                icon={<UndoOutlined />}
                disabled={!canUndo}
                onClick={onUndo}
                style={{ width: "100%", borderRadius: 8 }}
                aria-label="Undo last selection"
              >
                Undo
              </Button>
            </span>
          </Tooltip>
          <Tooltip
            title={!canRedo ? "No more actions available." : "Redo selection"}
          >
            <span style={{ flex: 1 }}>
              <Button
                icon={<RedoOutlined />}
                disabled={!canRedo}
                onClick={onRedo}
                style={{ width: "100%", borderRadius: 8 }}
                aria-label="Redo selection"
              >
                Redo
              </Button>
            </span>
          </Tooltip>
        </div>

        <Tooltip
          title={isEmpty ? "No components to clear" : "Clear all selections"}
        >
          <span style={{ width: "100%" }}>
            <Button
              icon={<ClearOutlined />}
              block
              disabled={isEmpty}
              onClick={onClear}
              style={{ borderRadius: 8 }}
              aria-label="Clear all selections"
              danger
            >
              Clear All
            </Button>
          </span>
        </Tooltip>

        <Button
          icon={<FilePdfOutlined />}
          block
          onClick={onExportPDF}
          style={{ borderRadius: 8 }}
          aria-label="Export build as PDF"
        >
          Export PDF
        </Button>

        <Button
          type="primary"
          icon={<CheckCircleOutlined />}
          block
          disabled={selectedComponents.length === 0 || isOverBudget}
          onClick={onCompleteBuild}
          style={{ borderRadius: 8, height: 40 }}
          aria-label="Complete your build"
        >
          Complete Build
        </Button>
      </Space>
    </Card>
  );
}
