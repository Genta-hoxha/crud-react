import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faUpload } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import {
  useGetTodosQuery,
  useAddTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} from "../api/apiSlice";
// ... (previous imports)

const TodoList = () => {
  const [newTodo, setNewTodo] = useState("");
  const [addInEdit, setAddInEdit] = useState({
    show: false,
    id: null,
  });
  const [editInput, setEditInput] = useState("");
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

  const handleSubmit = (e) => {
    e.preventDefault();
    addTodo({ userId: 1, title: newTodo, completed: false });
    setNewTodo("");
  };

  const editItem = (id) => {
    setAddInEdit({ show: true, id });

    const currentItem = todos.find((todo) => todo.id === id);
    if (currentItem) {
      setEditInput(currentItem.title || "");
    }
  };

  const funEditUpdate = (event) => {
    setEditInput(event.target.value.trim());
  };

  const handleEditSubmit = () => {
    if (addInEdit.id && editInput) {
      updateTodo({ id: addInEdit.id, title: editInput })
        .unwrap()
        .then(() => {
          setAddInEdit({ show: false, id: null });
          setEditInput("");
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
    <form onSubmit={handleSubmit}>
      <label htmlFor="new-todo">Enter a new todo item</label>
      <div className="new-todo">
        {" "}
        <input
          type="text"
          id="new-todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Enter new todo"
        />
        <button className="submit" type="submit">
          <FontAwesomeIcon icon={faUpload} />
        </button>{" "}
      </div>
    </form>
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

                {addInEdit.show && addInEdit.id === todo.id ? (
                  <>
                    <input
                      type="text"
                      placeholder="Edit"
                      onChange={funEditUpdate}
                      value={editInput}
                    />

                    <button className="save" onClick={handleEditSubmit}>
                      Save
                    </button>
                  </>
                ) : (
                  <label htmlFor={todo.id}>{todo.title || "Untitled"}</label>
                )}
              </div>
              <div>
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
    </main>
  );
};

export default TodoList;

// const TodoList = () => {
//   const [newTodo, setNewTodo] = useState("");
//   const [addInEdit, setAddInEdit] = useState({
//     show: false,
//     id: null,
//   });
//   const [editInput, setEditInput] = useState("");
//   const [expandedId, setExpandedId] = useState(false);
//   const {
//     data: todos,
//     isLoading,
//     isSuccess,
//     isError,
//     error,
//     refetch: refetchTodos,
//   } = useGetTodosQuery();
//   const [addTodo] = useAddTodoMutation();
//   const [updateTodo] = useUpdateTodoMutation();
//   const [deleteTodo] = useDeleteTodoMutation();

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     addTodo({ userId: 1, title: newTodo, completed: false });
//     setNewTodo("");
//   };

//   const editItem = (id) => {
//     setAddInEdit({ show: true, id });

//     const currentItem = todos.find((todo) => todo.id === id);
//     if (currentItem) {
//       setEditInput(currentItem.title || "");
//     }
//   };

//   const funEditUpdate = (event) => {
//     setEditInput(event.target.value.trim());
//   };

//   const handleEditSubmit = () => {
//     if (addInEdit.id && editInput) {
//       updateTodo({ id: addInEdit.id, title: editInput })
//         .unwrap()
//         .then(() => {
//           setAddInEdit({ show: false, id: null });
//           setEditInput("");

//           refetchTodos();
//         })
//         .catch((error) => {
//           console.log(error);
//         });
//     }
//   };
//   const toggleExpand = () => {
//     console.log("expand");
//     setExpandedId(!expandedId);
//     // setExpandedId((prevId) => (prevId === id ? null : id));
//   };

//   const newItemSection = (
//     <form onSubmit={handleSubmit}>
//       {" "}
//       <label htmlFor="new-todo">Enter a new todo item</label>
//       <div className="new-todo">
//         {" "}
//         <input
//           type="text"
//           id="new-todo"
//           value={newTodo}
//           onChange={(e) => setNewTodo(e.target.value)}
//           placeholder="Enter new todo"
//         />
//         <button className="submit" type="submit">
//           <FontAwesomeIcon icon={faUpload} />
//         </button>{" "}
//       </div>
//     </form>
//   );

//   let content = null;

//   if (isLoading) {
//     content = <p>Loading...</p>;
//   } else if (isSuccess) {
//     content = todos.map((todo) => (
//       <article key={todo.id} onClick={() => toggleExpand(todo.id)}>
//         <a
//           href={todo.link}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="link"
//         >
//           <div className={`todo${expandedId === todo.id ? "-expanded" : ""}`}>
//             {/* <div className={`todo ${expandedId === todo.id ? "-expanded" : ""}`}> */}
//             <label className="switch">
//               <input
//                 type="checkbox"
//                 checked={todo.completed}
//                 onChange={() =>
//                   updateTodo({ ...todo, completed: !todo.completed })
//                 }
//               />
//               <span className="slider"></span>
//             </label>

//             {addInEdit.show && addInEdit.id === todo.id ? (
//               <>
//                 <input
//                   type="text"
//                   placeholder="Edit"
//                   onChange={funEditUpdate}
//                   value={editInput}
//                 />
//                 <button className="save" onClick={handleEditSubmit}>
//                   Save
//                 </button>
//               </>
//             ) : (
//               // <a
//               //    href={todo.link}

//               //   target="_blank"
//               //   rel="noopener noreferrer"
//               //   className="link"
//               // >
//               <label htmlFor={todo.id}>{todo.title || "Untitled"}</label>
//             )}
//           </div>
//         </a>
//         <div>
//           {!addInEdit.show && (
//             <button className="edit" onClick={() => editItem(todo.id)}>
//               <FontAwesomeIcon icon={faEdit} />
//             </button>
//           )}
//           <button
//             className="trash"
//             onClick={() =>
//               deleteTodo({ id: todo.id })
//                 .unwrap()
//                 .then(() => refetchTodos())
//                 .catch((error) => {
//                   console.log(error);
//                 })
//             }
//           >
//             <FontAwesomeIcon icon={faTrash} />
//           </button>
//         </div>
//       </article>
//     ));
//   } else if (isError) {
//     content = <p>{error.message}</p>;
//   }

//   return (
//     <main className="todo-container">
//       <h1>Todo List</h1>
//       <a>{newItemSection}</a>
//       <ul className="todo-list">{content}</ul>

//       {/* nuk e dua per te gjithe listen */}
//       {/* <ul className={`todo${expandedId ? "-expanded" : "-list"}`}>{content}</ul> */}
//     </main>
//   );
// };

// export default TodoList;
