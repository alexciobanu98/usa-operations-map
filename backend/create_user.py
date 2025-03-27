from app import create_app, db
from app.models.user import User

def create_default_user():
    app = create_app()
    with app.app_context():
        db.create_all()
        
        # Check if admin user already exists
        if not User.query.filter_by(username='admin').first():
            # Create admin user
            user = User(
                username='admin',
                email='admin@example.com',
                first_name='Admin',
                last_name='User'
            )
            user.set_password('admin123')
            db.session.add(user)
            db.session.commit()
            print('Admin user created successfully!')
        else:
            print('Admin user already exists.')

if __name__ == '__main__':
    create_default_user()
