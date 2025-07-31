import React from 'react';
import { Users, Trash2 } from 'lucide-react';

const StudentList = ({ students, onRemoveStudent }) => {
  if (students.length === 0) {
    return (
      <div className="empty-state">
        <Users size={48} />
        <p>No students connected yet</p>
        <small>Students will appear here when they join</small>
      </div>
    );
  }

  return (
    <div className="student-list">
      {students.map((student) => (
        <div key={student.studentId} className="student-item">
          <div className="student-info">
            <span className="student-name">{student.studentName}</span>
            <span className="student-status">Connected</span>
          </div>
          <button
            className="btn btn-danger"
            onClick={() => onRemoveStudent(student.studentId)}
            title="Remove student"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default StudentList; 