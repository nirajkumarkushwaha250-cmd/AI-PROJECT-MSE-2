# AI Grammar Checker
A browser-based English grammar checker built with HTML, CSS and JavaScript. Quick rules suggest edits with explanations. Optional AI mode uses Transformers.js to download and run a pretrained grammar correction model in the browser.

## Run on macOS in VS Code
1. Install Python 3 and open this project folder in VS Code.
2. Press Command + Shift + B to start the included server task. Alternatively, run `python3 -m http.server 8000 --bind 127.0.0.1` in the integrated terminal.
3. Open http://127.0.0.1:8000 and select **Try example**, then **Check grammar**.
4. Stop the server with Ctrl+C in its terminal.

## Source
- index.html contains the interface and CSS.
- app.js handles the editor, results, clipboard and optional AI model.
- checker.js contains the rule-based corrections.

Quick rules cover selected English patterns. AI mode requires an internet connection for the first model download and accepts up to 500 characters per check.
