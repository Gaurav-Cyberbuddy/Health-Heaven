"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React, { useState, useEffect } from "react";
import { List, ListItem } from "@/components/ui/list";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/navbar";

export default function AssessmentPage() {
  const [ingredients, setIngredients] = useState("");
  const [foodName, setFoodName] = useState("");
  const [foodType, setFoodType] = useState("");
  const [assessment, setAssessment] = useState("");
  const [overallAnalysis, setOverallAnalysis] = useState("");
  const [safeConsumption, setSafeConsumption] = useState<string | null>(null);
  const [condition, setCondition] = useState("");
  const [objective, setObjective] = useState("");
  const [useProfileContext, setUseProfileContext] = useState(true);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [starRating, setStarRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Parsed sections for concise UI
  const [parsedResult, setParsedResult] = useState<string>("");
  const [parsedProof, setParsedProof] = useState<string>("");

  // Simple calorie estimator state
  const [calQtyGrams, setCalQtyGrams] = useState<string>("");
  const [calPer100g, setCalPer100g] = useState<string>("");
  const [proteinPer100g, setProteinPer100g] = useState<string>("");
  const [carbsPer100g, setCarbsPer100g] = useState<string>("");
  const [fatPer100g, setFatPer100g] = useState<string>("");
  const [presetKey, setPresetKey] = useState<string>("");
  const [servingSizeG, setServingSizeG] = useState<string>("");
  const [servingCount, setServingCount] = useState<string>("");

  // Common presets (kcal per 100 g)
  const CAL_PRESETS: Record<string, { kcal: number; protein: number; carbs: number; fat: number } > = {
    "Oats (rolled)": { kcal: 389, protein: 16.9, carbs: 66.3, fat: 6.9 },
    "White rice (cooked)": { kcal: 130, protein: 2.7, carbs: 28.2, fat: 0.3 },
    "Chicken breast (cooked)": { kcal: 165, protein: 31, carbs: 0, fat: 3.6 },
    "Olive oil": { kcal: 884, protein: 0, carbs: 0, fat: 100 },
    "Banana": { kcal: 89, protein: 1.1, carbs: 23, fat: 0.3 },
    "Almonds": { kcal: 579, protein: 21.2, carbs: 21.6, fat: 49.9 },
    "Whole milk": { kcal: 61, protein: 3.2, carbs: 4.8, fat: 3.3 },
    "Greek yogurt": { kcal: 59, protein: 10, carbs: 3.6, fat: 0.4 },
    "Peanut butter": { kcal: 588, protein: 25, carbs: 20, fat: 50 },
  };

  const totalCalories = (() => {
    const q = parseFloat(calQtyGrams);
    const c = parseFloat(calPer100g);
    if (Number.isFinite(q) && Number.isFinite(c) && q >= 0 && c >= 0) {
      return Math.round((q * c) / 100);
    }
    const s = parseFloat(servingSizeG);
    const n = parseFloat(servingCount);
    if (Number.isFinite(s) && Number.isFinite(n) && Number.isFinite(c) && s >= 0 && n >= 0 && c >= 0) {
      return Math.round(((s * n) * c) / 100);
    }
    return null;
  })();

  const totalGrams = (() => {
    const q = parseFloat(calQtyGrams);
    if (Number.isFinite(q) && q >= 0) return q;
    const s = parseFloat(servingSizeG);
    const n = parseFloat(servingCount);
    if (Number.isFinite(s) && Number.isFinite(n) && s >= 0 && n >= 0) return s * n;
    return null;
  })();

  const totals = (() => {
    const grams = totalGrams;
    const p = parseFloat(proteinPer100g);
    const cb = parseFloat(carbsPer100g);
    const f = parseFloat(fatPer100g);
    if (grams !== null && [p, cb, f].every(v => Number.isFinite(v) && v >= 0)) {
      return {
        protein: +(grams * p / 100).toFixed(1),
        carbs: +(grams * cb / 100).toFixed(1),
        fat: +(grams * f / 100).toFixed(1),
      };
    }
    return null;
  })();

  // Load/save calculator state
  useEffect(() => {
    try {
      const raw = localStorage.getItem('hh_calculator');
      if (raw) {
        const v = JSON.parse(raw);
        setCalQtyGrams(v.calQtyGrams ?? "");
        setCalPer100g(v.calPer100g ?? "");
        setProteinPer100g(v.proteinPer100g ?? "");
        setCarbsPer100g(v.carbsPer100g ?? "");
        setFatPer100g(v.fatPer100g ?? "");
        setPresetKey(v.presetKey ?? "");
        setServingSizeG(v.servingSizeG ?? "");
        setServingCount(v.servingCount ?? "");
      }
    } catch {}
  }, []);

  useEffect(() => {
    const data = { calQtyGrams, calPer100g, proteinPer100g, carbsPer100g, fatPer100g, presetKey, servingSizeG, servingCount };
    try { localStorage.setItem('hh_calculator', JSON.stringify(data)); } catch {}
  }, [calQtyGrams, calPer100g, proteinPer100g, carbsPer100g, fatPer100g, presetKey, servingSizeG, servingCount]);

  useEffect(() => {
    const loadSuggestions = async () => {
      if (ingredients.length > 0) {
        try {
          const res = await fetch(`/api/ingredients?q=${encodeURIComponent(ingredients)}`);
          const data = await res.json();
          setSuggestions(Array.isArray(data?.results) ? data.results : []);
        } catch {
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
      }
    };

    loadSuggestions();
  }, [ingredients]);

  const handleAssessment = async () => {
    setError(null);
    // Use chips if present, otherwise fall back to typed comma-separated list
    const tokens = selectedIngredients.length > 0
      ? selectedIngredients
      : ingredients.split(',').map(s => s.trim()).filter(Boolean);

    if (tokens.length === 0) {
      setAssessment("Please select at least one ingredient.");
      setOverallAnalysis("");
      setStarRating(null);
      return;
    }

    const combinedIngredients = tokens.join(", ");
    setLoading(true);
    try {
      let conditionToSend = condition;
      let objectiveToSend = objective;
      if (useProfileContext && typeof window !== 'undefined') {
        try {
          const prefsRaw = localStorage.getItem('hh_prefs');
          if (prefsRaw) {
            const prefs = JSON.parse(prefsRaw);
            conditionToSend = conditionToSend || prefs.primaryCondition || '';
            objectiveToSend = objectiveToSend || prefs.objective || '';
            const region = prefs.region || '';
            const diet = prefs.diet || '';
            const allergies = prefs.allergies || '';
            const age = prefs.age || '';
            const sex = prefs.sex || '';
            const activityLevel = prefs.activityLevel || '';
            // attach to request body via closure variables
            (window as any).__ctx = { region, diet, allergies, age, sex, activityLevel };
          }
        } catch {}
      }
      const res = await fetch('/api/assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredients: combinedIngredients,
          foodName,
          foodType,
          condition: conditionToSend,
          objective: objectiveToSend,
          ...(typeof window !== 'undefined' && (window as any).__ctx ? (window as any).__ctx : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        // Preserve error code for rate limit handling
        const error = new Error(data?.error || 'Failed to generate assessment');
        if (data?.code) {
          (error as any).code = data.code;
        }
        if (res.status === 429) {
          (error as any).code = 'RATE_LIMIT';
        }
        throw error;
      }
      const summaryText = data?.summary ?? "No assessment available.";
      setAssessment(summaryText);

      // Parse sections for Result and Proof blocks
      const extractSection = (label: string, text: string) => {
        const regex = new RegExp(`^${label}:\\s*([\\s\\S]*?)(?:\\n\\n|\\n[A-Z][A-Za-z ]+:|$)`, 'mi');
        const m = text.match(regex);
        return m && m[1] ? m[1].trim() : "";
      };
      const resultSection = extractSection("Result", summaryText);
      const proofSection = extractSection("Proof", summaryText) || extractSection("PROOF", summaryText);
      setParsedResult(resultSection);
      setParsedProof(proofSection);

      // Extract star rating and safe consumption from the summary
      const summary = summaryText;
      const ratingMatch = summary.match(/(\d+)\/10$/);
      if (ratingMatch && ratingMatch.length > 1) {
        setStarRating(parseInt(ratingMatch[1], 10));
      } else {
        setStarRating(null); // Set to null if no rating is found
      }

      const safeMatch = summary.match(/Safe consumption:\s*(.+)$/mi);
      if (safeMatch && safeMatch[1]) {
        setSafeConsumption(safeMatch[1].trim());
      } else {
        setSafeConsumption(null);
      }

      // Overall analysis becomes the crisp Result line when available
      const analysis = resultSection || generateOverallAnalysis(summary);
      setOverallAnalysis(analysis);
    } catch (e: any) {
      // Handle rate limit errors with user-friendly message
      if (e?.code === 'RATE_LIMIT' || e?.message?.includes('429') || e?.message?.includes('rate limit')) {
        setError('API rate limit reached. Please wait 30-60 seconds and try again. The system will automatically retry on your next attempt.');
      } else {
        setError(e?.message ?? 'Something went wrong. Please try again.');
      }
      setAssessment("");
      setOverallAnalysis("");
      setStarRating(null);
      setSafeConsumption(null);
    } finally {
      setLoading(false);
    }
  };

  const generateOverallAnalysis = (assessment: string): string => {
    // Basic logic for overall analysis based on the assessment
    if (assessment.toLowerCase().includes("bad")) {
      return `Based on the assessment, ${foodName} (${foodType}) seems to have some ingredients that may not be very healthy.
              It is recommended to consume it in moderation or look for healthier alternatives.`;
    } else if (assessment.toLowerCase().includes("good")) {
      return `Based on the assessment, ${foodName} (${foodType}) seems to have predominantly healthy ingredients.
              It can be a beneficial addition to your diet.`;
    } else {
      return `Unable to determine the overall health benefits of ${foodName} (${foodType}) based on the current assessment.
              More information may be needed for a comprehensive analysis.`;
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (!selectedIngredients.includes(suggestion)) {
      setSelectedIngredients([...selectedIngredients, suggestion]);
    }
    setIngredients("");
    setSuggestions([]);
  };

  const handleRemoveIngredient = (ingredientToRemove: string) => {
    setSelectedIngredients(selectedIngredients.filter((ingredient) => ingredient !== ingredientToRemove));
  };

  const addTypedIngredient = () => {
    const value = ingredients.trim();
    if (!value) return;
    if (!selectedIngredients.includes(value)) {
      setSelectedIngredients([...selectedIngredients, value]);
    }
    setIngredients("");
    setSuggestions([]);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <section className="container mx-auto px-6 py-10 md:py-14">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Ingredient Decoder</h1>
          <p className="mt-2 text-muted-foreground max-w-prose">
            Select ingredients, enter the food name and type, then generate a clear, AI-assisted health assessment with a star rating.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <Card className="glass rounded-2xl">
            <CardHeader>
              <CardTitle>Enter Details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Ingredients</label>
                <Input
                  type="text"
                  placeholder="Type to search or press Enter to add"
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTypedIngredient();
                    }
                  }}
                  className="rounded-xl"
                />
                {suggestions.length > 0 && (
                  <div className="rounded-xl border border-white/10 bg-white/10 backdrop-blur-md max-h-48 overflow-y-auto">
                    <List>
                      {suggestions.map((suggestion, index) => (
                        <ListItem
                          key={suggestion + index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="cursor-pointer hover:bg-secondary px-3 py-2"
                        >
                          {suggestion}
                        </ListItem>
                      ))}
                    </List>
                  </div>
                )}
                {selectedIngredients.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                    {selectedIngredients.map((ingredient) => (
                      <Badge key={ingredient} variant="secondary" className="px-2 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-md">
                        <span>{ingredient}</span>
                        <button
                          aria-label={`Remove ${ingredient}`}
                          onClick={() => handleRemoveIngredient(ingredient)}
                          className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">Food Name</label>
                <Input
                  type="text"
                  placeholder="e.g., Protein Bar"
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  className="rounded-xl"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">Food Type</label>
                <Input
                  type="text"
                  placeholder="e.g., snack, meal, dessert"
                  value={foodType}
                  onChange={(e) => setFoodType(e.target.value)}
                  className="rounded-xl"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                <label className="text-sm font-medium">Primary condition (optional)</label>
                  <select
                    className="rounded-xl border border-white/10 bg-white/10 backdrop-blur-md px-3 py-2 text-[var(--text)]"
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                  >
                    <option value="">— None —</option>
                    <option>Diabetes</option>
                    <option>Heart health</option>
                    <option>Hypertension</option>
                    <option>Weight management</option>
                    <option>PCOS</option>
                    <option>IBS</option>
                    <option>Cholesterol</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Objective (optional)</label>
                  <Input
                    type="text"
                    placeholder="e.g., defend against diabetes, become leaner"
                    value={objective}
                    onChange={(e) => setObjective(e.target.value)}
                    className="rounded-xl"
                  />
                </div>
                <div className="flex items-center gap-2 md:col-span-2">
                  <input id="use-profile" type="checkbox" checked={useProfileContext} onChange={(e) => setUseProfileContext(e.target.checked)} className="h-4 w-4" />
                  <label htmlFor="use-profile" className="text-sm text-muted-foreground">Use my profile condition/objective if available</label>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <Button onClick={handleAssessment} disabled={loading} className="min-w-44 rounded-xl btn-gradient hover:scale-[1.02]">
                  {loading ? 'Generating…' : 'Generate Assessment'}
                </Button>
                {error && (
                  <p className="text-red-600 text-sm" role="alert">{error}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="glass rounded-2xl">
            <CardHeader>
              <CardTitle>Results</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              {!assessment && !loading && (
                <div className="text-sm text-muted-foreground">
                  Your assessment will appear here once generated. Add ingredients and click Generate.
                </div>
              )}
              {assessment && (
                <div className="grid gap-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <div className="text-sm text-muted-foreground">Result</div>
                      <Textarea
                        readOnly
                        className="min-h-[160px] rounded-xl border border-white/10 bg-white/5 text-[var(--text)]/90 backdrop-blur-md"
                        value={parsedResult || assessment}
                      />
                    </div>
                    <div className="grid gap-2">
                      <div className="text-sm text-muted-foreground">Proof (certified)</div>
                      <Textarea
                        readOnly
                        className="min-h-[160px] rounded-xl border border-white/10 bg-white/5 text-[var(--text)]/90 backdrop-blur-md"
                        value={parsedProof || "• Evidence references will appear here (WHO / FDA / USDA / AHA)."}
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Star Rating:</span>
                      <span className="text-base">{starRating !== null ? `${starRating}/10` : 'N/A'}</span>
                    </div>
                    {safeConsumption && (
                      <div className="text-sm">
                        <span className="text-sm font-medium">Safe consumption:</span> {safeConsumption}
                      </div>
                    )}
                  </div>
                </div>
              )}
              {overallAnalysis && (
                <div className="grid gap-2">
                  <div className="text-sm text-muted-foreground">Overall Analysis</div>
                  <Textarea
                    readOnly
                    className="min-h-[180px] rounded-xl border border-white/10 bg-white/5 text-[var(--text)]/90 backdrop-blur-md"
                    value={overallAnalysis}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="container mx-auto px-6 pb-16">
        <div className="max-w-3xl">
          <Card className="glass rounded-2xl">
            <CardHeader>
              <CardTitle>Calorie Estimator</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <p className="text-sm text-muted-foreground">Use a preset or enter your own values. Estimate by grams or servings.</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Preset</label>
                  <select
                    className="rounded-xl border bg-white/70 backdrop-blur px-3 py-2"
                    value={presetKey}
                    onChange={(e) => {
                      const k = e.target.value;
                      setPresetKey(k);
                      if (k && CAL_PRESETS[k] !== undefined) {
                        const p = CAL_PRESETS[k];
                        setCalPer100g(String(p.kcal));
                        setProteinPer100g(String(p.protein));
                        setCarbsPer100g(String(p.carbs));
                        setFatPer100g(String(p.fat));
                      }
                    }}
                  >
                    <option value="">— Select —</option>
                    {Object.keys(CAL_PRESETS).map((k) => (
                      <option key={k} value={k}>{k}</option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Quantity (g)</label>
                  <Input
                    type="number"
                    min="0"
                    inputMode="decimal"
                    value={calQtyGrams}
                    onChange={(e) => setCalQtyGrams(e.target.value)}
                    placeholder="e.g., 65"
                    className="rounded-xl"
                  />
                </div>
                <div className="grid gap-2 sm:col-span-1">
                  <label className="text-sm font-medium">Calories per 100 g (kcal)</label>
                  <Input
                    type="number"
                    min="0"
                    inputMode="decimal"
                    value={calPer100g}
                    onChange={(e) => setCalPer100g(e.target.value)}
                    placeholder="e.g., 420"
                    className="rounded-xl"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Protein per 100 g (g)</label>
                  <Input
                    type="number"
                    min="0"
                    inputMode="decimal"
                    value={proteinPer100g}
                    onChange={(e) => setProteinPer100g(e.target.value)}
                    placeholder="e.g., 10"
                    className="rounded-xl"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Carbs per 100 g (g)</label>
                  <Input
                    type="number"
                    min="0"
                    inputMode="decimal"
                    value={carbsPer100g}
                    onChange={(e) => setCarbsPer100g(e.target.value)}
                    placeholder="e.g., 15"
                    className="rounded-xl"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Fat per 100 g (g)</label>
                  <Input
                    type="number"
                    min="0"
                    inputMode="decimal"
                    value={fatPer100g}
                    onChange={(e) => setFatPer100g(e.target.value)}
                    placeholder="e.g., 8"
                    className="rounded-xl"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Serving size (g)</label>
                  <Input
                    type="number"
                    min="0"
                    inputMode="decimal"
                    value={servingSizeG}
                    onChange={(e) => setServingSizeG(e.target.value)}
                    placeholder="e.g., 30"
                    className="rounded-xl"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Servings</label>
                  <Input
                    type="number"
                    min="0"
                    inputMode="decimal"
                    value={servingCount}
                    onChange={(e) => setServingCount(e.target.value)}
                    placeholder="e.g., 2"
                    className="rounded-xl"
                  />
                </div>
              </div>
              <div className="pt-1 text-sm space-y-2">
                {totalCalories !== null ? (
                  <span>
                    Estimated total: <span className="font-semibold">{totalCalories} kcal</span>
                  </span>
                ) : (
                  <span className="text-muted-foreground">Enter values above to see the estimate.</span>
                )}
                {totals && (
                  <div className="text-sm text-muted-foreground">
                    Macros total: <span className="font-semibold">{totals.protein}g protein</span>, <span className="font-semibold">{totals.carbs}g carbs</span>, <span className="font-semibold">{totals.fat}g fat</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="bg-white/30 backdrop-blur border-t border-white/40">
        <div className="container mx-auto px-6 py-5 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Health Heaven. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
