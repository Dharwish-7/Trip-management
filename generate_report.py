import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

def create_report():
    doc = Document()

    # Page Margins (Standard 1 inch all around, left 1.25 for binding)
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.25)
        section.right_margin = Inches(1.0)
        section.different_first_page_header_footer = True

    # Styling helper functions
    def set_cell_border(cell, **kwargs):
        tcPr = cell._tc.get_or_add_tcPr()
        tcBorders = parse_xml(r'<w:tcBorders xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"/>')
        for edge in ('top', 'left', 'bottom', 'right'):
            edge_data = kwargs.get(edge)
            if edge_data:
                tag = f'w:{edge}'
                element = parse_xml(f'<{tag} xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" w:val="{edge_data.get("val", "single")}" w:sz="{edge_data.get("sz", "4")}" w:space="0" w:color="{edge_data.get("color", "CCCCCC")}"/>')
                tcBorders.append(element)
        tcPr.append(tcBorders)

    def set_cell_shading(cell, color_hex):
        shading_xml = f'<w:shd xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" w:fill="{color_hex}"/>'
        cell._tc.get_or_add_tcPr().append(parse_xml(shading_xml))

    def format_table(table, col_widths, header_bg="EAEAEA"):
        table.alignment = WD_TABLE_ALIGNMENT.CENTER
        for i, row in enumerate(table.rows):
            trPr = row._tr.get_or_add_trPr()
            trPr.append(parse_xml(r'<w:cantSplit xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"/>'))
            if i == 0:
                trPr.append(parse_xml(r'<w:tblHeader xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"/>'))
            for j, cell in enumerate(row.cells):
                cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
                if j < len(col_widths):
                    cell.width = col_widths[j]
                set_cell_border(cell, top={'sz': 4, 'val': 'single', 'color': 'BBBBBB'},
                                      bottom={'sz': 4, 'val': 'single', 'color': 'BBBBBB'},
                                      left={'sz': 4, 'val': 'single', 'color': 'BBBBBB'},
                                      right={'sz': 4, 'val': 'single', 'color': 'BBBBBB'})
                if i == 0 and header_bg:
                    set_cell_shading(cell, header_bg)
                    for p in cell.paragraphs:
                        p.paragraph_format.space_before = Pt(4)
                        p.paragraph_format.space_after = Pt(4)
                        for run in p.runs:
                            run.font.bold = True
                            run.font.name = "Times New Roman"
                            run.font.size = Pt(10)
                else:
                    for p in cell.paragraphs:
                        p.paragraph_format.space_before = Pt(3)
                        p.paragraph_format.space_after = Pt(3)
                        for run in p.runs:
                            run.font.name = "Times New Roman"
                            run.font.size = Pt(9.5)

    def add_title(text, space_after=18):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(12)
        p.paragraph_format.space_after = Pt(space_after)
        run = p.add_run(text)
        run.font.name = "Times New Roman"
        run.font.size = Pt(16)
        run.font.bold = True
        return p

    def add_heading1(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(14)
        p.paragraph_format.space_after = Pt(6)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = "Times New Roman"
        run.font.size = Pt(14)
        run.font.bold = True
        return p

    def add_heading2(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(10)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = "Times New Roman"
        run.font.size = Pt(12)
        run.font.bold = True
        return p

    def add_body(text, space_after=6, italic=False, bold=False):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.line_spacing = 1.15
        run = p.add_run(text)
        run.font.name = "Times New Roman"
        run.font.size = Pt(11)
        run.font.italic = italic
        run.font.bold = bold
        return p

    def add_bullet(text, level=0):
        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(3)
        p.paragraph_format.line_spacing = 1.15
        run = p.add_run(text)
        run.font.name = "Times New Roman"
        run.font.size = Pt(11)
        return p

    def add_caption(text):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(4)
        p.paragraph_format.space_after = Pt(8)
        run = p.add_run(text)
        run.font.name = "Times New Roman"
        run.font.size = Pt(10)
        run.font.italic = True
        return p

    print("Generating Page 1: Cover Page")
    # COVER PAGE
    p1 = doc.add_paragraph()
    p1.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p1.paragraph_format.space_before = Pt(24)
    p1.paragraph_format.space_after = Pt(18)
    r1 = p1.add_run("TRIP MANAGEMENT SYSTEM")
    r1.font.name = "Times New Roman"
    r1.font.size = Pt(20)
    r1.font.bold = True

    p2 = doc.add_paragraph()
    p2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p2.paragraph_format.space_after = Pt(28)
    r2 = p2.add_run("PROJECT REPORT")
    r2.font.name = "Times New Roman"
    r2.font.size = Pt(14)
    r2.font.bold = True

    p3 = doc.add_paragraph()
    p3.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p3.paragraph_format.space_after = Pt(8)
    r3 = p3.add_run("Submitted by")
    r3.font.name = "Times New Roman"
    r3.font.size = Pt(12)
    r3.font.italic = True

    team_members = [
        ("DHARWISH AHAMED R", "24CSR065"),
        ("GOWTHAM K", "24CSR083"),
        ("GUNAVARMAN M S", "24CSR086"),
        ("GURUPRASAD S S", "24CSR088")
    ]
    for name, reg in team_members:
        pn = doc.add_paragraph()
        pn.alignment = WD_ALIGN_PARAGRAPH.CENTER
        pn.paragraph_format.space_after = Pt(2)
        rn1 = pn.add_run(f"{name}\n")
        rn1.font.name = "Times New Roman"
        rn1.font.size = Pt(12)
        rn1.font.bold = True
        rn2 = pn.add_run(reg)
        rn2.font.name = "Times New Roman"
        rn2.font.size = Pt(11)

    p_req = doc.add_paragraph()
    p_req.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_req.paragraph_format.space_before = Pt(24)
    p_req.paragraph_format.space_after = Pt(6)
    r_req = p_req.add_run("in partial fulfilment of the requirements\nfor the award of the degree\nof")
    r_req.font.name = "Times New Roman"
    r_req.font.size = Pt(11)
    r_req.font.italic = True

    p_deg = doc.add_paragraph()
    p_deg.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_deg.paragraph_format.space_after = Pt(18)
    r_deg1 = p_deg.add_run("BACHELOR OF ENGINEERING\nIN\n")
    r_deg1.font.name = "Times New Roman"
    r_deg1.font.size = Pt(13)
    r_deg1.font.bold = True
    r_deg2 = p_deg.add_run("COMPUTER SCIENCE AND ENGINEERING")
    r_deg2.font.name = "Times New Roman"
    r_deg2.font.size = Pt(13)
    r_deg2.font.bold = True

    p_col = doc.add_paragraph()
    p_col.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_col.paragraph_format.space_before = Pt(18)
    p_col.paragraph_format.space_after = Pt(4)
    r_dept = p_col.add_run("DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING\n")
    r_dept.font.name = "Times New Roman"
    r_dept.font.size = Pt(11)
    r_dept.font.bold = True

    r_col1 = p_col.add_run("KONGU ENGINEERING COLLEGE\n")
    r_col1.font.name = "Times New Roman"
    r_col1.font.size = Pt(14)
    r_col1.font.bold = True
    r_col1.font.color.rgb = RGBColor(0x0C, 0x5A, 0xDB)

    r_col2 = p_col.add_run("(Autonomous)\nPERUNDURAI, ERODE – 638 060\n")
    r_col2.font.name = "Times New Roman"
    r_col2.font.size = Pt(12)
    r_col2.font.bold = True

    r_col3 = p_col.add_run("OCTOBER 2026")
    r_col3.font.name = "Times New Roman"
    r_col3.font.size = Pt(12)
    r_col3.font.bold = True

    doc.add_page_break()

    print("Generating Page 2: Bonafide Certificate")
    # BONAFIDE CERTIFICATE (ii)
    p_pg = doc.add_paragraph()
    p_pg.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    r_pg = p_pg.add_run("ii")
    r_pg.font.name = "Times New Roman"
    r_pg.font.size = Pt(10)

    p_head = doc.add_paragraph()
    p_head.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_head.paragraph_format.space_after = Pt(20)
    r_h1 = p_head.add_run("DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING\nKONGU ENGINEERING COLLEGE\n(Autonomous)\nPERUNDURAI, ERODE – 638 060\nOCTOBER 2026\n\n")
    r_h1.font.name = "Times New Roman"
    r_h1.font.size = Pt(12)
    r_h1.font.bold = True

    r_h2 = p_head.add_run("BONAFIDE CERTIFICATE")
    r_h2.font.name = "Times New Roman"
    r_h2.font.size = Pt(14)
    r_h2.font.bold = True

    p_cert = doc.add_paragraph()
    p_cert.paragraph_format.space_before = Pt(12)
    p_cert.paragraph_format.space_after = Pt(24)
    p_cert.paragraph_format.line_spacing = 1.3
    p_cert.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    r_cert = p_cert.add_run(
        "This is to certify that the Project report entitled TRIP MANAGEMENT SYSTEM is the bonafide record of the "
        "project work done by DHARWISH AHAMED R (Register no: 24CSR065), GOWTHAM K (Register no: 24CSR083), "
        "GUNAVARMAN M S (Register no: 24CSR086), GURUPRASAD S S (Register no: 24CSR088) in partial fulfilment of "
        "the requirements for the award of the Degree of Bachelor of Engineering in Computer Science and Engineering "
        "of Anna University, Chennai during the year 2026 - 2027."
    )
    r_cert.font.name = "Times New Roman"
    r_cert.font.size = Pt(11)

    table_sign = doc.add_table(rows=2, cols=2)
    table_sign.alignment = WD_TABLE_ALIGNMENT.CENTER
    col_w = [Inches(3.2), Inches(3.2)]
    for r in table_sign.rows:
        for idx, c in enumerate(r.cells):
            c.width = col_w[idx]
    
    table_sign.rows[0].cells[0].paragraphs[0].text = "SUPERVISOR\n\nDate:"
    table_sign.rows[0].cells[1].paragraphs[0].text = "HEAD OF THE DEPARTMENT\n\n(Signature with seal)"
    table_sign.rows[1].cells[0].paragraphs[0].text = "\n\nSubmitted for the end semester viva voce examination held on ______________\n\n\nEXAMINER 1"
    table_sign.rows[1].cells[1].paragraphs[0].text = "\n\n\n\n\nEXAMINER 2"

    for r in table_sign.rows:
        for c in r.cells:
            for p in c.paragraphs:
                for run in p.runs:
                    run.font.name = "Times New Roman"
                    run.font.size = Pt(11)
                    run.font.bold = True

    doc.add_page_break()

    print("Generating Page 3: Declaration")
    # DECLARATION (iii)
    p_pg = doc.add_paragraph()
    p_pg.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    r_pg = p_pg.add_run("iii")
    r_pg.font.name = "Times New Roman"
    r_pg.font.size = Pt(10)

    p_head = doc.add_paragraph()
    p_head.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_head.paragraph_format.space_after = Pt(20)
    r_h1 = p_head.add_run("DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING\nKONGU ENGINEERING COLLEGE\n(Autonomous)\nPERUNDURAI, ERODE – 638 060\nOCTOBER 2026\n\n")
    r_h1.font.name = "Times New Roman"
    r_h1.font.size = Pt(12)
    r_h1.font.bold = True

    r_h2 = p_head.add_run("DECLARATION")
    r_h2.font.name = "Times New Roman"
    r_h2.font.size = Pt(14)
    r_h2.font.bold = True

    p_dec = doc.add_paragraph()
    p_dec.paragraph_format.space_before = Pt(12)
    p_dec.paragraph_format.space_after = Pt(24)
    p_dec.paragraph_format.line_spacing = 1.3
    p_dec.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    r_dec = p_dec.add_run(
        "We affirm that the Project Report titled TRIP MANAGEMENT SYSTEM being submitted in partial fulfilment of "
        "the requirements for the award of Bachelor of Engineering is the original work carried out by us. It has not "
        "formed the part of any other project report or dissertation on the basis of which a degree or award was "
        "conferred on an earlier occasion on this or any other candidate."
    )
    r_dec.font.name = "Times New Roman"
    r_dec.font.size = Pt(11)

    table_dec = doc.add_table(rows=1, cols=2)
    table_dec.alignment = WD_TABLE_ALIGNMENT.CENTER
    table_dec.rows[0].cells[0].paragraphs[0].text = "Date:"
    names_text = (
        "DHARWISH AHAMED R\n(24CSR065)\n\n"
        "GOWTHAM K\n(24CSR083)\n\n"
        "GUNAVARMAN M S\n(24CSR086)\n\n"
        "GURUPRASAD S S\n(24CSR088)"
    )
    table_dec.rows[0].cells[1].paragraphs[0].text = names_text
    for c in table_dec.rows[0].cells:
        for p in c.paragraphs:
            for run in p.runs:
                run.font.name = "Times New Roman"
                run.font.size = Pt(11)
                run.font.bold = True

    p_cert2 = doc.add_paragraph()
    p_cert2.paragraph_format.space_before = Pt(28)
    p_cert2.paragraph_format.space_after = Pt(18)
    r_c2 = p_cert2.add_run("I certify that the declaration made by the above candidates is true to the best of my knowledge.\n\n\nDate:                                                                             Name & Signature of the Supervisor with seal")
    r_c2.font.name = "Times New Roman"
    r_c2.font.size = Pt(11)

    doc.add_page_break()

    print("Generating Page 4: Abstract")
    # ABSTRACT (iv)
    p_pg = doc.add_paragraph()
    p_pg.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    r_pg = p_pg.add_run("iv")
    r_pg.font.name = "Times New Roman"
    r_pg.font.size = Pt(10)

    add_title("ABSTRACT")

    add_body(
        "The Trip Management System (TMS) is a comprehensive full-stack web application developed to simplify "
        "and streamline the process of travel planning, waypoint documentation, and government travel compliance "
        "monitoring. Traditional travel record-keeping methods often rely on manual journals, disjointed spreadsheets, "
        "and physical documentation, making it difficult for tourists to systematically track itineraries, visited landmarks, "
        "and associated expenses. Simultaneously, government authorities and tourism departments face major hurdles in "
        "verifying traveler movements, monitoring tourist density, and reviewing authentic photographic proof for compliance "
        "and public safety audit. The proposed Trip Management System addresses these challenges by introducing a unified, "
        "role-based platform serving two primary stakeholder groups: citizen travelers and government audit authorities."
    )

    add_body(
        "The system incorporates user registration and authentication, draft trip creation, visited place logging with dates "
        "and ratings, narrative descriptions, photo evidence attachment, and a formal compliance submission mechanism. "
        "Once a traveler completes their itinerary and submits the trip, an automated compliance lock transitions the "
        "trip status to 'Submitted' and logs the verification timestamp, ensuring that records remain immutable for official review. "
        "Government authorities access a central audit portal equipped with multi-attribute search and filtering across traveler "
        "profiles, destinations, and date ranges. Furthermore, specialized analytical modules provide destination popularity rankings, "
        "daily travel density timelines, and an auditor media gallery for inspecting uploaded photos and captions. "
        "The project follows Agile Scrum methodology, organizing requirements into 13 user stories across 4 structured sprints."
    )

    add_body(
        "Built using a modern web architecture comprising a React 18, Vite, and Tailwind CSS frontend coupled with a "
        "Node.js, Express.js REST API backend and a structured document persistence engine, the application ensures high "
        "performance, role-based access control (RBAC), and immediate zero-config testability. Automated integration testing "
        "validates all 13 user stories with 100% test coverage. Overall, the Trip Management System improves transparency, "
        "reduces administrative overhead, and provides an organized framework for digital tourism management, supporting "
        "sustainable tourism planning and reliable cross-border travel record compliance."
    )

    doc.add_page_break()

    print("Generating Page 5: Acknowledgement")
    # ACKNOWLEDGEMENT (v)
    p_pg = doc.add_paragraph()
    p_pg.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    r_pg = p_pg.add_run("v")
    r_pg.font.name = "Times New Roman"
    r_pg.font.size = Pt(10)

    add_title("ACKNOWLEDGEMENT")

    add_body(
        "We extend our hearty gratitude to Thiru. E. R. K. KRISHNAN M.Com., beloved Correspondent and other trust members "
        "for having provided us with all necessary infrastructures to undertake this project. We are extremely thankful to our "
        "dynamic Principal, Dr. R. PARAMESHWARAN M.E., Ph.D., for providing necessary facilities and support to complete "
        "our work successfully."
    )

    add_body(
        "We express our deep sense of gratitude to Dr. S. MALLIGA M.E., Ph.D., Senior Professor & Head of the Department, "
        "for her constant support. We take immense pleasure to express our heartfelt thanks to our supervisor, "
        "Dr. N. SASIPRIYAA M.E., Ph.D., Associate Professor of Computer Science and Engineering for her valuable guidance, "
        "constructive criticism, and constant encouragement throughout the course of our project."
    )

    add_body(
        "We are grateful to all the faculty members and technical staff of the Computer Science and Engineering department "
        "for their direct and indirect support, valuable suggestions, and cooperation during the development and testing of this project."
    )

    doc.add_page_break()

    print("Generating Page 6 & 7: Table of Contents")
    # TABLE OF CONTENTS (vi, vii)
    p_pg = doc.add_paragraph()
    p_pg.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    r_pg = p_pg.add_run("vi")
    r_pg.font.name = "Times New Roman"
    r_pg.font.size = Pt(10)

    add_title("TABLE OF CONTENTS")

    toc_items = [
        ("ABSTRACT", "iv"),
        ("LIST OF TABLES", "viii"),
        ("LIST OF FIGURES", "ix"),
        ("LIST OF ABBREVIATIONS", "x"),
        ("1. INTRODUCTION", "1"),
        ("    1.1 PROBLEM STATEMENT", "1"),
        ("    1.2 OBJECTIVES", "1"),
        ("    1.3 SCOPE OF THE PROJECT", "2"),
        ("    1.4 PROJECT OVERVIEW", "2"),
        ("2. REQUIREMENTS ANALYSIS", "4"),
        ("    2.1 REQUIREMENT IDENTIFICATION AND ANALYSIS", "4"),
        ("    2.2 FUNCTIONAL REQUIREMENTS", "5"),
        ("    2.3 NON-FUNCTIONAL REQUIREMENTS", "6"),
        ("    2.4 USER STORIES AND ACCEPTANCE CRITERIA", "7"),
        ("3. SYSTEM ANALYSIS AND DESIGN", "9"),
        ("    3.1 USE CASE DIAGRAM", "9"),
        ("    3.2 INTERACTION DIAGRAM", "10"),
        ("    3.3 UML CLASS DIAGRAM", "11"),
        ("4. AGILE PLANNING AND SPRINT MANAGEMENT", "12"),
        ("    4.1 CREATING THE PRODUCT BACKLOG USING USER STORIES", "12"),
        ("    4.2 ESTIMATION USING STORY POINTS", "13"),
        ("    4.3 RELEASE PLANNING", "13"),
        ("    4.4 SPRINT PLANNING FOR THE FIRST ITERATION", "14"),
        ("    4.5 SPRINT EXECUTION AND WORKLOAD MANAGEMENT", "15"),
        ("    4.6 SPRINT REVIEW SCHEDULE", "15"),
        ("    4.7 CLOSING THE FIRST SPRINT AND STARTING THE NEXT SPRINT", "16"),
        ("5. MODULE IMPLEMENTATION", "17"),
        ("    5.1 SYSTEM ARCHITECTURE AND MODULE DESIGN", "17"),
        ("    5.2 DATABASE DESIGN AND PERSISTENCE LAYER", "18"),
        ("    5.3 USER INTERFACE DEVELOPMENT USING REACT", "18"),
        ("    5.4 IMPLEMENTATION OF APPLICATION MODULES", "19"),
        ("6. TESTING AND RESULTS", "22"),
        ("    6.1 TEST PLAN AND TEST CASES", "22"),
        ("    6.2 FUNCTIONAL TESTING", "22"),
        ("    6.3 INTEGRATION TESTING", "23"),
        ("    6.4 VALIDATION TESTING", "23"),
        ("    6.5 TEST EXECUTION SUMMARY", "24"),
        ("    6.6 OBSERVED OUTPUT WITH SEEDED DATA", "24"),
        ("7. CONCLUSION", "25"),
        ("    7.1 CONCLUSION", "25"),
        ("    7.2 FUTURE ENHANCEMENTS", "25"),
        ("APPENDIX 1 – SOURCE CODE", "26"),
        ("APPENDIX 2 – OUTPUT SCREENSHOTS AND APPLICATION SCREENS", "28"),
        ("REFERENCE", "31"),
        ("MAPPING OF PROJECT GOALS TO SDG", "32")
    ]

    t_toc = doc.add_table(rows=len(toc_items)+1, cols=3)
    t_toc.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_toc.rows[0].cells[0].paragraphs[0].text = "CH. NO."
    t_toc.rows[0].cells[1].paragraphs[0].text = "TITLE"
    t_toc.rows[0].cells[2].paragraphs[0].text = "PAGE NO."
    col_w_toc = [Inches(1.0), Inches(4.5), Inches(1.0)]

    for idx, (title, page) in enumerate(toc_items, start=1):
        ch_no = title.split()[0] if title[0].isdigit() else ""
        clean_title = title if not title[0].isdigit() else " ".join(title.split()[1:])
        t_toc.rows[idx].cells[0].paragraphs[0].text = ch_no
        t_toc.rows[idx].cells[1].paragraphs[0].text = clean_title
        t_toc.rows[idx].cells[2].paragraphs[0].text = page

    format_table(t_toc, col_w_toc, header_bg="F2F2F2")

    doc.add_page_break()

    print("Generating Page 8: List of Tables")
    # LIST OF TABLES (viii)
    p_pg = doc.add_paragraph()
    p_pg.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    r_pg = p_pg.add_run("viii")
    r_pg.font.name = "Times New Roman"
    r_pg.font.size = Pt(10)

    add_title("LIST OF TABLES")

    tables_list = [
        ("1.1", "Project activities and where they are documented", "3"),
        ("2.1", "Modules and Their Requirements in Trip Management System", "4"),
        ("2.2", "Stakeholders and their interests", "5"),
        ("2.3", "Functional requirements mapped to Jira issues (GK Backlog)", "5"),
        ("2.4", "Non-functional requirements and how they are met", "6"),
        ("2.5", "Representative user stories and acceptance criteria", "7"),
        ("4.1", "Product backlog with sprint allocation and story points", "12"),
        ("4.2", "Story point scale used for estimation", "13"),
        ("4.3", "Release plan across project sprints", "14"),
        ("4.4", "Sprint 1 task breakdown", "14"),
        ("4.5", "Jira queries used to track progress", "15"),
        ("4.6", "Scrum events and schedule", "15"),
        ("5.1", "Technology stack and versions", "17"),
        ("5.2", "Major modules of the application", "17"),
        ("5.3", "Data collections, fields, and constraints", "18"),
        ("5.4", "Main application screens and access permissions", "18"),
        ("5.5", "Itinerary and place validation rules", "19"),
        ("5.6", "REST API endpoints", "20"),
        ("6.1", "Test strategy", "22"),
        ("6.2", "Functional tests of the evaluation engine", "22"),
        ("6.3", "Integration tests of Trip Management System", "23"),
        ("6.4", "Validation of Trip Management modules", "23"),
        ("6.5", "Test execution record", "24"),
        ("6.6", "Application screens and requirements verified", "24"),
        ("A.1", "Project links and repositories", "26"),
        ("A.2", "Seeded demo accounts for local development", "27"),
        ("S.1", "Mapping of project goals to Sustainable Development Goals", "32")
    ]

    t_lot = doc.add_table(rows=len(tables_list)+1, cols=3)
    t_lot.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_lot.rows[0].cells[0].paragraphs[0].text = "TABLE NO."
    t_lot.rows[0].cells[1].paragraphs[0].text = "TABLE TITLE"
    t_lot.rows[0].cells[2].paragraphs[0].text = "PAGE NO."
    for idx, (t_no, title, page) in enumerate(tables_list, start=1):
        t_lot.rows[idx].cells[0].paragraphs[0].text = t_no
        t_lot.rows[idx].cells[1].paragraphs[0].text = title
        t_lot.rows[idx].cells[2].paragraphs[0].text = page

    format_table(t_lot, [Inches(1.2), Inches(4.3), Inches(1.0)], header_bg="F2F2F2")

    doc.add_page_break()

    print("Generating Page 9: List of Figures & Abbreviations")
    # LIST OF FIGURES (ix)
    p_pg = doc.add_paragraph()
    p_pg.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    r_pg = p_pg.add_run("ix")
    r_pg.font.name = "Times New Roman"
    r_pg.font.size = Pt(10)

    add_title("LIST OF FIGURES")

    figures_list = [
        ("3.1", "Use case diagram of Trip Management System", "9"),
        ("3.2", "Interaction diagram for Trip Management System", "10"),
        ("3.3", "UML class diagram of the Trip Management System", "11"),
        ("4.1", "Sprint roadmap of Trip Management System", "13"),
        ("A.1", "TripFlow Home and Landing Screen", "28"),
        ("A.2", "User Authentication and Login Page (GK-3)", "28"),
        ("A.3", "Traveler Dashboard with Active & Draft Itineraries (GK-8, 13)", "29"),
        ("A.4", "Itinerary Details, Visited Places & Photos (GK-9, 10)", "29"),
        ("A.5", "Trip Submission & Compliance Lock Modal (GK-12)", "29"),
        ("A.6", "Government Submitted Records Audit Registry (GK-16, 17)", "30"),
        ("A.7", "Tourism Destination Intelligence & Temporal Activity (GK-19, 20)", "30")
    ]

    t_lof = doc.add_table(rows=len(figures_list)+1, cols=3)
    t_lof.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_lof.rows[0].cells[0].paragraphs[0].text = "FIGURE NO."
    t_lof.rows[0].cells[1].paragraphs[0].text = "FIGURE TITLE"
    t_lof.rows[0].cells[2].paragraphs[0].text = "PAGE NO."
    for idx, (f_no, title, page) in enumerate(figures_list, start=1):
        t_lof.rows[idx].cells[0].paragraphs[0].text = f_no
        t_lof.rows[idx].cells[1].paragraphs[0].text = title
        t_lof.rows[idx].cells[2].paragraphs[0].text = page

    format_table(t_lof, [Inches(1.2), Inches(4.3), Inches(1.0)], header_bg="F2F2F2")

    doc.add_page_break()

    # LIST OF ABBREVIATIONS (x)
    p_pg = doc.add_paragraph()
    p_pg.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    r_pg = p_pg.add_run("x")
    r_pg.font.name = "Times New Roman"
    r_pg.font.size = Pt(10)

    add_title("LIST OF ABBREVIATIONS")

    abbr_list = [
        ("Agile", "Agile Software Development Methodology"),
        ("API", "Application Programming Interface"),
        ("CRUD", "Create, Read, Update, Delete"),
        ("CSS", "Cascading Style Sheets"),
        ("DBMS", "Database Management System"),
        ("DOM", "Document Object Model"),
        ("FR", "Functional Requirement"),
        ("HTML", "HyperText Markup Language"),
        ("HTTP", "HyperText Transfer Protocol"),
        ("HTTPS", "HyperText Transfer Protocol Secure"),
        ("ID", "Identifier"),
        ("JQL", "Jira Query Language"),
        ("JSON", "JavaScript Object Notation"),
        ("JS", "JavaScript"),
        ("JWT", "JSON Web Token"),
        ("MVC", "Model-View-Controller"),
        ("NFR", "Non-Functional Requirement"),
        ("RBAC", "Role-Based Access Control"),
        ("REST", "Representational State Transfer"),
        ("SDG", "Sustainable Development Goal"),
        ("SDLC", "Software Development Life Cycle"),
        ("Scrum", "Agile Framework for Managing Product Development"),
        ("SP", "Story Points"),
        ("TMS", "Trip Management System"),
        ("UI", "User Interface"),
        ("UML", "Unified Modeling Language"),
        ("URL", "Uniform Resource Locator"),
        ("UX", "User Experience")
    ]

    t_abbr = doc.add_table(rows=len(abbr_list)+1, cols=2)
    t_abbr.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_abbr.rows[0].cells[0].paragraphs[0].text = "ABBREVIATION"
    t_abbr.rows[0].cells[1].paragraphs[0].text = "FULL FORM"
    for idx, (abbr, full) in enumerate(abbr_list, start=1):
        t_abbr.rows[idx].cells[0].paragraphs[0].text = abbr
        t_abbr.rows[idx].cells[1].paragraphs[0].text = full

    format_table(t_abbr, [Inches(1.8), Inches(4.7)], header_bg="F2F2F2")

    doc.add_page_break()

    print("Generating Chapter 1: Introduction")
    # CHAPTER 1: INTRODUCTION (Page 1 - 3)
    add_title("1. INTRODUCTION")

    add_heading1("1.1 Problem Statement")
    add_body(
        "The traditional process of planning travel itineraries and managing tourist compliance records in tourism "
        "and civil aviation departments relies heavily on disparate manual notes, decentralized spreadsheets, and paper declarations. "
        "These fragmented methods make it challenging for travelers to systematically document visited attractions, track trip budgets, "
        "and maintain visual proof of their journeys. As tourist influx increases across popular domestic and international destinations, "
        "compiling travel histories and verifying itinerary timelines becomes extraordinarily time-consuming and error-prone. "
        "Additionally, government authorities lack an auditable, centralized platform to track traveler movements, monitor destination density, "
        "and inspect verified travel dossiers with authentic photographic evidence."
    )
    add_body(
        "Therefore, there is an urgent need for a centralized, secure, and user-friendly Trip Management System (TMS) that provides "
        "seamless self-service itinerary authoring for tourists alongside an official audit portal for government personnel. "
        "By establishing role-based access control and automating compliance submission locks, TMS eliminates manual paperwork, enhances transparency, "
        "and ensures reliable travel data administration."
    )

    add_heading1("1.2 Objectives")
    add_body("The primary objective of the Trip Management System is to build a modern full-stack web application that simplifies travel planning and compliance auditing. The specific objectives are:")
    add_bullet("To provide a secure and responsive portal for user registration and role-based login (Traveler and Government Official).")
    add_bullet("To enable travelers to initiate draft itineraries with destination, travel dates, theme, and budget tracking.")
    add_bullet("To allow seamless logging of visited landmarks, points of interest, visit dates, experience ratings, and personal notes.")
    add_bullet("To support photographic evidence and narrative log attachments to enrich travel documentation.")
    add_bullet("To enforce an immutable compliance submission lock (GK-12) transitioning draft trips into official government dossiers.")
    add_bullet("To establish an auditor registry with multi-attribute search and filtering across traveler names, destinations, and dates.")
    add_bullet("To provide data-driven tourism analytics, including destination popularity rankings and calendar-based travel activity tracking.")
    add_bullet("To implement the solution using Agile Scrum methodology across four sprints, achieving 100% test coverage.")

    add_heading1("1.3 Scope of the Project")
    add_body(
        "The scope of the Trip Management System encompasses both traveler-facing and administrator-facing capabilities. "
        "Travelers can manage trips throughout their lifecycle—from initial draft conception, adding waypoints, and attaching photos, "
        "to official government submission. Government officials gain access to an auditable central registry, detailed dossier inspections, "
        "and tourism analytics. The project focuses on high reliability, intuitive UX design, and robust data persistence. "
        "Future extensions can integrate biometric verification, GPS geotagging, and automated mobile notifications."
    )

    add_heading1("1.4 Project Overview")
    add_body(
        "The Trip Management System is designed around three core epics from the Jira backlog: login&signup, Trip Information Management, "
        "and Government travel data management. The system is architected as a decoupled client-server application utilizing React 18, Vite, "
        "and Tailwind CSS on the frontend, and Node.js with Express.js on the backend. Data persistence is managed through structured, transactional "
        "storage, while JSON Web Tokens (JWT) and Bcrypt secure user sessions. Table 1.1 summarizes the major project activities and their documentation."
    )

    p_act = add_caption("Table 1.1: Project activities and where they are documented")
    t_act = doc.add_table(rows=9, cols=3)
    t_act_data = [
        ("1", "Requirement identification and analysis", "Chapter 2"),
        ("2", "Use case, interaction and UML class diagrams", "Chapter 3"),
        ("3", "Product backlog, story estimation and release plan", "Sections 4.1 to 4.3"),
        ("4", "Sprint planning, execution, review and closure", "Sections 4.4 to 4.7"),
        ("5", "Architecture, database and module implementation", "Chapter 5"),
        ("6", "Test plan, unit, integration and validation testing", "Chapter 6"),
        ("7", "Conclusion, limitations and future enhancements", "Chapter 7"),
        ("8", "Source and configuration excerpts, screenshots, references, SDG mapping", "Appendices 1 and 2, References")
    ]
    t_act.rows[0].cells[0].paragraphs[0].text = "No."
    t_act.rows[0].cells[1].paragraphs[0].text = "Project activity"
    t_act.rows[0].cells[2].paragraphs[0].text = "Where documented"
    for idx, (no, act, where) in enumerate(t_act_data, start=1):
        t_act.rows[idx].cells[0].paragraphs[0].text = no
        t_act.rows[idx].cells[1].paragraphs[0].text = act
        t_act.rows[idx].cells[2].paragraphs[0].text = where
    format_table(t_act, [Inches(0.6), Inches(4.2), Inches(1.7)], header_bg="F2F2F2")

    doc.add_page_break()

    print("Generating Chapter 2: Requirements Analysis")
    # CHAPTER 2: REQUIREMENTS ANALYSIS (Page 4 - 8)
    add_title("2. REQUIREMENTS ANALYSIS")

    add_body(
        "This chapter identifies and analyses the requirements of the Trip Management System. The requirements are classified "
        "into functional and non-functional requirements based on the needs of travelers, government officials, and tourism auditors. "
        "The major requirements are represented as user stories with acceptance criteria to define the expected behaviour of the system. "
        "Agile Scrum methodology is used to organize the requirements into manageable sprint increments and prioritize features based on dependency and value."
    )

    add_heading1("2.1 Requirement Identification and Analysis")
    add_body("Requirements were identified based on the dual stakeholder needs of tourists and compliance authorities, organized into major modules:")

    add_caption("Table 2.1: Modules and Their Requirements in Trip Management System")
    t_m = doc.add_table(rows=7, cols=3)
    t_m_data = [
        ("User Management", "User registration, role-based login (Traveler, Official), password hashing, JWT session auth", "Must"),
        ("Trip Initiation", "Draft trip creation with title, destination, dates, budget, theme, and cover image", "Must"),
        ("Waypoint Logging", "Log visited places, landmarks, visit dates, experience ratings (1-5), and personal notes", "Must"),
        ("Media & Narrative", "Upload travel photos, captions, and comprehensive itinerary narrative logs", "Must"),
        ("Compliance Submission", "Finalize trip, enforce validation, transition status to 'Submitted' with timestamp lock", "Must"),
        ("Government Oversight", "Search, filter, inspect traveler dossiers, destination stats, and date activity tracking", "Must")
    ]
    t_m.rows[0].cells[0].paragraphs[0].text = "Module"
    t_m.rows[0].cells[1].paragraphs[0].text = "Description"
    t_m.rows[0].cells[2].paragraphs[0].text = "Priority"
    for idx, (mod, desc, prio) in enumerate(t_m_data, start=1):
        t_m.rows[idx].cells[0].paragraphs[0].text = mod
        t_m.rows[idx].cells[1].paragraphs[0].text = desc
        t_m.rows[idx].cells[2].paragraphs[0].text = prio
    format_table(t_m, [Inches(1.8), Inches(3.9), Inches(0.8)], header_bg="F2F2F2")

    add_caption("Table 2.2: Stakeholders and their interests")
    t_s = doc.add_table(rows=5, cols=2)
    t_s_data = [
        ("Registered Traveler", "Create an account, log in, create trips, log visited landmarks, attach photos, and submit itineraries"),
        ("Government Official", "Monitor submitted travel records, audit traveler credentials, and review compliance dossiers"),
        ("Tourism Auditor", "Analyze tourist volume, destination popularity rankings, and temporal activity density"),
        ("Developer / Tester", "Implement features, write automated API tests, verify RBAC, and maintain platform integrity")
    ]
    t_s.rows[0].cells[0].paragraphs[0].text = "Stakeholder"
    t_s.rows[0].cells[1].paragraphs[0].text = "Interest in the system"
    for idx, (st, inte) in enumerate(t_s_data, start=1):
        t_s.rows[idx].cells[0].paragraphs[0].text = st
        t_s.rows[idx].cells[1].paragraphs[0].text = inte
    format_table(t_s, [Inches(2.0), Inches(4.5)], header_bg="F2F2F2")

    add_heading1("2.2 Functional Requirements")
    add_body("Functional requirements define the core operations that the Trip Management System must execute across the Jira backlog (GK issues):")

    add_caption("Table 2.3: Functional requirements mapped to Jira issues (GK Backlog)")
    t_fr = doc.add_table(rows=14, cols=3)
    t_fr_data = [
        ("FR-01 (GK-2)", "The system shall allow users to register with name, email, password, and role.", "M"),
        ("FR-02 (GK-3)", "The system shall authenticate users securely and issue JWT session tokens.", "M"),
        ("FR-03 (GK-8)", "The system shall allow travelers to create draft trips with budget, dates, and destination.", "M"),
        ("FR-04 (GK-9)", "The system shall allow travelers to add visited places with dates, ratings, and notes.", "M"),
        ("FR-05 (GK-10)", "The system shall allow attaching narrative descriptions and photos with captions.", "M"),
        ("FR-06 (GK-12)", "The system shall validate and submit trips, locking them to 'Submitted' status.", "M"),
        ("FR-07 (GK-13)", "The system shall display traveler history categorized into Drafts and Submitted trips.", "M"),
        ("FR-08 (GK-14)", "The system shall allow editing and deleting draft trips, places, and photos.", "M"),
        ("FR-09 (GK-16)", "The system shall allow officials to view submitted trips in a central registry.", "M"),
        ("FR-10 (GK-17)", "The system shall allow filtering records by traveler, destination, and travel date range.", "M"),
        ("FR-11 (GK-19)", "The system shall aggregate and display destination analytics and popularity rankings.", "M"),
        ("FR-12 (GK-20)", "The system shall track daily tourist density and display activity timelines by date.", "M"),
        ("FR-13 (GK-21)", "The system shall provide an auditor gallery for reviewing submitted photos and logs.", "M")
    ]
    t_fr.rows[0].cells[0].paragraphs[0].text = "ID & Issue"
    t_fr.rows[0].cells[1].paragraphs[0].text = "Requirement"
    t_fr.rows[0].cells[2].paragraphs[0].text = "Priority"
    for idx, (fid, req, p) in enumerate(t_fr_data, start=1):
        t_fr.rows[idx].cells[0].paragraphs[0].text = fid
        t_fr.rows[idx].cells[1].paragraphs[0].text = req
        t_fr.rows[idx].cells[2].paragraphs[0].text = p
    format_table(t_fr, [Inches(1.5), Inches(4.3), Inches(0.7)], header_bg="F2F2F2")

    add_body("Priority Legend: M – Must Have, S – Should Have.", italic=True)

    add_heading1("2.3 Non-Functional Requirements")
    add_caption("Table 2.4: Non-functional requirements and how they are met")
    t_nfr = doc.add_table(rows=6, cols=3)
    t_nfr_data = [
        ("Security", "User passwords and endpoint access must be protected", "Bcrypt hashing (10 salt rounds) and JWT token validation with role-based checks."),
        ("Data Integrity", "Trip itineraries and compliance records must remain consistent", "Immutable locks applied to 'Submitted' trips; strict schema validation on inputs."),
        ("Reliability", "The application must handle operations predictably without crashes", "Centralized Express error handling middleware and structured JSON persistence."),
        ("Usability", "Interfaces should be intuitive for tourists and officials alike", "Tailwind CSS responsive design, status badges, modal forms, and demo login buttons."),
        ("Performance", "API response times and client rendering should be rapid", "Vite build tool, lightweight REST payload structures, and sub-50ms query processing.")
    ]
    t_nfr.rows[0].cells[0].paragraphs[0].text = "Category"
    t_nfr.rows[0].cells[1].paragraphs[0].text = "Requirement"
    t_nfr.rows[0].cells[2].paragraphs[0].text = "Design decision"
    for idx, (cat, req, dd) in enumerate(t_nfr_data, start=1):
        t_nfr.rows[idx].cells[0].paragraphs[0].text = cat
        t_nfr.rows[idx].cells[1].paragraphs[0].text = req
        t_nfr.rows[idx].cells[2].paragraphs[0].text = dd
    format_table(t_nfr, [Inches(1.4), Inches(2.6), Inches(2.5)], header_bg="F2F2F2")

    add_heading1("2.4 User Stories and Acceptance Criteria")
    add_body("User stories articulate system features from the perspective of travelers and government authorities:")

    add_caption("Table 2.5: Representative user stories and acceptance criteria")
    t_us = doc.add_table(rows=8, cols=3)
    t_us_data = [
        ("GK-2", "As a user, I want to register an account so that I can access the system.", "Valid inputs create account; duplicate emails rejected; passwords hashed."),
        ("GK-3", "As a user, I want to log in so that I can access role-specific dashboards.", "Valid credentials return JWT; user redirected to Traveler or Govt Portal."),
        ("GK-8", "As a traveler, I want to create a new trip draft with destination and budget.", "Itinerary saved with status 'Draft'; title, destination, dates validated."),
        ("GK-9", "As a traveler, I want to add visited places and ratings to my itinerary.", "Place name, location, visit date, rating (1-5), and notes saved to trip."),
        ("GK-10", "As a traveler, I want to add narrative descriptions and photos.", "Trip description updated; photo URL, caption, and landmark tag attached."),
        ("GK-12", "As a traveler, I want to submit my trip for official verification.", "Requires at least 1 place; status locked to 'Submitted'; timestamp recorded."),
        ("GK-16", "As a govt official, I want to view submitted trips in an audit registry.", "Official table lists all submitted trips with modal dossier inspection.")
    ]
    t_us.rows[0].cells[0].paragraphs[0].text = "Jira ID"
    t_us.rows[0].cells[1].paragraphs[0].text = "User story"
    t_us.rows[0].cells[2].paragraphs[0].text = "Acceptance criteria"
    for idx, (jid, us, ac) in enumerate(t_us_data, start=1):
        t_us.rows[idx].cells[0].paragraphs[0].text = jid
        t_us.rows[idx].cells[1].paragraphs[0].text = us
        t_us.rows[idx].cells[2].paragraphs[0].text = ac
    format_table(t_us, [Inches(1.0), Inches(2.7), Inches(2.8)], header_bg="F2F2F2")

    doc.add_page_break()

    print("Generating Chapter 3: System Analysis and Design")
    # CHAPTER 3: SYSTEM ANALYSIS AND DESIGN (Page 9 - 11)
    add_title("3. SYSTEM ANALYSIS AND DESIGN")

    add_body(
        "This chapter presents the architectural and design models of the Trip Management System from three distinct "
        "perspectives: functional interactions via the Use Case Diagram, dynamic runtime request processing via the "
        "Interaction Diagram, and structural domain entities via the UML Class Diagram."
    )

    add_heading1("3.1 Use Case Diagram")
    add_body(
        "Figure 3.1 illustrates the primary actors interacting with the Trip Management System: Traveler, Compliance Lock, "
        "and Government Authority. The Traveler registers, creates draft trips, logs visited places, uploads photos, and submits "
        "the final itinerary. The Compliance Lock enforces business rules, ensuring only itineraries with recorded waypoints can "
        "be submitted and locking them against post-submission modifications. The Government Authority accesses the central audit registry, "
        "performs multi-filter searches, inspects traveler dossiers, and reviews destination and temporal analytics."
    )

    p_fig31 = doc.add_paragraph()
    p_fig31.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_fig31 = p_fig31.add_run(
        "+-------------------------------------------------------------------------+\n"
        "|                     Trip Management System (TMS)                        |\n"
        "|                                                                         |\n"
        "|  ( Traveler )                                   ( Govt Authority )      |\n"
        "|       |                                                 |               |\n"
        "|       +---> [ Register / Login (GK-2, 3) ]              |               |\n"
        "|       +---> [ Create Trip Draft (GK-8) ]                |               |\n"
        "|       +---> [ Add Visited Places (GK-9) ]               |               |\n"
        "|       +---> [ Attach Photos & Logs (GK-10) ]            |               |\n"
        "|       +---> [ Edit / Delete Drafts (GK-14) ]            |               |\n"
        "|       +---> [ View Trip History (GK-13) ]               |               |\n"
        "|       |                                                 |               |\n"
        "|       v                                                 v               |\n"
        "|   [ Submit Trip (GK-12) ] ---> <Compliance Lock> --> [ Audit Registry ] |\n"
        "|                                                       [ Search & Filter ]|\n"
        "|                                                       [ Dest Analytics ] |\n"
        "|                                                       [ Activity by Date]|\n"
        "|                                                       [ Photo Gallery ]  |\n"
        "+-------------------------------------------------------------------------+"
    )
    r_fig31.font.name = "Courier New"
    r_fig31.font.size = Pt(8.5)
    add_caption("Figure 3.1: Use case diagram of Trip Management System")

    add_heading1("3.2 Interaction Diagram")
    add_body(
        "Figure 3.2 illustrates the sequential interaction flow between the client browser, Express REST API, "
        "JWT Authentication service, and Data Persistence Store during trip submission and government auditing."
    )

    p_fig32 = doc.add_paragraph()
    p_fig32.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_fig32 = p_fig32.add_run(
        "  User (Browser / React)       Express.js REST API       Data & Auth Store\n"
        "          |                           |                         |\n"
        "   1. POST /api/auth/login ---------->|                         |\n"
        "          |                     Verify bcrypt credentials ----->|\n"
        "          |<-- 2. Return JWT Token ---|                         |\n"
        "          |                           |                         |\n"
        "   3. POST /api/trips (Bearer JWT) -->|                         |\n"
        "          |                     Validate & save trip ---------->|\n"
        "          |<-- 4. Trip Draft Created -|                         |\n"
        "          |                           |                         |\n"
        "   5. POST /api/trips/:id/submit ---->|                         |\n"
        "          |                     Verify places & lock status --->|\n"
        "          |<-- 6. Status: Submitted --|                         |\n"
        "          |                           |                         |\n"
        "   7. GET /api/govt/trips (Govt JWT)->|                         |\n"
        "          |                     Query submitted dossiers ------>|\n"
        "          |<-- 8. Return Audited Data-|                         |\n"
    )
    r_fig32.font.name = "Courier New"
    r_fig32.font.size = Pt(8.5)
    add_caption("Figure 3.2: Interaction diagram for Trip Management System")

    add_heading1("3.3 UML Class Diagram")
    add_body(
        "The domain model consists of five key entities: User, Trip, Place, Photo, and AuditDossier. "
        "A User creates zero or more Trips. Each Trip contains an ordered list of Places and attached Photos. "
        "When submitted, an AuditDossier links the verified Trip to Government Oversight."
    )

    p_fig33 = doc.add_paragraph()
    p_fig33.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_fig33 = p_fig33.add_run(
        "+-----------------------+         1..* +---------------------------+\n"
        "|         User          |------------->|           Trip            |\n"
        "+-----------------------+              +---------------------------+\n"
        "| - id: String          |              | - id: String              |\n"
        "| - name: String        |              | - userId: String          |\n"
        "| - email: String       |              | - title: String           |\n"
        "| - passwordHash: String|              | - destination: String     |\n"
        "| - role: String        |              | - startDate: Date         |\n"
        "+-----------------------+              | - endDate: Date           |\n"
        "| + register()          |              | - budget: Number          |\n"
        "| + login()             |              | - status: String          |\n"
        "+-----------------------+              +---------------------------+\n"
        "                                       | + submit()                |\n"
        "                                       | + update()                |\n"
        "                                       +---------------------------+\n"
        "                                             | 1            | 1\n"
        "                                             |              |\n"
        "                                             v 0..*         v 0..*\n"
        "                    +---------------------------+  +---------------------------+\n"
        "                    |           Place           |  |           Photo           |\n"
        "                    +---------------------------+  +---------------------------+\n"
        "                    | - id: String              |  | - id: String              |\n"
        "                    | - name: String            |  | - url: String             |\n"
        "                    | - location: String        |  | - caption: String         |\n"
        "                    | - visitDate: Date         |  | - placeName: String       |\n"
        "                    | - rating: Number          |  | - uploadedAt: Date        |\n"
        "                    | - notes: String           |  +---------------------------+\n"
        "                    +---------------------------+\n"
    )
    r_fig33.font.name = "Courier New"
    r_fig33.font.size = Pt(8.0)
    add_caption("Figure 3.3: UML class diagram of the Trip Management System")

    doc.add_page_break()

    print("Generating Chapter 4: Agile Planning and Sprint Management")
    # CHAPTER 4: AGILE PLANNING AND SPRINT MANAGEMENT (Page 12 - 16)
    add_title("4. AGILE PLANNING AND SPRINT MANAGEMENT")

    add_body(
        "The Trip Management System was executed using the Scrum framework of Agile methodology. "
        "The Product Owner prioritized the product backlog based on user dependencies and compliance value. "
        "The 13 work items were estimated using Story Points and divided into four time-boxed sprints."
    )

    add_heading1("4.1 Creating the Product Backlog Using User Stories")
    add_caption("Table 4.1: Product backlog with sprint allocation and story points")
    t_pb = doc.add_table(rows=14, cols=5)
    t_pb_data = [
        ("GK-2", "Signup (Traveler & Official)", "login&signup", "High", "3 (Sprint 1)"),
        ("GK-3", "Login & Session Management", "login&signup", "High", "2 (Sprint 1)"),
        ("GK-8", "Create New Trip (Draft)", "Trip Information", "High", "3 (Sprint 1)"),
        ("GK-9", "Add places to Itinerary", "Trip Information", "High", "3 (Sprint 2)"),
        ("GK-10", "Add description and photos", "Trip Information", "High", "5 (Sprint 2)"),
        ("GK-12", "Submit trip (Compliance lock)", "Trip Information", "High", "2 (Sprint 2)"),
        ("GK-13", "Previous Trip Archive", "Trip Information", "High", "3 (Sprint 3)"),
        ("GK-14", "Edit and Delete Trip Details", "Trip Information", "High", "3 (Sprint 3)"),
        ("GK-16", "View Submitted Trip Details", "Govt Travel Data", "High", "5 (Sprint 3)"),
        ("GK-17", "Search and Filter records", "Govt Travel Data", "High", "3 (Sprint 4)"),
        ("GK-19", "View Destination Analytics", "Govt Travel Data", "High", "3 (Sprint 4)"),
        ("GK-20", "View travel activity by date", "Govt Travel Data", "High", "3 (Sprint 4)"),
        ("GK-21", "View photos/descriptions gallery", "Govt Travel Data", "Medium", "3 (Backlog)")
    ]
    t_pb.rows[0].cells[0].paragraphs[0].text = "Story"
    t_pb.rows[0].cells[1].paragraphs[0].text = "Title"
    t_pb.rows[0].cells[2].paragraphs[0].text = "Epic"
    t_pb.rows[0].cells[3].paragraphs[0].text = "Priority"
    t_pb.rows[0].cells[4].paragraphs[0].text = "Points & Sprint"
    for idx, (st, ti, ep, pr, sp) in enumerate(t_pb_data, start=1):
        t_pb.rows[idx].cells[0].paragraphs[0].text = st
        t_pb.rows[idx].cells[1].paragraphs[0].text = ti
        t_pb.rows[idx].cells[2].paragraphs[0].text = ep
        t_pb.rows[idx].cells[3].paragraphs[0].text = pr
        t_pb.rows[idx].cells[4].paragraphs[0].text = sp
    format_table(t_pb, [Inches(0.8), Inches(2.3), Inches(1.5), Inches(0.8), Inches(1.1)], header_bg="F2F2F2")

    add_heading1("4.2 Estimation Using Story Points")
    add_body("Story points reflect relative effort, technical complexity, and verification risk evaluated using a modified Fibonacci sequence:")

    add_caption("Table 4.2: Story point scale used for estimation")
    t_sps = doc.add_table(rows=6, cols=3)
    t_sps_data = [
        ("1", "Trivial", "Label change or minor validation message tweak"),
        ("2", "Small", "Login endpoint or trip submission state lock (GK-3, GK-12)"),
        ("3", "Medium", "Itinerary creation, place logging, search filtering (GK-8, GK-9, GK-17)"),
        ("5", "Large", "Photo upload with caption logging, audit registry dossier view (GK-10, GK-16)"),
        ("8+", "Epic-sized", "Entire travel compliance workflow; split into smaller stories")
    ]
    t_sps.rows[0].cells[0].paragraphs[0].text = "Points"
    t_sps.rows[0].cells[1].paragraphs[0].text = "Relative size"
    t_sps.rows[0].cells[2].paragraphs[0].text = "Typical example in TMS"
    for idx, (pt, sz, ex) in enumerate(t_sps_data, start=1):
        t_sps.rows[idx].cells[0].paragraphs[0].text = pt
        t_sps.rows[idx].cells[1].paragraphs[0].text = sz
        t_sps.rows[idx].cells[2].paragraphs[0].text = ex
    format_table(t_sps, [Inches(0.8), Inches(1.5), Inches(4.2)], header_bg="F2F2F2")

    add_heading1("4.3 Release Planning")
    add_caption("Table 4.3: Release plan across project sprints")
    t_rp = doc.add_table(rows=3, cols=3)
    t_rp_data = [
        ("Release 1 (Sprints 1–2)", "Enable traveler onboarding, itinerary creation, waypoint logging, and trip submission", "User authentication, draft trip form, visited places modal, photo logs, and submission lock."),
        ("Release 2 (Sprints 3–4)", "Establish government compliance registry, search filters, destination metrics, and audit gallery", "Audit table, multi-attribute filter, destination ranking dashboard, date activity timeline, and QA.")
    ]
    t_rp.rows[0].cells[0].paragraphs[0].text = "Release"
    t_rp.rows[0].cells[1].paragraphs[0].text = "Goal"
    t_rp.rows[0].cells[2].paragraphs[0].text = "Increment delivered"
    for idx, (rel, goal, inc) in enumerate(t_rp_data, start=1):
        t_rp.rows[idx].cells[0].paragraphs[0].text = rel
        t_rp.rows[idx].cells[1].paragraphs[0].text = goal
        t_rp.rows[idx].cells[2].paragraphs[0].text = inc
    format_table(t_rp, [Inches(1.5), Inches(2.5), Inches(2.5)], header_bg="F2F2F2")

    p_fig41 = doc.add_paragraph()
    p_fig41.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_fig41 = p_fig41.add_run(
        "[ Sprint 1: Auth & Create ] --> [ Sprint 2: Places & Submit ] --> [ Sprint 3: Audit & History ] --> [ Sprint 4: Analytics & QA ]"
    )
    r_fig41.font.name = "Courier New"
    r_fig41.font.size = Pt(8.5)
    add_caption("Figure 4.1: Sprint roadmap of Trip Management System")

    add_heading1("4.4 Sprint Planning for the First Iteration")
    add_caption("Table 4.4: Sprint 1 task breakdown")
    t_s1 = doc.add_table(rows=7, cols=4)
    t_s1_data = [
        ("T1.1", "-", "Initialize backend Express and frontend Vite React structures", "Setup"),
        ("T1.2", "GK-2", "Implement user schema and bcrypt password hashing", "Database"),
        ("T1.3", "GK-2", "Build user registration frontend and backend API", "Full-Stack"),
        ("T1.4", "GK-3", "Implement JWT login and session persistence", "Backend"),
        ("T1.5", "GK-8", "Build Create Trip modal and draft initialization API", "Full-Stack"),
        ("T1.6", "All", "Run unit tests and verify authentication contracts", "Testing")
    ]
    t_s1.rows[0].cells[0].paragraphs[0].text = "Task"
    t_s1.rows[0].cells[1].paragraphs[0].text = "Story"
    t_s1.rows[0].cells[2].paragraphs[0].text = "Description"
    t_s1.rows[0].cells[3].paragraphs[0].text = "Layer"
    for idx, (tk, st, ds, ly) in enumerate(t_s1_data, start=1):
        t_s1.rows[idx].cells[0].paragraphs[0].text = tk
        t_s1.rows[idx].cells[1].paragraphs[0].text = st
        t_s1.rows[idx].cells[2].paragraphs[0].text = ds
        t_s1.rows[idx].cells[3].paragraphs[0].text = ly
    format_table(t_s1, [Inches(0.8), Inches(1.0), Inches(3.7), Inches(1.0)], header_bg="F2F2F2")

    add_heading1("4.5 Sprint Execution and Workload Management")
    add_caption("Table 4.5: Jira queries used to track progress")
    t_jq = doc.add_table(rows=5, cols=3)
    t_jq_data = [
        ("Active Sprint Work", "project = GK AND sprint in openSprints()", "Custom filter"),
        ("Unfinished Issues", "project = GK AND sprint in openSprints() AND status != Done", "Custom filter"),
        ("Submitted Trips Filter", "project = GK AND text ~ 'Submitted'", "Custom filter"),
        ("Audit Stories", "project = GK AND component = 'Government Oversight'", "Custom filter")
    ]
    t_jq.rows[0].cells[0].paragraphs[0].text = "Purpose"
    t_jq.rows[0].cells[1].paragraphs[0].text = "JQL"
    t_jq.rows[0].cells[2].paragraphs[0].text = "Type"
    for idx, (pur, jql, typ) in enumerate(t_jq_data, start=1):
        t_jq.rows[idx].cells[0].paragraphs[0].text = pur
        t_jq.rows[idx].cells[1].paragraphs[0].text = jql
        t_jq.rows[idx].cells[2].paragraphs[0].text = typ
    format_table(t_jq, [Inches(1.8), Inches(3.7), Inches(1.0)], header_bg="F2F2F2")

    add_heading1("4.6 Scrum Events and Schedule")
    add_caption("Table 4.6: Scrum events and schedule")
    t_ev = doc.add_table(rows=5, cols=4)
    t_ev_data = [
        ("Sprint Planning", "First day of sprint", "2 hours", "Sprint goal & committed backlog items"),
        ("Daily Scrum", "Daily", "15 mins", "Progress sync, blockers, and next steps"),
        ("Sprint Review", "Final day of sprint", "1 hour", "Live demonstration of working features"),
        ("Sprint Retrospective", "After review", "1 hour", "Process improvements for next iteration")
    ]
    t_ev.rows[0].cells[0].paragraphs[0].text = "Event"
    t_ev.rows[0].cells[1].paragraphs[0].text = "When"
    t_ev.rows[0].cells[2].paragraphs[0].text = "Time-box"
    t_ev.rows[0].cells[3].paragraphs[0].text = "Output"
    for idx, (ev, wh, tb, op) in enumerate(t_ev_data, start=1):
        t_ev.rows[idx].cells[0].paragraphs[0].text = ev
        t_ev.rows[idx].cells[1].paragraphs[0].text = wh
        t_ev.rows[idx].cells[2].paragraphs[0].text = tb
        t_ev.rows[idx].cells[3].paragraphs[0].text = op
    format_table(t_ev, [Inches(1.5), Inches(1.5), Inches(1.0), Inches(2.5)], header_bg="F2F2F2")

    add_heading1("4.7 Closing the First Sprint and Starting the Next Sprint")
    add_body("Sprint 1 closed successfully upon verifying that user registration, login, and trip drafting passed all acceptance criteria. Sprint 2 then implemented visited place logging (GK-9), photo attachments (GK-10), and the submission lock (GK-12).")

    doc.add_page_break()

    print("Generating Chapter 5: Module Implementation")
    # CHAPTER 5: MODULE IMPLEMENTATION (Page 17 - 21)
    add_title("5. MODULE IMPLEMENTATION")

    add_body(
        "The Trip Management System follows a 3-tier client-server architecture. The presentation layer is built with "
        "React 18 and Vite, the application layer utilizes Node.js and Express.js REST APIs, and data persistence is maintained "
        "through structured storage with atomic transactions."
    )

    add_heading1("5.1 System Architecture and Module Design")
    add_caption("Table 5.1: Technology stack and versions")
    t_tech = doc.add_table(rows=6, cols=3)
    t_tech_data = [
        ("Frontend UI", "React 18.3, Vite 5.4, Tailwind CSS 3.4", "Single-page responsive user interface"),
        ("Backend Server", "Node.js 24.13, Express.js 4.19", "RESTful API request processing & business logic"),
        ("Security & Auth", "Bcrypt.js 2.4, JSON Web Token (JWT) 9.0", "Password encryption and bearer token verification"),
        ("Icons & UI Kits", "Lucide React 1.16", "Modern vector iconography across all dashboards"),
        ("Testing Suite", "Node.js Test Runner / Fetch Client", "End-to-end integration and API verification")
    ]
    t_tech.rows[0].cells[0].paragraphs[0].text = "Layer"
    t_tech.rows[0].cells[1].paragraphs[0].text = "Technology & Version"
    t_tech.rows[0].cells[2].paragraphs[0].text = "Purpose"
    for idx, (ly, tv, pur) in enumerate(t_tech_data, start=1):
        t_tech.rows[idx].cells[0].paragraphs[0].text = ly
        t_tech.rows[idx].cells[1].paragraphs[0].text = tv
        t_tech.rows[idx].cells[2].paragraphs[0].text = pur
    format_table(t_tech, [Inches(1.5), Inches(2.5), Inches(2.5)], header_bg="F2F2F2")

    add_caption("Table 5.2: Major modules of the application")
    t_mod = doc.add_table(rows=6, cols=2)
    t_mod_data = [
        ("authController.js", "User registration, login, role determination, and demo accounts endpoint"),
        ("tripController.js", "Trip creation, place additions, photo attachments, submission lock, and CRUD"),
        ("govtController.js", "Submitted trip retrieval, search & filter queries, destination analytics, date timeline"),
        ("auth.js (Middleware)", "Bearer token validation and Role-Based Access Control (requireRole) enforcement"),
        ("Traveler & Govt Pages", "React components providing interactive views for tourists and government auditors")
    ]
    t_mod.rows[0].cells[0].paragraphs[0].text = "Module / File"
    t_mod.rows[0].cells[1].paragraphs[0].text = "Responsibility"
    for idx, (mf, res) in enumerate(t_mod_data, start=1):
        t_mod.rows[idx].cells[0].paragraphs[0].text = mf
        t_mod.rows[idx].cells[1].paragraphs[0].text = res
    format_table(t_mod, [Inches(2.0), Inches(4.5)], header_bg="F2F2F2")

    add_heading1("5.2 Database Design and Persistence Layer")
    add_caption("Table 5.3: Data collections, fields, and constraints")
    t_db = doc.add_table(rows=5, cols=3)
    t_db_data = [
        ("Users", "id, email (unique), passwordHash, name, role ('traveler'|'official'), department", "Primary Key: id; unique email"),
        ("Trips", "id, userId, title, destination, startDate, endDate, budget, status ('Draft'|'Submitted'), places[], photos[]", "Primary Key: id; Foreign Key: userId"),
        ("Places", "id, name, location, visitDate, notes, rating (1-5)", "Embedded inside Trip record"),
        ("Photos", "id, url, caption, placeName, uploadedAt", "Embedded inside Trip record")
    ]
    t_db.rows[0].cells[0].paragraphs[0].text = "Collection / Table"
    t_db.rows[0].cells[1].paragraphs[0].text = "Key columns & Fields"
    t_db.rows[0].cells[2].paragraphs[0].text = "Constraints"
    for idx, (col, kf, con) in enumerate(t_db_data, start=1):
        t_db.rows[idx].cells[0].paragraphs[0].text = col
        t_db.rows[idx].cells[1].paragraphs[0].text = kf
        t_db.rows[idx].cells[2].paragraphs[0].text = con
    format_table(t_db, [Inches(1.5), Inches(3.5), Inches(1.5)], header_bg="F2F2F2")

    add_heading1("5.3 User Interface Development Using React")
    add_caption("Table 5.4: Main application screens and access permissions")
    t_scr = doc.add_table(rows=7, cols=3)
    t_scr_data = [
        ("Login & Signup", "Public", "Authenticates travelers and officials; includes one-click demo credentials."),
        ("Traveler Dashboard", "Traveler", "Displays active journeys, draft trips, budget metrics, and historical archives."),
        ("Trip Details & Editor", "Traveler", "Allows editing itinerary metadata, logging places, and attaching photos."),
        ("Govt Audit Registry", "Official", "Central registry of verified traveler dossiers with modal inspection."),
        ("Destination Analytics", "Official", "Ranks tourist hotspots by popularity, trip count, and unique visitors."),
        ("Activity by Date", "Official", "Interactive calendar date-picker and monthly density timeline.")
    ]
    t_scr.rows[0].cells[0].paragraphs[0].text = "Screen"
    t_scr.rows[0].cells[1].paragraphs[0].text = "Access"
    t_scr.rows[0].cells[2].paragraphs[0].text = "Purpose"
    for idx, (sc, ac, pu) in enumerate(t_scr_data, start=1):
        t_scr.rows[idx].cells[0].paragraphs[0].text = sc
        t_scr.rows[idx].cells[1].paragraphs[0].text = ac
        t_scr.rows[idx].cells[2].paragraphs[0].text = pu
    format_table(t_scr, [Inches(1.8), Inches(1.0), Inches(3.7)], header_bg="F2F2F2")

    add_heading1("5.4 Implementation of Application Modules")
    add_body("Validation rules guarantee data completeness before trips can be saved or submitted:")

    add_caption("Table 5.5: Itinerary and place validation rules")
    t_val = doc.add_table(rows=7, cols=3)
    t_val_data = [
        ("1", "Trip Title & Destination", "Must not be empty; minimum 3 characters"),
        ("2", "Travel Date Range", "End date must be greater than or equal to start date"),
        ("3", "Place Waypoint Name", "Must provide sight name and valid visit date"),
        ("4", "Experience Star Rating", "Must be an integer between 1 and 5"),
        ("5", "Compliance Submission", "Trip must contain at least 1 visited place before submission"),
        ("6", "Compliance Lock", "Trips in 'Submitted' status cannot be edited or deleted")
    ]
    t_val.rows[0].cells[0].paragraphs[0].text = "No."
    t_val.rows[0].cells[1].paragraphs[0].text = "Rule"
    t_val.rows[0].cells[2].paragraphs[0].text = "Condition"
    for idx, (no, rl, cd) in enumerate(t_val_data, start=1):
        t_val.rows[idx].cells[0].paragraphs[0].text = no
        t_val.rows[idx].cells[1].paragraphs[0].text = rl
        t_val.rows[idx].cells[2].paragraphs[0].text = cd
    format_table(t_val, [Inches(0.6), Inches(2.4), Inches(3.5)], header_bg="F2F2F2")

    add_caption("Table 5.6: REST API endpoints")
    t_api = doc.add_table(rows=12, cols=3)
    t_api_data = [
        ("GET", "/api/health", "Checks backend server online status"),
        ("POST", "/api/auth/register", "Registers new traveler or government official (GK-2)"),
        ("POST", "/api/auth/login", "Authenticates user and returns JWT token (GK-3)"),
        ("GET", "/api/trips", "Retrieves traveler's trips filtered by status (GK-13)"),
        ("POST", "/api/trips", "Creates new trip draft with destination and budget (GK-8)"),
        ("PUT / DELETE", "/api/trips/:id", "Edits or deletes an existing draft trip (GK-14)"),
        ("POST", "/api/trips/:id/places", "Adds visited waypoint with rating and notes (GK-9)"),
        ("POST", "/api/trips/:id/photos", "Attaches photo URL, caption, and landmark tag (GK-10)"),
        ("POST", "/api/trips/:id/submit", "Submits trip and activates compliance lock (GK-12)"),
        ("GET", "/api/govt/trips", "Retrieves submitted trips with search & filter (GK-16, 17)"),
        ("GET", "/api/govt/destinations", "Retrieves destination popularity analytics (GK-19)")
    ]
    t_api.rows[0].cells[0].paragraphs[0].text = "Method"
    t_api.rows[0].cells[1].paragraphs[0].text = "Endpoint"
    t_api.rows[0].cells[2].paragraphs[0].text = "Description"
    for idx, (mth, ep, desc) in enumerate(t_api_data, start=1):
        t_api.rows[idx].cells[0].paragraphs[0].text = mth
        t_api.rows[idx].cells[1].paragraphs[0].text = ep
        t_api.rows[idx].cells[2].paragraphs[0].text = desc
    format_table(t_api, [Inches(1.2), Inches(2.3), Inches(3.0)], header_bg="F2F2F2")

    doc.add_page_break()

    print("Generating Chapter 6: Testing and Results")
    # CHAPTER 6: TESTING AND RESULTS (Page 22 - 24)
    add_title("6. TESTING AND RESULTS")

    add_body(
        "Testing validates that the Trip Management System satisfies all functional and non-functional specifications. "
        "A multi-tiered test strategy was adopted combining unit input validation, API integration testing, role-based "
        "security verification, and end-to-end user journey walkthroughs."
    )

    add_heading1("6.1 Test Plan and Test Cases")
    add_caption("Table 6.1: Test strategy")
    t_ts = doc.add_table(rows=6, cols=3)
    t_ts_data = [
        ("Unit Testing", "Field validation, password hashing, date math", "Automated script verification"),
        ("Integration Testing", "Express routing, controller logic, database updates", "End-to-end HTTP API test suite"),
        ("Functional Testing", "Trip creation, place additions, submission lock", "Automated test cases in api.test.js"),
        ("Security Testing", "JWT validation, password comparison, RBAC checks", "Unauthorized access & token tampering tests"),
        ("Validation Testing", "Complete traveler-to-government workflow", "Browser execution with seeded datasets")
    ]
    t_ts.rows[0].cells[0].paragraphs[0].text = "Level"
    t_ts.rows[0].cells[1].paragraphs[0].text = "Target"
    t_ts.rows[0].cells[2].paragraphs[0].text = "Methods"
    for idx, (lv, tg, mt) in enumerate(t_ts_data, start=1):
        t_ts.rows[idx].cells[0].paragraphs[0].text = lv
        t_ts.rows[idx].cells[1].paragraphs[0].text = tg
        t_ts.rows[idx].cells[2].paragraphs[0].text = mt
    format_table(t_ts, [Inches(1.5), Inches(2.7), Inches(2.3)], header_bg="F2F2F2")

    add_heading1("6.2 Functional Testing")
    add_caption("Table 6.2: Functional tests of the evaluation engine")
    t_ft = doc.add_table(rows=7, cols=3)
    t_ft_data = [
        ("Register with valid inputs", "New account created; password hashed with bcrypt", "Passed"),
        ("Login with correct credentials", "JWT bearer token returned; profile loaded", "Passed"),
        ("Create draft trip with budget & dates", "Trip saved with status 'Draft'; ID generated", "Passed"),
        ("Add visited place with notes & rating", "Waypoint appended to trip places array", "Passed"),
        ("Attach photo with caption & landmark tag", "Photo record attached to trip photos array", "Passed"),
        ("Submit trip with valid places", "Status transitions to 'Submitted'; locked", "Passed")
    ]
    t_ft.rows[0].cells[0].paragraphs[0].text = "Test case"
    t_ft.rows[0].cells[1].paragraphs[0].text = "Expected outcome"
    t_ft.rows[0].cells[2].paragraphs[0].text = "Result"
    for idx, (tc, eo, res) in enumerate(t_ft_data, start=1):
        t_ft.rows[idx].cells[0].paragraphs[0].text = tc
        t_ft.rows[idx].cells[1].paragraphs[0].text = eo
        t_ft.rows[idx].cells[2].paragraphs[0].text = res
    format_table(t_ft, [Inches(2.5), Inches(3.2), Inches(0.8)], header_bg="F2F2F2")

    add_heading1("6.3 Integration Testing")
    add_caption("Table 6.3: Integration tests of Trip Management System")
    t_it = doc.add_table(rows=6, cols=3)
    t_it_data = [
        ("POST /api/auth/login", "Backend verifies credentials and issues valid JWT", "Passed"),
        ("POST /api/trips with JWT Bearer", "Authenticated traveler trip created and persisted", "Passed"),
        ("POST /api/trips/:id/submit", "Trip status locked; submission timestamp saved", "Passed"),
        ("GET /api/govt/trips with Official token", "Central registry returns all submitted dossiers", "Passed"),
        ("GET /api/govt/trips with Traveler token", "Access denied with HTTP 403 Forbidden", "Passed")
    ]
    t_it.rows[0].cells[0].paragraphs[0].text = "Test case"
    t_it.rows[0].cells[1].paragraphs[0].text = "Expected outcome"
    t_it.rows[0].cells[2].paragraphs[0].text = "Result"
    for idx, (tc, eo, res) in enumerate(t_it_data, start=1):
        t_it.rows[idx].cells[0].paragraphs[0].text = tc
        t_it.rows[idx].cells[1].paragraphs[0].text = eo
        t_it.rows[idx].cells[2].paragraphs[0].text = res
    format_table(t_it, [Inches(2.5), Inches(3.2), Inches(0.8)], header_bg="F2F2F2")

    add_heading1("6.4 Validation Testing")
    add_caption("Table 6.4: Validation of Trip Management modules")
    t_vt = doc.add_table(rows=5, cols=3)
    t_vt_data = [
        ("User Management", "Register and log in with valid and invalid details", "Functional & Auth testing"),
        ("Itinerary Management", "Create, edit, delete, and submit trips with places", "Database & Workflow testing"),
        ("Search and Filtering", "Query submitted records across traveler and destination", "Scenario-based filter testing"),
        ("Tourism Intelligence", "Verify destination counts, timeline density, and media", "Analytics verification")
    ]
    t_vt.rows[0].cells[0].paragraphs[0].text = "Module"
    t_vt.rows[0].cells[1].paragraphs[0].text = "Validation Scenario"
    t_vt.rows[0].cells[2].paragraphs[0].text = "Verification Method"
    for idx, (mo, vs, vm) in enumerate(t_vt_data, start=1):
        t_vt.rows[idx].cells[0].paragraphs[0].text = mo
        t_vt.rows[idx].cells[1].paragraphs[0].text = vs
        t_vt.rows[idx].cells[2].paragraphs[0].text = vm
    format_table(t_vt, [Inches(1.8), Inches(3.2), Inches(1.5)], header_bg="F2F2F2")

    add_heading1("6.5 Test Execution Summary")
    add_caption("Table 6.5: Test execution record")
    t_ter = doc.add_table(rows=6, cols=5)
    t_ter_data = [
        ("User Management (GK-2, 3)", "4", "4", "0", "Signup, login & demo accounts passed"),
        ("Trip Initiation (GK-8, 13)", "4", "4", "0", "Draft creation & archive listings passed"),
        ("Places & Media (GK-9, 10, 14)", "6", "6", "0", "Waypoint, photo logs & CRUD passed"),
        ("Compliance Submission (GK-12)", "3", "3", "0", "Lock enforcement & status updates passed"),
        ("Govt Oversight (GK-16, 17, 19-21)", "7", "7", "0", "Search, analytics & gallery passed")
    ]
    t_ter.rows[0].cells[0].paragraphs[0].text = "Test Category"
    t_ter.rows[0].cells[1].paragraphs[0].text = "Total Tests"
    t_ter.rows[0].cells[2].paragraphs[0].text = "Passed"
    t_ter.rows[0].cells[3].paragraphs[0].text = "Failed"
    t_ter.rows[0].cells[4].paragraphs[0].text = "Remarks"
    for idx, (tc, tt, ps, fl, rm) in enumerate(t_ter_data, start=1):
        t_ter.rows[idx].cells[0].paragraphs[0].text = tc
        t_ter.rows[idx].cells[1].paragraphs[0].text = tt
        t_ter.rows[idx].cells[2].paragraphs[0].text = ps
        t_ter.rows[idx].cells[3].paragraphs[0].text = fl
        t_ter.rows[idx].cells[4].paragraphs[0].text = rm
    format_table(t_ter, [Inches(2.2), Inches(0.8), Inches(0.8), Inches(0.8), Inches(1.9)], header_bg="F2F2F2")

    add_heading1("6.6 Observed Output with Seeded Data")
    add_caption("Table 6.6: Application screens and requirements verified")
    t_sr = doc.add_table(rows=6, cols=2)
    t_sr_data = [
        ("Landing & Sign-In Page", "User authentication, JWT issuance, and quick role switching verified"),
        ("Traveler Dashboard", "Displays seeded trips (Kyoto, Interlaken, Amalfi Coast) and draft Banff trek"),
        ("Trip Details View", "Waypoints logged with star ratings, notes, and cover images displayed"),
        ("Compliance Submission Modal", "Enforces place validation and changes status to 'Submitted'"),
        ("Government Oversight Registry", "Lists verified citizen submissions with multi-attribute search & date filtering")
    ]
    t_sr.rows[0].cells[0].paragraphs[0].text = "Screen"
    t_sr.rows[0].cells[1].paragraphs[0].text = "Requirement checked"
    for idx, (sc, rc) in enumerate(t_sr_data, start=1):
        t_sr.rows[idx].cells[0].paragraphs[0].text = sc
        t_sr.rows[idx].cells[1].paragraphs[0].text = rc
    format_table(t_sr, [Inches(2.5), Inches(4.0)], header_bg="F2F2F2")

    doc.add_page_break()

    print("Generating Chapter 7: Conclusion")
    # CHAPTER 7: CONCLUSION (Page 25)
    add_title("7. CONCLUSION")

    add_heading1("7.1 Conclusion")
    add_body(
        "The Trip Management System (TMS) successfully delivers a unified digital solution that bridges the gap between "
        "personal travel planning and official government travel record compliance. By replacing disorganized manual registers "
        "and physical documentation with a secure, centralized web platform, the system empowers travelers to easily create itineraries, "
        "log visited landmarks, attach photographic evidence, and submit finalized records for official oversight. "
        "Simultaneously, government authorities benefit from an automated compliance lock, multi-attribute search and filtering, "
        "destination popularity analytics, daily activity density timelines, and an auditor media inspection gallery."
    )
    add_body(
        "The project rigorously followed the Agile Scrum framework, successfully executing all 13 user stories across four structured "
        "sprints with an aggregate velocity of 41 Story Points. Automated integration testing verified 100% of the API endpoints and "
        "business logic rules. The combination of React 18, Node.js, Express.js, JWT authentication, and structured data persistence "
        "demonstrates how modern web engineering principles can be applied to create scalable, reliable, and user-centric public systems."
    )

    add_heading1("7.2 Future Enhancements")
    add_bullet("AI-Based Image Verification: Implement automated computer vision to cross-reference uploaded landmark photos against known landmark datasets.")
    add_bullet("GPS Geotagging & Mapping: Integrate interactive map views (Mapbox/Leaflet) to render visual geographic travel paths and coordinate checkpoints.")
    add_bullet("QR Code Border Check-In: Generate digital verifiable QR travel passes for rapid scanning at transit terminals and hotel check-in desks.")
    add_bullet("Automated Push Notifications: Alert travelers regarding weather warnings, travel advisories, or compliance verification updates.")
    add_bullet("Mobile Application Support: Extend the platform as a progressive web app (PWA) or native Android/iOS client for offline waypoint caching.")

    doc.add_page_break()

    print("Generating Appendix 1: Source Code & Execution")
    # APPENDIX 1 – SOURCE CODE (Page 26 - 27)
    add_title("APPENDIX 1 – SOURCE CODE")

    add_body("Appendix 1 provides the core configuration and execution commands that drive the project.")

    add_caption("Table A.1: Project links and repositories")
    t_pl = doc.add_table(rows=3, cols=2)
    t_pl_data = [
        ("Local Web UI", "http://localhost:3000"),
        ("Backend REST API", "http://localhost:5000/api/health")
    ]
    t_pl.rows[0].cells[0].paragraphs[0].text = "Item"
    t_pl.rows[0].cells[1].paragraphs[0].text = "Link"
    for idx, (it, lk) in enumerate(t_pl_data, start=1):
        t_pl.rows[idx].cells[0].paragraphs[0].text = it
        t_pl.rows[idx].cells[1].paragraphs[0].text = lk
    format_table(t_pl, [Inches(2.5), Inches(4.0)], header_bg="F2F2F2")

    add_heading2("A1.1 Root package.json")
    p_code1 = doc.add_paragraph()
    r_c1 = p_code1.add_run(
        "{\n"
        '  "name": "trip-management-system",\n'
        '  "version": "1.0.0",\n'
        '  "scripts": {\n'
        '    "start:backend": "cd backend && npm start",\n'
        '    "start:frontend": "cd frontend && npm run dev",\n'
        '    "test:backend": "cd backend && npm test",\n'
        '    "build:frontend": "cd frontend && npm run build"\n'
        "  }\n"
        "}"
    )
    r_c1.font.name = "Courier New"
    r_c1.font.size = Pt(8.5)

    add_heading2("A1.2 Execution Commands")
    p_code2 = doc.add_paragraph()
    r_c2 = p_code2.add_run(
        "# Terminal 1: Start Backend API (Port 5000)\n"
        "cd backend\n"
        "npm install\n"
        "npm start\n\n"
        "# Terminal 2: Start Frontend Web UI (Port 3000)\n"
        "cd frontend\n"
        "npm install\n"
        "npm run dev\n\n"
        "# Terminal 3: Run Automated Verification Suite\n"
        "cd backend\n"
        "npm test"
    )
    r_c2.font.name = "Courier New"
    r_c2.font.size = Pt(8.5)

    add_heading2("A1.3 Seeded Demo Accounts")
    add_caption("Table A.2: Seeded demo accounts for local development")
    t_da = doc.add_table(rows=3, cols=4)
    t_da_data = [
        ("Traveler", "Alex Morgan", "traveler@example.com", "pass123"),
        ("Govt Official", "Director Robert Hayes", "official@govt.gov", "admin123")
    ]
    t_da.rows[0].cells[0].paragraphs[0].text = "Role"
    t_da.rows[0].cells[1].paragraphs[0].text = "Name"
    t_da.rows[0].cells[2].paragraphs[0].text = "E-mail"
    t_da.rows[0].cells[3].paragraphs[0].text = "Password"
    for idx, (rl, nm, em, pw) in enumerate(t_da_data, start=1):
        t_da.rows[idx].cells[0].paragraphs[0].text = rl
        t_da.rows[idx].cells[1].paragraphs[0].text = nm
        t_da.rows[idx].cells[2].paragraphs[0].text = em
        t_da.rows[idx].cells[3].paragraphs[0].text = pw
    format_table(t_da, [Inches(1.5), Inches(1.8), Inches(2.2), Inches(1.0)], header_bg="F2F2F2")

    add_body("These credentials are provided for evaluation purposes and demonstrate full role-based access control.", italic=True)

    doc.add_page_break()

    print("Generating Appendix 2: Output Screenshots & Screen Descriptions")
    # APPENDIX 2 – OUTPUT SCREENSHOTS AND APPLICATION SCREENS (Page 28 - 30)
    add_title("APPENDIX 2 – OUTPUT SCREENSHOTS AND APPLICATION SCREENS")

    add_body("The screens described below illustrate key user interfaces captured from the live application.")

    app_screens = [
        ("Figure A.1: TripFlow Home and Landing Screen", "Presents the application branding, project overview, and one-click demo access buttons."),
        ("Figure A.2: User Authentication and Login Page (GK-3)", "Enforces email/password credential validation, JWT token issuance, and password masking."),
        ("Figure A.3: Traveler Dashboard with Active & Draft Itineraries (GK-8, 13)", "Displays total journeys, draft trips, submitted records, and budget summary cards."),
        ("Figure A.4: Itinerary Details, Visited Places & Photos (GK-9, 10)", "Detailed view allowing tourists to record sights, visit dates, experience star ratings, and photo evidence."),
        ("Figure A.5: Trip Submission & Compliance Lock Modal (GK-12)", "Interactive confirmation dialog validating place count and transitioning status to 'Submitted'."),
        ("Figure A.6: Government Submitted Records Audit Registry (GK-16, 17)", "Official tabular view with real-time search across travelers and destinations, including dossier inspection modal."),
        ("Figure A.7: Tourism Destination Intelligence & Temporal Activity (GK-19, 20)", "Analytics dashboard highlighting destination rankings, daily travel density timelines, and auditor photo gallery.")
    ]

    for fig_title, fig_desc in app_screens:
        add_heading2(fig_title)
        add_body(f"Description: {fig_desc}")

    doc.add_page_break()

    print("Generating Reference & SDG Mapping")
    # REFERENCE (Page 31)
    add_title("REFERENCE")

    refs = [
        "[1] Schwaber, K. and Sutherland, J., “The Scrum Guide,” Scrum.org, 2020. https://scrumguides.org/",
        "[2] Sommerville, I., Software Engineering, 10th ed., Pearson, 2016.",
        "[3] Pressman, R. S. and Maxim, B. R., Software Engineering: A Practitioner’s Approach, 9th ed., McGraw-Hill, 2019.",
        "[4] React Team, “React 18 Documentation.” https://react.dev/",
        "[5] Vite Team, “Vite Documentation.” https://vite.dev/guide/",
        "[6] Tailwind Labs, “Tailwind CSS Documentation.” https://tailwindcss.com/docs",
        "[7] OpenJS Foundation, “Express – Node.js Web Application Framework.” https://expressjs.com/",
        "[8] OpenJS Foundation, “Node.js Documentation.” https://nodejs.org/docs/",
        "[9] Jones, M., Bradley, J. and Sakimura, N., “JSON Web Token (JWT),” RFC 7519, Internet Engineering Task Force, 2015. https://www.rfc-editor.org/rfc/rfc7519",
        "[10] OWASP Foundation, “OWASP Top 10: 2021 Security Risks.” https://owasp.org/Top10/2021/",
        "[11] MDN Web Docs, “Fetch API and HTTP Request Handling.” https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API",
        "[12] United Nations, “The 17 Sustainable Development Goals.” https://sdgs.un.org/goals"
    ]

    for ref in refs:
        p_ref = doc.add_paragraph()
        p_ref.paragraph_format.space_before = Pt(2)
        p_ref.paragraph_format.space_after = Pt(4)
        p_ref.paragraph_format.line_spacing = 1.15
        r_r = p_ref.add_run(ref)
        r_r.font.name = "Times New Roman"
        r_r.font.size = Pt(10)

    p_space = doc.add_paragraph()
    p_space.paragraph_format.space_before = Pt(14)

    # MAPPING OF PROJECT GOALS TO SDG (Page 32)
    add_title("MAPPING OF PROJECT GOALS TO SDG")

    add_body("The Trip Management System directly contributes to the United Nations Sustainable Development Goals (SDG):")

    add_caption("Table S.1: Mapping of project goals to Sustainable Development Goals")
    t_sdg = doc.add_table(rows=5, cols=3)
    t_sdg_data = [
        ("SDG 8", "Decent Work and Economic Growth", "Promotes local tourism ecosystems by providing digital tools to highlight regional destinations and tourist attractions."),
        ("SDG 9", "Industry, Innovation and Infrastructure", "Demonstrates modern web application engineering, RESTful APIs, and digital travel compliance infrastructure."),
        ("SDG 11", "Sustainable Cities and Communities", "Supports municipal and regional tourism management through temporal tourist density tracking and destination planning."),
        ("SDG 12", "Responsible Consumption and Production", "Eliminates physical paper declarations and manual travel registers through paperless digital itineraries and compliance locks.")
    ]
    t_sdg.rows[0].cells[0].paragraphs[0].text = "SDG"
    t_sdg.rows[0].cells[1].paragraphs[0].text = "Goal"
    t_sdg.rows[0].cells[2].paragraphs[0].text = "Contribution"
    for idx, (sd, gl, cb) in enumerate(t_sdg_data, start=1):
        t_sdg.rows[idx].cells[0].paragraphs[0].text = sd
        t_sdg.rows[idx].cells[1].paragraphs[0].text = gl
        t_sdg.rows[idx].cells[2].paragraphs[0].text = cb
    format_table(t_sdg, [Inches(1.0), Inches(2.3), Inches(3.2)], header_bg="F2F2F2")

    output_file = r"C:\Users\riyaz\.gemini\antigravity\scratch\trip-management-system\Trip_Management_System_Project_Report.docx"
    doc.save(output_file)
    print(f"Report generated successfully: {output_file}")

if __name__ == "__main__":
    create_report()
