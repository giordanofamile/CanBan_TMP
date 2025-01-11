import React, { useState } from "react";
    import { useDispatch, useSelector } from "react-redux";
    import { v4 as uuidv4 } from "uuid";
    import crossIcon from "../assets/icon-cross.svg";
    import boardsSlice from "../redux/boardsSlice";

    export default function AddEditTaskModal({
      type,
      setIsTaskModalOpen,
      setIsAddTaskModalOpen,
      taskIndex,
      prevColIndex = 0,
    }) {
      const dispatch = useDispatch();
      const [isFirstLoad, setIsFirstLoad] = useState(true);
      const [isValid, setIsValid] = useState(true);
      const [title, setTitle] = useState("");
      const [description, setDescription] = useState("");
      const board = useSelector((state) => state.boards).find(
        (board) => board.isActive
      );
      const columns = board.columns;
      const col = columns.find((col, index) => index === prevColIndex);
      const task = col ? col.tasks.find((task, index) => index === taskIndex) : [];
      const [status, setStatus] = useState(columns[prevColIndex].name);
      const [newColIndex, setNewColIndex] = useState(prevColIndex);
      const [priority, setPriority] = useState("low");
      const [project, setProject] = useState("");
      const [category, setCategory] = useState("");
      const [tags, setTags] = useState("");
      const [comments, setComments] = useState("");
      const [subtasks, setSubtasks] = useState([
        { title: "", isCompleted: false, id: uuidv4() },
        { title: "", isCompleted: false, id: uuidv4() },
      ]);
      const [projects] = useState(["Projet 1", "Projet 2", "Projet 3"]);
      const [categories] = useState(["Catégorie 1", "Catégorie 2", "Catégorie 3"]);

      if (type === "edit" && isFirstLoad) {
        setSubtasks(
          task.subtasks.map((subtask) => {
            return { ...subtask, id: uuidv4() };
          })
        );
        setTitle(task.title);
        setDescription(task.description);
        setPriority(task.priority || "low");
        setProject(task.project || "");
        setCategory(task.category || "");
        setTags(task.tags || "");
        setComments(task.comments || "");
        setIsFirstLoad(false);
      }

      const validate = () => {
        setIsValid(false);
        if (!title.trim()) {
          return false;
        }
        for (let i = 0; i < subtasks.length; i++) {
          if (!subtasks[i].title.trim()) {
            return false;
          }
        }
        setIsValid(true);
        return true;
      };

      const onChangeSubtasks = (id, newValue) => {
        setSubtasks((prevState) => {
          const newState = [...prevState];
          const subtask = newState.find((subtask) => subtask.id === id);
          subtask.title = newValue;
          return newState;
        });
      };

      const onDelete = (id) => {
        setSubtasks((prevState) => prevState.filter((el) => el.id !== id));
      };

      const onChangeStatus = (e) => {
        setStatus(e.target.value);
        setNewColIndex(e.target.selectedIndex);
      };

      const onChangePriority = (e) => {
        setPriority(e.target.value);
      };

      const onChangeProject = (e) => {
        setProject(e.target.value);
      };

      const onChangeCategory = (e) => {
        setCategory(e.target.value);
      };

      const onChangeTags = (e) => {
        setTags(e.target.value);
      };

      const onChangeComments = (e) => {
        setComments(e.target.value);
      };

      const onSubmit = (type) => {
        if (type === "add") {
          dispatch(
            boardsSlice.actions.addTask({
              title,
              description,
              subtasks,
              status,
              newColIndex,
              priority,
              project,
              category,
              tags,
              comments
            })
          );
        } else {
          dispatch(
            boardsSlice.actions.editTask({
              title,
              description,
              subtasks,
              status,
              taskIndex,
              prevColIndex,
              newColIndex,
              priority,
              project,
              category,
              tags,
              comments
            })
          );
        }
      };

      return (
        <div
          className={`modal-container ${type === "add" ? "dimmed" : ""}`}
          onClick={(e) => {
            if (e.target !== e.currentTarget) {
              return;
            }
            setIsAddTaskModalOpen(false);
          }}
        >
          <div className="modal">
            <h3>{type === "edit" ? "Modifier" : "Ajouter une nouvelle"} tâche</h3>
            <label htmlFor="task-name-input">Nom de la tâche</label>
            <div className="input-container">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                id="task-name-input"
                type="text"
                placeholder="ex: Prendre une pause café"
                className={!isValid && !title.trim() ? "red-border" : ""}
              />
              {!isValid && !title.trim() && (
                <span className="cant-be-empty-span text-L"> Ne peut pas être vide</span>
              )}
            </div>

            <label htmlFor="task-name-input">Description</label>
            <div className="description-container">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                id="task-description-input"
                placeholder="ex: Il est toujours bon de faire une pause. Cette pause de 15 minutes rechargera un peu les batteries."
              />
            </div>
            <div className="input-container">
              <label htmlFor="task-comments-input">Commentaires</label>
              <textarea
                value={comments}
                onChange={onChangeComments}
                id="task-comments-input"
                placeholder="Ajouter des commentaires ici"
              />
            </div>

            <label>Sous-tâches</label>
            <div className="modal-columns">
              {subtasks.map((subtask, index) => {
                return (
                  <div className="modal-column" key={index}>
                    <div className="input-container">
                      <input
                        onChange={(e) => {
                          onChangeSubtasks(subtask.id, e.target.value);
                        }}
                        type="text"
                        value={subtask.title}
                        className={
                          !isValid && !subtask.title.trim() ? "red-border" : ""
                        }
                      />
                      {!isValid && !subtask.title.trim() ? (
                        <span className="cant-be-empty-span text-L">
                          {" "}
                          Ne peut pas être vide
                        </span>
                      ) : null}
                    </div>
                    <img
                      src={crossIcon}
                      alt="delete-column-icon"
                      onClick={() => {
                        onDelete(subtask.id);
                      }}
                    />
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => {
                setSubtasks((state) => [
                  ...state,
                  { title: "", isCompleted: false, id: uuidv4() },
                ]);
              }}
              className="add-column-btn btn-light"
            >
              + Ajouter une sous-tâche
            </button>

            <div className="status-priority-container">
              <div className="select-column-container">
                <label className="text-M">Statut actuel</label>
                <select
                  className="select-status text-L"
                  value={status}
                  onChange={onChangeStatus}
                >
                  {columns.map((col, index) => (
                    <option className="status-options" key={index}>
                      {col.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="select-column-container">
                <label className="text-M">Priorité</label>
                <select
                  className="select-status text-L"
                  value={priority}
                  onChange={onChangePriority}
                >
                    <option className="status-options" value="low">Basse</option>
                    <option className="status-options" value="medium">Moyenne</option>
                    <option className="status-options" value="high">Haute</option>
                </select>
              </div>
            </div>
            <div className="select-column-container">
              <label className="text-M">Projet</label>
              <select
                className="select-status text-L"
                value={project}
                onChange={onChangeProject}
              >
                <option value="">Sélectionner un projet</option>
                {projects.map((proj, index) => (
                  <option className="status-options" key={index} value={proj}>
                    {proj}
                  </option>
                ))}
              </select>
            </div>
            <div className="select-column-container">
              <label className="text-M">Catégorie</label>
              <select
                className="select-status text-L"
                value={category}
                onChange={onChangeCategory}
              >
                <option value="">Sélectionner une catégorie</option>
                {categories.map((cat, index) => (
                  <option className="status-options" key={index} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="input-container">
              <label htmlFor="task-tags-input">Tags</label>
              <input
                value={tags}
                onChange={onChangeTags}
                id="task-tags-input"
                type="text"
                placeholder="ex: tag1, tag2, tag3"
              />
            </div>

            <button
              onClick={() => {
                const isValid = validate();
                if (isValid) {
                  onSubmit(type);
                  setIsAddTaskModalOpen(false);
                  type === "edit" && setIsTaskModalOpen(false);
                }
              }}
              className="create-btn"
            >
              Créer une tâche
            </button>
          </div>
        </div>
      );
    }
