from .db import db, environment, SCHEMA, add_prefix_for_prod

class Comment(db.Model):
    __tablename__ = 'comments'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'), nullable=False)
    comment = db.Column(db.Text, nullable=False)
    url = db.Column(db.String(255), nullable=True)

    user = db.relationship('User', back_populates='comments')
    post = db.relationship('Post', back_populates='comments')
