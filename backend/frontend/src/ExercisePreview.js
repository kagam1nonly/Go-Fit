import React from 'react';

const ExercisePreview = ({ exercise }) => {
  return (
    <div className="exercise-preview">
      <p><strong>Exercise:</strong> {exercise.name}</p>
      <p><strong>Description:</strong> {exercise.description}</p>
    </div>
  );
};

export default ExercisePreview;