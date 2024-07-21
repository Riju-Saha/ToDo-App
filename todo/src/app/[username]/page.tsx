"use client"
import { useSearchParams } from 'next/navigation';
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import LogoutBtn from '@/components/logoutBtn';
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import TodoItem from '@/components/todoItem';
import ResponsiveText from '@/components/ResponsiveText'


interface Todo {
    username: string;
    startDate: string;
    endDate: string;
    id: number;
    task: string;
    priority: string;
}

export default function Usernamepage() {
    const searchParams = useSearchParams();
    const username = searchParams.get('username');

    const [todo, setTodo] = useState('');
    const [priority, setPriority] = useState('low');
    const [todos, setTodos] = useState<Todo[]>([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editTodoId, setEditTodoId] = useState<number | null>(null);
    const [sortTodo, setSortTodo] = useState<string>('id');
    console.log("todos are ", todos)

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortTodo(e.target.value);
        console.log("sort is: ", sortTodo)
    };
    const fetchTodos = useCallback(async () => {
        try {
            const response = await fetch(`http://localhost:8080/todos?username=${username}&sortTodo=${sortTodo}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch todos');
            }

            const data = await response.json();
            console.log('Fetched todos:', { data });
            setTodos(data.todos);
        } catch (error) {
            console.error('Error fetching todos:', error);
            alert('Failed to fetch todos. Please try again.');
        }
    }, [username, sortTodo]);

    useEffect(() => {
        if (username) {
            fetchTodos();
        }
    }, [username, fetchTodos]);

    const handleEdit = (id: number, task: string, priority: string) => {
        setIsEditMode(true);
        setEditTodoId(id);
        setTodo(task);
        setPriority(priority);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isEditMode) {
            handleUpdate();
        } else {
            handleAdd();
        }
    };

    const handleAdd = async () => {
        console.log('Form submitted:', { username, todo, priority });
        try {
            const response = await fetch(`http://localhost:8080/todos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, todo, priority }),
            });

            if (!response.ok) {
                alert('Adding todo failed. Please check your details and try again.');
                return;
            }

            const data = await response.json();
            console.log('Response data:', data);

            if (data.success) {
                fetchTodos();
                setTodo('');
                setPriority('low');
                setIsEditMode(false);
                setEditTodoId(null);
            } else {
                alert('Adding todo failed: ' + data.message);
            }
        } catch (error) {
            console.error('Error during fetch:', error);
            alert('An error occurred adding todo. Please try again.');
        }
    };

    const handleUpdate = async () => {
        if (editTodoId === null) return;

        try {
            const response = await fetch(`http://localhost:8080/todos?id=${editTodoId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, todo, priority }),
            });

            if (!response.ok) {
                alert('Updating todo failed. Please check your details and try again.');
                return;
            }

            const data = await response.json();
            console.log('Response data:', data);

            if (data.success) {
                fetchTodos();
                setTodo('');
                setPriority('low');
                setIsEditMode(false);
                setEditTodoId(null);
            } else {
                alert('Updating todo failed: ' + data.message);
            }
        } catch (error) {
            console.error('Error during fetch:', error);
            alert('An error occurred updating todo. Please try again.');
        }
    };

    return (
        <>
            <div style={{ display: "flex", justifyContent: "space-between", position: "relative", float: "right", marginTop: "1%", marginRight: "1%" }}>
                <Link href='/auth/login'>
                    <LogoutBtn />
                </Link>
                </div>

                <div className="max-w-xxl w-full mx-auto rounded-2xl p-4 md:p-8 shadow-input bg-black dark:bg-black">

                    <form className="my-8" onSubmit={handleSubmit}>
                        <div className="mb-2">
                            <Input id="todo" placeholder="Add a todo" type="text" className="bg-black text-white" value={todo}
                                onChange={(e) => setTodo(e.target.value)} required />
                        </div>
                        <div className="mb-2">
                            <Select id="priority" className="bg-black text-white" value={priority} onChange={(e) => setPriority(e.target.value)}>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </Select>
                        </div>
                        <button type="submit"
                            className="bg-gradient-to-br relative group btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                        >
                            {isEditMode ? 'Update' : 'Add'}
                        </button>
                    </form>

                    <div className="my-4">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <h3 className="font-bold text-lg text-center" ><ResponsiveText>Current Todos:</ResponsiveText></h3>
                            <h3>
                                <Select name="sort" value={sortTodo} id="sort" className="bg-black text-white" onChange={handleSortChange}>
                                    <option value="id">Id</option>
                                    <option value="priority">Priority</option>
                                </Select>
                            </h3>
                        </div>

                        <ul className="pl-6" style={{ listStyleType: 'none', padding: 0 }}>
                        <li
                            style={{
                                marginTop: "2.5%",
                                padding: "1.5%",
                                display: "flex",
                                justifyContent: "space-between"
                            }}
                        >
                            <span style={{ display: "inline-block", width: "8%", fontWeight: "bold" }}>
                                <ResponsiveText>ID</ResponsiveText>
                            </span>
                            <span style={{ display: "inline-block", width: "17%", textAlign: "center", fontWeight: "bold" }}>
                                <ResponsiveText>Created</ResponsiveText>
                            </span>
                            <span style={{ display: "inline-block", width: "17%", textAlign: "center", fontWeight: "bold" }}>
                                <ResponsiveText>Due</ResponsiveText>
                            </span>
                            <span style={{ display: "inline-block", width: "26%", textAlign:"center", fontWeight: "bold" }}>
                                <ResponsiveText>Task</ResponsiveText>
                            </span>
                            <span style={{ display: "inline-block", width: "20%", textAlign: "center", fontWeight: "bold" }}>
                                <ResponsiveText>Priority</ResponsiveText>
                            </span>
                            <span style={{ display: "inline-block", width: "10%", textAlign: "center", fontWeight: "bold" }}>
                                <ResponsiveText>Action</ResponsiveText>
                            </span>
                            </li>
                        </ul>

                        <ul className="pl-6" style={{ listStyleType: 'none', padding: 0 }}>
                            {todos.map((element) => (
                                <TodoItem
                                    key={element.id}
                                    username={element.username}
                                    startDate={element.startDate}
                                    id={element.id}
                                    task={element.task}
                                    priority={element.priority}
                                    onEdit={handleEdit}
                                />
                            ))}
                        </ul>
                    </div>
                </div>

                

        </>
    );
}
