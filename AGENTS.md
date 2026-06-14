<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npm exec nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax

<!-- nx configuration end-->

## Domain Concepts

**Solo Microservice:**
A "solo microservice" is a microservice that encapsulates exactly one distinct entity or aggregate root (e.g., `user-service`). It is responsible solely for the lifecycle, state, and business rules of that specific domain concept without bleeding into other domains. It owns its own database and exposes its capabilities via well-defined contracts (gRPC, HTTP).

**DDD + CQRS in Solo Microservices:**
- **DDD (Domain-Driven Design):** Focuses on isolating the core business logic (Domain) from infrastructure and framework concerns. Even in a single-entity microservice, it helps maintain a clean boundary around the entity's behavior.
- **CQRS (Command Query Responsibility Segregation):** Segregates operations that modify state (Commands) from operations that read state (Queries). In a solo microservice, this means having distinct execution paths and models for reading the entity vs. updating/creating it, which improves maintainability and scalability.
