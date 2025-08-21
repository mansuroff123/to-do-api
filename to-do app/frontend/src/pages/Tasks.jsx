import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/client";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function Tasks() {
    const qc = useQueryClient()
    const [title, setTitle] = useState("");
    const { logout } = useAuth();

    const { data: tasks } = useQuery({
        queryKey: ["tasks"],
        queryFn: async () => (await api.get("/api/tasks/")).data,
    })

    const createMutation = useMutation({
        mutationFn: async (payload) => (await api.post("/api/tasks/", payload)).data,
        onSuccess: () => { setTitle(""); qc.invalidateQueries({ queryKey: ['tasks'] }) }
    })

    const toggleMutation = useMutation({
        mutationFn: async (t) => (await api.patch(`/api/tasks/${t.id}/`, { completed: !t.completed })).data,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] })
    })

    const deleteMutation = useMutation({
        mutationFn: async (id) => (await api.delete(`/api/tasks/${id}/`)).data,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] })
    })

    const handleLogout = () => {
        logout();
        window.location.href = "/login";
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
            <div className="container mx-auto max-w-4xl px-4 py-8">
                {/* Header */}
                <div className="navbar bg-base-100 shadow-lg rounded-box mb-8">
                    <div className="navbar-start">
                        <h1 className="text-2xl font-bold text-primary">My Tasks</h1>
                    </div>
                    <div className="navbar-end">
                        <button 
                            onClick={handleLogout}
                            className="btn btn-ghost btn-sm"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                        </button>
                    </div>
                </div>

                {/* Add Task Form */}
                <div className="card bg-base-100 shadow-lg mb-8">
                    <div className="card-body">
                        <form onSubmit={(e) => {e.preventDefault(); if(title.trim()) createMutation.mutate({ title })}} className="flex gap-4">
                            <div className="form-control flex-1">
                                <input 
                                    type="text"
                                    placeholder="What needs to be done?" 
                                    className="input input-bordered w-full focus:input-primary"
                                    value={title} 
                                    onChange={e => setTitle(e.target.value)}
                                />
                            </div>
                            <button 
                                type="submit" 
                                className={`btn btn-primary ${createMutation.isPending ? "loading" : ""}`}
                                disabled={createMutation.isPending || !title.trim()}
                            >
                                {createMutation.isPending ? "Adding..." : "Add Task"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Tasks List */}
                <div className="space-y-4">
                    {!tasks ? (
                        <div className="flex justify-center py-8">
                            <span className="loading loading-spinner loading-lg text-primary"></span>
                        </div>
                    ) : tasks.length === 0 ? (
                        <div className="card bg-base-100 shadow-lg">
                            <div className="card-body text-center py-12">
                                <div className="text-6xl mb-4">📝</div>
                                <h3 className="text-xl font-semibold mb-2">No tasks yet</h3>
                                <p className="text-base-content/70">Add your first task above to get started!</p>
                            </div>
                        </div>
                    ) : (
                        tasks.map(t => (
                            <div key={t.id} className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
                                <div className="card-body py-4">
                                    <div className="flex items-center gap-4">
                                        <input 
                                            type="checkbox" 
                                            className="checkbox checkbox-primary checkbox-lg"
                                            checked={t.completed} 
                                            onChange={() => toggleMutation.mutate(t)}
                                            disabled={toggleMutation.isPending}
                                        />
                                        <span className={`flex-1 text-lg ${t.completed ? 'line-through text-base-content/50' : ''}`}>
                                            {t.title}
                                        </span>
                                        <div className="flex gap-2">
                                            <div className={`badge ${t.completed ? 'badge-success' : 'badge-warning'}`}>
                                                {t.completed ? 'Completed' : 'Pending'}
                                            </div>
                                            <button 
                                                onClick={() => deleteMutation.mutate(t.id)}
                                                className="btn btn-ghost btn-sm text-error hover:bg-error hover:text-error-content"
                                                disabled={deleteMutation.isPending}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Stats */}
                {tasks && tasks.length > 0 && (
                    <div className="stats shadow-lg mt-8 w-full">
                        <div className="stat">
                            <div className="stat-title">Total Tasks</div>
                            <div className="stat-value text-primary">{tasks.length}</div>
                        </div>
                        <div className="stat">
                            <div className="stat-title">Completed</div>
                            <div className="stat-value text-success">{tasks.filter(t => t.completed).length}</div>
                        </div>
                        <div className="stat">
                            <div className="stat-title">Remaining</div>
                            <div className="stat-value text-warning">{tasks.filter(t => !t.completed).length}</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
