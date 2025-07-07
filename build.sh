git clone https://github.com/cj-praveen/gemini-ppt.git
cd gemini-ppt
bun install
mkdir dist
bun build main.js --compile --outfile=dist/gemini-ppt
