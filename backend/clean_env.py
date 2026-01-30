import os

def clean_env():
    with open(".env", "r", encoding="utf-8") as f:
        lines = f.readlines()
    
    cleaned_lines = []
    for line in lines:
        if "=" in line:
            key, val = line.split("=", 1)
            # Strip whitespace and quotes
            val = val.strip().strip("'").strip('"')
            key = key.strip()
            cleaned_lines.append(f"{key}={val}\n")
    
    with open(".env", "w", encoding="utf-8") as f:
        f.writelines(cleaned_lines)
    print("Cleaned .env file")

if __name__ == "__main__":
    clean_env()
