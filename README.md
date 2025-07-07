# Gemini PPT

A command-line tool to generate PowerPoint presentations (`.pptx`) using natural language instructions and Google's Gemini API. Built using [Bun](https://bun.sh), this project automates slide content creation and formatting with ease.

---

## Features

- Generate slide decks from plain English prompts.
- Built-in file name validation and overwrite protection.
- AI-powered content creation using Gemini 2.0 Flash model.
- Outputs clean and professional `.pptx` files via `pptxgenjs`.
- Interactive terminal prompts for user-friendly operation.

---

## Getting Started

### [Download ↗](/releases)
Download the precompiled binary from the [Releases](/releases) section of this repository.

### Setup

Set your Gemini API key via environment variable:
```bash
export GEMINI_API_KEY="your-api-key-here"
```
If you don't set it, the program will securely prompt you for it at runtime.

### Run
- On Windows: Double-click the executable file to start the program.
- On macOS or Linux:
1. Make it executable:
    ```bash
    chmod u+x gemini-ppt
    ```
2. Run from terminal or double-click in file manager:
    ```bash
    ./gemini-ppt
    ```

---

## Build from Source

### 1. Prerequisites

- [Bun](https://bun.sh/) installed
- A terminal that supports Node.js-compatible apps
- [Gemini API Key](https://aistudio.google.com/apikey)

### 2. Clone the Repository

```bash
git clone https://github.com/cj-praveen/gemini-ppt.git
cd gemini-ppt
```

### 3. Install Dependencies

```bash
bun install
```

### 4. Compile the binary
```bash
bun build main.js --compile --outfile=builds/gemini_ppt
```
(Add .exe at the end if building for Windows)

---

## License
[MIT LICENSE](/LICENSE)