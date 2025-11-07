import os
import re

def detect_stack_and_purpose(project_path):
    files = os.listdir(project_path)
    stack = []
    purpose = "Experimental MVP project."

    # --- detect tech stack ---
    if any(f.endswith('.py') for f in files): stack.append('Python')
    if any(f.endswith('.ts') for f in files): stack.append('TypeScript')
    if any(f.endswith('.js') for f in files): stack.append('JavaScript')
    if any(f.endswith('.html') for f in files): stack.append('HTML')
    if any(f.endswith('.css') for f in files): stack.append('CSS')

    # --- detect environments / frameworks ---
    if 'pyproject.toml' in files or 'requirements.txt' in files: stack.append('Flask / FastAPI')
    if '.replit' in files: stack.append('Replit runtime')
    if 'package.json' in files: stack.append('Node.js environment')
    if 'templates' in os.listdir(project_path): stack.append('Jinja2 templating')
    if 'static' in os.listdir(project_path): stack.append('Frontend assets')

    # --- read code to detect purpose ---
    for file in files:
        if file.endswith('.py'):
            try:
                with open(os.path.join(project_path, file), 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read().lower()
                    if 'openai' in content: stack.append('OpenAI API')
                    if 'flask' in content: stack.append('Flask web framework')
                    if 'streamlit' in content: stack.append('Streamlit app')
                    if 'fastapi' in content: stack.append('FastAPI')
                    # purpose inference
                    if re.search(r'cv|resume', content): purpose = 'AI-tailored CV or career tool.'
                    elif re.search(r'alcohol|drink|beer|ml|abv', content): purpose = 'Health tracker for alcohol awareness.'
                    elif re.search(r'zodiac|astro|sign|birth', content): purpose = 'Astrology and personality insight app.'
                    elif re.search(r'timeline|milestone|portfolio', content): purpose = 'UX timeline or portfolio visualisation.'
                    elif re.search(r'task|todo|manager', content): purpose = 'Productivity or task manager tool.'
            except Exception:
                continue

    # --- detect preview image ---
    image = None
    for f in files:
        if f.lower().endswith(('.png', '.jpg', '.jpeg')):
            image = f
            break

    return ', '.join(sorted(set(stack))), purpose, image


def generate_readme(project_path):
    project_name = os.path.basename(project_path)
    stack, purpose, image = detect_stack_and_purpose(project_path)
    image_section = f"![Preview]({image})\n\n" if image else ""

    readme_content = f"""# {project_name}

{image_section}
**Purpose:** {purpose}  
**Tech Stack:** {stack}

---

### 🧠 Summary
Part of my AI + Low-Code MVP collection.  
Each project was built and refined in Replit — usually in less than a day — to test automation and product ideas fast.

---

### 🧩 Built by
[Sandor Kardos](https://www.linkedin.com/in/sandor-kardos/)  
[Portfolio](https://sandorkardos.com)
"""

    readme_path = os.path.join(project_path, "README.md")
    readme2_path = os.path.join(project_path, "README2.md")

    # --- check existing README behaviour ---
    if os.path.exists(readme_path):
        # if exists, create README2.md instead of overwriting
        with open(readme2_path, "w", encoding="utf-8") as f:
            f.write(readme_content)
        print(f"🟡 README.md already exists, created README2.md for {project_name}")
    else:
        # otherwise create new README.md
        with open(readme_path, "w", encoding="utf-8") as f:
            f.write(readme_content)
        print(f"✅ README.md created for {project_name}")

    return project_name, purpose, stack, image


def generate_master_readme(base_path, summaries):
    content = """# 🧠 MVP Portfolio

A collection of **AI-powered, low-code MVPs** built in **Replit** to quickly bring ideas to life.  
Each prototype was designed, developed, and fine-tuned in **under a day** — combining design, automation, and product thinking.

---

## 🚀 Projects
"""
    for project, (purpose, stack, image) in summaries.items():
        preview = f"![{project}]({project}/{image})\n" if image else ""
        content += f"### [{project}](./{project})\n{preview}\n"
        content += f"**Purpose:** {purpose}\n\n**Tech Stack:** {stack}\n\n---\n"

    content += """
## ⚙️ About
All projects are rapid MVP experiments — small systems combining **design, automation, and AI** to solve real problems fast.

---

## 🌐 Connect
💼 [LinkedIn](https://www.linkedin.com/in/sandor-kardos/)  
🌍 [sandorkardos.com](https://sandorkardos.com)
"""
    with open(os.path.join(base_path, "README.md"), "w", encoding="utf-8") as f:
        f.write(content)
    print("📘 Master README updated.")


# === main ===
base_path = "./"
projects = [p for p in os.listdir(base_path)
            if os.path.isdir(os.path.join(base_path, p)) and not p.startswith('.')]

summaries = {}
for project in projects:
    try:
        project_path = os.path.join(base_path, project)
        project_name, purpose, stack, image = project, *detect_stack_and_purpose(project_path)
        generate_readme(project_path)
        summaries[project_name] = (purpose, stack, image)
    except Exception as e:
        print(f"⚠️ Error with {project}: {e}")

generate_master_readme(base_path, summaries)
