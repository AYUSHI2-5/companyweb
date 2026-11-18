import os
import glob
import json
import hashlib
from PIL import Image

# 1. Users
def hash_password(pwd):
    return hashlib.sha256(pwd.encode('utf-8')).hexdigest()

users = [
    {
        "id": "usr-01",
        "username": "admin",
        "email": "admin@baadam.com",
        "name": "BAADAM Administrator",
        "role": "superadmin",
        "password_hash": hash_password("Baadam@2026"),
        "created_at": "2026-11-01T00:00:00.000Z",
        "last_login": None
    }
]

with open('data/users.json', 'w', encoding='utf-8') as f:
    json.dump(users, f, indent=2)

# 2. Media Library: Index existing assets
media_items = []
asset_files = glob.glob('assets/*.*') + glob.glob('assets/uploads/*.*')
for idx, fpath in enumerate(sorted(asset_files)):
    normalized = fpath.replace('\\', '/')
    ext = os.path.splitext(normalized)[1].lower()
    if ext in ['.jpg', '.jpeg', '.png', '.webp', '.svg']:
        try:
            sz = os.path.getsize(fpath)
            width, height = 0, 0
            if ext != '.svg':
                with Image.open(fpath) as img:
                    width, height = img.size
            
            basename = os.path.basename(normalized)
            title = os.path.splitext(basename)[0].replace('-', ' ').replace('_', ' ').title()
            media_items.append({
                "id": f"med-{idx+1:04d}",
                "filename": basename,
                "path": normalized,
                "alt": f"BAADAM {title} Visual Asset",
                "width": width,
                "height": height,
                "size": sz,
                "mime_type": f"image/{ext[1:] if ext != '.jpg' else 'jpeg'}",
                "uploaded_at": "2026-11-16T10:00:00.000Z"
            })
        except Exception as e:
            pass

with open('data/media.json', 'w', encoding='utf-8') as f:
    json.dump(media_items, f, indent=2)

# 3. Audit Logs
logs = [
    {
        "id": "log-0001",
        "action": "system_init",
        "section": "all",
        "user": "system",
        "details": "Initial CMS system seed and repository indexing completed",
        "timestamp": "2026-11-16T15:20:00.000Z"
    }
]

with open('data/audit_logs.json', 'w', encoding='utf-8') as f:
    json.dump(logs, f, indent=2)

print(f'Successfully initialized users ({len(users)}), media ({len(media_items)}), and audit logs ({len(logs)})!')
