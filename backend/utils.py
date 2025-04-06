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
