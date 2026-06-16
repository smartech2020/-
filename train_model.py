# -*- coding: utf-8 -*-
"""
Academic Risk Prediction Model Training Script
For Khwarizmi & Scientific Olympiad projects.
Trains Logistic Regression, Random Forest, and Gradient Boosting models
to predict student academic decline and saves the best model.
"""

import os
import random
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import accuracy_score, precision_recall_fscore_support, confusion_matrix
import joblib

def generate_synthetic_data(num_records=5000):
    print(f"Generating {num_records} realistic academic records...")
    
    np.random.seed(42)
    random.seed(42)
    
    ages = np.random.randint(15, 19, size=num_records)
    grades = np.random.choice([10, 11, 12], size=num_records, p=[0.35, 0.33, 0.32])
    genders = np.random.choice(['دختر', 'پسر'], size=num_records)
    
    # Study hours (strongly correlated with higher scores, lower risk)
    study_hours = np.random.normal(3.0, 1.2, size=num_records)
    study_hours = np.clip(study_hours, 0.5, 8.0)
    
    # Sleep hours
    sleep_hours = np.random.normal(7.0, 1.0, size=num_records)
    sleep_hours = np.clip(sleep_hours, 4.0, 10.0)
    
    # Absences (strongly correlated with high risk)
    absences = np.random.negative_binomial(2, 0.4, size=num_records)
    absences = np.clip(absences, 0, 25)
    
    # Prior GPA (0-20 Iranian scale. Strongest risk indicator)
    gpas = np.random.normal(15.5, 3.0, size=num_records)
    gpas = np.clip(gpas, 6.0, 20.0)
    
    homework = np.random.choice(['کامل', 'ناقص', 'عدم انجام'], size=num_records, p=[0.6, 0.3, 0.1])
    
    # Screen usage
    mobile_hours = np.random.normal(3.2, 1.5, size=num_records)
    mobile_hours = np.clip(mobile_hours, 0.5, 9.0)
    
    internet_hours = np.random.normal(2.8, 1.3, size=num_records)
    internet_hours = np.clip(internet_hours, 0.5, 8.0)
    
    parental_support = np.random.choice(['بالا', 'متوسط', 'کم'], size=num_records, p=[0.5, 0.35, 0.15])
    motivation = np.random.choice(['زیاد', 'متوسط', 'کم'], size=num_records, p=[0.45, 0.4, 0.15])
    class_participation = np.random.choice(['فعال', 'معمولی', 'منفعل'], size=num_records, p=[0.5, 0.35, 0.15])
    
    # Calculate academic risk index
    risk_score = (20.0 - gpas) * 3.5 + absences * 2.2 + (6.0 - study_hours) * 4.0 + (7.5 - sleep_hours) * 1.5 + mobile_hours * 1.5 + internet_hours * 1.0
    
    # Map categorical adjustments
    for i in range(num_records):
        if homework[i] == 'عدم انجام':
            risk_score[i] += 12
        elif homework[i] == 'ناقص':
            risk_score[i] += 6
            
        if parental_support[i] == 'کم':
            risk_score[i] += 10
        elif parental_support[i] == 'متوسط':
            risk_score[i] += 4
            
        if motivation[i] == 'کم':
            risk_score[i] += 12
        elif motivation[i] == 'متوسط':
            risk_score[i] += 5
            
        if class_participation[i] == 'منفعل':
            risk_score[i] += 10
        elif class_participation[i] == 'معمولی':
            risk_score[i] += 3
            
        # Add random noise
        risk_score[i] += np.random.normal(0, 4)
        
    # Bucketing Academic Risk
    # High risk, Medium risk, Low risk (زیاد، متوسط، کم)
    academic_risk = []
    for r in risk_score:
        if r >= 48:
            academic_risk.append('High')
        elif r >= 26:
            academic_risk.append('Medium')
        else:
            academic_risk.append('Low')
            
    df = pd.DataFrame({
        'سن': ages,
        'جنسیت': genders,
        'پایه_تحصیلی': grades,
        'ساعات_مطالعه': np.round(study_hours, 1),
        'ساعات_خواب': np.round(sleep_hours, 1),
        'غیبت': absences,
        'وضعیت_تکالیف': homework,
        'معدل_قبلی': np.round(gpas, 2),
        'استفاده_موبایل': np.round(mobile_hours, 1),
        'استفاده_اینترنت': np.round(internet_hours, 1),
        'حمایت_والدین': parental_support,
        'انگیزه_تحصیلی': motivation,
        'مشارکت_کلاسی': class_participation,
        'academic_risk': academic_risk
    })
    
    os.makedirs('data', exist_ok=True)
    df.to_csv('data/student_dataset.csv', index=False, encoding='utf-8')
    print("Dataset successfully generated and saved to data/student_dataset.csv")
    return df

def train_and_evaluate():
    # Load dataset
    if not os.path.exists('data/student_dataset.csv'):
        df = generate_synthetic_data()
    else:
        df = pd.read_csv('data/student_dataset.csv', encoding='utf-8')
        print("Dataset loaded from existing data/student_dataset.csv")
        
    df_encoded = df.copy()
    
    # Encoders map
    encoders = {}
    categorical_cols = ['جنسیت', 'وضعیت_تکالیف', 'حمایت_والدین', 'انگیزه_تحصیلی', 'مشارکت_کلاسی']
    for col in categorical_cols:
        le = LabelEncoder()
        df_encoded[col] = le.fit_transform(df[col])
        encoders[col] = le
        
    # Separate features and target
    X = df_encoded.drop('academic_risk', axis=1)
    y = df_encoded['academic_risk']
    
    # Split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    models = {
        'Logistic Regression': LogisticRegression(max_iter=1000, random_state=42),
        'Random Forest': RandomForestClassifier(n_estimators=150, max_depth=12, random_state=42),
        'Gradient Boosting': GradientBoostingClassifier(n_estimators=100, learning_rate=0.1, max_depth=6, random_state=42)
    }
    
    best_acc = 0
    best_model_name = ""
    best_model = None
    results = {}
    
    print("\n--- Training & Evaluating Models ---")
    for name, model in models.items():
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        
        acc = accuracy_score(y_test, y_pred)
        precision, recall, f1, _ = precision_recall_fscore_support(y_test, y_pred, average='weighted')
        cm = confusion_matrix(y_test, y_pred, labels=['Low', 'Medium', 'High'])
        
        results[name] = {
            'accuracy': acc,
            'precision': precision,
            'recall': recall,
            'f1_score': f1,
            'confusion_matrix': cm.tolist()
        }
        
        print(f"\nModel: {name}")
        print(f"  Accuracy:  {acc:.4f}")
        print(f"  Precision: {precision:.4f}")
        print(f"  Recall:    {recall:.4f}")
        print(f"  F1 Score:  {f1:.4f}")
        print(f"  Confusion Matrix:\n{cm}")
        
        if acc > best_acc:
            best_acc = acc
            best_model_name = name
            best_model = model

    print(f"\n>>> Best Model Selected: {best_model_name} with Accuracy {best_acc:.4f}")
    
    # Feature Importance (For RF/GB)
    feature_importances = {}
    if hasattr(best_model, 'feature_importances_'):
        importances = best_model.feature_importances_
        features = X.columns
        feature_importances = dict(zip(features, importances))
        # Sort
        feature_importances = dict(sorted(feature_importances.items(), key=lambda item: item[1], reverse=True))
        print("\nFeature Importances from Best Model (XAI):")
        for f, imp in feature_importances.items():
            print(f"  {f}: {imp:.4f}")

    # Save the best model, encoders, and extra data
    os.makedirs('model', exist_ok=True)
    model_payload = {
        'model': best_model,
        'model_name': best_model_name,
        'encoders': encoders,
        'feature_names': list(X.columns),
        'feature_importances': feature_importances,
        'evaluation_results': results
    }
    
    joblib.dump(model_payload, 'model/academic_risk_model.pkl')
    print("\nBest model successfully saved to model/academic_risk_model.pkl")

if __name__ == "__main__":
    train_and_evaluate()
