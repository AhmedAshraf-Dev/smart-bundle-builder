import React from "react";
import { Card, Typography, Divider } from "antd";
import { ComponentCard } from "./ComponentCard";
import { PCComponent, Category, getComponentsByCategory, wouldBeIncompatible, BUDGET_MAX } from "./data";

const { Title, Text } = Typography;

interface CategorySectionProps {
  category: Category;
  selected: Record<string, string>;
  totalSpent: number;
  isDark: boolean;
  onSelect: (component: PCComponent) => void;
}

export function CategorySection({
  category,
  selected,
  totalSpent,
  isDark,
  onSelect,
}: CategorySectionProps) {
  const components = getComponentsByCategory(category);
  const selectedId = selected[category];

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ marginBottom: 12 }}>
        <Title
          level={5}
          style={{
            margin: 0,
            color: isDark ? "#e0e0e0" : "#141414",
            fontSize: 15,
          }}
        >
          {category}
        </Title>
        <Text style={{ fontSize: 12, color: "#8c8c8c" }}>
          Choose one{" "}
          {category === "Power Supply"
            ? "power supply"
            : category.toLowerCase()}
        </Text>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 12,
        }}
      >
        {components.map((component) => {
          const isSelected = selectedId === component.id;
          const isIncompatible = !isSelected && wouldBeIncompatible(component, selected);
          const spentWithoutThisCategory = selectedId
            ? totalSpent - (components.find((c) => c.id === selectedId)?.price ?? 0)
            : totalSpent;
          const isOverBudget =
            !isSelected &&
            spentWithoutThisCategory + component.price > BUDGET_MAX;

          return (
            <ComponentCard
              key={component.id}
              component={component}
              isSelected={isSelected}
              isIncompatible={isIncompatible}
              isOverBudget={isOverBudget}
              isDark={isDark}
              onSelect={onSelect}
            />
          );
        })}
      </div>
    </div>
  );
}
