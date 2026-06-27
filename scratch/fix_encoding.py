import re

filepath = r"c:\laragon\www\porto-apps\kevin-porto\index.html"

with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
    content = f.read()

# Replace corrupted character sequences
replacements = {
    "âš¡": "⚡",
    "â€”": "—",
    "â€“": "–",
    "Â·": "·",
    "ðŸš€": "🚀",
    "Ã—": "×",
    "â": "—", # sometimes standalone â gets created
}

for corrupt, clean in replacements.items():
    content = content.replace(corrupt, clean)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)

print("HTML encoding repair completed successfully.")
