from html.parser import HTMLParser

class TagChecker(HTMLParser):
    def __init__(self):
        super().__init__()
        self.stack = []
        self.void_tags = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'}
    def handle_starttag(self, tag, attrs):
        if tag not in self.void_tags:
            self.stack.append((tag, self.getpos()))
    def handle_endtag(self, tag):
        if tag not in self.void_tags:
            if self.stack:
                top, pos = self.stack.pop()
                if top != tag:
                    print(f'Mismatched tag: expected </{top}>, found </{tag}>')
            else:
                print(f'Extra closing tag </{tag}>')

for f in ['index.html', 'about.html', 'services.html', 'portfolio.html', 'contact.html']:
    c = open(f, encoding='utf-8').read()
    checker = TagChecker()
    checker.feed(c)
    print(f'{f}: {len(checker.stack)} unclosed tags')

