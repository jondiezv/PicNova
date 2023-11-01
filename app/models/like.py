from .db import db, environment, SCHEMA, add_prefix_for_prod

class Like(db.Model):
    __tablename__ = 'likes'

    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), primary_key=True)
    post_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('posts.id')), primary_key=True)
    updownvote = db.Column(db.Integer, nullable=True)

    user = db.relationship('User', back_populates='likes')
    post = db.relationship('Post', back_populates='likes')
