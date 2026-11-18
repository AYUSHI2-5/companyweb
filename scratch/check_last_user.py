import json

with open(r'C:\Users\Admin\.gemini\antigravity\brain\2e8adeb1-375c-4850-926c-403a790a7841\.system_generated\logs\transcript.jsonl', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for line in reversed(lines):
    data = json.loads(line)
    if data.get('type') == 'USER_INPUT':
        print(json.dumps(data, indent=2))
        break

