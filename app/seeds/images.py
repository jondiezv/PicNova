from app.models import db, Image, Post, User, environment, SCHEMA
from sqlalchemy.sql import text

def seed_images():

    post_demo = Post.query.filter_by(title="My First Post").first()
    post2 = Post.query.filter_by(title="Cute Cat Picture").first()
    post3 = Post.query.filter_by(title="Doggo Adventures").first()
    post4 = Post.query.filter_by(title="Art Showcase").first()
    post5 = Post.query.filter_by(title="Foodie Delights").first()
    post6 = Post.query.filter_by(title="Nature's Beauty").first()

    image1 = Image(
        post_id=post_demo.id,
        url="https://cdn.discordapp.com/attachments/1169328578379387000/1169328590022774904/image.png"
    )
    image2 = Image(
        post_id=post2.id,
        url="https://cdn.discordapp.com/attachments/1169328578379387000/1171931685936431114/cat-blink.gif"
    )
    image3 = Image(
        post_id=post3.id,
        url="https://cdn.discordapp.com/attachments/1169328578379387000/1169328590022774904/image.png"
    )
    image4 = Image(
        post_id=post4.id,
        url="https://cdn.discordapp.com/attachments/1169328578379387000/1169328590022774904/image.png"
    )
    image5 = Image(
        post_id=post5.id,
        url="https://cdn.discordapp.com/attachments/1169328578379387000/1169328590022774904/image.png"
    )
    image6 = Image(
        post_id=post6.id,
        url="https://cdn.discordapp.com/attachments/1169328578379387000/1169328590022774904/image.png"
    )

    db.session.add(image1)
    db.session.add(image2)
    db.session.add(image3)
    db.session.add(image4)
    db.session.add(image5)
    db.session.add(image6)
    db.session.commit()

def undo_images():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.images RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM images"))

    db.session.commit()
