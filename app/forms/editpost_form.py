from flask_wtf import FlaskForm
from wtforms import StringField, BooleanField, SubmitField
from wtforms.validators import DataRequired

class EditPost(FlaskForm):
    title = StringField("title", validators=[DataRequired()])
    description = StringField("description")
    hidden = BooleanField("hidden")
    submit = SubmitField("submit")
