import json

with open(r'C:\Users\Admin\.gemini\antigravity\brain\2e8adeb1-375c-4850-926c-403a790a7841\.system_generated\logs\transcript.jsonl', 'r', encoding='utf-8') as f:
    for line in f:
        if any(term in line.lower() for term in ['circle', 'hero text', 'get your business', 'navbar', 'book a call', 'let\'s talk']):
            obj = json.loads(line)
            if obj.get('type') == 'USER_INPUT':
                print(obj.get('step_index'), 'USER:', str(obj.get('content'))[:250])

