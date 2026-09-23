# Blog Backend (Django 6.1.1 + DRF)

## Design Decisions

1. **Django Version**: Target version updated to **Django 6.1.1** running on Python 3.12+.
2. **Author Field Selection**: 
   A simple `CharField` is used for `author` rather than a Foreign Key to `django.contrib.auth.models.User`. Since public authentication is out of scope, using a string keeps the public read-only API completely decoupled from administrative auth records.
3. **Slug Auto-generation**: 
   Slugs are automatically calculated using `slugify` on post titles. If duplicate titles occur, an incremental suffix (e.g., `-1`, `-2`) is appended automatically to maintain unique URLs.
4. **Published Timestamp**:
   Setting a post's status to `published` automatically sets `published_at` to the current timestamp if not manually specified.

## Quickstart

```bash
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
