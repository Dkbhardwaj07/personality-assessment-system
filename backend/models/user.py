from sqlalchemy import Column, Integer, String, Float, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from config import DATABASE_URL

Base = declarative_base()
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    openness = Column(Float, default=0.0)
    conscientiousness = Column(Float, default=0.0)
    extraversion = Column(Float, default=0.0)
    agreeableness = Column(Float, default=0.0)
    neuroticism = Column(Float, default=0.0)

def init_db():
    Base.metadata.create_all(bind=engine)
