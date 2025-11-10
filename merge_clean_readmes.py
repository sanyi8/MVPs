import os
import re

def clean_and_merge_readmes(base_path="./"):
    projects = [p for p in os.listdir(base_path)
                if os.path.isdir(os.path.join(base_path, p)) and not p.startswith('.')]

    for project in projects:
        project_path = os.path.join(base_path, project)
        readme_path = os.path.join(project_path, "README.md")
        readme2_path = os.path.join(project_path, "README2.md")

        # csak ha mindkettő létezik
        if os.path.exists(readme_path) and os.path.exists(readme2_path):
            with open(readme_path, "r", encoding="utf-8", errors="ignore") as f1:
                content1 = f1.read()
            with open(readme2_path, "r", encoding="utf-8", errors="ignore") as f2:
                content2 = f2.read()

            # --- AI-stílusú egyesítés logika ---
            merged = f"{content1.strip()}\n\n---\n\n{content2.strip()}"

            # törli duplikált sorokat, duplikált szakaszokat
            merged_lines = []
            seen = set()
            for line in merged.splitlines():
                line_clean = re.sub(r'\s+', ' ', line.strip().lower())
                if line_clean not in seen:
                    seen.add(line_clean)
                    merged_lines.append(line)
            merged_text = "\n".join(merged_lines)

            # --- tisztított új README mentése ---
            with open(readme_path, "w", encoding="utf-8") as f:
                f.write(merged_text)
            os.remove(readme2_path)  # törli a README2-t

            print(f"✅ Clean merged README created for {project}")
        elif os.path.exists(readme2_path):
            # ha csak README2 van
            os.rename(readme2_path, readme_path)
            print(f"ℹ️ Only README2 found, renamed to README.md for {project}")
        else:
            print(f"⚠️ No README files found for {project}")

    print("\n📘 All README files cleaned and unified.")

if __name__ == "__main__":
    clean_and_merge_readmes()
