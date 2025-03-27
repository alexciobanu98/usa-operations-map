from app import create_app, socketio, db
from app.models import User, Project, Site, Task
from config import Config
import os

app = create_app(Config)

# Create a context for database operations
@app.shell_context_processor
def make_shell_context():
    return {
        'db': db,
        'User': User,
        'Project': Project,
        'Site': Site,
        'Task': Task
    }

# Initialize the database
@app.cli.command('init-db')
def init_db():
    """Initialize the database with tables and seed data."""
    db.create_all()
    
    # Check if admin user exists
    if not User.query.filter_by(username='admin').first():
        # Create admin user
        admin = User(
            username='admin',
            email='admin@example.com',
            first_name='Admin',
            last_name='User',
            role='admin'
        )
        admin.set_password('admin123')  # Change this in production!
        db.session.add(admin)
        
        # Create a test user
        user = User(
            username='user',
            email='user@example.com',
            first_name='Test',
            last_name='User',
            role='user'
        )
        user.set_password('user123')  # Change this in production!
        db.session.add(user)
        
        db.session.commit()
        print('Database initialized with admin and test users.')
    else:
        print('Database already contains users, skipping initialization.')

if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
