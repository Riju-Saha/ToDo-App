import React from "react";
import { useRouter } from "next/navigation";

// import Head from 'next/head'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faFaceRelieved } from '@fortawesome/pro-solid-svg-icons'

import ReactDOM from 'react-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'


export default function TodoItem(props: {
  username: string;
  priority: string;
  id: number;
  task: string;
  onEdit: (id: number, task: string, priority: string) => void;
}) {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/todos?id=${props.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
      );
      if (!response.ok) {
        throw new Error("Failed to delete todo");
      }
      console.log("Todo deleted successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error fetching todos:", error);
      alert("Failed to fetch todos. Please try again.");
    }
  };

  const handleUpdate = () => {
    props.onEdit(props.id, props.task, props.priority)
  }

  return (
    <div>
      <li
        style={{
          backgroundColor:
            props.priority === "high" ? "#484848"
              : props.priority === "medium" ? "#919191"
                : "#DADADA",
          marginTop: "5%",
          padding: "3%",
        }}
      >
        <span style={{ display: "inline-block", width: "12%", color: "black", fontWeight: "bold" }}>
          {props.id}
        </span>
        <div style={{ display: "inline-block", width: "38%", color: "black", fontWeight: "bold", wordWrap: "break-word" }}>
          {props.task}
        </div>
        <span style={{ display: "inline-block", width: "24%", color: "black", fontWeight: "bold", textAlign: "center" }}>
          {props.priority}
        </span>
        <span style={{ display: "inline-block", width: "12.5%", backgroundColor: 'gray', textAlign: 'center' }}>
          <button type="button" onClick={handleUpdate}>
            {/* Edit */}
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
        </span>
        <span style={{ display: "inline-block", width: "12.5%", backgroundColor: 'black', textAlign: 'center' }}>
          <button type="button" onClick={handleDelete}>
            {/* Delete */}
            <FontAwesomeIcon icon={faTrash} />

          </button>
        </span>
      </li>
    </div>
  );
}



