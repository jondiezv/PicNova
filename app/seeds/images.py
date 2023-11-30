from app.models import db, Image, Post, User, environment, SCHEMA
from sqlalchemy.sql import text

def seed_images():

    post_demo = Post.query.filter_by(title="VR-ready cat").first()
    post2 = Post.query.filter_by(title="Why is he looking at me like that").first()
    post3 = Post.query.filter_by(title="just picked up this game").first()
    post4 = Post.query.filter_by(title="Art Showcase").first()
    post5 = Post.query.filter_by(title="Foodie Delights").first()
    post6 = Post.query.filter_by(title="Nature's Beauty").first()
    post7 = Post.query.filter_by(title="who is this character and why is she everywhere").first()
    post8 = Post.query.filter_by(title="rate my haul").first()

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
        url="https://cdn.discordapp.com/attachments/1169328578379387000/1179889335890362479/cyxpck0qdn081.jpg"
    )
    image4 = Image(
        post_id=post4.id,
        url="https://cdn.discordapp.com/attachments/1169328578379387000/1179893081122803712/OIG.jpg"
    )
    image5 = Image(
        post_id=post5.id,
        url="https://cdn.discordapp.com/attachments/1169328578379387000/1179889335131189319/churrasco-steak-on-platter-recipe-card.jpg"
    )
    image6 = Image(
        post_id=post6.id,
        url="https://cdn.discordapp.com/attachments/1169328578379387000/1179889334594310264/0381f510b6548084b87b1726aa8a5a6b-salto-angel-angel-falls.jpg"
    )
    image7 = Image(
        post_id=post7.id,
        url="https://cdn.discordapp.com/attachments/1169328578379387000/1179893132624674816/sxetva0x2s081.png"
    )
    image8 = Image(
        post_id=post8.id,
        url="https://cdn.discordapp.com/attachments/1169328578379387000/1179889333357002823/1pd7tad9o6ib1.jpg"
    )



    db.session.add(image1)
    db.session.add(image2)
    db.session.add(image3)
    db.session.add(image4)
    db.session.add(image5)
    db.session.add(image6)
    db.session.add(image7)
    db.session.add(image8)
    db.session.commit()

def undo_images():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.images RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM images"))

    db.session.commit()
