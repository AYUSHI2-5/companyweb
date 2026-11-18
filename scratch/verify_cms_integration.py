import os
import glob
from html.parser import HTMLParser

class TagBalanceParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.stack = []
        self.self_closing = {
            'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
            'link', 'meta', 'param', 'source', 'track', 'wbr'
        }
        self.errors = []

    def handle_starttag(self, tag, attrs):
        if tag.lower() not in self.self_closing:
            self.stack.append(tag.lower())

    def handle_endtag(self, tag):
        tag = tag.lower()
        if tag in self.self_closing:
            return
        if not self.stack:
            self.errors.append(f"Unexpected end tag </{tag}> with empty stack")
            return
        last_tag = self.stack.pop()
        if last_tag != tag:
            self.errors.append(f"Mismatched end tag: expected </{last_tag}>, found </{tag}>")

def verify_cms_spec_dashboard():
    print("--- VERIFYING FULL CMS PROJECT SPECIFICATIONS ---")
    project_files = glob.glob('projects/*/index.html')
    all_ok = True

    required_snippets = [
        'project-cms-spec-grid',
        'Project Title',
        'Live Platform URL',
        'Project Category',
        'Service Month',
        'Service Duration',
        'Deployment Status',
        'project-stage-section',
        'project-gallery-grid',
        'project-story-grid',
        'project-features-grid',
        'project-impact-grid',
        'project-navigation-bar'
    ]

    forbidden_snippets = [
        'Homepage Display',
        'Featured on Homepage',
        'case study',
        'CASE STUDY'
    ]

    for p in project_files:
        name = os.path.basename(os.path.dirname(p))
        content = open(p, 'r', encoding='utf-8').read()

        # Check required snippets
        for s in required_snippets:
            if s not in content:
                print(f"FAILED: {name} missing snippet: '{s}'")
                all_ok = False

        # Check forbidden snippets
        for f in forbidden_snippets:
            if f.lower() in content.lower():
                print(f"FAILED: {name} contains forbidden text: '{f}'")
                all_ok = False

        # Tag balance check
        parser = TagBalanceParser()
        parser.feed(content)
        if parser.stack or parser.errors:
            print(f"FAILED: {name} tag mismatch: unclosed={parser.stack}, errors={parser.errors}")
            all_ok = False

    # Check CSS syntax
    css_content = open('style.css', 'r', encoding='utf-8').read()
    open_braces = css_content.count('{')
    close_braces = css_content.count('}')
    if open_braces != close_braces:
        print(f"FAILED: style.css brace mismatch: {open_braces} open, {close_braces} close")
        all_ok = False
    else:
        print(f"style.css: {open_braces} balanced brace pairs.")

    if all_ok:
        print(f"\nSUCCESS: All {len(project_files)} project pages have 100% full CMS specifications, no forbidden text, and perfect HTML tag balance!")
    else:
        print("\nSOME CHECKS FAILED! Please review output above.")

if __name__ == '__main__':
    verify_cms_spec_dashboard()
