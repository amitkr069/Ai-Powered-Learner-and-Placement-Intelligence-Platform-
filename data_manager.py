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
    y = ((df['coding_score'] > 70) & (df['communication_score'] > 70)).astype(int)
    X = df[['coding_score', 'aptitude_score', 'communication_score']]
    
    model = RandomForestClassifier(n_estimators=100)
    model.fit(X, y)
    joblib.dump(model, 'models/placement_rf.pkl')
    print("Random Forest model trained and saved.")

if __name__ == "__main__":
    generate_initial_data()
    train_model()