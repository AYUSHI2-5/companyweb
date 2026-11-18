import json

with open(r'C:\Users\Admin\.gemini\antigravity\brain\2e8adeb1-375c-4850-926c-403a790a7841\.system_generated\logs\transcript.jsonl', 'r', encoding='utf-8') as f:
    for line in f:
        data = json.loads(line)
        if data.get('source') == 'USER_EXPLICIT' or data.get('type') == 'USER_INPUT':
            content = data.get('content', '')
            media = data.get('media', [])
            print(f"Step {data.get('step_index')}: {content[:100]} | media count: {len(media)}")

