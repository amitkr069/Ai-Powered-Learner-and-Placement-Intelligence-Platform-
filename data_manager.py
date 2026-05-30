import pandas as pd
import numpy as np
import os
from sklearn.ensemble import RandomForestClassifier
import joblib

def generate_initial_data():
    os.makedirs('data', exist_ok=True)
    os.makedirs('models', exist_ok=True)
    
    # learner_scores.csv
    df_scores = pd.DataFrame({
        'learner_id': range(1, 101),
        'batch': np.random.choice(['Batch_A', 'Batch_B'], 100),
        'coding_score': np.random.randint(40, 100, 100),
        'aptitude_score': np.random.randint(40, 100, 100),
        'communication_score': np.random.randint(40, 100, 100)
    })
    df_scores.to_csv('data/learner_scores.csv', index=False)

    # attendance_data.csv
    df_att = pd.DataFrame({
        'learner_id': range(1, 101),
        'attendance_pct': np.random.randint(50, 100, 100)
    })
    df_att.to_csv('data/attendance_data.csv', index=False)

    # assessment_data.csv
    df_assess = pd.DataFrame({
        'assessment_id': range(1001, 1101),
        'learner_id': np.random.randint(1, 101, 100),
        'score': np.random.randint(0, 100, 100),
        'type': np.random.choice(['Aptitude', 'Coding', 'Communication'], 100)
    })
    df_assess.to_csv('data/assessment_data.csv', index=False)
    print("Data generation complete.")


def train_model():
    df = pd.read_csv('data/learner_scores.csv')
    
    # Calculate a composite score instead of hard cutoffs
    # Give different weights to different skills
    composite_score = (df['coding_score'] * 0.5) + (df['aptitude_score'] * 0.25) + (df['communication_score'] * 0.25)
    
    # Target label: 1 if composite score > 65, else 0
    y = (composite_score > 65).astype(int) 
    
    X = df[['coding_score', 'aptitude_score', 'communication_score']]
    
    model = RandomForestClassifier(n_estimators=100, max_depth=5) # Added max_depth to prevent perfect memorization
    model.fit(X, y)
    
    joblib.dump(model, 'models/placement_rf.pkl')
    print("Model retrained with softer boundaries.")


if __name__ == "__main__":
    generate_initial_data()
    train_model()