import os
import requests
from dotenv import load_dotenv
import json

# ------------------------------------------------------------------------------
# CONFIGURATION
# ------------------------------------------------------------------------------
load_dotenv()
token = os.getenv("CAVNAS_API_KEY")
CANVAS_BASE_URL = "https://usfca.instructure.com/"
DOWNLOAD_ROOT = './ClassMaterials'

if not os.path.exists(DOWNLOAD_ROOT):
    os.makedirs(DOWNLOAD_ROOT)

os.chdir(os.path.expanduser(DOWNLOAD_ROOT))
# ------------------------------------------------------------------------------


def get_favorite_courses(base_url, token):
    """
    Calls the Canvas endpoint: GET /api/v1/users/self/favorites/courses
    Returns a list of favorite course objects (JSON).
    """
    url = f"{base_url}/api/v1/users/self/favorites/courses"

    # Create a session with the appropriate Authorization header
    session = requests.Session()
    session.headers.update({"Authorization": f"Bearer {token}"})

    # Make the request
    response = session.get(url)
    response.raise_for_status()  # Raise an exception for HTTP errors
    return response.json()       # Return the JSON list of courses


def get_favorite_courses_parsed():
    """Retrieve and print the user's favorite courses."""
    favorites = get_favorite_courses(CANVAS_BASE_URL, token)
    print("Your favorite courses:")
    courses = {}
    for course in favorites:
        print(f"- {course['name']} (ID: {course['id']})")
        courses[course['id']] = course['name']


def get_root_folder_for_course(session, course_id):
    """
    Returns the root folder object for the specified course.
    API endpoint: GET /api/v1/courses/:course_id/folders/root
    """
    url = f"{CANVAS_BASE_URL}/api/v1/courses/{course_id}/folders/root"
    resp = session.get(url)
    if resp.status_code == 200:
        return resp.json()
    else:
        print(f"Error {resp.status_code} getting root folder: {resp.text}")
        return None


def download_folder(session, folder_obj, local_path):
    """
    Recursively download the subfolders & files of the given `folder_obj` into `local_path`.
    `folder_obj` is a JSON dict returned by the Canvas Folders API (it must have 'id', etc.).
    """
    folder_id = folder_obj["id"]
    folder_name = folder_obj["name"]

    # Local folder for this folder_obj
    current_folder_path = os.path.join(
        local_path, sanitize_filename(folder_name))
    os.makedirs(current_folder_path, exist_ok=True)

    # Download files in defined folder
    files = list_files_in_folder(session, folder_id)
    for f in files:
        download_file(session, f, current_folder_path)

    # 2. Downloads subfolders or specified folder
    subfolders = list_subfolders(session, folder_id)
    for sf in subfolders:
        download_folder(session, sf, current_folder_path)


def list_files_in_folder(session, folder_id):
    """
    Return a list of file objects (JSON) for all files in the specified folder.
    API endpoint: GET /api/v1/folders/:folder_id/files
    We also handle pagination if there's more than one page of results.
    """
    files = []
    base_url = f"{CANVAS_BASE_URL}/api/v1/folders/{folder_id}/files"
    page_url = base_url  # start
    while page_url:
        resp = session.get(page_url, params={"per_page": 100})
        resp.raise_for_status()
        chunk = resp.json()
        files.extend(chunk)
        # Check if there's a "next" page
        page_url = get_next_page_url(resp)

    return files


def list_subfolders(session, folder_id):
    """
    Return a list of subfolder objects (JSON) for the specified folder.
    API endpoint: GET /api/v1/folders/:folder_id/folders
    Handle pagination similarly.
    """
    folders = []
    base_url = f"{CANVAS_BASE_URL}/api/v1/folders/{folder_id}/folders"
    page_url = base_url
    while page_url:
        resp = session.get(page_url, params={"per_page": 100})
        resp.raise_for_status()
        chunk = resp.json()
        folders.extend(chunk)

        # Check if there's a "next" page
        page_url = get_next_page_url(resp)

    return folders


def download_file(session, file_obj, local_folder):
    """
    Given a file object from the Canvas API and a local folder path,
    download the file contents into that folder.
    file_obj has 'filename' and 'url' (download URL).
    """
    filename = file_obj["display_name"] or file_obj["filename"]
    download_url = file_obj["url"]  # The direct download URL
    local_filename = sanitize_filename(filename)
    local_path = os.path.join(local_folder, local_filename)

    # Skip if we have already
    if os.path.exists(local_path):
        print(f"File already exists, skipping: {local_filename}")
        return
    if download_url == "":
        print(
            f"This file is part of an unpublished module and is not available yet., skipping: {local_filename}")
        return
    print(f"Downloading {filename} -> {local_path}")
    resp = session.get(download_url, stream=True)
    if resp.status_code == 200:
        with open(local_path, "wb") as f:
            for chunk in resp.iter_content(chunk_size=8192):
                f.write(chunk)
    else:
        print(f"Error {resp.status_code} downloading {filename}: {resp.text}")


def get_next_page_url(resp):
    """
    Canvas uses pagination links in the HTTP 'Link' header.
    We look for a link with rel="next".
    """
    if "Link" not in resp.headers:
        return None
    links = resp.headers["Link"].split(",")
    for link in links:
        parts = link.split(";")
        if len(parts) < 2:
            continue
        url_part = parts[0].strip().lstrip("<").rstrip(">")
        rel_part = parts[1].strip()
        if rel_part == 'rel="next"':
            return url_part
    return None


def sanitize_filename(name):
    """
    Replace or remove any characters that might be invalid in the local file system.
    """
    return "".join(c for c in name if c not in r'\/:*?"<>|')


def download_files_from_course(course_id, course_name):
    """
    Main entry point. Gets the root folder for the course, then recursively
    downloads all folders/files into a local directory structure.
    """
    session = requests.Session()
    session.headers.update({"Authorization": f"Bearer {token}"})

    # 1. Get the root folder for this course
    root_folder = get_root_folder_for_course(session, course_id=course_id)
    if not root_folder:
        print("Could not fetch root folder. Exiting.")
        return

    os.makedirs(course_name, exist_ok=True)

    # 3. Recursively download the entire folder structure
    print(f"Starting download for course {course_id}...")
    download_folder(session, root_folder, course_name)
    print("Download complete.")


# Save the current directory before changing it
original_dir = os.getcwd()

# Change to the download directory
if not os.path.exists(DOWNLOAD_ROOT):
    os.makedirs(DOWNLOAD_ROOT)

os.chdir(os.path.expanduser(DOWNLOAD_ROOT))

# Get favorite courses
j = get_favorite_courses(CANVAS_BASE_URL, token)

# Save the JSON file with proper error handling
try:
    with open('favorite_courses.json', 'w') as f:
        json.dump(j, f, indent=2)  # Added indent for better readability
    print(
        f"Successfully saved favorite courses to {os.path.join(os.getcwd(), 'favorite_courses.json')}")
except Exception as e:
    print(f"Error saving favorite courses: {e}")

# Change back to the original directory
os.chdir(original_dir)
