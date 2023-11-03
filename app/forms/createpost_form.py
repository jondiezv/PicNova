from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileAllowed, FileRequired
from app.api.aws_helper import ALLOWED_EXTENSIONS
from wtforms import StringField, IntegerField, SubmitField, BooleanField
from wtforms.validators import DataRequired, InputRequired



class CreatePost(FlaskForm):
    image = FileField("Image File", validators=[FileRequired(), FileAllowed(list(ALLOWED_EXTENSIONS))])
    title = StringField("title", validators=[DataRequired()])
    description = StringField("description")
    hidden = BooleanField("hidden")
    submit = SubmitField("submit")
