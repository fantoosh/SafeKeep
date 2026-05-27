from datetime import datetime
from flask import render_template, session, redirect, url_for, send_from_directory, current_app
from flask_login import login_required, current_user
from . import main
from .. import db
import os


@main.route("/", methods=["GET", "POST"])
def index():
    if current_user.is_authenticated:
        return redirect(url_for("main.vault_app"))
    return render_template("index.html")


@main.route("/vault")
@login_required
def vault_app():
    static_dir = os.path.join(current_app.root_path, "static", "vault-react")
    return send_from_directory(static_dir, "index.html")
