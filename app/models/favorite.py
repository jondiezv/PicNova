from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy.sql import text

class Favorite(db.Model):
    __tablename__ = 'favorites'

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'), primary_key=True)

    user = db.relationship('User', back_populates='favorites')
    post = db.relationship('Post', back_populates='favorites')
