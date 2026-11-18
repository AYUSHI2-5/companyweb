import json

with open(r'C:\Users\Admin\.gemini\antigravity\brain\2e8adeb1-375c-4850-926c-403a790a7841\.system_generated\logs\transcript_full.jsonl', 'r', encoding='utf-8') as f:
    for line in f:
        obj = json.loads(line)
        if obj.get('step_index') == 2778:
            print(obj.get('content'))
            print('media:', obj.get('media'))

