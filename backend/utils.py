import requests


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
