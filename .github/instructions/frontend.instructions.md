---
applyTo: "apps/frontend/**/*"
description: Path-specific instructions for Next.js frontend development
---

# Frontend Instructions (apps/frontend/)

> Path-specific instructions for TypeScript/React frontend development

---

## Quick Context

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.x (strict mode - no `any` types)
- **React**: React 19 (functional components + hooks)
- **Testing**: vitest + React Testing Library + Playwright (E2E)
- **Type Checking**: tsc --strict (mandatory)
- **Linting**: ESLint + Prettier
- **Structure**: `src/` contains source, `tests/` contains tests

---

## Before You Start

1. **Read First**: `/docs/AI_DOCS_FRONTEND.md` for detailed frontend patterns
2. **Strict TypeScript**: No `any` types allowed (use `unknown` with type guards if needed)
3. **Tests First**: Write tests BEFORE implementing components (TDD)
4. **Server vs Client**: Use server components by default, mark client components explicitly

---

## Key Patterns

### Type-Safe Components
```typescript
// ✅ GOOD - Fully typed props
type PlanCardProps = {
  plan: Plan;
  readonly: boolean;
  onSelect?: (id: string) => void;
};

export const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  readonly,
  onSelect,
}) => (
  <div className="p-4">
    <h3>{plan.title}</h3>
    {!readonly && <button onClick={() => onSelect?.(plan.id)}>Select</button>}
  </div>
);

// ❌ BAD - any types
function PlanCard(props: any) {
  return <div>{props.plan}</div>;
}
```

### Test-First Development
```typescript
// Step 1: Write test first (RED)
it("should render plan title", () => {
  render(<PlanCard plan={mockPlan} readonly={false} onSelect={vi.fn()} />);
  expect(screen.getByText("My Plan")).toBeInTheDocument();
});

// Step 2: Implement component (GREEN)
export const PlanCard: React.FC<PlanCardProps> = ({ plan }) => (
  <div>{plan.title}</div>
);
```

### Server vs. Client Components
```typescript
// ✅ GOOD - Server component (default)
export default async function DefinitionsPage() {
  const definitions = await fetch("http://api/definitions");
  return <DefinitionsList definitions={definitions} />;
}

// ✅ GOOD - Client component (explicit)
"use client";
import { useState } from "react";

export const PlanForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  // ... component
};
```

### State Management

**Server State** (API data with TanStack Query):
```typescript
const { data: plan } = useQuery({
  queryKey: ["plans", id],
  queryFn: () => apiClient.getPlan(id),
});
```

**Client State** (UI state with Zustand):
```typescript
const sidebarOpen = useUIStore(state => state.sidebarOpen);
```

**Form State** (with React Hook Form + Zod):
```typescript
const { register, handleSubmit } = useForm<FormData>({
  resolver: zodResolver(PlanFormSchema),
});
```

### Form Validation (Zod + React Hook Form)
```typescript
// Step 1: Define Zod schema
const PlanFormSchema = z.object({
  programId: z.string().min(1, "Required"),
  athleteLevel: z.enum(["beginner", "intermediate", "advanced"]),
  weeks: z.number().int().positive().max(52),
});

type PlanFormData = z.infer<typeof PlanFormSchema>;

// Step 2: Use in component
"use client";
export const PlanForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<PlanFormData>({
    resolver: zodResolver(PlanFormSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("programId")} />
      {errors.programId && <span>{errors.programId.message}</span>}
    </form>
  );
};
```

### Custom Hook with TanStack Query
```typescript
import { useQuery } from "@tanstack/react-query";
import type { Plan } from "@/lib/types";

export function useGetPlan(planId: string) {
  return useQuery<Plan, Error>({
    queryKey: ["plans", planId],
    queryFn: async () => apiClient.getPlan(planId),
    enabled: !!planId,
    staleTime: 1000 * 60 * 5,
  });
}

// Usage
const { data: plan, isLoading, error } = useGetPlan(planId);
```

### Explicit Error & Loading States
```typescript
// ✅ GOOD - All states handled
if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorBoundary error={error} />;
if (!plan) return <NotFound />;
return <PlanViewer plan={plan} />;

// ❌ BAD - Silent failures
{plan && <PlanViewer plan={plan} />}
```

---

## Code Quality Checklist

Before committing, verify:

- [ ] **Tests written FIRST** (TDD - red, green, refactor)
- [ ] **All tests pass**: `npm run test`
- [ ] **Coverage ≥80%**: `npm run test -- --coverage`
- [ ] **Type checking passes**: `npm run typecheck`
- [ ] **Linting passes**: `npm run lint`
- [ ] **Code formatted**: `npm run format`
- [ ] **No `any` types** (or justified with comments)
- [ ] **No hardcoded API URLs** (use environment variables)
- [ ] **Error states handled** (no silent failures)
- [ ] **Loading states implemented**
- [ ] **Proper prop typing** (no optional unnecessarily)

---

## Testing Requirements

### Test File Organization
```
tests/
├── components/     # Component unit tests
├── lib/            # Library/utility tests
├── e2e/            # End-to-end tests (Playwright)
└── setup.ts        # Test configuration
```

### Test Naming & Structure
```typescript
// Component test: Feature.test.tsx
describe("PlanCard", () => {
  it("should render plan title", () => {
    render(<PlanCard plan={mockPlan} readonly={false} onSelect={vi.fn()} />);
    expect(screen.getByText("Plan Title")).toBeInTheDocument();
  });

  it("should call onSelect when button clicked", () => {
    const onSelect = vi.fn();
    render(<PlanCard plan={mockPlan} readonly={false} onSelect={onSelect} />);
    fireEvent.click(screen.getByRole("button", { name: /select/i }));
    expect(onSelect).toHaveBeenCalledWith(mockPlan.id);
  });
});

// Hook test: useGetPlan.test.ts
describe("useGetPlan", () => {
  it("should fetch plan data", async () => {
    const { result } = renderHook(() => useGetPlan("plan-1"));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data?.id).toBe("plan-1");
  });
});
```

### Coverage Targets
- **Minimum**: 80% line coverage (enforced)
- **Target**: 85-90% for components and utilities
- **Run**: `npm run test -- --coverage`

---

## Command Reference

```bash
# Setup
pnpm install

# Development
pnpm dev                # Start dev server
pnpm typecheck         # Type checking (tsc)
pnpm lint              # Run ESLint
pnpm format            # Run Prettier

# Testing
pnpm test              # Run unit tests
pnpm test:watch       # Watch mode
pnpm test:e2e         # Run E2E tests

# Build
pnpm build             # Production build
pnpm start             # Start production server
```

---

## File Structure Conventions

- **Components**: `PascalCase.tsx` (e.g., `PlanCard.tsx`)
- **Hooks**: `useFeature.ts` (always starts with `use`, e.g., `useGetPlan.ts`)
- **Stores**: `featureStore.ts` (e.g., `uiStore.ts`)
- **Utilities**: `camelCase.ts` (e.g., `apiClient.ts`)
- **Types**: Inline or in `lib/types.ts`
- **Tests**: `Feature.test.tsx` or `feature.test.ts`
- **Imports**: From `@/*` (e.g., `from @/components/plan/PlanCard`)

---

## Styling Guidelines

Use Tailwind CSS exclusively - no inline styles or CSS-in-JS:

```typescript
// ✅ GOOD - Tailwind classes
<div className="flex items-center justify-between gap-4 p-6 bg-blue-50 rounded border">
  <h2 className="text-lg font-bold">{title}</h2>
  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
    Action
  </button>
</div>

// ❌ BAD - Inline styles
<div style={{ display: "flex", padding: "24px" }}>
```

Use shadcn/ui pre-built components:
```typescript
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
```

---

## What NOT to Do

❌ Skip tests or write tests after components
❌ Use `any` type in TypeScript
❌ Mix server and client component concerns
❌ Hardcode API URLs or credentials
❌ Ignore error states or loading states
❌ Create prop drilling chains (use stores)
❌ Forget to memoize expensive components
❌ Use `console.log()` without proper logging
❌ Use `||` for boolean checks (use `??` for nullish)

---

## Documentation

- **Detailed Guide**: `docs/AI_DOCS_FRONTEND.md`
- **Testing Patterns**: `docs/AI_DOCS_TESTING.md`
- **File Structure**: `docs/AI_DOCS_WORKFLOW.md`
- **Architecture**: `docs/design_and_architecture.md`

---

**Last Updated**: 2026-03-02
