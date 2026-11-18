import glob

for f in glob.glob('*.js'):
    c = open(f, encoding='utf-8').read()
    if 'brandRadarCanvas' in c:
        print(f'Found brandRadarCanvas in {f}')
    if 'radar' in c.lower():
        print(f'Found radar in {f}')

