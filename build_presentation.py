import sys
from pptx import Presentation
from pptx.util import Pt
from pptx.dml.color import RGBColor

input_path = r"C:\Users\riyaz\.gemini\antigravity\brain\27239e96-0aa1-4bf8-b873-df908bf8db48\.user_uploaded\media_1793252382884_6e030dc9.pptx"
output_path = r"C:\Users\riyaz\.gemini\antigravity\scratch\trip-management-system\Trip_Management_System_Presentation.pptx"

prs = Presentation(input_path)

def find_shape(slide, name):
    for shape in slide.shapes:
        if shape.name == name:
            return shape
    return None

def set_paragraphs(shape, paragraph_specs):
    tf = shape.text_frame
    tf.clear()
    
    for i, spec in enumerate(paragraph_specs):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        run = p.add_run()
        run.text = spec.get('text', '')
        
        if 'font' in spec and spec['font']:
            run.font.name = spec['font']
        else:
            run.font.name = 'Times New Roman'
            
        if 'size' in spec and spec['size']:
            run.font.size = spec['size']
            
        if 'bold' in spec and spec['bold'] is not None:
            run.font.bold = spec['bold']
            
        if 'color' in spec and spec['color']:
            run.font.color.rgb = spec['color']

print("Updating Slide 1: Title Slide")
s1 = prs.slides[0]

# Update Project Title
title_shape = find_shape(s1, "Project title")
if title_shape:
    set_paragraphs(title_shape, [
        {'text': "TRIP MANAGEMENT SYSTEM (TMS)", 'size': Pt(24), 'bold': True, 'color': None},
        {'text': "AGILE SCRUM PROJECT REVIEW", 'size': Pt(20), 'bold': True, 'color': RGBColor(0x59, 0xA5, 0xC5)},
        {'text': "OCTOBER 2026", 'size': Pt(18), 'bold': True, 'color': RGBColor(0x59, 0xA5, 0xC5)}
    ])

# Update Presented By with the user's team members
pres_shape = find_shape(s1, "Presented by")
if pres_shape:
    set_paragraphs(pres_shape, [
        {'text': "PRESENTED BY", 'size': Pt(14), 'bold': True, 'color': RGBColor(0x26, 0x26, 0x26)},
        {'text': "DHARWISH AHAMED R  -  24CSR065", 'size': Pt(13), 'bold': False, 'color': RGBColor(0x26, 0x26, 0x26)},
        {'text': "GOWTHAM K                     -  24CSR083", 'size': Pt(13), 'bold': False, 'color': RGBColor(0x26, 0x26, 0x26)},
        {'text': "GUNAVARMAN M S           -  24CSR086", 'size': Pt(13), 'bold': False, 'color': RGBColor(0x26, 0x26, 0x26)},
        {'text': "GURUPRASAD S S             -  24CSR088", 'size': Pt(13), 'bold': False, 'color': RGBColor(0x26, 0x26, 0x26)}
    ])

print("Updating Slide 2: Introduction & Objectives")
s2 = prs.slides[1]
intro_shape = find_shape(s2, "Intro panel")
if intro_shape:
    set_paragraphs(intro_shape, [
        {'text': "Introduction", 'size': Pt(16), 'bold': True, 'color': RGBColor(0x11, 0x18, 0x27)},
        {'text': "Trip Management System is a full-stack web application that digitizes tourist itineraries and streamlines travel compliance records.", 'size': Pt(12), 'bold': False, 'color': RGBColor(0x37, 0x41, 0x51)},
        {'text': "It connects two primary users: International / Domestic Travelers and Government Tourism & Audit Authorities.", 'size': Pt(12), 'bold': False, 'color': RGBColor(0x37, 0x41, 0x51)},
        {'text': "One workflow links registration, itinerary creation, landmark logging, photo documentation, compliance submission, and audit analytics.", 'size': Pt(12), 'bold': False, 'color': RGBColor(0x37, 0x41, 0x51)}
    ])

obj_texts = [
    "Make travel itinerary planning and budget tracking convenient for tourists.",
    "Improve landmark logging with visited dates, notes, and experience ratings.",
    "Maintain digital records of all journeys with photographic evidence.",
    "Provide better tourist density and destination visibility for authorities.",
    "Support transparent government monitoring of submitted travel activities."
]

for idx, txt in enumerate(obj_texts, start=1):
    obj_shape = find_shape(s2, f"Objective text {idx}")
    if obj_shape:
        set_paragraphs(obj_shape, [
            {'text': txt, 'size': Pt(12), 'bold': False, 'color': RGBColor(0x26, 0x26, 0x26)}
        ])

print("Updating Slide 3: Users and Modules")
s3 = prs.slides[2]

# Role 1: Traveler
r1_head = find_shape(s3, "Role head 1")
if r1_head:
    set_paragraphs(r1_head, [{'text': "Traveler", 'size': Pt(14), 'bold': True, 'color': RGBColor(0x11, 0x18, 0x27)}])
r1_badge = find_shape(s3, "Role badge 1")
if r1_badge:
    set_paragraphs(r1_badge, [{'text': "T", 'size': Pt(14), 'bold': True, 'color': RGBColor(0xFF, 0xFF, 0xFF)}])
r1_list = find_shape(s3, "Role list 1")
if r1_list:
    set_paragraphs(r1_list, [
        {'text': "Register and log in securely", 'size': Pt(11), 'bold': False, 'color': RGBColor(0x37, 0x41, 0x51)},
        {'text': "Create and customize trip itineraries", 'size': Pt(11), 'bold': False, 'color': RGBColor(0x37, 0x41, 0x51)},
        {'text': "Log visited places with dates and ratings", 'size': Pt(11), 'bold': False, 'color': RGBColor(0x37, 0x41, 0x51)},
        {'text': "Upload photos and submit trips for audit", 'size': Pt(11), 'bold': False, 'color': RGBColor(0x37, 0x41, 0x51)}
    ])

# Role 2: Government Official
r2_head = find_shape(s3, "Role head 2")
if r2_head:
    set_paragraphs(r2_head, [{'text': "Government Authority", 'size': Pt(14), 'bold': True, 'color': RGBColor(0x11, 0x18, 0x27)}])
r2_badge = find_shape(s3, "Role badge 2")
if r2_badge:
    set_paragraphs(r2_badge, [{'text': "G", 'size': Pt(14), 'bold': True, 'color': RGBColor(0xFF, 0xFF, 0xFF)}])
r2_list = find_shape(s3, "Role list 2")
if r2_list:
    set_paragraphs(r2_list, [
        {'text': "Access central submitted travel registry", 'size': Pt(11), 'bold': False, 'color': RGBColor(0x37, 0x41, 0x51)},
        {'text': "Search and filter records across travelers", 'size': Pt(11), 'bold': False, 'color': RGBColor(0x37, 0x41, 0x51)},
        {'text': "Inspect trip itineraries, places and media", 'size': Pt(11), 'bold': False, 'color': RGBColor(0x37, 0x41, 0x51)},
        {'text': "Monitor tourist volume and compliance", 'size': Pt(11), 'bold': False, 'color': RGBColor(0x37, 0x41, 0x51)}
    ])

# Role 3: Tourism Auditor
r3_head = find_shape(s3, "Role head 3")
if r3_head:
    set_paragraphs(r3_head, [{'text': "Tourism Auditor", 'size': Pt(14), 'bold': True, 'color': RGBColor(0x11, 0x18, 0x27)}])
r3_badge = find_shape(s3, "Role badge 3")
if r3_badge:
    set_paragraphs(r3_badge, [{'text': "A", 'size': Pt(14), 'bold': True, 'color': RGBColor(0xFF, 0xFF, 0xFF)}])
r3_list = find_shape(s3, "Role list 3")
if r3_list:
    set_paragraphs(r3_list, [
        {'text': "Analyze destination popularity metrics", 'size': Pt(11), 'bold': False, 'color': RGBColor(0x37, 0x41, 0x51)},
        {'text': "Track travel activity by calendar date", 'size': Pt(11), 'bold': False, 'color': RGBColor(0x37, 0x41, 0x51)},
        {'text': "Audit photographic logs in media gallery", 'size': Pt(11), 'bold': False, 'color': RGBColor(0x37, 0x41, 0x51)},
        {'text': "Generate compliance and density reports", 'size': Pt(11), 'bold': False, 'color': RGBColor(0x37, 0x41, 0x51)}
    ])

# Core Modules
modules_map = {
    "Module 1": "Registration & Login (JWT)",
    "Module 2": "Trip Itinerary Management",
    "Module 3": "Visited Places & Landmarks",
    "Module 4": "Photo & Narrative Logging",
    "Module 5": "Submission & Compliance Lock",
    "Module 6": "Previous Trips Archive",
    "Module 7": "Government Audit Registry",
    "Module 8": "Search & Multi-Filter Engine",
    "Module 9": "Destination Intelligence",
    "Module 10": "Activity by Date & Gallery"
}

for mod_name, mod_text in modules_map.items():
    m_shape = find_shape(s3, mod_name)
    if m_shape:
        set_paragraphs(m_shape, [{'text': mod_text, 'size': Pt(10), 'bold': False, 'color': RGBColor(0x26, 0x26, 0x26)}])

print("Updating Slide 4: Use Case Diagram")
s4 = prs.slides[3]
sys_label = find_shape(s4, "System label")
if sys_label:
    set_paragraphs(sys_label, [{'text': "Trip Management System", 'size': Pt(14), 'bold': True, 'color': RGBColor(0x11, 0x18, 0x27)}])

uc_map = {
    "UC Beneficiary 1": "Register / Login",
    "UC Beneficiary 2": "Create Trip & Set Budget",
    "UC Beneficiary 3": "Add Visited Places & Notes",
    "UC Beneficiary 4": "Upload Photos & Captions",
    "UC FPS 1": "Edit / Delete Draft Trips",
    "UC FPS 2": "Submit Trip for Audit",
    "UC FPS 3": "Search & Filter Records",
    "UC FPS 4": "Inspect Submitted Dossiers",
    "UC Generate QR": "Compliance Lock (Submitted)",
    "UC Admin 1": "Monitor Destination Stats",
    "UC Admin 2": "Audit Date Activity & Photos",
    "Beneficiary label": "Traveler",
    "FPS Owner label": "Compliance Lock",
    "Administrator label": "Govt Authority",
    "Legend": "Dashed arrows: Compliance submission flow"
}

for sh_name, sh_text in uc_map.items():
    sh = find_shape(s4, sh_name)
    if sh:
        is_bold = True if "label" in sh_name else False
        sz = Pt(12) if "label" in sh_name else (Pt(9) if "Legend" in sh_name else Pt(10))
        set_paragraphs(sh, [{'text': sh_text, 'size': sz, 'bold': is_bold, 'color': RGBColor(0x26, 0x26, 0x26)}])

print("Updating Slide 5: System Workflow")
s5 = prs.slides[4]
flow_lanes = {
    "Lane label Beneficiary": "Traveler",
    "Lane label System": "TripFlow System",
    "Lane label FPS Owner": "Compliance Lock",
    "Lane label Administrator": "Govt Authority"
}
for lane_name, lane_text in flow_lanes.items():
    l_sh = find_shape(s5, lane_name)
    if l_sh:
        set_paragraphs(l_sh, [{'text': lane_text, 'size': Pt(12), 'bold': True, 'color': RGBColor(0x11, 0x18, 0x27)}])

flow_steps = {
    "Step 1": "Register & Login (GK-2, 3)",
    "Step 2": "Create Trip Draft (GK-8)",
    "Step 3": "Log Places & Notes (GK-9)",
    "Step 4": "Attach Photos & Logs (GK-10)",
    "Step 5": "Submit Trip to Govt (GK-12)",
    "Step 6": "Search & Audit Dossiers (GK-16, 17)",
    "Step 7": "Destination & Date Analytics (GK-19, 20)"
}
for step_name, step_text in flow_steps.items():
    st_sh = find_shape(s5, step_name)
    if st_sh:
        set_paragraphs(st_sh, [{'text': step_text, 'size': Pt(10), 'bold': False, 'color': RGBColor(0x26, 0x26, 0x26)}])

print("Updating Slide 6: System Architecture")
s6 = prs.slides[5]
t1 = find_shape(s6, "Tier 1")
if t1:
    set_paragraphs(t1, [
        {'text': "Presentation Layer", 'size': Pt(12), 'bold': True, 'color': RGBColor(0x11, 0x18, 0x27)},
        {'text': "Frontend: React 18, Vite, Tailwind CSS", 'size': Pt(11), 'bold': False, 'color': RGBColor(0x37, 0x41, 0x51)}
    ])

t2 = find_shape(s6, "Tier 2")
if t2:
    set_paragraphs(t2, [
        {'text': "Application Layer", 'size': Pt(12), 'bold': True, 'color': RGBColor(0x11, 0x18, 0x27)},
        {'text': "Backend: Node.js, Express.js REST APIs", 'size': Pt(11), 'bold': False, 'color': RGBColor(0x37, 0x41, 0x51)}
    ])

t3 = find_shape(s6, "Tier 3")
if t3:
    set_paragraphs(t3, [
        {'text': "Data & Security Layer", 'size': Pt(12), 'bold': True, 'color': RGBColor(0x11, 0x18, 0x27)},
        {'text': "JWT Authentication, Bcrypt, JSON Store", 'size': Pt(11), 'bold': False, 'color': RGBColor(0x37, 0x41, 0x51)}
    ])

req_flow = find_shape(s6, "Request flow")
if req_flow:
    set_paragraphs(req_flow, [
        {'text': "Request flow", 'size': Pt(13), 'bold': True, 'color': RGBColor(0x11, 0x18, 0x27)},
        {'text': "Frontend sends authenticated REST API calls with JWT Bearer tokens.", 'size': Pt(11), 'bold': False, 'color': RGBColor(0x37, 0x41, 0x51)},
        {'text': "Express.js applies business logic, RBAC, and data validation.", 'size': Pt(11), 'bold': False, 'color': RGBColor(0x37, 0x41, 0x51)},
        {'text': "Persistent store safely saves and retrieves traveler records & media.", 'size': Pt(11), 'bold': False, 'color': RGBColor(0x37, 0x41, 0x51)}
    ])

stored_rec = find_shape(s6, "Stored records")
if stored_rec:
    set_paragraphs(stored_rec, [
        {'text': "Stored records", 'size': Pt(13), 'bold': True, 'color': RGBColor(0x11, 0x18, 0x27)},
        {'text': "Users & role credentials (travelers, officials)", 'size': Pt(11), 'bold': False, 'color': RGBColor(0x37, 0x41, 0x51)},
        {'text': "Trips, destinations, budgets, and travel dates", 'size': Pt(11), 'bold': False, 'color': RGBColor(0x37, 0x41, 0x51)},
        {'text': "Visited waypoints, landmark notes, and ratings", 'size': Pt(11), 'bold': False, 'color': RGBColor(0x37, 0x41, 0x51)},
        {'text': "Photo logs, captions, and audit timestamps", 'size': Pt(11), 'bold': False, 'color': RGBColor(0x37, 0x41, 0x51)}
    ])

print("Updating Slide 7: Agile Sprint Plan")
s7 = prs.slides[6]

sprints = [
    ("Sprint 1: Access & Initiation", "GK-2 Signup, GK-3 Login, GK-8 Create Trip (8 SP)"),
    ("Sprint 2: Itinerary & Submit", "GK-9 Places, GK-10 Photos, GK-12 Submit Trip (10 SP)"),
    ("Sprint 3: History & Ingestion", "GK-13 Previous Trip, GK-14 CRUD, GK-16 Records (11 SP)"),
    ("Sprint 4: Search & Analytics", "GK-17 Search & Filter, GK-19 Destination Metrics (6 SP)"),
    ("Sprint 4: Temporal Tracking", "GK-20 View travel activity by date & timeline (3 SP)"),
    ("Backlog: Visual Evidence", "GK-21 View photos/descriptions in gallery (3 SP)"),
    ("Verification & Testing", "Automated end-to-end API test suite passed (100%)")
]

for idx, (sp_title, sp_text) in enumerate(sprints, start=1):
    st_title = find_shape(s7, f"Sprint title {idx}")
    if st_title:
        set_paragraphs(st_title, [{'text': sp_title, 'size': Pt(11), 'bold': True, 'color': RGBColor(0x11, 0x18, 0x27)}])
    st_desc = find_shape(s7, f"Sprint text {idx}")
    if st_desc:
        set_paragraphs(st_desc, [{'text': sp_text, 'size': Pt(10), 'bold': False, 'color': RGBColor(0x4B, 0x55, 0x63)}])

agile_panel = find_shape(s7, "Agile panel")
if agile_panel:
    set_paragraphs(agile_panel, [
        {'text': "Agile-oriented approach", 'size': Pt(13), 'bold': True, 'color': RGBColor(0x11, 0x18, 0x27)},
        {'text': "Incremental sprints deliver all 13 user stories across Traveler and Government modules.", 'size': Pt(11), 'bold': False, 'color': RGBColor(0x37, 0x41, 0x51)}
    ])

print("Updating Slide 8: Technology and Benefits")
s8 = prs.slides[7]
t_head = find_shape(s8, "Tech heading")
if t_head:
    set_paragraphs(t_head, [{'text': "Technology stack", 'size': Pt(14), 'bold': True, 'color': RGBColor(0x11, 0x18, 0x27)}])

tech_items = [
    ("Tech 1", "FRONTEND\nReact 18, Vite, Tailwind CSS, Lucide Icons"),
    ("Tech 2", "BACKEND\nNode.js, Express.js REST APIs"),
    ("Tech 3", "SECURITY & DATA\nJWT, Bcrypt.js, Structured Document Store"),
    ("Tech 4", "INTEGRATION\nRESTful APIs with Role-Based Access Control")
]
for t_id, t_text in tech_items:
    sh = find_shape(s8, t_id)
    if sh:
        lines = t_text.split('\n')
        set_paragraphs(sh, [
            {'text': lines[0], 'size': Pt(11), 'bold': True, 'color': RGBColor(0x11, 0x18, 0x27)},
            {'text': lines[1], 'size': Pt(10), 'bold': False, 'color': RGBColor(0x4B, 0x55, 0x63)}
        ])

ben = find_shape(s8, "Benefits")
if ben:
    set_paragraphs(ben, [
        {'text': "Benefits", 'size': Pt(14), 'bold': True, 'color': RGBColor(0x11, 0x18, 0x27)},
        {'text': "Convenient digital itinerary planning & landmark logging", 'size': Pt(11), 'bold': False, 'color': RGBColor(0x37, 0x41, 0x51)},
        {'text': "Eliminates paperwork with verified digital submission lock", 'size': Pt(11), 'bold': False, 'color': RGBColor(0x37, 0x41, 0x51)},
        {'text': "Real-time destination analytics and tourist distribution tracking", 'size': Pt(11), 'bold': False, 'color': RGBColor(0x37, 0x41, 0x51)},
        {'text': "Transparent monitoring via temporal date views & photo audit", 'size': Pt(11), 'bold': False, 'color': RGBColor(0x37, 0x41, 0x51)}
    ])

conc = find_shape(s8, "Conclusion")
if conc:
    set_paragraphs(conc, [
        {'text': "Conclusion", 'size': Pt(14), 'bold': True, 'color': RGBColor(0x11, 0x18, 0x27)},
        {'text': "Centralized, role-based digital travel management platform", 'size': Pt(11), 'bold': False, 'color': RGBColor(0x37, 0x41, 0x51)},
        {'text': "Registration to compliance audit in one seamless workflow", 'size': Pt(11), 'bold': False, 'color': RGBColor(0x37, 0x41, 0x51)},
        {'text': "Modern web technologies deliver speed, security & high reliability", 'size': Pt(11), 'bold': False, 'color': RGBColor(0x37, 0x41, 0x51)}
    ])

print("Updating Slide 9: Thank You Slide")
s9 = prs.slides[8]
proj_name = find_shape(s9, "Project name")
if proj_name:
    set_paragraphs(proj_name, [{'text': "TRIP MANAGEMENT SYSTEM (TMS)", 'size': Pt(22), 'bold': True, 'color': None}])

links = find_shape(s9, "Links")
if links:
    set_paragraphs(links, [
        {'text': "Objective: Convenient, digital and transparent travel planning and compliance monitoring", 'size': Pt(12), 'bold': False, 'color': RGBColor(0x4B, 0x55, 0x63)},
        {'text': "Users: International & Domestic Travelers, Government Tourism Authorities", 'size': Pt(12), 'bold': False, 'color': RGBColor(0x4B, 0x55, 0x63)}
    ])

prs.save(output_path)
print(f"Presentation successfully saved to: {output_path}")
