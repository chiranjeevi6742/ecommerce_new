import os
import sys

try:
    # Add the parent directory to sys.path
    current_dir = os.path.dirname(__file__)
    parent_dir = os.path.join(current_dir, '..')
    sys.path.append(parent_dir)
    
    print(f"DEBUG: sys.path: {sys.path}")
    print(f"DEBUG: Listing parent dir content: {os.listdir(parent_dir)}")
    
    from app.main import app
except Exception as e:
    import traceback
    print("CRITICAL ERROR IMPORTING APP:")
    traceback.print_exc()
    raise e
