from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase
from datetime import datetime

# Create a base class for SQLAlchemy models
class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)

class CVProfile(db.Model):
    """Model representing a CV profile for a specific job application."""
    __tablename__ = 'cv_profiles'
    
    id = db.Column(db.Integer, primary_key=True)
    slug = db.Column(db.String(255), unique=True, nullable=False, index=True)
    name = db.Column(db.String(100), nullable=False)
    job = db.Column(db.String(100), nullable=False)
    company = db.Column(db.String(100), nullable=False)
    summary = db.Column(db.Text, nullable=False)
    skills = db.Column(db.Text, nullable=True)  # New skills field
    video = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    created_by = db.Column(db.String(100), nullable=True)
    
    def __repr__(self):
        return f'<CVProfile {self.name} for {self.job} at {self.company}>'
    
    @classmethod
    def get_by_slug(cls, slug):
        """Get a CV profile by its slug."""
        return cls.query.filter_by(slug=slug).first()


class CVFeedback(db.Model):
    """Model for storing HR feedback on CV profiles."""
    __tablename__ = 'cv_feedback'
    
    id = db.Column(db.Integer, primary_key=True)
    cv_slug = db.Column(db.String(255), nullable=False, index=True)
    feedback_type = db.Column(db.String(50), nullable=False)  # interested, maybe, not-match, improve
    message = db.Column(db.Text, nullable=True)
    detailed_ratings = db.Column(db.Text, nullable=True)  # JSON string for section ratings
    improvement_tips = db.Column(db.Text, nullable=True)  # JSON string for tips
    time_spent = db.Column(db.Integer, nullable=True)  # milliseconds
    section_times = db.Column(db.Text, nullable=True)  # JSON string for section viewing times
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    hr_ip = db.Column(db.String(45), nullable=True)  # For tracking unique viewers
    
    def __repr__(self):
        return f'<CVFeedback {self.cv_slug}: {self.feedback_type}>'


class CVAnalytics(db.Model):
    """Model for storing CV viewing analytics."""
    __tablename__ = 'cv_analytics'
    
    id = db.Column(db.Integer, primary_key=True)
    cv_slug = db.Column(db.String(255), nullable=False, index=True)
    event_type = db.Column(db.String(50), nullable=False)  # page_view, section_view, chat_opened, etc.
    event_data = db.Column(db.Text, nullable=True)  # JSON string for event details
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    visitor_ip = db.Column(db.String(45), nullable=True)
    user_agent = db.Column(db.String(500), nullable=True)
    
    def __repr__(self):
        return f'<CVAnalytics {self.cv_slug}: {self.event_type}>'