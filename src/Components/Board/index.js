import { Component } from "react";
import Card from "../Card";
import "./index.css";

class Board extends Component {
  render() {
    const { title, tasks, titlesort, prioritysort } = this.props;
    
    let sortedTasks = [...tasks]; // Create a copy to avoid mutating props
    
    if (titlesort) {
      sortedTasks.sort((a, b) => a.title.localeCompare(b.title));
    }
    
    if (prioritysort) {
      sortedTasks.sort((a, b) => b.priority - a.priority);
    }

    return (
      <div className="board">
        <div style={{display:"flex",justifyContent:"space-between"}}>
        <h2>
          {title}
          <span>{tasks.length}</span>
              
        </h2>
        <span style={{fontSize:"20px"}}> + ...</span>
        </div>
        
        <div className="task-list">
          {sortedTasks.length > 0 ? (
            sortedTasks.map((task) => (
              <Card key={task.id} task={task} />
            ))
          ) : (
            <div className="empty-state">No tasks</div>
          )}
        </div>
      </div>
    );
  }
}

export default Board;