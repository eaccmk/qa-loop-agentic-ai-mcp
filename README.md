# QA Loop in Agentic AI

**QA Loop (in agentic AI)**

A `QA loop` is a repeating cycle where an AI agent tests a live product on its own. 
It looks at the product, decides what to test, runs the test, checks the result, and then uses what it learned to test again. 
This keeps repeating without a person guiding each step.

Here is an **Analogy**:

> It's like a chef who keeps tasting a soup while cooking. 
> They taste it, notice it needs more salt, adjust it, tastes again, and keeps repeating this until the soup is right, all without anyone telling them to do it.

![QA Loop Agentic AI](assets/agentic_qa_loop_diagram.png)

QA Loop Studio is a development-first sample web app and test harness for building and validating user-facing product flows with Playwright.

It is meant to stay generic so the repository can expand into a larger project over time.

## What this repo is about

- A simple local website with a login screen, home dashboard, profile settings, and theme toggle
- A Playwright end-to-end testing setup for behavior-first validation
- A lightweight base for continuous product iteration, QA, and agent-assisted development

## QA Loop

A QA loop is the repeatable cycle of:

1. Inspecting the real product state
2. Identifying quality risks
3. Writing or updating tests around user behavior
4. Making the code change
5. Running the tests again
6. Repeating until the feature is stable

In this repo, the QA loop is designed to support agentic and AI-assisted testing workflows where the app is checked in a browser and the tests evolve with the product.

Here is a visual explanation :

![QA Loop Agentic AI MCP](assets/qa-loop-agentic-ai-mcp.png)

## Install and setup

If npm blocks install scripts during setup, approve the Vite dependency first:

```bash
npm install-scripts approve esbuild
```

On macOS, you can also allow the optional file watcher:

```bash
npm install-scripts approve fsevents
```

Then install the project dependencies:

```bash
npm install
```

## Run the website locally

```bash
npm run dev
```

Then open the local URL shown in the terminal.

## Run end-to-end tests

Run this in a new terminal session:

```bash
npm run test:e2e
```

## Live web development loop

Use this flow when you want to inspect the app, make changes, and rerun tests:

```bash
npm run dev
```

In a new terminal session, run:

```bash
npm run test:e2e
```

Then:

1. Make your code changes
2. Refresh the browser or rerun the app if needed
3. Run `npm run test:e2e` again
4. Repeat until the behavior is correct

## Project direction

This repository is intentionally small at first so it can grow into a fuller product later. Good next expansion areas include:

- richer authentication flows
- more product pages
- profile persistence
- shared UI components
- broader Playwright coverage
- API integration
- CI automation
