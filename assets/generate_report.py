from reportlab.lib.pagesizes import letter
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas
from reportlab.lib import colors
import os

PROJECT_ROOT = os.path.dirname(os.path.dirname(__file__))
ASSETS_DIR = os.path.join(PROJECT_ROOT, "assets")
OUTPUT_PDF = os.path.join(ASSETS_DIR, "Project2_DevTools_Implementation_Report.pdf")

SCREENSHOTS = [
    ("Figure 1: DevTools lab overview in Project 2", os.path.join(ASSETS_DIR, "devtools-lab-overview.png")),
    ("Figure 2: Logging and browser-message demo controls used", os.path.join(ASSETS_DIR, "devtools-actions-triggered.png")),
    ("Figure 3: Reproduced bug output", os.path.join(ASSETS_DIR, "bug-reproduced.png")),
    ("Figure 4: Bug after applying fix", os.path.join(ASSETS_DIR, "bug-fixed.png")),
]

IMPLEMENTATION_ITEMS = [
    "Message Logging: Log Info, Log Warning, Log Error, Log Table, Log Group, Log Custom.",
    "View messages logged by the browser: trigger 404 network failure, uncaught TypeError, and a Violation (long click handler simulation).",
    "Filter messages workflow: by log level, text, regular expression, source, and user messages (Console sidebar instructions included in UI).",
    "Reproduce a bug: calculator begins in buggy string-concatenation mode so 5 + 1 becomes 51.",
    "Get familiar with Sources UI: instructions in app point to relevant functions in script.js.",
    "Pause code with breakpoint and set line-of-code breakpoint: runBuggyCalculator and computeSum are explicit targets.",
    "Check variable values with Scope pane and Watch expression: typeof sum.",
    "Use Console while paused: evaluate parseInt(addend1) + parseInt(addend2).",
    "Apply a fix: Apply Fix button switches compute path to numeric parsing (base-10 parseInt), changing output to 6 for 5 and 1.",
]


def draw_wrapped_text(c, text, x, y, max_width, line_height=14, font_name="Helvetica", font_size=11):
    c.setFont(font_name, font_size)
    words = text.split()
    line = ""
    for word in words:
        candidate = (line + " " + word).strip()
        if c.stringWidth(candidate, font_name, font_size) <= max_width:
            line = candidate
        else:
            c.drawString(x, y, line)
            y -= line_height
            line = word
    if line:
        c.drawString(x, y, line)
        y -= line_height
    return y


def draw_image_fit(c, image_path, x, y_top, max_width, max_height):
    image = ImageReader(image_path)
    iw, ih = image.getSize()
    scale = min(max_width / float(iw), max_height / float(ih))
    width = iw * scale
    height = ih * scale
    y = y_top - height
    c.drawImage(image, x, y, width=width, height=height, preserveAspectRatio=True, anchor="sw")
    return y


def main():
    c = canvas.Canvas(OUTPUT_PDF, pagesize=letter)
    page_width, page_height = letter

    left = 54
    right = page_width - 54
    y = page_height - 54

    c.setTitle("Project 2 DevTools Implementation Report")

    c.setFont("Helvetica-Bold", 18)
    c.drawString(left, y, "Project 2: Chrome DevTools Demo Implementations")
    y -= 28

    c.setFont("Helvetica", 11)
    c.setFillColor(colors.black)
    y = draw_wrapped_text(
        c,
        "This report documents practical implementations inspired by Chrome DevTools Console and JavaScript debugging tutorials.",
        left,
        y,
        right - left,
    )
    y -= 8

    c.setFont("Helvetica-Bold", 12)
    c.drawString(left, y, "Implemented Requirements")
    y -= 16

    c.setFont("Helvetica", 11)
    for item in IMPLEMENTATION_ITEMS:
        y = draw_wrapped_text(c, "- " + item, left, y, right - left)
        if y < 100:
            c.showPage()
            y = page_height - 54
            c.setFont("Helvetica", 11)

    c.showPage()
    y = page_height - 54

    c.setFont("Helvetica-Bold", 16)
    c.drawString(left, y, "Screenshots")
    y -= 24

    for caption, image_path in SCREENSHOTS:
        if not os.path.exists(image_path):
            y = draw_wrapped_text(c, "Missing screenshot: " + os.path.basename(image_path), left, y, right - left)
            y -= 10
            continue

        c.setFont("Helvetica-Bold", 11)
        y = draw_wrapped_text(c, caption, left, y, right - left)

        image_top = y - 4
        image_bottom = draw_image_fit(c, image_path, left, image_top, right - left, 280)
        y = image_bottom - 14

        if y < 120:
            c.showPage()
            y = page_height - 54

    c.save()
    print("Created:", OUTPUT_PDF)


if __name__ == "__main__":
    main()
