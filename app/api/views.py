from flask import jsonify, request, abort
from flask_login import login_required, current_user

from . import api
from .. import db
from ..models import Credential, User


@api.route("/me")
@login_required
def me():
    return jsonify({
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
    })


@api.route("/credentials")
@login_required
def get_credentials():
    creds = Credential.query.filter_by(user_id=current_user.id).all()
    result = []
    for c in creds:
        try:
            decrypted = c.decrypt_credential(c.encrypted_password).decode("utf-8")
        except Exception:
            decrypted = ""
        result.append({
            "id": c.id,
            "website": c.website,
            "username": c.username,
            "password": decrypted,
        })
    return jsonify(result)


@api.route("/credentials", methods=["POST"])
@login_required
def create_credential():
    data = request.get_json(force=True)
    if not data or not data.get("website") or not data.get("username"):
        abort(400)
    cred = Credential(
        user_id=current_user.id,
        website=data["website"],
        username=data["username"],
    )
    cred.password = data.get("password", "")
    db.session.add(cred)
    db.session.commit()
    return jsonify({"id": cred.id, "website": cred.website, "username": cred.username}), 201


@api.route("/credentials/<int:cred_id>", methods=["PUT"])
@login_required
def update_credential(cred_id):
    cred = Credential.query.filter_by(id=cred_id, user_id=current_user.id).first_or_404()
    data = request.get_json(force=True)
    if "website" in data:
        cred.website = data["website"]
    if "username" in data:
        cred.username = data["username"]
    if "password" in data:
        cred.password = data["password"]
    db.session.commit()
    return jsonify({"id": cred.id, "website": cred.website, "username": cred.username})


@api.route("/credentials/<int:cred_id>", methods=["DELETE"])
@login_required
def delete_credential(cred_id):
    cred = Credential.query.filter_by(id=cred_id, user_id=current_user.id).first_or_404()
    db.session.delete(cred)
    db.session.commit()
    return jsonify({"deleted": cred_id})
