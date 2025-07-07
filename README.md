# Gemini PPT
A CLI tool that creates structured, editable .pptx slides using Google's Gemini AI ideal for students, educators, and professionals needing a fast start.

### [Download ↗](/releases)

https://github.com/user-attachments/assets/e04d2a39-225b-4724-a94d-0665085c3174

_Set your Gemini API key via an environment variable. If you don’t set it, the program will securely prompt you at runtime._

---

## Build from Source

- Requires [Bun](https://bun.sh/)

- Clone the Repository

```bash
git clone https://github.com/cj-praveen/gemini-ppt.git
cd gemini-ppt
```

- Install Dependencies

```bash
bun install
```

- Compile the binary
```bash
bun build main.js --compile --outfile=builds/gemini-ppt
```
_(Add .exe at the end if building for Windows)_
