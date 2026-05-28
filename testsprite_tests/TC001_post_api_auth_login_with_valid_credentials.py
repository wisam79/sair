import requests

def test_post_api_auth_login_with_valid_credentials():
    base_url = "http://localhost:3000"
    endpoint = "/api/auth/login"
    url = base_url + endpoint
    headers = {
        "Content-Type": "application/json"
    }
    # Using example valid credentials (should be replaced with actual valid test credentials)
    payload = {
        "email": "testuser@example.com",
        "password": "TestPassword123!"
    }

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=30)
    except requests.RequestException as e:
        assert False, f"Request to {url} failed: {e}"

    # Assert response status code is 200 (success)
    assert response.status_code == 200, f"Expected status code 200, got {response.status_code}"

    try:
        response_json = response.json()
    except ValueError:
        assert False, "Response is not valid JSON"

    # Verify presence of authentication token or similar success indicator in response
    # Since exact schema is not provided, check for common keys like 'access_token' or 'token'
    token_keys = ["access_token", "token", "jwt", "authToken"]
    assert any(key in response_json for key in token_keys), f"Authentication token not found in response: {response_json}"

test_post_api_auth_login_with_valid_credentials()