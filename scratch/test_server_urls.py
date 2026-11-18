import urllib.request

urls = [
    'http://localhost:8080/projects/ashray-labs/',
    'http://localhost:8080/projects/ashray-labs',
    'http://localhost:8080/projects/kp-e-services/',
    'http://localhost:8080/portfolio.html',
    'http://localhost:8080/project-detail.html?slug=ashray-labs',
    'http://localhost:8080/admin.html',
    'http://localhost:8080/api/projects'
]

for u in urls:
    try:
        req = urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as resp:
            print(f'[{resp.status} OK] {u} (Content-Type: {resp.headers.get("Content-Type")})')
    except Exception as e:
        print(f'[FAILED] {u} -> {e}')

