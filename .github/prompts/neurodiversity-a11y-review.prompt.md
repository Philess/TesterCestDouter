---
mode: agent
description: 'Neurodiversity Website exploratory checking using Playwright MCP'
tools: ['createFile', 'createDirectory', 'editFiles', 'search', 'runCommands', 'runTasks', 'usages', 'vscodeAPI', 'problems', 'changes', 'testFailure', 'fetch', 'todos', 'playwright', 'search']
model: 'Claude Sonnet 4'
---

# Website Exploration for Testing

Your goal is to explore the website, test the main user flows, and identify potential issues or areas for improvement. You will use the Playwright MCP Server to navigate and interact with the website.

## Specific Instructions

1. Read and understand the accessibility rules provided on [this list](.github.context/a11y-rules.context.md).
2. Navigate to the provided URL using the Playwright MCP Server. If no URL is provided, ask the user to provide one.
3. Identify and interact with 3-5 core features or user flows.
4. Capture screenshots of each interaction and check if you identify any bad practices or issues regarding the accessibility rules provided on the provided list.
5. Document the user interactions, the issues found, and suggested improvements in a markdown file. Include the screenshots in the markdown file.
6. Close the browser context upon completion.
7. Provide a concise summary of your findings.

## Output

Put all generated files in the `./reports` directory. The main report should be named `a11y-review-report.md` and the screenshots should be placed in a subdirectory named `screenshots` to ease their inclusion in the report with a relative path.
