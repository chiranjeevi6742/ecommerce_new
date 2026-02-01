import os
import sys

try:
    # Add the parent directory to sys.path
    # Add the parent directory to sys.path
    current_dir = os.path.dirname(os.path.abspath(__file__))
    parent_dir = os.path.dirname(current_dir) # Should go up one level to 'backend'
    sys.path.append(parent_dir)
    
    print(f"DEBUG: sys.path: {sys.path}")
    print(f"DEBUG: Listing parent dir content: {os.listdir(parent_dir)}")
    
    from app.main import app
except Exception as e:
    import traceback
    print("CRITICAL ERROR IMPORTING APP:")
    traceback.print_exc()
    raise e
