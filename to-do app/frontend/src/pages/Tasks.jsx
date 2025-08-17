import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/client";
import {useState} from "react";

export default function Tasks() {
    const qc = useQueryClient()
    const [title, setTitle] = useState("");

    const { data: tasks } = useQuery({
        queryKey: ["tasks"],
        queryFn: async () => (await api.get("/api/tasks/")).data,
    })

    const createMutation = useMutation({
        mutationFn: async (payload) => (await api.put("/api/tasks/", payload)).data,
        onSuccess: () => { setTitle(""); qc.invalidateQueries({ queryKey: ['tasks'] }) }
    })

    const toggleMutation = useMutation({
        mutationFn: async (t) => (await api.patch(`/api/tasks/${id}/`, { completed: !tasks.completed })).data,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] })
    })

    const deleteMutation = useMutation({
        mutationFn: async (id) => (await api.delete(`/api/tasks/${id}/`)).data,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] })
    })

    return (
        <div style={{ maxWidth: 600, margin: '40px auto', padding: 16 }}>
            <h2>My Tasks</h2>

            <form onSubmit={(e) => {e.preventDefault(); if(title.trim()) createMutation.mutate({ title })}}>
                <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="New task..." />
                <button type="submit" disabled={createMutation.isPending}>Add</button>
            </form>

            <ul>
                {(tasks||[]).map( t => (
                    <li key={t.id} style={{ display:'flex', gap:8, alignItems: 'center', marginTop: 8 }}>
                        <input type="checkbox" checked={t.completed} onChange={()=>toggleMutation.mutate(t)} />
                        <span style={{ textDecoration: t.completed ? 'line-through' : 'none' }}>{t.title}</span>
                        <button onClick={()=>deleteMutation.mutate(t.id)} style={{ marginLeft:'auto' }}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    )

}
