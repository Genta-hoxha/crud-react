// add imports
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faUpload } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import {
  useGetTodosQuery,
  useAddTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} from "../api/apiSlice";

const TodoList = () => {
  const [newTodo, setNewTodo] = useState("");
  // const [selectedTodoId, setSelectedTodoId] = useState();
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
    // addTodo
    addTodo({ userId: 1, title: newTodo, completed: false });
    setNewTodo("");
  };

  const newItemSection = (
    <form onSubmit={handleSubmit}>
      <label htmlFor="new-todo">Enter a new todo item</label>
      <div className="new-todo">
        <input
          type="text"
          id="new-todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Enter new todo"
        />
      </div>
      <button className="submit" type="submit">
        <FontAwesomeIcon icon={faUpload} />
      </button>
    </form>
  );
  // const deleteItem = (id) => {
  //   setSelectedTodoId(id);
  //   console.log(id);
  //   deleteTodo(id);
  // };

  let content;
  // Define conditional content

  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (isSuccess) {
    content = todos.map((todo) => (
      <article key={todo.id}>
        <div className="todo">
          <input
            type="checkbox"
            checked={todo.completed}
            id={todo.id}
            onChange={() => updateTodo({ ...todo, completed: !todo.completed })}
          />
          <label htmlFor={todo.id}>{todo.title || "Untitled"}</label>
        </div>
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
      </article>
    ));
  } else if (isError) {
    content = <p>{error.message}</p>;
  } else {
    content = null;
  }

  return (
    <main>
      <h1>Todo List</h1>
      {newItemSection}
      {content}
    </main>
  );
};

export default TodoList;
