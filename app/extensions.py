from flask_bootstrap import Bootstrap
from flask_login import LoginManager
from flask_mail import Mail
from flask_moment import Moment
from flask_sqlalchemy import SQLAlchemy


bootstrap = Bootstrap()
db = SQLAlchemy()
moment = Moment()
mail = Mail()

login_manager = LoginManager()
login_manager.login_view = "auth.login"
login_manager.login_message = "Please login or signup to add a new trip"


@login_manager.unauthorized_handler
def unauthorized():
    from flask import request, jsonify, redirect, url_for
    if request.path.startswith("/api/") or request.headers.get("X-Requested-With") == "XMLHttpRequest":
        return jsonify({"error": "unauthorized"}), 401
    return redirect(url_for("auth.login"))
