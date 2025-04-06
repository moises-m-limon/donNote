import json
from google import genai
from google.genai import types
import httpx
import requests
import pathlib


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
    return response.json()

def get_root_folder_for_course(session, course_id, base_url):
    """
    Returns the root folder object for the specified course.
    API endpoint: GET /api/v1/courses/:course_id/folders/root
    """
    url = f"{base_url}/api/v1/courses/{course_id}/folders/root"
    resp = session.get(url)
    if resp.status_code == 200:
        return resp.json()
    else:
        print(f"Error {resp.status_code} getting root folder: {resp.text}")
        return None


def list_files_in_folder(session, folder_id, base_url):
    """
    Return a list of file objects (JSON) for all files in the specified folder.
    API endpoint: GET /api/v1/folders/:folder_id/files
    We also handle pagination if there's more than one page of results.
    """
    files = []
    base_url = f"{base_url}/api/v1/folders/{folder_id}/files"
    page_url = base_url  # start
    while page_url:
        resp = session.get(page_url, params={"per_page": 100})
        resp.raise_for_status()
        chunk = resp.json()
        files.extend(chunk)
        # Check if there's a "next" page
        page_url = get_next_page_url(resp)
    print(files)
    return files


def list_subfolders(session, folder_id, base_url):
    """
    Return a list of subfolder objects (JSON) for the specified folder.
    API endpoint: GET /api/v1/folders/:folder_id/folders
    Handle pagination similarly.
    """
    folders = []
    base_url = f"{base_url}/api/v1/folders/{folder_id}/folders"
    page_url = base_url
    while page_url:
        resp = session.get(page_url, params={"per_page": 100})
        resp.raise_for_status()
        chunk = resp.json()
        folders.extend(chunk)

        # Check if there's a "next" page
        page_url = get_next_page_url(resp)

    return folders


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


def get_course_files(course_id, base_url, token):
    """
    Get all files for a specific course.
    Returns a list of file objects with relevant information.
    """
    # Create a session with the appropriate Authorization header
    session = requests.Session()
    session.headers.update({"Authorization": f"Bearer {token}"})
    
    # Get the root folder for this course
    root_folder = get_root_folder_for_course(session, course_id=course_id, base_url=base_url)
    if not root_folder:
        return None
    
    # Get all files recursively
    all_files = []
    process_folder(session, root_folder, base_url, all_files)
    
    # Format the response
    file_list = []
    for file in all_files:
        file_list.append({
            "id": file.get("id"),
            "name": file.get("display_name") or file.get("filename"),
            "url": file.get("url"),
            "size": file.get("size"),
            "content_type": file.get("content-type"),
            "created_at": file.get("created_at"),
            "updated_at": file.get("updated_at"),
            "folder_path": file.get("folder_path", "")
        })
    
    return file_list


def process_folder(session, folder, base_url, all_files, folder_path=""):
    """
    Recursively process a folder and its subfolders to get all files.
    """
    folder_id = folder.get("id")
    folder_name = folder.get("name")
    
    # Update the folder path
    current_folder_path = f"{folder_path}/{folder_name}" if folder_path else folder_name
    
    # Get files in the current folder
    files = list_files_in_folder(session, folder_id, base_url)
    for file in files:
        # Add folder path to each file
        file["folder_path"] = current_folder_path
        all_files.append(file)
    
    # Get subfolders and process them recursively
    subfolders = list_subfolders(session, folder_id, base_url)
    for subfolder in subfolders:
        process_folder(session, subfolder, base_url, all_files, current_folder_path)
=======
# class BaseClass(typing.TypedDict, total=False):
#     response: str


def summerize(client, file_name, prompt, system_prompt):
    try:

        # Read the file from the temp directory
        file_path = pathlib.Path(f'temp/{file_name}')

        # Generate content using the file and prompt
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            config=types.GenerateContentConfig(
                system_instruction=system_prompt
            ),
            contents=[
                types.Part.from_bytes(
                    data=file_path.read_bytes(),
                    mime_type='application/pdf'
                ),
                prompt
            ],
        )

        # Parse the JSON response
        try:
            return response.text
        except Exception as e:
            print(f"Error parsing JSON response: {str(e)}")
            return {"error": "Failed to parse response"}

    except Exception as e:
        print(f"Error in summarization: {str(e)}")
        return {"error": str(e)}
