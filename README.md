# AI Grammar Checker
Paste a sentence or paragraph and use Gemini to correct grammar, punctuation and spelling while preserving the original language and meaning. Compare the result with your draft and copy it.

## Run in VS Code
1. Open the repository folder in VS Code with Python 3 installed.
2. Create a Gemini API key at https://aistudio.google.com/apikey.
3. Run `python3 server.py` in the integrated terminal, or press Command + Shift + B.
4. At the hidden prompt paste the key and press Enter. The server keeps it in memory. You can also set GEMINI_API_KEY in the server environment beforehand.
5. Open http://127.0.0.1:8000, choose Gemini, enter your passage and click **Check grammar**. Try “Yesterday she buy two book.” An expected correction is “Yesterday she bought two books.”
6. Press Ctrl+C in the terminal to stop.

Gemini sends the submitted passage to Google. Each request accepts up to 12,000 characters. The default model is `gemini-flash-latest`. If it returns HTTP 503 without a requested wait time, the server waits one second and tries `gemini-3.1-flash-lite` once. When Google specifies a wait, follow the message in Review.

To use Flash-Lite directly on macOS, stop the running server with Ctrl+C and run `GEMINI_MODEL=gemini-3.1-flash-lite python3 server.py` in the same terminal. Setting `GEMINI_MODEL` keeps both attempts on the selected model.

Quick rules run locally without a key. The optional browser AI model downloads on first use and accepts up to 500 characters. The local Python backend is required for Gemini mode.
