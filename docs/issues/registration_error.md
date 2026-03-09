# Issue: Registration Error - BCrypt and Password Length

**Date:** 2026-03-09

**Reported By:** William

**Problem Description:**
Users are encountering registration errors. The backend logs indicate two primary issues:
1.  **BCrypt Library Errors:** The `bcrypt` library is not correctly initialized, leading to `passlib.exc.UnknownHashError` and `AttributeError`. This suggests a problem with the `bcrypt` library's installation or version within the Docker environment.
2.  **Password Length Exceeds Limit:** A `ValueError` occurs during password hashing because provided passwords are longer than the 72-byte limit supported by BCrypt.

**Analysis Summary:**
The backend logs show errors related to BCrypt initialization and a `ValueError` for password length during registration attempts.

**Proposed Solutions:**
1.  **Address BCrypt Library Issues:**
    *   Verify and potentially update the `bcrypt` dependency in the backend's `pyproject.toml` or `requirements.txt`.
    *   Reinstall the dependency and rebuild the Docker image:
        ```bash
        docker compose build backend
        docker compose up -d --force-recreate backend
        ```
2.  **Handle Password Length:**
    *   Modify the backend code (specifically in `app/core/security.py` or `app/api/auth.py`) to either:
        *   Truncate passwords exceeding 72 bytes before hashing (e.g., `password[:72]`).
        *   Implement proper input validation to enforce a maximum password length.

**Next Steps:**
Implement the proposed solutions and thoroughly test the registration and login functionalities.