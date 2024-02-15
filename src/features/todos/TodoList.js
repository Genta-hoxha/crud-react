import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faUpload } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import {
  useGetTodosQuery,
  useAddTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} from "../api/apiSlice";
import Modal from "./Modal";

const TodoList = () => {
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [addInEdit, setAddInEdit] = useState({
    show: false,
    id: null,
  });
  const [editInputTitle, setEditInputTitle] = useState("");
  const [editInputDescription, setEditInputDescription] = useState("");
  const [expandedIds, setExpandedIds] = useState([]);
  const {
    data: todos,
    isLoading,
    isSuccess,
    isError,
    error,
    refetch: refetchTodos,
  } = useGetTodosQuery();
  const [addTodo] = useAddTodoMutation();
  const [updateTodo] = useUpdateTodoMutation();
  const [deleteTodo] = useDeleteTodoMutation();
  const [modalIsShown, setModalIsShown] = useState(false);
  const [addedItem, setAddedItem] = useState(null);

  const showModal = () => {
    setModalIsShown(true);
  };

  const hideModal = () => {
    setModalIsShown(false);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    addTodo({
      userId: 1,
      title: newTodoTitle,
      description: newDescription,
      completed: false,
    })
      .unwrap()
      .then((response) => {
        const newItem = response.payload;
        setNewTodoTitle("");
        setNewDescription("");
        hideModal();
        setAddedItem({
          title: newItem.title,
          description: newItem.description,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const editItem = (id) => {
    setAddInEdit({ show: true, id });

    const currentItem = todos.find((todo) => todo.id === id);
    if (currentItem) {
      setEditInputTitle(currentItem.title || "");
      setEditInputDescription(currentItem.description || "");
    }
  };

  const funEditUpdate = (event) => {
    setEditInputTitle(event.target.value.trim());
  };

  const funDescriptionUpdate = (event) => {
    setEditInputDescription(event.target.value.trim());
  };
  const handleEditSubmit = () => {
    if (addInEdit.id && editInputTitle && editInputDescription) {
      updateTodo({
        id: addInEdit.id,
        title: editInputTitle,
        description: editInputDescription,
      })
        .unwrap()
        .then(() => {
          setAddInEdit({ show: false, id: null });
          setEditInputTitle("");
          setEditInputDescription("");
          refetchTodos();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const toggleExpand = (id) => {
    console.log("expand");
    setExpandedIds((prevIds) =>
      prevIds.includes(id)
        ? prevIds.filter((prevId) => prevId !== id)
        : [...prevIds, id]
    );
  };
  const newItemSection = (
    <>
      <div>
        <button onClick={showModal} className="btn">
          Create new Item +
        </button>
        <Modal isOpen={modalIsShown}>
          <h2>Create a New Todo Item</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="title">Title </label>
            <input
              type="text"
              name="title"
              id="new-todo"
              required
              onChange={(e) => setNewTodoTitle(e.target.value)}
            />
            <br /> <br />
            <label htmlFor="description">Description </label>
            <textarea
              rows="4"
              cols="30"
              name="description"
              form="usrform"
              id="new-todo1"
              type="text"
              required
              onChange={(e) => setNewDescription(e.target.value)}
            ></textarea>
            <div className="buttons">
              <button type="submit">Submit</button>
              <button onClick={hideModal}>Close</button>
            </div>{" "}
          </form>
        </Modal>
      </div>
    </>
  );

  let content = null;

  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (isSuccess) {
    content = (
      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id}>
            <article onClick={() => toggleExpand(todo.id)}>
              <div
                className={`todo${
                  expandedIds.includes(todo.id) ? "-expanded" : ""
                }`}
              >
                <div className="switchheader">
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() =>
                        updateTodo({
                          ...todo,
                          completed: !todo.completed,
                        })
                      }
                    />

                    <span className="slider"></span>
                  </label>
                </div>

                {addInEdit.show && addInEdit.id === todo.id ? (
                  <div className="editing">
                    <input
                      type="text"
                      placeholder="Edit Title"
                      onChange={funEditUpdate}
                      value={editInputTitle}
                    />
                    {/* <input
                      type="text"
                      placeholder="Edit Description"
                      onChange={funDescriptionUpdate}
                      value={editInputDescription}
                    /> */}
                    <textarea
                      rows="4"
                      cols="50"
                      name="comment"
                      form="usrform"
                      type="text"
                      onChange={funDescriptionUpdate}
                      value={editInputDescription}
                    ></textarea>
                    <button className="save" onClick={handleEditSubmit}>
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="content">
                    <label htmlFor={todo.id} id="title">
                      {todo.title || "Untitled"}
                    </label>

                    <label htmlFor={todo.id} id="description">
                      {todo.description || "Untitled"}
                    </label>
                  </div>
                )}
              </div>
              <div className="editdelete">
                {!addInEdit.show && (
                  <button className="edit" onClick={() => editItem(todo.id)}>
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                )}
                <button
                  className="trash"
                  onClick={() =>
                    deleteTodo({ id: todo.id })
                      .unwrap()
                      .then(() => refetchTodos())
                      .catch((error) => {
                        console.log(error);
                      })
                  }
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </article>
          </li>
        ))}
      </ul>
    );
  } else if (isError) {
    content = <p>{error.message}</p>;
  }
  return (
    <main className="todo-container">
      <h1>Todo List</h1>
      <a>{newItemSection}</a>
      {content}
      {/* {addedItem && (
        <div className="added-item">
          <p>Added Item:</p>
          <p>Title: {addedItem.title}</p>
          <p>Description: {addedItem.description}</p>
        </div>
      )} */}
    </main>
  );
};

//   return (
//     <main className="todo-container">
//       <h1>Todo List</h1>
//       <a>{newItemSection}</a>
//       {content}
//     </main>
//   );
// };

export default TodoList;
