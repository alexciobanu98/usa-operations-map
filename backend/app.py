from app import create_app, socketio, db
from app.models.user import User
import os

app = create_app()

# Create a context for the app
with app.app_context():
    # Create tables if they don't exist
    db.create_all()
    
    # Check if admin user exists, create if not
    if not User.query.filter_by(username='admin').first():
        admin = User(username='admin', email='admin@example.com', first_name='Admin', last_name='User')
        admin.set_password('admin123')
        db.session.add(admin)
        db.session.commit()
        print('Admin user created successfully!')

if __name__ == '__main__':
    # Use environment variables for host and port if available (for production)
    host = os.environ.get('HOST', '0.0.0.0')
    port = int(os.environ.get('PORT', 5000))
    
    # In development, use socketio to run the app with debug mode
    if app.config['DEBUG']:
        socketio.run(app, host=host, port=port, debug=True)
    else:
        # In production, let gunicorn handle the app
        app.run(host=host, port=port)
