import React, { Component } from 'react';
import "./index.css";
import Board from '../Board'; // Assuming Board is a separate component
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTasks, faClipboardList, faCheckCircle, faList } from '@fortawesome/free-solid-svg-icons'; // Icons

class Display extends Component {
  state = {
    mainobj: [],
    showDisplay: false,
    todos: [],
    progress: [],
    done: [],
    backlog: [],
    canceled: [],
    usergroup: [],
    Urgent: [],
    High: [],
    Medium: [],
    Low: [],
    Nopriority: [],
    user: false,
    status: true,
    priority: false,
    titlesort: false,
    prioritysort: false,
  };
  getapi = async () => {
    try {
      const response = await fetch("https://api.quicksell.co/v1/internal/frontend-assignment");
      const data = await response.json();
      this.setState({ mainobj: data.tickets }, () => {
        this.grouping();
        this.filter();  
        this.Priority();
      });
      
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  Priority = () => {
    const { mainobj } = this.state;

    const Urgent = mainobj.filter((object) => object.priority === 4);
    const High = mainobj.filter((object) => object.priority === 3);
    const Medium = mainobj.filter((object) => object.priority === 2);
    const Low = mainobj.filter((object) => object.priority === 1);
    const Nopriority = mainobj.filter((object) => object.priority === 0); // Fixed priority check
    this.setState({ Urgent, High, Medium, Low, Nopriority });
  }
  grouping = () => {
    const { mainobj } = this.state;
    const reqobj = [];
    for (let i = 1; i <= 5; i++) {
      const userGroup = mainobj.filter((object) => object.userId === `usr-${i}`);
      reqobj.push(userGroup);
    }
    this.setState({ usergroup: reqobj });
  }

  filter = () => {
    const { mainobj } = this.state;

    if (mainobj.length > 0) {
      const todos = mainobj.filter((object) => object.status === "Todo");
      const progress = mainobj.filter((object) => object.status === "In progress");
      const done = mainobj.filter((object) => object.status === "Done");
      const backlog = mainobj.filter((object) => object.status === "Backlog");
      const canceled = mainobj.filter((object) => object.status === "Canceled");

      this.setState({ todos, progress, done, backlog, canceled });
    }
  };

  groupselect = (event) => {
    const value = event.target.value;
    this.setState({
      user: value === "user",
      status: value === "status",
      priority: value === "priority"
    });
  }

  componentDidMount() {
    const savedState = localStorage.getItem("displayState");
    if (savedState) {
      this.setState(JSON.parse(savedState));
    } else {
      this.getapi();  
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state !== prevState) {
      localStorage.setItem("displayState", JSON.stringify(this.state));
    }
  }

  order = (event) => {
    const value = event.target.value;
    this.setState({
      prioritysort: value === "priority",
      titlesort: value === "title"
    });
  }

  render() {
    const { showDisplay, todos, progress, backlog, done, canceled, usergroup } = this.state;

    return (
      <div className="main-page">
        <button className="main-page-button" onClick={() => this.setState({ showDisplay: !showDisplay })}>
          <FontAwesomeIcon icon={faTasks} /> Display
        </button>

        {showDisplay && (
          <div className="absolute top-full mt-2 bg-white p-4 rounded shadow-lg">
            <div className="mb-4">
              <label className="block text-sm mb-2">Grouping</label>
              <select onChange={this.groupselect} >
                <option value="status" selected={this.state.status}>Status</option>
                <option value="user" selected={this.state.user}>User</option>
                <option value="priority" selected={this.state.priority}>Priority</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-2">Ordering</label>
              <select onChange={this.order}>
                <option value="default">Default</option>
                <option value="priority" selected={this.state.prioritysort}>Priority</option>
                <option value="title" selected={this.state.titlesort}>Title</option>
              </select>
            </div>
          </div>
        )}

        {this.state.status && (
          <div className="board-row">
            <Board title={<><FontAwesomeIcon icon={faList} /> Backlog</>} tasks={backlog} sort={false} prioritysort={this.state.prioritysort} titlesort={this.state.titlesort} />
            <Board title={<><FontAwesomeIcon icon={faTasks} /> Todo</>} tasks={todos} />
            <Board title={<><FontAwesomeIcon icon={faClipboardList} /> In Progress</>} tasks={progress} />
            <Board title={<><FontAwesomeIcon icon={faCheckCircle} /> Done</>} tasks={done} />
            <Board title="Canceled" tasks={canceled} />
          </div>
        )}
        
        {this.state.user && (
          <div className="board-row">
            {usergroup.map((object, index) => (
              <Board key={index} title={object[0]?.userId || "Unknown User"} tasks={object} prioritysort={this.state.prioritysort} titlesort={this.state.titlesort} />
            ))}
          </div>
        )}

        {this.state.priority && (
          <div className="board-row">
            <Board title={<><FontAwesomeIcon icon={faList} /> Urgent</>} tasks={this.state.Urgent} />
            <Board title={<><FontAwesomeIcon icon={faTasks} /> High</>} tasks={this.state.High} prioritysort={this.state.prioritysort} titlesort={this.state.titlesort} />
            <Board title={<><FontAwesomeIcon icon={faClipboardList} /> Medium</>} tasks={this.state.Medium} prioritysort={this.state.prioritysort} titlesort={this.state.titlesort} />
            <Board title={<><FontAwesomeIcon icon={faCheckCircle} /> No Priority</>} tasks={this.state.Nopriority} prioritysort={this.state.prioritysort} titlesort={this.state.titlesort} />
            <Board title="Canceled" tasks={canceled} prioritysort={this.state.prioritysort} titlesort={this.state.titlesort} />
          </div>
        )}
      </div>
    );
  }
}

export default Display;
