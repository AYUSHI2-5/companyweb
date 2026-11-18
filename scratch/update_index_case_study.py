with open('index.html', 'r', encoding='utf-8') as f:
    txt = f.read()

txt = txt.replace('aria-label="View KP E-Services Case Study">\n                  <span>View Case</span>', 'aria-label="View KP E-Services Project">\n                  <span>View Project</span>')
txt = txt.replace('aria-label="View KP E-Services Case Study">\r\n                  <span>View Case</span>', 'aria-label="View KP E-Services Project">\r\n                  <span>View Project</span>')

txt = txt.replace('aria-label="View Chick N Go Case Study">\n                  <span>View Case</span>', 'aria-label="View Chick N Go Project">\n                  <span>View Project</span>')
txt = txt.replace('aria-label="View Chick N Go Case Study">\r\n                  <span>View Case</span>', 'aria-label="View Chick N Go Project">\r\n                  <span>View Project</span>')

txt = txt.replace('aria-label="View Dodani ERP Case Study">\n                  <span>View Case</span>', 'aria-label="View Dodani ERP Project">\n                  <span>View Project</span>')
txt = txt.replace('aria-label="View Dodani ERP Case Study">\r\n                  <span>View Case</span>', 'aria-label="View Dodani ERP Project">\r\n                  <span>View Project</span>')

txt = txt.replace('aria-label="Read full case study">\n                <span>READ CASE STUDY</span>', 'aria-label="View project details">\n                <span>VIEW PROJECT</span>')
txt = txt.replace('aria-label="Read full case study">\r\n                <span>READ CASE STUDY</span>', 'aria-label="View project details">\r\n                <span>VIEW PROJECT</span>')

txt = txt.replace('href="portfolio.html" class="feature-action-btn" aria-label="View KP E-Services Project"', 'href="projects/kp-e-services/" class="feature-action-btn" aria-label="View KP E-Services Project"')
txt = txt.replace('href="portfolio.html" class="feature-action-btn" aria-label="View Chick N Go Project"', 'href="projects/chick-n-go/" class="feature-action-btn" aria-label="View Chick N Go Project"')
txt = txt.replace('href="portfolio.html" class="feature-action-btn" aria-label="View Dodani ERP Project"', 'href="projects/dodani-erp/" class="feature-action-btn" aria-label="View Dodani ERP Project"')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(txt)

print("Updated index.html successfully")

