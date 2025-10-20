from flask import Flask, render_template, request, redirect, url_for, make_response, send_file, jsonify
from openai import OpenAI
import os
import logging
import re
import random
import io
import json
from datetime import datetime
from models import db, CVProfile, CVFeedback, CVAnalytics

# Configure logging
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)

# Set up configuration
app.secret_key = os.environ.get("SESSION_SECRET", "funnelcv-secret-key")

# Load database URL, with a fallback for testing
database_url = os.environ.get("DATABASE_URL")
if database_url:
    logging.info(f"Using database: {database_url[:10]}...(redacted)")
    app.config["SQLALCHEMY_DATABASE_URI"] = database_url
    app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
        "pool_recycle": 300,
        "pool_pre_ping": True,
    }
    # Initialize database
    db.init_app(app)
    
    # Create database tables
    with app.app_context():
        db.create_all()
        logging.info("Database tables created successfully")
else:
    logging.warning("DATABASE_URL not found. Database features disabled.")

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@app.route('/')
def index():
    """Render the main form page"""
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate():
    """Process form data and generate a tailored CV summary"""
    # Get form data
    name = request.form.get('name', '')
    job = request.form.get('job', '')
    company = request.form.get('company', '')
    summary = request.form.get('summary', '')
    skills = request.form.get('skills', '')
    video = request.form.get('video', '')
    funnel_style = request.form.get('funnel_style', 'modern')
    
    # Validate required fields
    if not all([name, job, company, summary]):
        logging.error("Missing required fields")
        return render_template('index.html', error="All fields except skills and video link are required")
    
    try:
        logging.info(f"Starting CV generation for {name} - {job} at {company}")
        logging.info(f"Skills provided: {skills}")
        
        # Prompt AI to rewrite summary using GPT-3.5-Turbo
        logging.info("Calling OpenAI API...")
        response = client.chat.completions.create(
            model=request.form.get('model', 'gpt-5-nano'),
            messages=[
                {"role": "system", "content": f"Create a professional and tailored CV summary for a {job} role at {company}. The summary should be concise, well-formatted with paragraphs, and highlight the most relevant qualifications and experiences for this specific position. Focus on what would make the candidate stand out to HR professionals."},
                {"role": "user", "content": summary}
            ]
        )
        
        ai_content = response.choices[0].message.content.strip()
        
        # Apply humanizer to make content sound more natural if it seems AI-generated
        rewritten = humanize_text(ai_content)
        
        # Create a unique URL slug from input data
        slug = create_slug(name, job, company)
        
        # Get the processed video URL
        processed_video = process_video_url(video)
        
        # Check if we're using database or Replit DB
        if database_url:
            # Store in PostgreSQL database
            with app.app_context():
                # Check if slug already exists
                existing_profile = CVProfile.query.filter_by(slug=slug).first()
                if existing_profile:
                    # Generate a unique slug by adding a timestamp
                    import time
                    slug = f"{slug}-{int(time.time())}"
                
                # Create new CV profile
                new_profile = CVProfile(
                    slug=slug,
                    name=name,
                    job=job,
                    company=company,
                    summary=rewritten,
                    skills=skills,
                    video=processed_video,
                    created_by=os.environ.get("REPL_OWNER", "unknown")
                )
                
                # Add to database and commit
                db.session.add(new_profile)
                db.session.commit()
                logging.info(f"Created CV profile in database with slug: {slug}")
        else:
            # Fallback to Replit DB if database URL not configured
            from replit import db as replit_db
            replit_db[slug] = {
                "name": name,
                "job": job,
                "company": company,
                "summary": rewritten,
                "skills": skills,
                "video": processed_video,
                "created_at": os.environ.get("REPL_OWNER", "unknown")  # Store creator info
            }
            logging.info(f"Created CV profile in Replit DB with slug: {slug}")
        
        # Redirect to the appropriate funnel based on style selection
        if funnel_style == 'chat':
            return redirect(url_for('chat_funnel', slug=slug))
        else:
            return redirect(url_for('funnel', slug=slug))
    
    except Exception as e:
        logging.error(f"Error generating CV: {str(e)}")
        logging.error(f"Error type: {type(e).__name__}")
        import traceback
        logging.error(f"Traceback: {traceback.format_exc()}")
        
        error_message = "There was an error processing your request. Please try again."
        if "OpenAI" in str(e):
            error_message = "Error connecting to AI service. Please try again in a moment."
        
        return render_template('index.html', 
                             error=error_message,
                             name=name,
                             job=job,
                             company=company,
                             summary=summary,
                             skills=skills,
                             video=video)

@app.route('/chat-funnel/<slug>')
def chat_funnel(slug):
    """Display the chat-style CV funnel"""
    try:
        if database_url:
            # Get profile from PostgreSQL database
            with app.app_context():
                cv_profile = CVProfile.get_by_slug(slug)
                if not cv_profile:
                    logging.error(f"CV not found for slug: {slug}")
                    return "CV not found", 404
                
                data = {
                    'name': cv_profile.name,
                    'job': cv_profile.job,
                    'company': cv_profile.company,
                    'summary': cv_profile.summary,
                    'skills': cv_profile.skills,
                    'video': cv_profile.video
                }
        else:
            # Fallback to Replit DB
            from replit import db as replit_db
            data = replit_db.get(slug, None)
            if not data:
                logging.error(f"CV not found for slug: {slug}")
                return "CV not found", 404
        
        return render_template('chat-funnel.html', data=data, slug=slug)
        
    except Exception as e:
        logging.error(f"Error displaying chat funnel: {str(e)}")
        return "Error loading CV", 500

@app.route('/cv/<slug>')
def funnel(slug):
    """Display the generated CV page"""
    if database_url:
        # Get profile from PostgreSQL database
        with app.app_context():
            cv_profile = CVProfile.query.filter_by(slug=slug).first()
            if not cv_profile:
                logging.error(f"CV not found for slug: {slug}")
                return render_template('index.html', error="CV not found. Please create a new one."), 404
            
            # Convert to dictionary for template compatibility
            data = {
                "name": cv_profile.name,
                "job": cv_profile.job,
                "company": cv_profile.company,
                "summary": cv_profile.summary,
                "skills": cv_profile.skills if cv_profile.skills else "",
                "video": cv_profile.video,
                "created_at": cv_profile.created_at.strftime("%Y-%m-%d %H:%M:%S") if cv_profile.created_at else "Unknown"
            }
    else:
        # Fallback to Replit DB
        from replit import db as replit_db
        data = replit_db.get(slug, None)
        if not data:
            logging.error(f"CV not found for slug: {slug}")
            return render_template('index.html', error="CV not found. Please create a new one."), 404
    
    return render_template('funnel.html', data=data, slug=slug)

@app.route('/cv/<slug>/download')
def download_cv(slug):
    """Download the CV as a PDF file"""
    try:
        from reportlab.lib import colors
        from reportlab.lib.pagesizes import A4
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
        from reportlab.lib.units import inch
        
        if database_url:
            with app.app_context():
                cv_profile = CVProfile.query.filter_by(slug=slug).first()
                if not cv_profile:
                    logging.error(f"CV not found for slug: {slug}")
                    return "CV not found", 404
                
                name = cv_profile.name
                job = cv_profile.job
                company = cv_profile.company
                summary = cv_profile.summary
                skills = cv_profile.skills
                video = cv_profile.video
        else:
            from replit import db as replit_db
            data = replit_db.get(slug, None)
            if not data:
                logging.error(f"CV not found for slug: {slug}")
                return "CV not found", 404
            
            name = data["name"]
            job = data["job"]
            company = data["company"]
            summary = data["summary"]
            skills = data["skills"]
            video = data.get("video", "")

        # Create PDF buffer
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=72, leftMargin=72, topMargin=72, bottomMargin=72)
        styles = getSampleStyleSheet()
        story = []

        # Custom styles
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Title'],
            fontSize=24,
            spaceAfter=30
        )
        heading_style = ParagraphStyle(
            'CustomHeading',
            parent=styles['Heading1'],
            fontSize=16,
            spaceAfter=16
        )

        # Add content
        story.append(Paragraph(name, title_style))
        story.append(Paragraph(f"{job} at {company}", styles['Heading2']))
        story.append(Spacer(1, 20))
        
        story.append(Paragraph("Professional Summary", heading_style))
        story.append(Paragraph(summary, styles['Normal']))
        story.append(Spacer(1, 20))
        
        story.append(Paragraph("Skills & Expertise", heading_style))
        story.append(Paragraph(skills, styles['Normal']))
        
        if video:
            story.append(Spacer(1, 20))
            story.append(Paragraph("Video Introduction", heading_style))
            story.append(Paragraph(f"View my introduction: {video}", styles['Normal']))

        # Build PDF
        doc.build(story)
        buffer.seek(0)
        
        # Create the response
        filename = f"{name.replace(' ', '_')}_CV.pdf"
        return send_file(
            buffer,
            as_attachment=True,
            download_name=filename,
            mimetype='application/pdf'
        )

        # SECTION 2: PROFESSIONAL SUMMARY (50% approx)
        summary_section = f"""
----------------------------------------------
PROFESSIONAL SUMMARY (KEY HIGHLIGHTS)
----------------------------------------------
{summary}
"""
        
        # SECTION 3: SKILLS & ADDITIONAL INFO (30% approx)
        skills_section = f"""
----------------------------------------------
KEY SKILLS & EXPERTISE
----------------------------------------------
{skills}
"""

        # Combine all sections
        cv_content = header_section + summary_section + skills_section
        
        # Add video link if available (as part of the 30% section)
        if video:
            cv_content += f"""
----------------------------------------------
VIDEO INTRODUCTION
----------------------------------------------
View my introduction video: {video}
"""
        # Create an in-memory file-like object
        buffer = io.BytesIO()
        buffer.write(cv_content.encode('utf-8'))
        buffer.seek(0)
        
        # Create the response
        filename = f"{name.replace(' ', '_')}_CV.txt"
        return send_file(
            buffer,
            as_attachment=True,
            download_name=filename,
            mimetype='text/plain'
        )
    except Exception as e:
        logging.error(f"Error generating CV download: {str(e)}")
        return "Error generating CV download", 500

def create_slug(name, job, company):
    """Create a URL-friendly slug from user inputs"""
    # Convert to lowercase and replace spaces with hyphens
    base_slug = f"{name.lower()}-{job.lower()}-{company.lower()}"
    # Remove special characters
    slug = re.sub(r'[^a-z0-9-]', '', base_slug.replace(' ', '-'))
    # Remove repeated hyphens
    slug = re.sub(r'-+', '-', slug)
    return slug

def humanize_text(text):
    """Make AI-generated text sound more natural and human-written"""
    if not text:
        return text
    
    try:
        # Split into paragraphs
        paragraphs = text.split('\n\n')
        humanized_paragraphs = []
        
        for paragraph in paragraphs:
            if not paragraph.strip():
                continue
                
            # Vary sentence structure in paragraphs
            sentences = re.split(r'(?<=[.!?])\s+', paragraph)
            for i in range(len(sentences)):
                # Skip short sentences and bullet points
                if len(sentences[i]) < 15 or sentences[i].strip().startswith('•'):
                    continue
                    
                # Randomly convert some sentences to active voice
                if random.random() < 0.3:
                    # Replace passive constructions with active ones
                    sentences[i] = re.sub(r'is being ([a-z]+ed)', r'actively \1s', sentences[i])
                    sentences[i] = re.sub(r'are being ([a-z]+ed)', r'actively \1', sentences[i])
                
                # Occasionally vary sentence structures
                if random.random() < 0.2 and ',' in sentences[i]:
                    parts = sentences[i].split(',', 1)
                    sentences[i] = f"{parts[1].strip()}, {parts[0].strip()[0].lower()}{parts[0].strip()[1:]}"
            
            # Replace overly formal or AI-like phrases
            modified_para = ' '.join(sentences)
            modified_para = modified_para.replace("utilize", "use")
            modified_para = modified_para.replace("furthermore", "also")
            modified_para = modified_para.replace("in addition", "plus")
            modified_para = modified_para.replace("subsequently", "then")
            modified_para = modified_para.replace("demonstrates", "shows")
            
            # Strengthen verbs instead of using adverbs
            modified_para = re.sub(r'effectively ([a-z]+)', r'excel at \1ing', modified_para)
            modified_para = re.sub(r'efficiently ([a-z]+)', r'streamline \1ing', modified_para)
            
            humanized_paragraphs.append(modified_para)
        
        # Join paragraphs back together
        return '\n\n'.join(humanized_paragraphs)
    except Exception as e:
        logging.error(f"Error in humanizing text: {str(e)}")
        return text  # Return original text if humanizing fails

def process_video_url(url):
    """Process video URLs to ensure proper embedding"""
    if not url:
        return ""
    
    # Process YouTube links to ensure they use embed format
    youtube_patterns = [
        r'(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&\s]+)',
        r'(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^\s]+)'
    ]
    
    for pattern in youtube_patterns:
        match = re.search(pattern, url)
        if match:
            video_id = match.group(1)
            return f"https://www.youtube.com/embed/{video_id}"
    
    # Process Loom links
    loom_pattern = r'(?:https?:\/\/)?(?:www\.)?loom\.com\/share\/([^\s]+)'
    match = re.search(loom_pattern, url)
    if match:
        video_id = match.group(1)
        return f"https://www.loom.com/embed/{video_id}"
    
    # Return the original URL if it doesn't match known patterns
    return url

@app.route('/feedback/<slug>', methods=['POST'])
def submit_feedback(slug):
    """Handle HR feedback submission for a CV"""
    try:
        data = request.get_json()
        
        # Create feedback record
        feedback = CVFeedback(
            cv_slug=slug,
            feedback_type=data.get('feedback_type'),
            message=data.get('message'),
            detailed_ratings=json.dumps(data.get('detailed_ratings')) if data.get('detailed_ratings') else None,
            improvement_tips=json.dumps(data.get('improvement_tips')) if data.get('improvement_tips') else None,
            time_spent=data.get('time_spent'),
            section_times=json.dumps(data.get('section_times')) if data.get('section_times') else None,
            hr_ip=request.remote_addr
        )
        
        db.session.add(feedback)
        db.session.commit()
        
        logging.info(f"Feedback submitted for CV {slug}: {data.get('feedback_type')}")
        
        return jsonify({'status': 'success', 'message': 'Feedback submitted successfully'})
        
    except Exception as e:
        logging.error(f"Error submitting feedback: {str(e)}")
        return jsonify({'status': 'error', 'message': 'Failed to submit feedback'}), 500

@app.route('/analytics/<slug>', methods=['POST'])
def track_analytics(slug):
    """Track analytics events for a CV"""
    try:
        data = request.get_json()
        
        # Create analytics record
        analytics = CVAnalytics(
            cv_slug=slug,
            event_type=data.get('event'),
            event_data=json.dumps(data.get('data')) if data.get('data') else None,
            visitor_ip=request.remote_addr,
            user_agent=request.headers.get('User-Agent', '')[:500]  # Limit length
        )
        
        db.session.add(analytics)
        db.session.commit()
        
        return jsonify({'status': 'success'})
        
    except Exception as e:
        logging.error(f"Error tracking analytics: {str(e)}")
        return jsonify({'status': 'error'}), 500

@app.route('/feedback-summary/<slug>')
def feedback_summary(slug):
    """Get feedback summary for a CV (for applicant to view)"""
    try:
        # Get all feedback for this CV
        feedbacks = CVFeedback.query.filter_by(cv_slug=slug).all()
        analytics = CVAnalytics.query.filter_by(cv_slug=slug).all()
        
        if not feedbacks and not analytics:
            return jsonify({
                'status': 'no_data',
                'message': 'No feedback or analytics data available yet'
            })
        
        # Aggregate feedback data
        feedback_summary = {
            'total_views': len(set([a.visitor_ip for a in analytics if a.event_type == 'page_view'])),
            'total_feedback': len(feedbacks),
            'feedback_breakdown': {},
            'average_time_spent': 0,
            'improvement_suggestions': [],
            'ratings': {
                'skills': [],
                'experience': [],
                'presentation': [],
                'fit': []
            }
        }
        
        # Process feedback
        total_time = 0
        for feedback in feedbacks:
            # Count feedback types
            if feedback.feedback_type in feedback_summary['feedback_breakdown']:
                feedback_summary['feedback_breakdown'][feedback.feedback_type] += 1
            else:
                feedback_summary['feedback_breakdown'][feedback.feedback_type] = 1
            
            # Add time spent
            if feedback.time_spent:
                total_time += feedback.time_spent
            
            # Add improvement tips
            if feedback.improvement_tips:
                try:
                    tips = json.loads(feedback.improvement_tips)
                    feedback_summary['improvement_suggestions'].extend(tips)
                except:
                    pass
            
            # Add detailed ratings
            if feedback.detailed_ratings:
                try:
                    ratings = json.loads(feedback.detailed_ratings)
                    for section, rating in ratings.items():
                        if section in feedback_summary['ratings']:
                            feedback_summary['ratings'][section].append(rating)
                except:
                    pass
        
        # Calculate averages
        if feedbacks:
            feedback_summary['average_time_spent'] = total_time / len(feedbacks)
        
        # Calculate average ratings
        for section in feedback_summary['ratings']:
            ratings = feedback_summary['ratings'][section]
            if ratings:
                feedback_summary['ratings'][section] = {
                    'average': sum(ratings) / len(ratings),
                    'count': len(ratings)
                }
            else:
                feedback_summary['ratings'][section] = {'average': 0, 'count': 0}
        
        return jsonify({
            'status': 'success',
            'data': feedback_summary
        })
        
    except Exception as e:
        logging.error(f"Error getting feedback summary: {str(e)}")
        return jsonify({'status': 'error', 'message': 'Failed to get feedback summary'}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
