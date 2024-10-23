import React, { Component } from 'react';
import './index.css';

class Card extends Component {
  renderFeatureIcon() {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M8 4v5M8 11v.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    );
  }

  renderCheckbox() {
    const { task } = this.props;
    return (
      <div className="round-checkbox">
        <input
          type="checkbox"
          id={`checkbox-${task.id}`}
          checked={task.completed}
          onChange={() => this.props.onTaskToggle?.(task.id)}
        />
        <label htmlFor={`checkbox-${task.id}`}></label>
      </div>
    );
  }

  render() {
    const { task } = this.props;
    
    return (
      <div className="card-container">
        <div className="card-content">
          <div className="card-header">
            <span className="task-id">{task.id}</span>
            <div className="profile-image">
              <img 
                src="../profile.png" 
                alt="User avatar"
                onError={(e) => {
                  e.target.src = "/api/placeholder/32/32";
                }}
              />
            </div>
          </div>
          <div className="title-row">
            {this.renderCheckbox()}
            <h3 className="task-title">{task.title}</h3>
          </div>
          <div className="task-tag">
            <span className="tag-icon">
              {this.renderFeatureIcon()}
            </span>
            <span className="tag-text">{task.tag || "Feature Request"}</span>
          </div>
        </div>
      </div>
    );
  }
}

export default Card;