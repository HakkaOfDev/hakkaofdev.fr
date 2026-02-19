"use client";

import { Code, Eye } from "lucide-react";
import { useCallback, useState } from "react";
import { AnimatedSpan } from "@/components/AnimatedComponents";
import { useThemeEngine } from "@/hooks/useThemeEngine";
import { DEFAULT_COLORS } from "@/lib/constants/theme.constants";
import { storeCustomTheme } from "@/lib/themes/storage";
import type {
  ThemeColors,
  ThemeCreateMode,
  ThemeCreateStep,
  ThemePalette,
} from "@/types/theme";
import { THEME_COLOR_KEYS } from "@/types/theme";
import { ThemeCreateJSONForm } from "./ThemeCreateJSONForm";
import { ThemeCreatePreview } from "./ThemeCreatePreview";
import {
  ThemeCreateError,
  ThemeCreateSuccess,
} from "./ThemeCreateStatusMessages";
import { ThemeCreateVisualForm } from "./ThemeCreateVisualForm";

export function CThemeCreate() {
  const { setTheme } = useThemeEngine();

  const [mode, setMode] = useState<ThemeCreateMode>("visual");
  const [step, setStep] = useState<ThemeCreateStep>("input");
  const [errorMsg, setErrorMsg] = useState("");
  const [createdName, setCreatedName] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const [themeName, setThemeName] = useState("my-custom-theme");
  const [themeLabel, setThemeLabel] = useState("My Custom Theme");
  const [isDark, setIsDark] = useState(true);
  const [colors, setColors] = useState<ThemeColors>(DEFAULT_COLORS);

  const handleColorChange = (key: keyof ThemeColors, value: string) => {
    setColors((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetColors = () => {
    setColors(DEFAULT_COLORS);
  };

  const generateJSON = useCallback(() => {
    return JSON.stringify(
      {
        name: themeName,
        label: themeLabel,
        isDark,
        colors,
      },
      null,
      2,
    );
  }, [themeName, themeLabel, isDark, colors]);

  const handleVisualSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      try {
        if (!themeName || !themeLabel) {
          throw new Error("Theme name and label are required.");
        }

        const palette: ThemePalette = {
          name: themeName,
          label: themeLabel,
          isDark,
          colors,
        };

        storeCustomTheme(palette);
        setTheme(palette.name);
        setCreatedName(palette.label);
        setStep("success");
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : "Invalid theme data.");
        setStep("error");
      }
    },
    [themeName, themeLabel, isDark, colors, setTheme],
  );

  const handleJSONSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const raw = new FormData(e.currentTarget).get("json") as string;

      try {
        const parsed = JSON.parse(raw) as Record<string, unknown>;

        if (!parsed.name || typeof parsed.name !== "string") {
          throw new Error('Missing required field "name" (string).');
        }
        if (!parsed.label || typeof parsed.label !== "string") {
          throw new Error('Missing required field "label" (string).');
        }
        if (typeof parsed.isDark !== "boolean") {
          throw new Error('Missing required field "isDark" (boolean).');
        }
        if (!parsed.colors || typeof parsed.colors !== "object") {
          throw new Error('Missing required field "colors" (object).');
        }

        const colorsParsed = parsed.colors as Record<string, unknown>;
        for (const key of THEME_COLOR_KEYS) {
          if (!colorsParsed[key] || typeof colorsParsed[key] !== "string") {
            throw new Error(`Missing or invalid color: "${key}".`);
          }
        }

        const palette: ThemePalette = {
          name: parsed.name as string,
          label: parsed.label as string,
          isDark: parsed.isDark as boolean,
          colors: colorsParsed as unknown as ThemeColors,
        };

        storeCustomTheme(palette);
        setTheme(palette.name);
        setCreatedName(palette.label);
        setStep("success");
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : "Invalid JSON input.");
        setStep("error");
      }
    },
    [setTheme],
  );

  if (step === "success") {
    return <ThemeCreateSuccess themeName={createdName} />;
  }

  if (step === "error") {
    return (
      <ThemeCreateError
        errorMessage={errorMsg}
        onRetry={() => setStep("input")}
      />
    );
  }

  return (
    <AnimatedSpan className="gap-3">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Create a custom theme using the{" "}
          <span className="font-semibold text-foreground">
            {mode === "visual" ? "visual editor" : "JSON editor"}
          </span>
          .
        </p>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setMode("visual")}
            className={`inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1 font-semibold text-[10px] transition-colors ${
              mode === "visual"
                ? "bg-primary/10 text-primary ring-1 ring-primary/20 ring-inset"
                : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
            }`}
          >
            <Eye className="h-3 w-3" />
            Visual
          </button>
          <button
            type="button"
            onClick={() => setMode("json")}
            className={`inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1 font-semibold text-[10px] transition-colors ${
              mode === "json"
                ? "bg-primary/10 text-primary ring-1 ring-primary/20 ring-inset"
                : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
            }`}
          >
            <Code className="h-3 w-3" />
            JSON
          </button>
        </div>
      </div>

      {mode === "visual" ? (
        <ThemeCreateVisualForm
          themeName={themeName}
          themeLabel={themeLabel}
          isDark={isDark}
          colors={colors}
          onThemeNameChange={setThemeName}
          onThemeLabelChange={setThemeLabel}
          onIsDarkChange={setIsDark}
          onColorChange={handleColorChange}
          onCopyJSON={() => navigator.clipboard.writeText(generateJSON())}
          onResetColors={handleResetColors}
          onSubmit={handleVisualSubmit}
        />
      ) : (
        <ThemeCreateJSONForm
          defaultJSON={generateJSON()}
          onSubmit={handleJSONSubmit}
        />
      )}

      <ThemeCreatePreview
        isDark={isDark}
        colors={colors}
        showPreview={showPreview}
        onTogglePreview={() => setShowPreview(!showPreview)}
      />
    </AnimatedSpan>
  );
}
