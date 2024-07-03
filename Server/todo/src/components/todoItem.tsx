import React from "react";
import { useRouter } from "next/navigation";

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
        `${window.location.origin}/api/v2/todos?id=${props.id}`,{
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
            props.priority === "high"
              ? "red"
              : props.priority === "medium"
              ? "orange"
              : "magenta",
          marginTop: "5%",
          padding: "3%",
        }}
      >
        <span style={{ display: "inline-block", width: "18%" }}>
          {props.id}
        </span>
        <span style={{ display: "inline-block", width: "35%" }}>
          {props.task}
        </span>
        <span style={{ display: "inline-block", width: "22%" }}>
          {props.priority}
        </span>
        <span style={{ display: "inline-block", width: "10%", backgroundColor: 'navy' }}>
          <button type="button" onClick={handleUpdate}>
            Edit
          </button>
        </span>
        <span style={{ display: "inline-block", width: "15%", backgroundColor: 'violet' }}>
          <button type="button" onClick={handleDelete}>
            Delete
          </button>
        </span>
      </li>
    </div>
  );
}



