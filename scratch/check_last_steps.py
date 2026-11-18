import json

with open(r'C:\Users\Admin\.gemini\antigravity\brain\2e8adeb1-375c-4850-926c-403a790a7841\.system_generated\logs\transcript.jsonl', 'r', encoding='utf-8') as f:
    for line in f:
        data = json.loads(line)
        if data.get('step_index', 0) >= 5980:
            print(f"Step {data.get('step_index')}, Type: {data.get('type')}, Source: {data.get('source')}, Tool: {[t.get('name') for t in data.get('tool_calls', [])] if 'tool_calls' in data else ''}")
            if data.get('source') == 'USER_EXPLICIT' or data.get('type') == 'USER_INPUT':
                print("USER INPUT:", data.get('content'))
                print("MEDIA:", data.get('media'))

