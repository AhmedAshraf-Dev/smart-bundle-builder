import {
  MenuOutlined,
  MoonOutlined,
  SunOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Alert,
  theme as antTheme,
  Avatar,
  Button,
  ConfigProvider,
  Drawer,
  message,
  Switch,
  Typography,
} from "antd";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { BuildSummary } from "./components/BuildSummary";
import { CategorySection } from "./components/CategorySection";
import { BUDGET_MAX, CATEGORIES, Category } from "./components/data";
import { useBuild } from "./context/BuildContext";

const { Title, Text } = Typography;

type BuildState = Record<string, string>;

export default function AppUI() {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const {
    selected,
    totalSpent,
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
  } = useBuild();
  const bg = isDark ? "#141414" : "#f5f7fa";
  const headerBg = isDark ? "#1f1f1f" : "#fff";
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  useEffect(() => {
    localStorage.setItem("theme", isDark ? "dark" : "light");
    document.documentElement.setAttribute(
      "data-theme",
      isDark ? "dark" : "light",
    );
  }, [isDark]);

  const toggleTheme = useCallback(() => {
    setIsDark(!isDark);
    messageApi.success({
      content: `${!isDark ? "Dark" : "Light"} mode activated`,
      duration: 1,
    });
  }, [isDark, messageApi]);
  const summary = (
    <BuildSummary
      selected={selected}
      totalSpent={totalSpent}
      canUndo={canUndo}
      canRedo={canRedo}
      isDark={isDark}
      onUndo={handleUndo}
      onRedo={handleRedo}
      onExportPDF={handleExportPDF}
      onCompleteBuild={handleCompleteBuild}
      onRemove={handleRemove}
      onClear={handleClear}
    />
  );

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
      }}
    >
      {contextHolder}
      <motion.div
        animate={{ background: bg }}
        transition={{ duration: 0.3 }}
        style={{ minHeight: "100vh" }}
      >
        {/* Header */}
        <div
          style={{
            background: headerBg,
            borderBottom: isDark ? "1px solid #303030" : "1px solid #f0f0f0",
            padding: "0 24px",
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            zIndex: 100,
            boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
            transition: "background 0.3s",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "linear-gradient(135deg, #1677ff, #4096ff)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
              }}
            >
              💻
            </div>
            <div>
              <Title
                level={5}
                style={{
                  margin: 0,
                  fontSize: 16,
                  color: isDark ? "#e0e0e0" : "#141414",
                }}
              >
                Smart Bundle Builder
              </Title>
              {!isMobile && (
                <Text style={{ fontSize: 12, color: "#8c8c8c" }}>
                  Build your perfect setup within budget.
                </Text>
              )}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <SunOutlined
                style={{
                  color: isDark ? "#8c8c8c" : "#faad14",
                  fontSize: 14,
                }}
              />
              <Switch
                size="small"
                checked={isDark}
                onChange={toggleTheme}
                // onClick={}
                aria-label="Toggle dark mode"
              />
              <MoonOutlined
                style={{
                  color: isDark ? "#adb5bd" : "#8c8c8c",
                  fontSize: 14,
                }}
              />
            </div>
            <Avatar
              icon={<UserOutlined />}
              style={{ background: "#1677ff", cursor: "pointer" }}
              aria-label="User profile"
            />
            {isMobile && (
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={() => setMobileDrawerOpen(true)}
                aria-label="Open build summary"
              />
            )}
          </div>
        </div>

        {/* Main Content */}
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: isMobile ? "16px 16px 120px" : "24px",
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 320px",
            gap: 24,
            alignItems: "start",
          }}
        >
          {/* Categories */}
          <div>
            {totalSpent > BUDGET_MAX && (
              <Alert
                type="error"
                message={`⚠️ Your build exceeds the $${BUDGET_MAX} budget by $${totalSpent - BUDGET_MAX}. Please remove or replace some components.`}
                showIcon
                style={{ borderRadius: 10, marginBottom: 16 }}
                closable
              />
            )}

            {CATEGORIES.map((category) => (
              <div
                key={category}
                style={{
                  background: isDark ? "#1f1f1f" : "#fff",
                  borderRadius: 14,
                  padding: "20px",
                  marginBottom: 16,
                  border: isDark ? "1px solid #303030" : "1px solid #f0f0f0",
                  transition: "background 0.3s",
                }}
              >
                <CategorySection
                  category={category as Category}
                  selected={selected}
                  totalSpent={totalSpent}
                  isDark={isDark}
                  onSelect={handleSelect}
                />
              </div>
            ))}
          </div>

          {/* Sticky Sidebar (desktop) */}
          {!isMobile && (
            <div style={{ position: "sticky", top: 80 }}>{summary}</div>
          )}
        </div>

        {/* Mobile sticky bottom bar */}
        {isMobile && (
          <div
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              background: isDark ? "#1f1f1f" : "#fff",
              borderTop: isDark ? "1px solid #303030" : "1px solid #f0f0f0",
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              zIndex: 200,
              boxShadow: "0 -4px 16px rgba(0,0,0,0.08)",
            }}
          >
            <div>
              <Text
                style={{
                  fontSize: 11,
                  color: "#8c8c8c",
                  display: "block",
                }}
              >
                Total
              </Text>
              <Text
                strong
                style={{
                  fontSize: 16,
                  color:
                    totalSpent > BUDGET_MAX
                      ? "#ff4d4f"
                      : isDark
                        ? "#fff"
                        : "#141414",
                }}
              >
                ${totalSpent}{" "}
                <Text style={{ fontSize: 11, color: "#8c8c8c" }}>
                  / ${BUDGET_MAX}
                </Text>
              </Text>
            </div>
            <div style={{ flex: 1, maxWidth: 160 }}>
              <div
                style={{
                  height: 6,
                  borderRadius: 3,
                  background: isDark ? "#303030" : "#f0f0f0",
                  overflow: "hidden",
                }}
              >
                <motion.div
                  animate={{
                    width: `${Math.min((totalSpent / BUDGET_MAX) * 100, 100)}%`,
                    background:
                      totalSpent / BUDGET_MAX >= 0.95
                        ? "#ff4d4f"
                        : totalSpent / BUDGET_MAX >= 0.7
                          ? "#fa8c16"
                          : "#52c41a",
                  }}
                  transition={{ duration: 0.4 }}
                  style={{ height: "100%", borderRadius: 3 }}
                />
              </div>
            </div>
            <Button
              type="primary"
              size="small"
              style={{ borderRadius: 8 }}
              onClick={() => setMobileDrawerOpen(true)}
            >
              View Build
            </Button>
          </div>
        )}

        {/* Mobile Drawer */}
        <Drawer
          title={null}
          placement="bottom"
          open={mobileDrawerOpen}
          onClose={() => setMobileDrawerOpen(false)}
          size="85%"
          styles={{
            body: {
              padding: 16,
              background: isDark ? "#141414" : "#f5f7fa",
            },
            header: { display: "none" },
          }}
          style={{ borderRadius: "16px 16px 0 0", overflow: "hidden" }}
        >
          <div
            style={{
              width: 40,
              height: 4,
              borderRadius: 2,
              background: isDark ? "#303030" : "#e0e0e0",
              margin: "0 auto 16px",
            }}
          />
          {summary}
        </Drawer>
      </motion.div>
    </ConfigProvider>
  );
}
