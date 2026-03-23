import os
import re

def clean_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Skip landing page which should keep the footer
    if 'ProfessionalLandingPage.jsx' in filepath or 'LandingPage' in filepath:
        return

    # Remove the import statement
    new_content = re.sub(r'^\s*import\s+Footer\s+from\s+[^;]+;\s*\n', '', content, flags=re.MULTILINE)
    
    # Remove the <Footer /> tag or <Footer></Footer>
    new_content = re.sub(r'\s*<Footer\s*/?>', '', new_content)
    new_content = re.sub(r'\s*<Footer\s*>.*?</Footer>', '', new_content, flags=re.DOTALL)

    if content != new_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Cleaned {filepath}")

def main():
    base_dir = r"c:\Users\DELL\Desktop\cms\frontend\src\pages"
    for root, dirs, files in os.walk(base_dir):
        for file in files:
            if file.endswith('.jsx'):
                clean_file(os.path.join(root, file))

if __name__ == '__main__':
    main()
