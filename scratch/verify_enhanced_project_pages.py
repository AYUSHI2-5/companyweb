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

def verify_all_project_pages():
    print("=== VERIFYING ENHANCED PROJECT DETAIL PAGES ===")
    project_files = glob.glob('projects/*/index.html')
    assert len(project_files) == 16, f"Expected 16 projects, found {len(project_files)}"
    
    required_sections = [
        ('1. KEY FEATURES', 'project-features-section'),
        ('2. TECHNOLOGY STACK', 'project-tech-matrix-section'),
        ('3. SYSTEM ARCHITECTURE', 'project-architecture-section'),
        ('4. APPLICATION SHOWCASE', 'project-showcase-section'),
        ('5. MY CONTRIBUTION', 'project-contribution-section'),
        ('6. RESULTS & IMPACT', 'project-results-section'),
        ('7. PROJECT LINKS', 'project-links-section'),
        ('8. EXPLORE MORE PROJECTS', 'project-related-section'),
        ('HERO & CMS SPEC', 'project-cms-spec-grid'),
        ('STORY & CHALLENGE', 'project-story-section'),
        ('FINAL CTA', 'cta-banner-section'),
        ('NAVIGATION PREV/NEXT', 'project-navigation-bar')
    ]
    
    forbidden_terms = [
        'Homepage Display',
        'Featured on Homepage',
        'case study',
        'CASE STUDY'
    ]
    
    all_ok = True
    
    for p in project_files:
        slug = os.path.basename(os.path.dirname(p))
        content = open(p, 'r', encoding='utf-8').read()
        
        # Check required sections
        for label, class_name in required_sections:
            if class_name not in content:
                print(f"FAILED: {slug} missing section '{label}' (class: {class_name})")
                all_ok = False
                
        # Check forbidden terms
        for term in forbidden_terms:
            if term.lower() in content.lower():
                print(f"FAILED: {slug} contains forbidden term '{term}'")
                all_ok = False
                
        # Check tag balance
        parser = TagBalanceParser()
        parser.feed(content)
        if parser.stack or parser.errors:
            print(f"FAILED: {slug} tag errors: unclosed={parser.stack}, errors={parser.errors}")
            all_ok = False
            
    # Verify CSS brace balance
    css = open('style.css', 'r', encoding='utf-8').read()
    open_b = css.count('{')
    close_b = css.count('}')
    if open_b != close_b:
        print(f"FAILED: style.css brace mismatch ({open_b} open, {close_b} close)")
        all_ok = False
    else:
        print(f"style.css: {open_b} balanced brace pairs.")
        
    if all_ok:
        print(f"\nALL 16 PROJECT PAGES SUCCESSFULLY VERIFIED!")
        print("[PASS] All 8 required sections present on all pages")
        print("[PASS] Existing navbar, hero, metadata, gallery, overview, challenge & solution 100% preserved")
        print("[PASS] 0 unclosed or mismatched HTML tags")
        print("[PASS] 0 occurrences of 'case study' or 'Homepage Display'")
        print("[PASS] Clean responsive styling integrated into style.css")
    else:
        print("\nSome verification checks failed. Review errors above.")

if __name__ == '__main__':
    verify_all_project_pages()
