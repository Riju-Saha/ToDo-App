import React from "react";
import { useRouter } from "next/navigation";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import ResponsiveText from '@/components/ResponsiveText'


export default function TodoItem(props: {
  username: string;
  priority: string;
  id: number;
  task: string;
  startDate: string;
  endDate: string;
  onEdit: (id: number, task: string, priority: string, endDate: string) => void;
}) {
  const router = useRouter();

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  const formatDate1 = (dateString: string): string => {
    const date = new Date(dateString);
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const StartDateOnly = formatDate(props.startDate);
  const EndDateOnly = formatDate(props.endDate);
  const EndDate = formatDate1(props.endDate);

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
    props.onEdit(props.id, props.task, props.priority, EndDate)
  }

  return (
    <div>
      <li
        style={{
          backgroundColor:
            props.priority === "high" ? "#484848"
              : props.priority === "medium" ? "#919191"
                : "#DADADA",
          marginTop: "2.5%",
          padding: "1.5%",
          display: "flex",
          justifyContent: "space-between", 
          alignItems: "center"
        }}
      >
        <span style={{ display: "inline-block", width: "8%", color: "black", fontWeight: "bold", alignItems: "center", justifyContent:"center"}}>
          <ResponsiveText>{props.id}</ResponsiveText>
        </span>
        <span style={{ display: "inline-block", width: "17%", color: "black", fontWeight: "bold", textAlign: "center", alignItems: "center", justifyContent:"center" }}>
          <ResponsiveText>{StartDateOnly}</ResponsiveText>
        </span>
        <span style={{ display: "inline-block", width: "17%", color: "black", fontWeight: "bold", textAlign: "center", alignItems: "center", justifyContent:"center" }}>
          <ResponsiveText>{EndDateOnly}</ResponsiveText>
        </span>
        <div style={{ display: "inline-block", width: "31%", color: "black", fontWeight: "bold", wordWrap: "break-word", textAlign:"center", alignItems: "center", justifyContent:"center" }}>
          <ResponsiveText>{props.task}</ResponsiveText>
        </div>
        <span style={{ display: "inline-block", width: "25%", color: "black", fontWeight: "bold", textAlign: "center", alignItems: "center", justifyContent:"center" }}>
          <ResponsiveText>{props.priority}</ResponsiveText>
        </span>
        <span style={{width: "4%", backgroundColor: 'gray', display: "flex", alignItems: "center", justifyContent:"center"}}>
          <button type="button" onClick={handleUpdate}>
            {/* Edit */}
            <ResponsiveText><FontAwesomeIcon icon={faPenToSquare} /></ResponsiveText>
          </button>
        </span>
        <span style={{ width: "4%", backgroundColor: 'black', display: "flex", alignItems: "center", justifyContent:"center"}}>
          <button type="button" onClick={handleDelete}>
            {/* Delete */}
            <ResponsiveText><FontAwesomeIcon icon={faTrash} /></ResponsiveText>

          </button>
        </span>
      </li>
    </div>
  );
}



