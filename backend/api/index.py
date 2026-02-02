import os
import sys

try:
    # Add the parent directory to sys.path
    current_dir = os.path.dirname(os.path.abspath(__file__))
    parent_dir = os.path.dirname(current_dir) # Should go up one level to 'backend'
    sys.path.insert(0, parent_dir) # Prioritize local imports
    
    print(f"DEBUG: sys.path: {sys.path}")
    print(f"DEBUG: Listing parent dir content: {os.listdir(parent_dir)}")
    
    from app.main import app

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
