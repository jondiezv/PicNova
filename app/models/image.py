from .db import db, environment, SCHEMA, add_prefix_for_prod

class Image(db.Model):
    __tablename__ = 'images'

    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'), primary_key=True)
    url = db.Column(db.String(255), nullable=False)

    post = db.relationship('Post', back_populates='images')
