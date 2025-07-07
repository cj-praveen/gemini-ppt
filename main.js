import PptxGenJS from "pptxgenjs";
import promptSync from "prompt-sync";
import { existsSync } from 'fs';

class Main {

    constructor() {
        this.prompt = promptSync({ sigint: true });
        this.API_KEY = process.env.GEMINI_API_KEY || "";
    }

    async init() {
        while (!this.API_KEY) {
            this.API_KEY = this.prompt("Enter your API Key: ", { echo: "*" });
            if (!this.API_KEY) {
                this.cprint("API Key is empty, Please retry!", "RED");
            }
        }

        let session_count = 1;

        while (true) {
            console.log(`\nSession: ${session_count}\n`);

            let fileName = this.prompt("Enter the filename: ");
            fileName = this.validateFileName(fileName);

            while (true) {
                if (existsSync(fileName)) {
                    this.cprint(`Do you want to override ${fileName}? (Y/N): `, "YELLOW");
                    let resp = this.prompt();
                    if (resp.toUpperCase() === "Y") {
                        break;
                    } else if (resp.toUpperCase() === "N") {
                        fileName = this.prompt("Enter the filename: ");
                        fileName = this.validateFileName(fileName);
                    }
                } else {
                    break;
                }
            }

            let instructions = this.prompt("Enter slide instructions (MAX 500 characters): ").trim();

            if (!instructions) {
                this.cprint("No slide instructions were provided, Please try again.", "RED");
                continue;
            }

            let slides = await this.generate_content(instructions.slice(0, 500));

            if (!slides || slides.length === 0) {
                this.cprint(`Unable to write ${fileName}, Please try again.\n`, "RED");
                continue;
            }

            await this.create_pptx(fileName, slides);

            session_count++;

            this.cprint("Ctrl+C to quit program", "YELLOW");
        }
    }

    validateFileName(fileName) {
        fileName = fileName ? fileName.slice(0, 100).trim().replace(/[^a-zA-Z0-9-_(). ]/g, "_") : "Untitled.pptx";
        if (!fileName.endsWith(".pptx")) {
            fileName += ".pptx";
        }
        return fileName;
    }

    cprint(text, color) {
        color = color.toString().toUpperCase();

        const colors = {
            "RED": "\x1b[91m%s\x1b[0m",
            "GREEN": "\x1b[92m%s\x1b[0m",
            "YELLOW": "\x1b[93m%s\x1b[0m",
            "CYAN": "\x1b[96m%s\x1b[0m",
            "BOLD_WHITE": "\x1b[1;97m%s\x1b[0m",
        };

        if (colors[color]) {
            console.log(colors[color], text);
        } else {
            console.log(text);
        }
    }

    async generate_content(instructions) {
        const ai_prompt = `
        --- SYSTEM PROMPT BEGIN ---
        You are a PPT Assistant specialized in generating content for presentation slides.  
        Respond strictly **only** with a plain JSON array—no code blocks, no explanations, no extra formatting.  
        Each element in the array should follow this format:  
        [  
        {{
            "title": "Slide Title",  
            "content": "Slide Content",    
        }}
        ]  
        Do **not** include any text outside the JSON response.  
        Do **not** enclose the JSON in markdown, quotes, or any other formatting.
        --- SYSTEM PROMPT END ---

        --- USER PROMPT BEGIN ---
        ${instructions}
        --- USER PROMPT END ---`;

        const controller = new AbortController();
        const http_timeout = setTimeout(() => controller.abort(), 120_000);

        try {
            let response = await fetch(
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-goog-api-key": this.API_KEY
                    },
                    body: JSON.stringify({
                        "contents": [{"parts": [{"text": ai_prompt.toString().trim()}]}]
                    }),
                    signal: controller.signal
                }
            );

            response = await response.json();

            if (!response.error) {
                let text = response.candidates?.[0]?.content?.parts?.[0]?.text;

                if (!text) {
                    this.cprint("No response from AI, Please try again.", "RED");
                    return [];
                }

                try {
                    return JSON.parse(text.trim().replace(/^```(?:json)?\s*|\s*```$/g, "").trim());
                } catch(err) {
                    this.cprint("Invalid response format by AI, Please try again.", "RED");
                }
            }

            if (response.error && response.error?.message?.toString().toLowerCase().includes("api key not valid")) {
                this.cprint(`API Error: Invalid API Key, Please restart the app.`, "RED");
                this.prompt("Press Enter to exit!");
                process.exit(1);
            }

            this.cprint(`API Error: ${response.error.message}`, "RED");

        } catch (err) {
            if (err.name === "AbortError") {
                this.cprint("Request timed out (120 seconds), Please try again.", "RED");
            } else {
                this.cprint(`HTTP Error: ${err}`, "RED");
            }
        }

        clearTimeout(http_timeout);
        return [];
    }

    async create_pptx(fileName, slides) {
        try {
            const pptx = new PptxGenJS();

            slides.forEach(({ title, content }) => {
                let slide = pptx.addSlide();

                slide.addText(title, {
                    x: 0.5,
                    y: 0.5,
                    fontSize: 24,
                    bold: true
                });

                slide.addText(content, {
                    x: 0.5,
                    y: 1.5,
                    fontSize: 18
                });
            });

            await pptx.writeFile({ fileName: fileName });
            this.cprint(`${process.cwd()}/${fileName} saved!\n`, "GREEN");

        } catch(err) {
            this.cprint(`Error: Unable to write ${fileName}\n${err}\n`, "RED");
        }

    }

}

(async () => {
    const app = new Main();
    app.cprint("Get your 'API KEY' at https://aistudio.google.com/apikey", "YELLOW");
    await app.init();
})();
