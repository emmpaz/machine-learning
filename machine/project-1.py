from sklearn import datasets
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler


from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, classification_report


import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
iris = datasets.load_iris()

#feature variables
#the data that should dictate the classification in the target variable
X = iris.data

#target variable
#the target is multi-classification (setosa, versicolor, virginica)
y = iris.target

#splitting the features by 2'0'% for testing and 8'0'% for training
X_train, X_test, y_train, y_test  = train_test_split(X, y, test_size=.5, random_state=42)

#scale the training and testing sets to normalize any larger magnitudes
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

#initialize the models
logisitic_regression = LogisticRegression(random_state=42)
decision_tree = DecisionTreeClassifier(random_state=42)
svm = SVC(random_state=42)

#train the models with the training datasets
logisitic_regression.fit(X_train_scaled, y_train)
decision_tree.fit(X_train_scaled, y_train)
svm.fit(X_train_scaled, y_train)

#start predicting on the testing dataset
lr_predictions = logisitic_regression.predict(X_test_scaled)
dt_predictions = decision_tree.predict(X_test_scaled)
svm_predictions = svm.predict(X_test_scaled)

#calculate the accuracies for each

#if we increase the testing dataset (decrease training set), accuracy decreases
lr_accuracy = accuracy_score(y_test, lr_predictions)
dt_accuracy = accuracy_score(y_test, dt_predictions)
svm_accuracy = accuracy_score(y_test, svm_predictions)

print("Logistic Regression accuracy:", lr_accuracy)
print("Decision Tree accuracy:", dt_accuracy)
print("SVM accuracy:", svm_accuracy)

# Accuracy: overall correctness of model
# Precision: ability of the model to correctly identify positive instances
# Recall: measures ability to find all positive instances, ratio of true positive predictions to total actual positives
#       - important when the cost of false negatives is high
# F1-score: harmonic mean of precision and recall
#       - provides a balanced measure of the models's performance
#       - 2 * (precision * recall) / (precision + recall)
#       - useful when class distribution is uneven
# Support: the number of instances of each class in the testing set
#       - indicator of the class distribution in the dataset
# 
# 

def extract_values(report):
    return [
        [report['0']['precision'], report['0']['recall'], report['0']['f1-score']],
        [report['1']['precision'], report['1']['recall'], report['1']['f1-score']],
        [report['2']['precision'], report['2']['recall'], report['2']['f1-score']],
        [report['macro avg']['precision'], report['macro avg']['recall'], report['macro avg']['f1-score']],
        [report['weighted avg']['precision'], report['weighted avg']['recall'], report['weighted avg']['f1-score']]
    ]

lr_report = classification_report(y_test, lr_predictions, output_dict=True)
dt_report = classification_report(y_test, dt_predictions, output_dict=True)
svm_report = classification_report(y_test, svm_predictions, output_dict=True)

lr_values = extract_values(lr_report)
dt_values = extract_values(dt_report)
svm_values = extract_values(svm_report)

report_values = [lr_values, dt_values, svm_values]

report_values = np.array(report_values).reshape(3, -1)

labels = ['Logisitc Regression', 'Decision Tree', 'SVM']

fig, ax = plt.subplots(figsize=(10,6))
sns.heatmap(report_values, annot=True, cmap='YlGnBu', xticklabels=['Precision', 'Recall', 'F1-score'], yticklabels=labels + ['', ''], ax=ax)

ax.set_title('Classification Report Heatmap')
ax.set_xlabel('Metrics')
ax.set_ylabel('Algorithms')

plt.tight_layout()
plt.show()