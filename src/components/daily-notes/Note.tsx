import React from 'react';

export default function DailyNote() {
  return (
    <div className="daily-note">
      <div className="header">
        <h3>Notes</h3>
        <div className="timeline">
          <button>Select date</button>
          <button>Yesterday</button>
          <button>Tomorrow</button>
        </div>
      </div>
    </div>
  );
}
