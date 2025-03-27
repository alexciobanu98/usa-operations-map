from app import create_app, db
from app.models.project import Project
from app.models.site import Site
from app.models.user import User
import random
from datetime import datetime, timedelta

def create_sample_data():
    app = create_app()
    with app.app_context():
        db.create_all()
        
        # Check if we already have sample data
        if Project.query.count() > 0:
            print("Sample data already exists. Skipping creation.")
            return
        
        # Get admin user
        admin = User.query.filter_by(username='admin').first()
        if not admin:
            print("Admin user not found. Please run create_user.py first.")
            return
        
        # Sample project data by region
        regions = ['pnw', 'midwest', 'northeast', 'southeast', 'southwest', 'west']
        statuses = ['active', 'completed', 'pending']
        customers = ['Verizon', 'AT&T', 'T-Mobile', 'Sprint', 'US Cellular', 'Dish Network']
        
        # Create projects for each region
        for region in regions:
            # Number of projects per region
            num_projects = random.randint(5, 15)
            
            for i in range(num_projects):
                status = random.choice(statuses)
                customer = random.choice(customers)
                start_date = datetime.now() - timedelta(days=random.randint(30, 365))
                end_date = None
                if status == 'completed':
                    end_date = start_date + timedelta(days=random.randint(30, 180))
                elif status == 'active':
                    end_date = datetime.now() + timedelta(days=random.randint(30, 180))
                
                budget = random.uniform(100000, 1000000)
                actual_cost = 0
                if status == 'completed':
                    actual_cost = budget * random.uniform(0.8, 1.2)
                elif status == 'active':
                    actual_cost = budget * random.uniform(0.1, 0.9)
                
                project = Project(
                    name=f"{region.title()} Project {i+1}",
                    description=f"A {status} wireless construction project in the {region.title()} region for {customer}.",
                    status=status,
                    region=region,
                    customer=customer,
                    start_date=start_date,
                    end_date=end_date,
                    budget=budget,
                    actual_cost=actual_cost,
                    manager_id=admin.id
                )
                
                db.session.add(project)
            
        # Commit all projects
        db.session.commit()
        print(f"Created sample projects for all regions.")
        
        # Get all projects for adding sites
        projects = Project.query.all()
        
        # Create sites for each project
        for project in projects:
            # Number of sites per project
            num_sites = random.randint(1, 5)
            
            # States by region for more realistic data
            states_by_region = {
                'pnw': ['WA', 'OR', 'ID'],
                'midwest': ['IL', 'IN', 'IA', 'KS', 'MI', 'MN', 'MO', 'NE', 'ND', 'OH', 'SD', 'WI'],
                'northeast': ['CT', 'ME', 'MA', 'NH', 'NJ', 'NY', 'PA', 'RI', 'VT'],
                'southeast': ['AL', 'AR', 'FL', 'GA', 'KY', 'LA', 'MS', 'NC', 'SC', 'TN', 'VA', 'WV'],
                'southwest': ['AZ', 'NM', 'OK', 'TX'],
                'west': ['CA', 'CO', 'MT', 'NV', 'UT', 'WY']
            }
            
            # Cities by state (just a few examples)
            cities = {
                'WA': ['Seattle', 'Tacoma', 'Spokane', 'Bellevue'],
                'OR': ['Portland', 'Eugene', 'Salem', 'Bend'],
                'CA': ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento'],
                'TX': ['Houston', 'Dallas', 'Austin', 'San Antonio'],
                'NY': ['New York', 'Buffalo', 'Rochester', 'Syracuse'],
                'FL': ['Miami', 'Orlando', 'Tampa', 'Jacksonville']
            }
            
            # Get states for this region
            region_states = states_by_region.get(project.region, ['CA', 'TX', 'NY', 'FL'])
            
            for i in range(num_sites):
                # Pick a random state for this region
                state = random.choice(region_states)
                
                # Pick a city or generate a generic one if not in our list
                if state in cities:
                    city = random.choice(cities[state])
                else:
                    city = f"{state} City {random.randint(1, 5)}"
                
                # Generate latitude and longitude based on region for more realistic clustering
                if project.region == 'pnw':
                    lat = random.uniform(42, 49)
                    lng = random.uniform(-125, -116)
                elif project.region == 'midwest':
                    lat = random.uniform(36, 49)
                    lng = random.uniform(-104, -80)
                elif project.region == 'northeast':
                    lat = random.uniform(40, 47)
                    lng = random.uniform(-80, -67)
                elif project.region == 'southeast':
                    lat = random.uniform(25, 39)
                    lng = random.uniform(-94, -75)
                elif project.region == 'southwest':
                    lat = random.uniform(26, 37)
                    lng = random.uniform(-109, -94)
                elif project.region == 'west':
                    lat = random.uniform(32, 42)
                    lng = random.uniform(-124, -109)
                else:
                    lat = random.uniform(25, 49)
                    lng = random.uniform(-125, -70)
                
                site = Site(
                    name=f"{project.name} Site {i+1}",
                    address=f"{random.randint(100, 9999)} Main St",
                    city=city,
                    state=state,
                    zip_code=f"{random.randint(10000, 99999)}",
                    latitude=lat,
                    longitude=lng,
                    status=project.status,
                    project_id=project.id
                )
                
                db.session.add(site)
        
        # Commit all sites
        db.session.commit()
        print(f"Created sample sites for all projects.")

if __name__ == '__main__':
    create_sample_data()
