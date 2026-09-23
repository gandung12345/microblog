## Microblog

This is a technical interview task for Python developer at Software Seni. How to run it without docker:

```
[the backend]

$ cd backend
$ python -m venv venv
$ . venv/bin/activate
(venv) $ pip install -r requirements.txt
(venv) $ python manage.py makemigrations
(venv) $ python manage.py migrate
(venv) $ python manage.py runserver

--------------------------------------------

[the frontend (on another shell tab)]

$ cd frontend
$ npm install
$ npm run dev
```
