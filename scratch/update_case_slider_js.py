new_clients_data = """    var clientsData = [
    {
      id: 'case1',
      name: 'KP E-Services',
      category: 'Loan Operations & FinTech Platform',
      statRange: 'React · Node.js · Wallets',
      clientMeta: 'CASE 01 · FINTECH & OPERATIONS',
      headline: 'End-to-End Loan Lifecycle & Connector Operations Platform',
      description: 'Engineered a unified loan operations portal guiding applications from lead and pre-login to sanction and disbursement, featuring bank criteria verification, automated payouts, referral wallets, and KYC document vaults.',
      metricLabel: 'DISBURSEMENT EFFICIENCY & SPEED',
      beforeNum: 100,
      afterNum: 340,
      beforeDisplay: 'Manual Intake',
      afterDisplay: 'Automated 24/7',
      tags: ['React.js', 'Node.js', 'Digital Wallets', 'Cloud Vault', 'FinTech APIs'],
      image: 'assets/portfolio-hero-1.png',
      curvePath: 'M0,130 C120,130 180,115 280,85 C380,55 440,25 600,10',
      ctaUrl: 'portfolio.html'
    },
    {
      id: 'case2',
      name: 'Ashray Labs',
      category: 'Healthcare & Diagnostics Portal',
      statRange: 'Next.js · Clinical ERP · SMS',
      clientMeta: 'CASE 02 · HEALTHCARE & DIAGNOSTICS',
      headline: 'Pathology Center Portal, Appointment Booking & Report Engine',
      description: 'Developed an integrated web portal and clinical admin system where patients book appointments, browse test packages, request quotations, and instantly download invoices and reports with multi-city campaign tools.',
      metricLabel: 'PATIENT ACCESS & BOOKING VOLUME',
      beforeNum: 50,
      afterNum: 220,
      beforeDisplay: 'Walk-In Only',
      afterDisplay: 'Self-Service Web',
      tags: ['Next.js', 'Clinical ERP', 'PDF Report Engine', 'SMS Alerts', 'Cloud DB'],
      image: 'assets/case-dental-clinic.jpg',
      curvePath: 'M0,135 C100,135 220,120 320,70 C400,30 490,15 600,8',
      ctaUrl: 'portfolio.html'
    },
    {
      id: 'case3',
      name: 'Chick N Go',
      category: 'Mobile Food Ordering Platform',
      statRange: 'Flutter · PWA · Multi-Domain',
      clientMeta: 'CASE 03 · FOOD & BEVERAGE E-COMMERCE',
      headline: 'Multi-Tenant Food Ordering Engine & Real-Time Kitchen Dispatch',
      description: 'Built a high-conversion online food ordering application and admin panel with live order tracking, payment processing, and a white-label frontend architecture running seamlessly across multiple domains.',
      metricLabel: 'DIRECT ORDERS & TURNOVER',
      beforeNum: 1,
      afterNum: 5,
      beforeDisplay: 'Third-Party Aggregator',
      afterDisplay: '0% Commission PWA',
      tags: ['Flutter / PWA', 'React.js', 'Online Payments', 'Multi-Tenant', 'Live Dispatch'],
      image: 'assets/portfolio-hero-2.png',
      curvePath: 'M0,125 C140,125 210,105 310,65 C410,25 480,18 600,12',
      ctaUrl: 'portfolio.html'
    },
    {
      id: 'case4',
      name: 'ProCurve',
      category: 'Business Valuation Software',
      statRange: 'Python · Valuation Algorithms · Cloud',
      clientMeta: 'CASE 04 · VALUATION & FINANCIAL MODELING',
      headline: 'Valuation Workspace for Registered Valuers & Asset Appraisers',
      description: 'Created an internal financial modeling software enabling registered valuers to manage clients, share capital, and director files, and execute income, market, and net-asset valuation algorithms on audit-ready sheets.',
      metricLabel: 'VALUATION REPORTING ACCURACY',
      beforeNum: 80,
      afterNum: 99,
      beforeDisplay: 'Spreadsheet Drafts',
      afterDisplay: 'Audit-Ready Suite',
      tags: ['Python', 'React.js', 'Financial Modeling', 'Data Security', 'Audit Workflows'],
      image: 'assets/about-office-mockup.jpg',
      curvePath: 'M0,130 C130,130 200,110 300,75 C400,40 470,20 600,10',
      ctaUrl: 'portfolio.html'
    },
    {
      id: 'case5',
      name: 'Just Land',
      category: 'Property Marketplace & FSBO Portal',
      statRange: 'Next.js · Mapbox · Real-Time Chat',
      clientMeta: 'CASE 05 · REAL ESTATE & PROPTECH',
      headline: 'Interactive Property Marketplace & In-App Buyer-Agent Chat',
      description: 'Engineered a land and property marketplace where buyers search listings, featured homes, and FSBO properties, save favorites, and message agents and sellers directly through encrypted chat.',
      metricLabel: 'BUYER ENGAGEMENT & INQUIRIES',
      beforeNum: 25,
      afterNum: 92,
      beforeDisplay: 'Static Classifieds',
      afterDisplay: 'Real-Time Interactive',
      tags: ['Next.js', 'Mapbox GL', 'WebSocket Chat', 'Node.js', 'FSBO Engine'],
      image: 'assets/hero-building.jpg',
      curvePath: 'M0,135 C110,135 220,115 320,60 C420,15 480,10 600,5',
      ctaUrl: 'portfolio.html'
    },
    {
      id: 'case6',
      name: 'Dodani ERP',
      category: 'Brokerage Back-Office & Escrow ERP',
      statRange: 'Django · Postgres · Escrow Vault',
      clientMeta: 'CASE 06 · ENTERPRISE OPERATIONS',
      headline: 'Internal Real Estate Workspace, Escrow & Water Rights Engine',
      description: 'Architected an internal operations system for real estate brokerage teams to coordinate leads, tasks, properties, offers, escrow stages, shared well water agreements, and transaction vaults.',
      metricLabel: 'TRANSACTION CLOSING EFFICIENCY',
      beforeNum: 35,
      afterNum: 88,
      beforeDisplay: 'Fragmented Files',
      afterDisplay: 'Unified Back-Office',
      tags: ['React.js', 'Python / Django', 'PostgreSQL', 'Escrow Vault', 'AWS S3'],
      image: 'assets/about-office-showcase.png',
      curvePath: 'M0,130 C120,130 200,105 310,65 C410,25 490,15 600,10',
      ctaUrl: 'portfolio.html'
    }
  ];"""

with open('case-study-slider.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re
pattern = r'var clientsData = \[.*?\];'
assert re.search(pattern, text, re.DOTALL) is not None, "clientsData not found in case-study-slider.js"

new_text = re.sub(pattern, new_clients_data.strip(), text, count=1, flags=re.DOTALL)

with open('case-study-slider.js', 'w', encoding='utf-8', newline='\r\n') as f:
    f.write(new_text)

print("Successfully updated case-study-slider.js!")
