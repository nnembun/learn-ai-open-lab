# Learn AI Open Lab

Learn AI Open Lab is a free, open-source educational toolkit for learning practical AI skills. The first module, **AI Prompt Lab**, helps beginners test, compare and improve prompts in a private browser workspace. It is useful on its own and does not require an account, an AI provider, or a commercial academy subscription.

## What is included

- Side-by-side prompt workbench with live character counts
- Beginner-friendly prompt quality checklist
- Example library for business, marketing, education, content and everyday tasks
- Guided first exercise
- Response comparison workspace
- Local save, edit and delete for prompts and notes
- JSON and CSV export
- JSON and CSV import from the My prompts library
- Six-module learning roadmap with honest availability labels
- Responsive, accessible UI with helpful empty states

## Educational purpose and wider mission

Learn AI Open Lab aims to make practical AI education accessible to beginners, educators, creators and small business owners. It teaches prompt-writing as a practical, observable skill: give an AI a job, add useful context, set boundaries, and request a usable format.

The first public module is AI Prompt Lab. The in-app roadmap also describes planned AI Automation, Video, Coding, Business and Learning Library modules. Planned modules are clearly labelled and are not represented as working features yet.

## Installation and local development

```bash
npm install
npm run dev
```

Then open the local URL shown by Vite.

## Quality checks

```bash
npm test
npm run typecheck
npm run build
```

## Privacy

Saved prompts and notes stay in your browser's local storage. The app does not send prompt content to a server and does not require credentials. Export files are created locally by the browser.

## Screenshots

The app is a single responsive workbench. To capture a current screenshot, run `npm run dev` and use the browser's screenshot tools; screenshots are intentionally not committed until a stable release capture is selected.

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request. Useful contribution areas include:

1. Improve the JSON/CSV import UI with preview and duplicate handling.
2. Add keyboard shortcut help and screen-reader announcements.
3. Add browser end-to-end tests for the guided exercise.
4. Add a visual prompt diff with changed-word highlighting.
5. Add educator-reviewed examples for new learner contexts.
6. Add multilingual example packs and translations.
7. Improve mobile editing and touch targets.
8. Add a lesson-authoring format for community modules.
9. Add optional provider-agnostic response adapters.
10. Improve error recovery and local-storage migration handling.

Please do not include API keys, personal data, fabricated usage claims, or private prompts in commits or issues.

## Run without installing globally

```bash
npm install
npm run build
```

## License

MIT. See [LICENSE](LICENSE).
