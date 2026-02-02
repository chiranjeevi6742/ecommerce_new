import os
import sys
import subprocess

# --- SELF-HEALING DEPENDENCY CHECK ---
def ensure_dependencies():
    """
    Vercel sometimes fails to install specific packages (like razorpay)
    due to build-time complexities. This function manually checks and installs
    missing critical packages at runtime if they are absent.
    """
    required_packages = ["razorpay"]
    
    for package in required_packages:
        try:
            __import__(package)
            print(f"DEBUG: {package} is already installed.")
        except ImportError:
            print(f"WARNING: {package} not found. Attempting runtime install...")
            try:
                subprocess.check_call([sys.executable, "-m", "pip", "install", package, "--target", "/tmp/packages"])
                sys.path.append("/tmp/packages")
                print(f"SUCCESS: Runtime installed {package}")
            except Exception as e:
                print(f"CRITICAL: Failed to runtime install {package}: {e}")

# Run the check before importing app
ensure_dependencies()

try:
    # Add the parent directory to sys.path
    current_dir = os.path.dirname(os.path.abspath(__file__))
    parent_dir = os.path.dirname(current_dir) # Should go up one level to 'backend'
    sys.path.insert(0, parent_dir)
    
    from app.main import app
    
    # Add a debug route to list installed packages
    from fastapi import Response
    import pkg_resources
    
    @app.get("/debug-env")
    def debug_env():
        installed_packages = [f"{p.project_name}=={p.version}" for p in pkg_resources.working_set]
        return {"packages": installed_packages, "sys_path": sys.path}

except Exception as e:
    import traceback
    error_msg = traceback.format_exc()
    print("CRITICAL ERROR IMPORTING APP:")
    print(error_msg)
    
    # Fallback app to show error in browser
    from fastapi import FastAPI, Response
    app = FastAPI()

    @app.get("/{catchall:path}")
    def show_error(catchall: str):
        return Response(content=f"<h1>Startup Error</h1><pre>{error_msg}</pre>", media_type="text/html", status_code=500)
