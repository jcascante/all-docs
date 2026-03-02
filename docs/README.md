---
title: Documentation Index
description: Navigation hub for all project documentation including AI guides, architecture, and workflows
author: Copilot
lastUpdated: 2026-03-02
version: 1.0
tags: [documentation, index, navigation, ai-docs]
---

# Documentation Index

Welcome! This directory contains comprehensive documentation for the Training Program Generator project, including AI-optimized guides for developers and AI assistants.

---

## 🤖 AI Assistant Documentation

These documents are optimized for AI code generation and are the **primary reference** for AI models (GitHub Copilot, Claude, etc.):

### [AI_DOCS_PYTHON.md](./AI_DOCS_PYTHON.md)
Best practices for Python backend development.
- Project structure
- Type hints and style
- Pydantic models and FastAPI patterns
- Async/await patterns
- Error handling
- Testing patterns
- Common code patterns

**When to use**: You're writing Python code for the backend.

### [AI_DOCS_FRONTEND.md](./AI_DOCS_FRONTEND.md)
Best practices for TypeScript/React frontend development.
- Project structure
- Type safety in TypeScript
- Component patterns
- Server vs. client components
- State management (TanStack Query, Zustand)
- Forms with Zod and React Hook Form
- Testing patterns
- Performance optimization

**When to use**: You're writing TypeScript or React code.

### [AI_DOCS_TESTING.md](./AI_DOCS_TESTING.md)
Test-Driven Development (TDD) and comprehensive testing guide.
- TDD workflow (Red → Green → Refactor)
- Unit test patterns (pytest, vitest)
- Integration and E2E tests
- Mocking and fixtures
- Snapshot and property-based testing
- Test coverage expectations
- Testing checklist

**When to use**: You're writing tests or implementing features (start with tests!).

### [AI_DOCS_WORKFLOW.md](./AI_DOCS_WORKFLOW.md)
Development workflow, conventions, and standards.
- File and folder naming conventions
- Branch naming and commit messages
- Development checklist
- Local development setup
- CI/CD requirements
- Troubleshooting guide

**When to use**: You're starting a new task, committing code, or setting up your environment.

### [AI_DOCS_VSCODE.md](./AI_DOCS_VSCODE.md)
VS Code and GitHub Copilot integration guide.
- VS Code settings and extensions
- Using Copilot effectively (Chat, completions, context)
- Debugging in VS Code
- Running tests from the editor
- REST client for API testing
- Performance tips

**When to use**: You're using VS Code or GitHub Copilot.

---

## 📐 Architecture & Design

### [design_and_architecture.md](./design_and_architecture.md)
System-level design and architecture decisions.
- System overview and core invariants
- Technology stack
- Data models and schemas
- API design
- Generation pipeline
- Quality assurance strategies

**When to use**: You need to understand system design or make architectural decisions.

### [architecture_c4.md](./architecture_c4.md)
C4 model diagrams for system visualization.
- Context (high-level system view)
- Containers (major components)
- Components (internal structure)
- Classes and relationships

**When to use**: You want visual diagrams of the system architecture.

---

## 🚀 Getting Started

### For AI Models (Copilot, Claude, etc.)
1. **First time?** Read `.copilot-instructions.md` in the project root
2. **Writing Python?** Read `AI_DOCS_PYTHON.md` + `AI_DOCS_TESTING.md`
3. **Writing React/TS?** Read `AI_DOCS_FRONTEND.md` + `AI_DOCS_TESTING.md`
4. **Confused about structure?** Read `AI_DOCS_WORKFLOW.md`
5. **Using VS Code?** Read `AI_DOCS_VSCODE.md`

### For Human Developers
1. **New to the project?** Start with `design_and_architecture.md`
2. **Setting up your environment?** See `AI_DOCS_VSCODE.md` and `AI_DOCS_WORKFLOW.md`
3. **Writing code?** Check the language-specific AI docs (Python/Frontend)
4. **Writing tests?** Read `AI_DOCS_TESTING.md` (tests come first!)
5. **Making a PR?** Ensure you've read `AI_DOCS_WORKFLOW.md` for conventions

---

## 📋 Documentation by Task

### "I want to add a new feature"
1. Read: `design_and_architecture.md` (understand requirements)
2. Read: Relevant AI_DOCS (Python or Frontend)
3. Read: `AI_DOCS_TESTING.md` (write tests first!)
4. Read: `AI_DOCS_WORKFLOW.md` (commit conventions)

### "I need to fix a bug"
1. Read: `AI_DOCS_TESTING.md` (write reproducing test)
2. Read: Relevant language-specific guide
3. Follow: Development checklist in `AI_DOCS_WORKFLOW.md`

### "I'm setting up my environment"
1. Read: `AI_DOCS_WORKFLOW.md` (setup instructions)
2. Read: `AI_DOCS_VSCODE.md` (if using VS Code)

### "I'm using GitHub Copilot"
1. Read: `.copilot-instructions.md` (root level)
2. Read: `AI_DOCS_VSCODE.md` (Copilot tips)
3. Reference: Language-specific guides as needed

### "I want to understand the system"
1. Read: `design_and_architecture.md` (overview)
2. View: `architecture_c4.md` (visual diagrams)
3. Reference: Relevant language guides

---

## 🎯 Quick Reference

### Project Structure
```
project-builder-engine/
├── apps/
│   ├── backend/          Python FastAPI backend
│   └── frontend/         Next.js React frontend
├── docs/                 This directory
│   ├── README.md         You are here
│   ├── AI_DOCS_*.md      AI-optimized guides
│   ├── design_*.md       Architecture & design
│   └── ...
├── .copilot-instructions.md  Root-level AI instructions
├── package.json          Root workspace config
└── turbo.json            Monorepo config
```

### Technology Stack
- **Backend**: Python 3.12+, FastAPI, async/await
- **Frontend**: Next.js 15, React 19, TypeScript 5.x
- **Testing**: pytest (backend), vitest + Playwright (frontend)
- **Type Checking**: mypy, tsc (strict mode)
- **Linting**: Ruff (Python), ESLint (TypeScript)

### Key Files
- **`.copilot-instructions.md`** - AI instructions (read first!)
- **`AI_DOCS_PYTHON.md`** - Python backend standards
- **`AI_DOCS_FRONTEND.md`** - TypeScript/React standards
- **`AI_DOCS_TESTING.md`** - TDD and testing standards
- **`design_and_architecture.md`** - System design

---

## ✅ Quality Standards

- **Test Coverage**: Minimum 80% across all code
- **Type Safety**: Strict TypeScript, mypy --strict for Python
- **TDD**: Tests written BEFORE implementation (non-negotiable)
- **No `any` types**: Except with explicit comments
- **No hardcoded secrets**: Use environment variables
- **Explicit error handling**: No silent failures

---

## 🔗 Cross-References

### Common Scenarios

**"Write a new API endpoint"**
→ `AI_DOCS_PYTHON.md` (FastAPI section) + `AI_DOCS_TESTING.md` (API tests)

**"Create a React component"**
→ `AI_DOCS_FRONTEND.md` (Component patterns) + `AI_DOCS_TESTING.md` (Component tests)

**"Add form validation"**
→ `AI_DOCS_FRONTEND.md` (Forms & Validation) + examples in `AI_DOCS_TESTING.md`

**"Debug a failing test"**
→ `AI_DOCS_TESTING.md` + `AI_DOCS_VSCODE.md` (Debugging section)

**"Set up development environment"**
→ `AI_DOCS_WORKFLOW.md` (Local Development Setup) + `AI_DOCS_VSCODE.md`

---

## 📝 Notes

### For AI Models
- These docs are written to be parsed by AI systems
- Code examples are production-ready patterns
- When in doubt, refer to the AI_DOCS files
- TDD is **mandatory** - write tests first
- All type hints are **required** (Python and TypeScript)

### For Humans
- Use `AI_DOCS_*` files as your primary reference
- They contain patterns, examples, and best practices
- `.copilot-instructions.md` guides any AI assistant you're using
- Design docs explain the "why" behind architectural choices

### Keeping Documentation Updated
- Update AI docs when patterns change
- Update design docs when requirements shift
- Keep examples up-to-date with code
- Document new tooling or dependencies

---

## 🆘 Getting Help

| Question | Reference |
|----------|-----------|
| "How do I write Python code?" | `AI_DOCS_PYTHON.md` |
| "How do I write React/TypeScript?" | `AI_DOCS_FRONTEND.md` |
| "How do I write tests?" | `AI_DOCS_TESTING.md` |
| "What's the project structure?" | `AI_DOCS_WORKFLOW.md` |
| "How do I use VS Code/Copilot?" | `AI_DOCS_VSCODE.md` |
| "Why was this decision made?" | `design_and_architecture.md` |
| "What's the overall system design?" | `design_and_architecture.md` + `architecture_c4.md` |

---

**Last Updated**: 2026-03-02

For the most current information, always refer to the main `.copilot-instructions.md` and language-specific AI_DOCS files.
