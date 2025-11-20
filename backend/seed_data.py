# Database Seeder
# Populates database with sample menu items

from app import db
from models.models import MenuItem

def seed_menu_items():
    """
    Seeds the database with 5 sample menu items
    Run this script once to populate initial data
    """
    
    # Check if menu items already exist
    existing_count = db.menu_items.count_documents({})
    if existing_count > 0:
        print(f"Database already has {existing_count} menu items. Skipping seed.")
        return
    
    # Sample menu items with images
    sample_items = [
        MenuItem.create(
            name="Masala Dosa",
            description="Crispy dosa filled with spiced potato masala, served with sambar and chutney",
            price=60,
            category="South Indian",
            image_url="https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500",
            is_available=True
        ),
        MenuItem.create(
            name="Veg Biryani",
            description="Fragrant basmati rice cooked with mixed vegetables and aromatic spices",
            price=120,
            category="Main Course",
            image_url="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500",
            is_available=True
        ),
        MenuItem.create(
            name="Paneer Butter Masala",
            description="Cottage cheese cubes in rich tomato and butter gravy with cream",
            price=150,
            category="Main Course",
            image_url="https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500",
            is_available=True
        ),
        MenuItem.create(
            name="Cold Coffee",
            description="Refreshing iced coffee blended with milk and ice cream",
            price=50,
            category="Beverages",
            image_url="https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=500",
            is_available=True
        ),
        MenuItem.create(
            name="Samosa (2 pcs)",
            description="Crispy fried pastry filled with spiced potatoes and peas",
            price=30,
            category="Snacks",
            image_url="https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500",
            is_available=True
        )
    ]
    
    # Insert all items
    result = db.menu_items.insert_many(sample_items)
    
    print(f"Successfully seeded {len(result.inserted_ids)} menu items!")
    print("Sample menu items added to database.")

if __name__ == '__main__':
    seed_menu_items()
