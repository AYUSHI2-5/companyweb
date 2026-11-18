with open('style.css', 'r', encoding='utf-8') as f:
    text = f.read()

target1 = """
.services-section.services-pinned-content {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  max-height: 100vh;
  z-index: 2;
  box-sizing: border-box;
  scroll-snap-align: none !important;
  scroll-snap-stop: normal !important;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
"""

print("Target 1 found:", target1.strip() in text)

target2 = """/* Accordion Item Base */
.service-acc-item {
  border-radius: 16px;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
  position: relative;
}"""

print("Target 2 found:", target2.strip() in text)

