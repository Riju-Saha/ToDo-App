"use client"
import { useSearchParams, useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import LogoutBtn from '@/components/logoutBtn';
// import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
// import { cn } from "@/utils/cn";
import TodoItem from '@/components/todoItem';


interface Todo {
    username: string;
    id: number; // Adjust as per your API response
    task: string;
    priority: string;
    // action: string;
}

export default function page() {
    const searchParams = useSearchParams();
    const username = searchParams.get('username');
    const router = useRouter();
    const [todo, setTodo] = useState('');
    const [priority, setPriority] = useState('low');
    const [todos, setTodos] = useState<Todo[]>([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editTodoId, setEditTodoId] = useState<number | null>(null);

    const fetchTodos = async () => {
        try {
            const response = await fetch(`http://localhost:8080/todos?username=${username}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch todos');
            }
            // console.log(response)
            const data = await response.json();
            console.log('Fetched todos:', {data});
            setTodos(data.todos);
        } catch (error) {
            console.error('Error fetching todos:', error);
            alert('Failed to fetch todos. Please try again.');
        }
    };

    useEffect(() => {
        if (username) {
            fetchTodos();
        }
    }, [username]);
    
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
            const response = await fetch("https://todo-rho-plum.vercel.app/todos", {
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


    console.log("am from page. and the edit id clicked is: ", editTodoId)
    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1%', marginRight: '1%' }}>
                <Link href='/auth/login'>
                    <LogoutBtn />
                </Link>
            </div>
            <div className="max-w-md w-full mx-auto rounded-2xl p-4 md:p-8 shadow-input bg-black dark:bg-black">
                <h2 className="font-bold text-xl text-center">Todos</h2>

                <form className="my-8" onSubmit={handleSubmit}>
                    <div className="mb-2">
                        <Input id="todo" placeholder="Add a todo" type="text" className="bg-black text-white" value={todo}
                            onChange={(e) => setTodo(e.target.value)} required />
                    </div>
                    <div className="mb-2">
                        <Select
                            id="priority"
                            className="bg-black text-white"
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                        >
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
                    <h3 className="font-bold text-lg text-center" style={{marginBottom: '8%'}}>Current Todos:</h3>
                    <ul style={{ listStyleType: 'none', padding: '0' }}>
                        <li style={{ display: 'inline-block', width: '18%', fontWeight: 'bold' }}>ID</li>
                        <li style={{ display: 'inline-block', width: '35%', fontWeight: 'bold' }}>Task</li>
                        <li style={{ display: 'inline-block', width: '22%', fontWeight: 'bold' }}>Priority</li>
                        <li style={{ display: 'inline-block', width: '10%', fontWeight: 'bold' }}>Action</li>
                    </ul>
                    <ul className="pl-6" style={{ listStyleType: 'none', padding: 0 }}>
                        {todos.map((element) => (
                            <TodoItem
                                username={element.username}
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
