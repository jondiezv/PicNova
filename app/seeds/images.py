from app.models import db, Image, Post, User, environment, SCHEMA
from sqlalchemy.sql import text

def seed_images():

    post_demo = Post.query.filter_by(title="My First Post").first()


    image = Image(
        post_id=post_demo.id,
        url="https://cdn.discordapp.com/attachments/1169328578379387000/1169328590022774904/image.png"
    )

    db.session.add(image)
    db.session.commit()

def undo_images():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.images RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM images"))

    db.session.commit()
