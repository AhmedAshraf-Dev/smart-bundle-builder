import React from "react";
import { Card, Button, Tag, Typography, Tooltip, Badge } from "antd";
import {
  CheckCircleFilled,
  LockFilled,
  DollarCircleOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { motion } from "motion/react";
import { PCComponent, Category } from "./data";

const { Text, Title } = Typography;

const CATEGORY_ICONS: Record<Category, string> = {
  CPU: "🖥️",
  Motherboard: "🔧",
  RAM: "💾",
  GPU: "🎮",
  Storage: "💿",
  "Power Supply": "⚡",
  Case: "📦",
};

const CATEGORY_COLORS: Record<Category, string> = {
  CPU: "blue",
  Motherboard: "purple",
  RAM: "green",
  GPU: "volcano",
  Storage: "cyan",
  "Power Supply": "orange",
  Case: "magenta",
};

interface ComponentCardProps {
  component: PCComponent;
  isSelected: boolean;
  isIncompatible: boolean;
  isOverBudget: boolean;
  isDark: boolean;
  onSelect: (component: PCComponent) => void;
}

export function ComponentCard({
  component,
  isSelected,
  isIncompatible,
  isOverBudget,
  isDark,
  onSelect,
}: ComponentCardProps) {
  const isDisabled = isIncompatible || isOverBudget;
  const disabledReason = isIncompatible
    ? "Incompatible with your current selection."
    : isOverBudget
      ? "Exceeds remaining budget."
      : null;

  const disabledIcon = isIncompatible ? (
    <LockFilled style={{ color: "#8c8c8c", fontSize: 12 }} />
  ) : isOverBudget ? (
    <DollarCircleOutlined style={{ color: "#8c8c8c", fontSize: 12 }} />
  ) : null;

  const cardContent = (
    <motion.div
      whileHover={!isDisabled ? { y: -2, scale: 1.01 } : {}}
      whileTap={!isDisabled ? { scale: 0.99 } : {}}
      animate={{ opacity: isDisabled ? 0.5 : 1 }}
      transition={{ duration: 0.2 }}
      style={{ height: "100%" }}
    >
      <Card
        hoverable={!isDisabled}
        onClick={() => !isDisabled && onSelect(component)}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !isDisabled) {
            e.preventDefault();
            onSelect(component);
          }
        }}
        tabIndex={isDisabled ? -1 : 0}
        role="button"
        aria-pressed={isSelected}
        aria-disabled={isDisabled}
        aria-label={`${component.name}, $${component.price}${isDisabled ? `, ${disabledReason}` : ""}`}
        style={{
          cursor: isDisabled ? "not-allowed" : "pointer",
          border: isSelected
            ? "2px solid #1677ff"
            : isDark
              ? "1px solid #303030"
              : "1px solid #f0f0f0",
          borderRadius: 12,
          boxShadow: isSelected ? "0 0 0 3px rgba(22,119,255,0.15)" : undefined,
          transition: "all 0.2s ease",
          position: "relative",
          background: isDark
            ? isSelected
              ? "#111d2c"
              : "#1f1f1f"
            : isSelected
              ? "#f0f7ff"
              : "#fff",
          height: "100%",
        }}
        styles={{ body: { padding: "16px" } }}
      >
        {isSelected && (
          <div
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 1,
            }}
          >
            <CheckCircleFilled style={{ color: "#1677ff", fontSize: 18 }} />
          </div>
        )}

        {isDisabled && disabledIcon && (
          <div
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 1,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            {disabledIcon}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ fontSize: 32, lineHeight: 1 }}>
            {CATEGORY_ICONS[component.category]}
          </div>

          <div>
            <Tag
              color={CATEGORY_COLORS[component.category]}
              style={{ borderRadius: 6, fontSize: 11, marginBottom: 6 }}
            >
              {component.category}
            </Tag>
            <Title
              level={5}
              style={{
                margin: 0,
                fontSize: 14,
                color: isDark ? "#e0e0e0" : "#141414",
                lineHeight: "1.4",
              }}
            >
              {component.name}
            </Title>
          </div>

          <Text
            style={{
              fontSize: 12,
              color: isDark ? "#8c8c8c" : "#8c8c8c",
              display: "block",
            }}
          >
            {component.description}
          </Text>

          {component.compatibleWith && (
            <Text style={{ fontSize: 11, color: "#1677ff" }}>
              Compatible with:{" "}
              {Object.entries(component.compatibleWith)
                .map(([cat]) => cat)
                .join(", ")}
            </Text>
          )}

          {isDisabled && disabledReason && (
            <Text
              style={{
                fontSize: 11,
                color: "#8c8c8c",
                fontStyle: "italic",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              {disabledIcon} {disabledReason}
            </Text>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 4,
            }}
          >
            <Text
              strong
              style={{
                fontSize: 16,
                color: isDark ? "#fff" : "#141414",
              }}
            >
              ${component.price}
            </Text>

            <Button
              type={isSelected ? "default" : "primary"}
              size="small"
              disabled={isDisabled}
              icon={isSelected ? <CheckOutlined /> : undefined}
              onClick={(e) => {
                e.stopPropagation();
                if (!isDisabled) onSelect(component);
              }}
              style={{
                borderRadius: 8,
                fontSize: 12,
              }}
              aria-label={
                isSelected
                  ? `Deselect ${component.name}`
                  : `Select ${component.name}`
              }
            >
              {isSelected ? "Selected" : "Select"}
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );

  if (isDisabled && disabledReason) {
    return (
      <Tooltip title={disabledReason} placement="top">
        {cardContent}
      </Tooltip>
    );
  }

  return cardContent;
}
