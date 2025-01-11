import React, { useState, useRef, useEffect } from "react";
    import { useSelector, useDispatch } from "react-redux";
    import TaskModal from "../modals/TaskModal";
    import "../styles/Column&Task.css";
    import boardsSlice from "../redux/boardsSlice";
    import viewTaskIcon from "../assets/icon-vertical-ellipsis.svg";
    import AddEditTaskModal from "../modals/AddEditTaskModal";

    export default function Task({ taskIndex, colIndex }) {
      const dispatch = useDispatch();
      const boards = useSelector((state) => state.boards);
      const board = boards.find((board) => board.isActive === true);
      const columns = board.columns;
      const col = columns.find((col, i) => i === colIndex);
      const task = col.tasks.find((task, i) => i === taskIndex);
      const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
      const [isEditing, setIsEditing] = useState(false);
      const [taskTitle, setTaskTitle] = useState(task.title);
      const inputRef = useRef(null);
      const [isEditModalOpen, setIsEditModalOpen] = useState(false);

      let completed = 0;
      let subtasks = task.subtasks;
      subtasks.forEach((subtask) => {
        if (subtask.isCompleted) {
          completed++;
        }
      });

      const handleOnDrag = (e) => {
        e.dataTransfer.setData("text", JSON.stringify({taskIndex, prevColIndex: colIndex}));
      }

      const handleDoubleClick = () => {
        setIsEditing(true);
      };

      const handleBlur = () => {
        setIsEditing(false);
        if (taskTitle.trim() !== task.title) {
          dispatch(boardsSlice.actions.editTaskTitle({
            taskIndex,
            colIndex,
            newTitle: taskTitle
          }))
        }
      };

      const handleChange = (e) => {
        setTaskTitle(e.target.value);
      };

      const handleSubtaskClick = (subtaskIndex) => {
        dispatch(boardsSlice.actions.setSubtaskCompleted({
          index: subtaskIndex,
          taskIndex,
          colIndex
        }))
      }

      const handleViewTaskClick = (e) => {
        e.stopPropagation();
        setIsTaskModalOpen(true);
      };

      const handleTaskClick = () => {
          if (!isEditing) {
            setIsEditModalOpen(true);
          }
      };

      useEffect(() => {
        if (isEditing && inputRef.current) {
          inputRef.current.focus();
        }
      }, [isEditing]);

      return (
        <div>
          <div
            draggable
            onDragStart={handleOnDrag}
            className="task"
            onClick={handleTaskClick}
          >
            {isEditing ? (
              <input
                type="text"
                ref={inputRef}
                value={taskTitle}
                onBlur={handleBlur}
                onChange={handleChange}
                className="task-title-input heading-M"
              />
            ) : (
              <div className="task-title-container">
                <p className="task-title heading-M" onDoubleClick={handleDoubleClick}>
                  {taskTitle}
                </p>
                <div className="task-icons">
                  <img
                    src={viewTaskIcon}
                    alt="view task"
                    className="view-task-icon"
                    onClick={handleViewTaskClick}
                  />
                </div>
              </div>
            )}
            <div className="subtasks-container">
              {subtasks.map((subtask, index) => (
                <div key={index} className="subtask-item" onClick={() => handleSubtaskClick(index)}>
                  <span className={`subtask-checkbox ${subtask.isCompleted ? 'completed' : ''}`}></span>
                  <span className={`subtask-text text-M ${subtask.isCompleted ? 'completed' : ''}`}>{subtask.title}</span>
                </div>
              ))}
            </div>
            <p className="num-of-subtasks text-M">
              {completed} of {subtasks.length} subtasks
            </p>
          </div>
          {isTaskModalOpen && (
            <TaskModal
              colIndex={colIndex}
              taskIndex={taskIndex}
              setIsTaskModalOpen={setIsTaskModalOpen}
            />
          )}
          {isEditModalOpen && (
            <AddEditTaskModal
              setIsAddTaskModalOpen={setIsEditModalOpen}
              setIsTaskModalOpen={setIsEditModalOpen}
              type="edit"
              taskIndex={taskIndex}
              prevColIndex={colIndex}
            />
          )}
        </div>
      );
    }
