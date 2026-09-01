from sqlalchemy import Column, String
from app.core.database import Base

class SchemeDB(Base):
    __tablename__ = "schemes"
    
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    scope = Column(String, nullable=False)
    category = Column(String, nullable=False)
    subsidy_amount = Column(String, nullable=False)
    eligibility = Column(String, nullable=False)
    documents_required = Column(String, nullable=False) # Store comma separated or JSON string
    deadline = Column(String, nullable=False)
    portal_link = Column(String, nullable=False)
