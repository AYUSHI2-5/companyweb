# Update case-study-slider.js
with open('case-study-slider.js', 'r', encoding='utf-8') as f:
    code = f.read()

new_clients_data = """  var clientsData = [
    {
      id: 'case1',
      name: 'Business Management Platform',
      category: 'Web Application Development',
      statRange: 'React · Python · MySQL',
      clientMeta: 'CASE 01 · ENTERPRISE TECHNOLOGY',
      headline: 'Centralized Business Operations & Automated Workflows',
      description: 'Developed a centralized web application with an intuitive dashboard, automated workflows and integrated database management to streamline operations.',
      metricLabel: 'SYSTEM EFFICIENCY & DATA',
      beforeNum: 100,
      afterNum: 340,
      beforeDisplay: 'Manual',
      afterDisplay: 'Automated',
      tags: ['React.js', 'Python', 'Django', 'MySQL'],
      image: 'assets/about-office.jpg',
      curvePath: 'M0,130 C120,130 180,115 280,85 C380,55 440,25 600,10',
      ctaUrl: 'portfolio.html'
    },
    {
      id: 'case2',
      name: 'Corporate Digital Presence',
      category: 'Corporate Website Development',
      statRange: 'HTML5 · CSS3 · Bootstrap',
      clientMeta: 'CASE 02 · PROFESSIONAL SERVICES',
      headline: 'Seamless Omnichannel Navigation & Modern Corporate Presence',
      description: 'Designed and developed a responsive, modern website with structured content and an intuitive user interface ensuring high accessibility.',
      metricLabel: 'CROSS-DEVICE ACCESSIBILITY',
      beforeNum: 50,
      afterNum: 100,
      beforeDisplay: 'Legacy Web',
      afterDisplay: 'Responsive',
      tags: ['HTML5', 'CSS3', 'JavaScript', 'Bootstrap'],
      image: 'assets/hero-office.jpg',
      curvePath: 'M0,135 C100,135 220,120 320,70 C400,30 490,15 600,8',
      ctaUrl: 'portfolio.html'
    },
    {
      id: 'case3',
      name: 'Smart Mobile Application',
      category: 'Mobile Application Development',
      statRange: 'Flutter · Firebase · REST',
      clientMeta: 'CASE 03 · MOBILE TECHNOLOGY',
      headline: 'Mobile-First Accessibility & Integrated Backend Services',
      description: 'Developed a mobile-first application with user-friendly navigation and integrated backend services for seamless convenience.',
      metricLabel: 'MOBILE ADOPTION & USAGE',
      beforeNum: 1,
      afterNum: 5,
      beforeDisplay: 'Web-Only',
      afterDisplay: 'iOS & Android',
      tags: ['Flutter', 'Firebase', 'REST APIs', 'UI/UX Design'],
      image: 'assets/case-fitness-app.jpg',
      curvePath: 'M0,125 C140,125 210,105 310,65 C410,25 480,18 600,12',
      ctaUrl: 'portfolio.html'
    },
    {
      id: 'case4',
      name: 'Cloud Infrastructure Modernization',
      category: 'Cloud & Infrastructure Solutions',
      statRange: 'AWS · Linux · Docker',
      clientMeta: 'CASE 04 · INFORMATION TECHNOLOGY',
      headline: 'Scalable Infrastructure & Optimized Resource Management',
      description: 'Designed a cloud-ready infrastructure approach with optimized deployment and resource management to support evolving requirements.',
      metricLabel: 'SYSTEM RELIABILITY & SCALE',
      beforeNum: 80,
      afterNum: 99,
      beforeDisplay: 'Monolith',
      afterDisplay: 'Cloud-Ready',
      tags: ['AWS', 'Linux', 'Docker', 'Optimization'],
      image: 'assets/cta-collaboration.jpg',
      curvePath: 'M0,132 C110,132 230,110 330,75 C420,40 500,20 600,8',
      ctaUrl: 'portfolio.html'
    },
    {
      id: 'case5',
      name: 'Intelligent Business Automation',
      category: 'AI & Automation',
      statRange: 'Python · ML · REST APIs',
      clientMeta: 'CASE 05 · ARTIFICIAL INTELLIGENCE',
      headline: 'Intelligent Automation Workflows & AI Functionality',
      description: 'Integrated intelligent automation workflows and AI-powered functionality into existing business processes to eliminate repetitive manual tasks.',
      metricLabel: 'AUTOMATION & INSIGHTS',
      beforeNum: 20,
      afterNum: 90,
      beforeDisplay: 'Manual Entry',
      afterDisplay: 'AI Workflows',
      tags: ['Python', 'Machine Learning', 'REST APIs', 'Automation'],
      image: 'assets/about-digital-solutions.jpg',
      curvePath: 'M0,128 C130,128 240,100 340,60 C430,22 510,14 600,6',
      ctaUrl: 'portfolio.html'
    },
    {
      id: 'case6',
      name: 'Enterprise Management System',
      category: 'Enterprise Software Solutions',
      statRange: 'Python · Django · Postgres',
      clientMeta: 'CASE 06 · ENTERPRISE SOFTWARE',
      headline: 'Centralized Software Solution & Structured Data Hub',
      description: 'Developed a centralized software solution with structured data management, automated reporting and multi-system integrations.',
      metricLabel: 'OPERATIONAL DATA UNITY',
      beforeNum: 10,
      afterNum: 100,
      beforeDisplay: 'Siloed Tools',
      afterDisplay: 'Central Hub',
      tags: ['Python', 'Django', 'PostgreSQL', 'JavaScript'],
      image: 'assets/hero-building.jpg',
      curvePath: 'M0,135 C90,135 200,115 300,75 C410,35 500,18 600,6',
      ctaUrl: 'portfolio.html'
    }
  ];"""

# Replace clientsData definition
import re
code_new = re.sub(r'var clientsData = \[.*?\];', new_clients_data, code, flags=re.DOTALL)

with open('case-study-slider.js', 'w', encoding='utf-8') as f:
    f.write(code_new)

print("Updated case-study-slider.js successfully")

