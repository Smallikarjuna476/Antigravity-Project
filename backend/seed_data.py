import uuid
from app.core.database import SessionLocal, Base, engine
from app.core.security import get_password_hash
from app.models.user import User
from app.models.disease import DiseaseRecord, ExpertContact
from app.services.ai_disease_engine import DISEASE_KNOWLEDGE_BASE

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # 1. Seed Users for all 4 roles
        demo_users = [
            {
                "email": "farmer@agrisense.ai",
                "full_name": "Ramesh Gowda",
                "password": "password123",
                "role": "farmer",
                "phone": "+91 98451 23456",
                "state": "Karnataka",
                "district": "Mysuru",
                "farm_size_acres": 4.5,
                "primary_crops": "Tomato, Potato, Rice, Sugarcane"
            },
            {
                "email": "officer@agrisense.ai",
                "full_name": "Dr. Sunita Deshmukh",
                "password": "password123",
                "role": "officer",
                "phone": "+91 94220 87654",
                "state": "Maharashtra",
                "district": "Pune",
                "farm_size_acres": 0.0,
                "primary_crops": "Regional Horticulture Extension"
            },
            {
                "email": "researcher@agrisense.ai",
                "full_name": "Prof. Arvind Swaminathan",
                "password": "password123",
                "role": "researcher",
                "phone": "+91 97890 54321",
                "state": "Tamil Nadu",
                "district": "Coimbatore",
                "farm_size_acres": 0.0,
                "primary_crops": "AI Agronomy & Pathology"
            },
            {
                "email": "admin@agrisense.ai",
                "full_name": "AgriSense Super Admin",
                "password": "adminpassword123",
                "role": "admin",
                "phone": "+91 80000 12345",
                "state": "Karnataka",
                "district": "Bengaluru",
                "farm_size_acres": 0.0,
                "primary_crops": "System Administration"
            }
        ]

        for u in demo_users:
            existing = db.query(User).filter(User.email == u["email"]).first()
            if not existing:
                user = User(
                    email=u["email"],
                    full_name=u["full_name"],
                    hashed_password=get_password_hash(u["password"]),
                    role=u["role"],
                    phone=u["phone"],
                    state=u["state"],
                    district=u["district"],
                    farm_size_acres=u["farm_size_acres"],
                    primary_crops=u["primary_crops"],
                    is_active=True,
                    is_verified=True
                )
                db.add(user)
        
        # 2. Seed Disease Records Encyclopedia
        for key, d in DISEASE_KNOWLEDGE_BASE.items():
            existing_rec = db.query(DiseaseRecord).filter(
                DiseaseRecord.crop_name == d["crop"],
                DiseaseRecord.disease_name == d["disease"]
            ).first()
            if not existing_rec:
                rec = DiseaseRecord(
                    crop_name=d["crop"],
                    disease_name=d["disease"],
                    scientific_name=d.get("scientific_name", ""),
                    category=d.get("category", "Fungal"),
                    severity_default=d.get("severity", "Moderate"),
                    symptoms=d["symptoms"],
                    cause=d["cause"],
                    organic_treatment=d["organic_treatment"],
                    chemical_treatment=d["chemical_treatment"],
                    prevention_tips=d["prevention_tips"],
                    favorable_conditions=d.get("favorable_conditions", "Warm and humid conditions")
                )
                db.add(rec)

        # 3. Seed Regional Krishi Vigyan Kendras (KVK) & Agriculture Officers
        experts = [
            {
                "name": "Dr. H. N. Shivakumar",
                "designation": "Senior Plant Pathologist",
                "organization": "ICAR - Krishi Vigyan Kendra (KVK)",
                "district": "Mysuru",
                "state": "Karnataka",
                "phone": "+91 821 2548200",
                "email": "kvkmysuru@icar.gov.in",
                "specialization": "Solanaceous & Paddy Pathology, Biological Pest Management",
                "latitude": 12.2958,
                "longitude": 76.6394,
                "availability": "Mon - Fri (9:30 AM - 5:00 PM)"
            },
            {
                "name": "Dr. Prathibha Patil",
                "designation": "Agronomist & Extension Specialist",
                "organization": "University of Agricultural Sciences (UAS)",
                "district": "Bengaluru",
                "state": "Karnataka",
                "phone": "+91 80 23330153",
                "email": "extension@uasbangalore.edu.in",
                "specialization": "Integrated Pest Management (IPM), Precision Fertigation",
                "latitude": 13.0768,
                "longitude": 77.5753,
                "availability": "Mon - Sat (9:00 AM - 5:30 PM)"
            },
            {
                "name": "Dr. Vijay Kulkarni",
                "designation": "Principal Crop Scientist",
                "organization": "ICAR - National Institute of Abiotic Stress Management",
                "district": "Pune",
                "state": "Maharashtra",
                "phone": "+91 2112 254057",
                "email": "kvkpune@niam.res.in",
                "specialization": "Sugarcane, Grape & Cotton Disease Diagnostics",
                "latitude": 18.5204,
                "longitude": 73.8567,
                "availability": "Mon - Fri (10:00 AM - 4:30 PM)"
            },
            {
                "name": "Dr. K. Annamalai",
                "designation": "Chief Horticulture Officer",
                "organization": "Tamil Nadu Agricultural University (TNAU)",
                "district": "Coimbatore",
                "state": "Tamil Nadu",
                "phone": "+91 422 6611200",
                "email": "director_research@tnau.ac.in",
                "specialization": "Spices, Vegetables, and Organic Bio-remediation",
                "latitude": 11.0168,
                "longitude": 76.9558,
                "availability": "Mon - Fri (9:00 AM - 5:00 PM)"
            },
            {
                "name": "Dr. S. K. Sharma",
                "designation": "Deputy Director of Agriculture",
                "organization": "State Department of Agriculture & Farmer Welfare",
                "district": "Jaipur",
                "state": "Rajasthan",
                "phone": "+91 141 2227181",
                "email": "agri-jaipur@rajasthan.gov.in",
                "specialization": "Arid Zone Crops, Wheat Rust, Mustard Aphid Control",
                "latitude": 26.9124,
                "longitude": 75.7873,
                "availability": "Mon - Sat (9:30 AM - 6:00 PM)"
            }
        ]

        for exp in experts:
            existing_exp = db.query(ExpertContact).filter(ExpertContact.name == exp["name"]).first()
            if not existing_exp:
                ec = ExpertContact(**exp)
                db.add(ec)

        # 4. Seed Schemes
        from app.api.v1.schemes import ALL_SCHEMES
        from app.models.scheme import SchemeDB
        import json
        
        for s in ALL_SCHEMES:
            existing_s = db.query(SchemeDB).filter(SchemeDB.id == s["id"]).first()
            if not existing_s:
                scheme = SchemeDB(
                    id=s["id"],
                    name=s["name"],
                    scope=s["scope"],
                    category=s["category"],
                    subsidy_amount=s["subsidy_amount"],
                    eligibility=s["eligibility"],
                    documents_required=json.dumps(s["documents_required"]),
                    deadline=s["deadline"],
                    portal_link=s["portal_link"]
                )
                db.add(scheme)

        db.commit()
        print("Database successfully seeded with Demo Users, Disease Encyclopedia, and KVK Experts!")
    except Exception as e:
        db.rollback()
        print("Error seeding database:", e)
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
