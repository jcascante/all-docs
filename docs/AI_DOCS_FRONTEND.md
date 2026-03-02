---
title: TypeScript & React Frontend - Best Practices & AI Guidelines
description: Comprehensive guide for TypeScript/React frontend development with Next.js 15, strict mode, testing, and state management
author: Copilot
lastUpdated: 2026-03-02
version: 1.0
tags: [typescript, react, frontend, next.js, tdd, testing, zod]
---

# TypeScript & React Frontend - Best Practices & AI Guidelines

> **For AI Models (Copilot, Claude, etc.)**: This document describes patterns to follow when generating or modifying TypeScript/React code.

---

## Project Structure

```
apps/frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   ├── generate/           # Plan generation feature
│   │   └── definitions/        # Program definitions feature
│   ├── components/             # Reusable React components
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── plan/               # Plan-specific components
│   │   └── forms/              # Form components
│   ├── lib/
│   │   ├── api-client.ts       # API communication
│   │   ├── utils.ts            # Utility functions
│   │   ├── types.ts            # TypeScript types/interfaces
│   │   └── validation.ts       # Zod validation schemas
│   ├── store/                  # Zustand state stores
│   └── styles/                 # Global styles
├── tests/
│   ├── components/             # Component unit tests
│   ├── lib/                    # Library unit tests
│   ├── e2e/                    # End-to-end tests (Playwright)
│   └── setup.ts                # Test configuration
├── vitest.config.ts            # Unit test config
├── playwright.config.ts        # E2E test config
└── package.json
```

---

## Language & Style

- **TypeScript Version**: 5.7+, **Strict Mode REQUIRED**
- **React Version**: 19+
- **Node/Next.js**: Next.js 15+ with App Router (not Pages Router)
- **Linter**: ESLint (flat config)
- **Formatter**: Prettier (auto-format)
- **Line Length**: 100 characters (enforced)
- **Type Checking**: `tsc --strict --noEmit`

### TypeScript Configuration

```jsonc
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noPropertyAccessFromIndexSignature": true,
    "exactOptionalPropertyTypes": true,
    "target": "ES2020"
  }
}
```

### Type Safety Requirements

```typescript
// ✅ GOOD - Full type safety
function formatDate(date: Date): string {
  return date.toLocaleDateString();
}

const user: User = { id: 1, name: "John", email: "john@example.com" };

// ❌ BAD - Any types, implicit any
function formatDate(date: any): any {
  return date.toLocaleDateString();
}

// ✅ GOOD - Export types
export type PlanProps = {
  planId: string;
  title: string;
  weeks: number;
  onUpdate?: (plan: Plan) => Promise<void>;
};

// ❌ BAD - Optional without full typing
type PlanProps = {
  planId?: string;
  title?: string;
  weeks?: number;
  onUpdate?: any;
};
```

---

## Component Patterns

All components are **functional components** using React hooks. Use server components where appropriate.

### Basic Component

```typescript
// ✅ Type-safe component with proper typing
type SessionCardProps = {
  sessionId: string;
  title: string;
  exerciseCount: number;
  onSelect: (id: string) => void;
};

export const SessionCard: React.FC<SessionCardProps> = ({
  sessionId,
  title,
  exerciseCount,
  onSelect,
}) => {
  const handleClick = () => {
    onSelect(sessionId);
  };

  return (
    <div className="p-4 border rounded-lg cursor-pointer hover:bg-gray-100">
      <h3 className="font-bold text-lg">{title}</h3>
      <p className="text-sm text-gray-600">{exerciseCount} exercises</p>
      <button
        onClick={handleClick}
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Select
      </button>
    </div>
  );
};
```

### Server vs. Client Components

```typescript
// Server component (default in App Router)
// ✅ GOOD - Use for data fetching, protected operations
export default async function DefinitionsPage() {
  const definitions = await fetch("http://api/definitions");
  return <DefinitionsList definitions={definitions} />;
}

// Client component - explicitly marked
"use client";
import { useState } from "react";

// ✅ GOOD - Use for interactivity, hooks
export const PlanForm: React.FC<{ onSubmit: (data: PlanRequest) => Promise<void> }> = ({
  onSubmit,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  // ... component logic
};
```

### Props Typing Pattern

```typescript
// ✅ GOOD - Separate type definition
type PlanViewerProps = {
  plan: Plan;
  readonly: boolean;
  onWeekSelect?: (weekNumber: number) => void;
};

export const PlanViewer: React.FC<PlanViewerProps> = ({
  plan,
  readonly,
  onWeekSelect,
}) => {
  // ...
};

// ✅ GOOD - With children
type ContainerProps = {
  title: string;
  children: React.ReactNode;
};

export const Container: React.FC<ContainerProps> = ({ title, children }) => (
  <div>
    <h1>{title}</h1>
    {children}
  </div>
);
```

---

## State Management

### TanStack Query (Server State)

Use TanStack Query for server state, API calls, and caching.

```typescript
// hooks/useGetPlan.ts
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { Plan } from "@/lib/types";

export function useGetPlan(planId: string) {
  return useQuery<Plan, Error>({
    queryKey: ["plans", planId],
    queryFn: async () => {
      const response = await apiClient.get(`/plans/${planId}`);
      return response.data;
    },
    enabled: !!planId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Usage in component
"use client";
import { useGetPlan } from "@/hooks/useGetPlan";

export const PlanDetail: React.FC<{ planId: string }> = ({ planId }) => {
  const { data: plan, isLoading, error } = useGetPlan(planId);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!plan) return <NotFound />;

  return <div>{/* Render plan */}</div>;
};
```

### Zustand (Client State)

Use Zustand for client-only state (UI state, user preferences).

```typescript
// store/uiStore.ts
import { create } from "zustand";

type UIStore = {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSelectedPlanId: (id: string | null) => void;
  selectedPlanId: string | null;
};

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  selectedPlanId: null,
  setSelectedPlanId: (id) => set({ selectedPlanId: id }),
}));

// Usage
"use client";
import { useUIStore } from "@/store/uiStore";

export const Sidebar: React.FC = () => {
  const { sidebarOpen, toggleSidebar } = useUIStore();

  return (
    <aside className={sidebarOpen ? "open" : "closed"}>
      <button onClick={toggleSidebar}>Toggle</button>
    </aside>
  );
};
```

---

## Forms & Validation

Use **React Hook Form** with **Zod** for type-safe forms.

### Validation Schema

```typescript
// lib/validation/planForm.ts
import { z } from "zod";

export const PlanRequestSchema = z.object({
  programId: z.string().min(1, "Program is required"),
  athleteLevel: z.enum(["beginner", "intermediate", "advanced"]),
  durationWeeks: z.number().int().positive().max(52),
  notes: z.string().optional(),
});

export type PlanRequest = z.infer<typeof PlanRequestSchema>;
```

### Form Component

```typescript
// components/forms/PlanForm.tsx
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlanRequestSchema, type PlanRequest } from "@/lib/validation/planForm";
import { useCreatePlan } from "@/hooks/useCreatePlan";

type PlanFormProps = {
  onSuccess?: (planId: string) => void;
};

export const PlanForm: React.FC<PlanFormProps> = ({ onSuccess }) => {
  const createPlan = useCreatePlan();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PlanRequest>({
    resolver: zodResolver(PlanRequestSchema),
    defaultValues: {
      athleteLevel: "intermediate",
      durationWeeks: 12,
    },
  });

  const onSubmit = async (data: PlanRequest) => {
    const result = await createPlan.mutateAsync(data);
    onSuccess?.(result.id);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="programId" className="block font-medium mb-1">
          Program
        </label>
        <select
          id="programId"
          {...register("programId")}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Select a program</option>
          {/* Options */}
        </select>
        {errors.programId && (
          <p className="text-red-600 text-sm mt-1">{errors.programId.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {isSubmitting ? "Generating..." : "Generate Plan"}
      </button>
    </form>
  );
};
```

---

## API Communication

Centralized API client with type safety.

```typescript
// lib/api-client.ts
import axios, { AxiosInstance } from "axios";
import type { Plan, PlanRequest } from "./types";

class APIClient {
  private client: AxiosInstance;

  constructor(baseURL: string = process.env.NEXT_PUBLIC_API_URL) {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async createPlan(request: PlanRequest): Promise<Plan> {
    const response = await this.client.post<Plan>("/v1/plans", request);
    return response.data;
  }

  async getPlan(id: string): Promise<Plan> {
    const response = await this.client.get<Plan>(`/v1/plans/${id}`);
    return response.data;
  }

  // ... other methods
}

export const apiClient = new APIClient();
```

### Custom Hooks for API Calls

```typescript
// hooks/useCreatePlan.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { Plan, PlanRequest } from "@/lib/types";

export function useCreatePlan() {
  const queryClient = useQueryClient();

  return useMutation<Plan, Error, PlanRequest>({
    mutationFn: (request) => apiClient.createPlan(request),
    onSuccess: (newPlan) => {
      // Invalidate plans list to refetch
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      queryClient.setQueryData(["plans", newPlan.id], newPlan);
    },
    onError: (error) => {
      console.error("Failed to create plan:", error);
    },
  });
}
```

---

## Testing (TDD-First)

### Unit Tests (Vitest + React Testing Library)

Write tests BEFORE implementation.

```typescript
// components/plan/SessionCard.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { SessionCard } from "./SessionCard";

describe("SessionCard", () => {
  it("should render session title and exercise count", () => {
    render(
      <SessionCard
        sessionId="s1"
        title="Warm-up"
        exerciseCount={3}
        onSelect={vi.fn()}
      />
    );

    expect(screen.getByText("Warm-up")).toBeInTheDocument();
    expect(screen.getByText("3 exercises")).toBeInTheDocument();
  });

  it("should call onSelect when button is clicked", () => {
    const onSelect = vi.fn();
    render(
      <SessionCard
        sessionId="s1"
        title="Warm-up"
        exerciseCount={3}
        onSelect={onSelect}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /select/i }));
    expect(onSelect).toHaveBeenCalledWith("s1");
  });

  it("should apply hover styles", () => {
    const { container } = render(
      <SessionCard
        sessionId="s1"
        title="Warm-up"
        exerciseCount={3}
        onSelect={vi.fn()}
      />
    );

    const element = container.firstChild;
    expect(element).toHaveClass("hover:bg-gray-100");
  });
});
```

### E2E Tests (Playwright)

```typescript
// e2e/generate-plan.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Plan Generation Flow", () => {
  test("should generate a plan from user input", async ({ page }) => {
    await page.goto("/generate");

    // Select program
    await page.selectOption('select[id="programId"]', "strength-101");

    // Select athlete level
    await page.selectOption('select[id="athleteLevel"]', "intermediate");

    // Submit form
    await page.click('button:has-text("Generate Plan")');

    // Wait for redirect to plan detail
    await page.waitForURL(/^.*\/plans\/[a-f0-9-]+$/);

    // Verify plan is displayed
    expect(await page.isVisible("text=Week 1")).toBeTruthy();
    expect(await page.isVisible("text=Warm-up Session")).toBeTruthy();
  });

  test("should show validation errors on invalid input", async ({ page }) => {
    await page.goto("/generate");

    // Submit without selecting program
    await page.click('button:has-text("Generate Plan")');

    // Check error message
    expect(await page.isVisible("text=Program is required")).toBeTruthy();
  });
});
```

### Test Coverage Expectations

- **Minimum**: 80% line coverage (enforced by CI)
- **Target**: 85-90% for components and utilities
- **Critical**: 100% coverage for validation schemas, hooks, and API logic

Run tests:
```bash
npm run test              # Unit tests
npm run test:watch      # Watch mode
npm run test:e2e        # E2E tests
```

---

## Error Handling & Loading States

```typescript
// ✅ GOOD - Explicit error handling
"use client";
import { useQuery } from "@tanstack/react-query";

type PlanDetailProps = {
  planId: string;
};

export const PlanDetail: React.FC<PlanDetailProps> = ({ planId }) => {
  const { data: plan, isLoading, error } = useQuery({
    queryKey: ["plans", planId],
    queryFn: async () => apiClient.getPlan(planId),
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <ErrorBoundary error={error} onRetry={() => {/* refetch */}} />
    );
  }

  if (!plan) {
    return <NotFoundPage resourceName="Plan" />;
  }

  return <PlanRenderer plan={plan} />;
};
```

---

## Styling with Tailwind CSS

- Use Tailwind classes exclusively (no inline styles)
- Use Tailwind v4+ syntax
- Use shadcn/ui for pre-built components

```typescript
// ✅ GOOD
<div className="flex items-center justify-between gap-4 p-6 border rounded-lg bg-gray-50">
  <h2 className="text-xl font-bold text-gray-900">{title}</h2>
  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
    Click me
  </button>
</div>

// ❌ BAD - Inline styles
<div style={{ display: "flex", padding: "24px" }}>
  {/* ... */}
</div>
```

---

## Performance Optimization

- Use `React.memo()` for expensive components
- Use `useMemo()` and `useCallback()` selectively (profile first)
- Lazy-load routes with `React.lazy()` and `Suspense`
- Use Next.js Image component for optimization

```typescript
// ✅ GOOD - Memoized component
const PlanListItem = React.memo(
  ({ plan, onSelect }: PlanListItemProps) => (
    <div onClick={() => onSelect(plan.id)}>{plan.title}</div>
  )
);

// ✅ GOOD - Lazy-loaded page
const AdminPanel = React.lazy(() => import("./AdminPanel"));

export default function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AdminPanel />
    </Suspense>
  );
}
```

---

## Imports & Organization

```typescript
// Order:
// 1. React & Next.js
import { useState, useCallback } from "react";
import Link from "next/link";

// 2. Third-party libraries
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

// 3. Local imports
import { apiClient } from "@/lib/api-client";
import { PlanCard } from "@/components/plan/PlanCard";
import type { Plan } from "@/lib/types";
```

---

## Environment Variables

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=Training Program Generator
```

Use `NEXT_PUBLIC_` prefix for browser-accessible variables.

```typescript
// Usage
const API_URL = process.env.NEXT_PUBLIC_API_URL;
```

---

## Checklist Before Committing

- [ ] TypeScript strict mode passes (`tsc --strict --noEmit`)
- [ ] ESLint passes (`npm run lint`)
- [ ] Prettier formatted (`npm run format`)
- [ ] Tests written BEFORE code (TDD)
- [ ] Minimum 80% test coverage
- [ ] All tests pass (`npm run test`)
- [ ] E2E tests pass (`npm run test:e2e`)
- [ ] No `any` types (except in special cases with comments)
- [ ] No hardcoded API URLs or credentials
- [ ] Proper error handling (no bare catch)
- [ ] Proper loading states (no undefined UI flashing)
- [ ] Accessible HTML (proper ARIA labels, semantic HTML)
