import { useEffect, useState } from 'react'
import { useContext } from '../../context'
import { logic } from '../../logic'

export const UsersList = () => {
    const { alert, confirm } = useContext()

    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const [selected, setSelected] = useState({})

    const [onlyActive, setOnlyActive] = useState(undefined)

    const toggleAll = (checked) => {
        if (checked) {
            const map = {}

            users.forEach(user => { map[user.email] = true })
            setSelected(map)
        } else {
            setSelected({})
        }
    }

    const toggleOne = (email) => {
        setSelected(prev => ({ ...prev, [email]: !prev[email] }))
    }

    useEffect(() => {
        setLoading(true)
        try {
            logic.getAllUsers({
                search: search.trim() || undefined,
                active: onlyActive,
                page,
                limit: 20
            })
                .then(users => setUsers(users || []))
                .catch(error => {
                    console.error(error)
                    alert(error.message)
                })
                .finally(() => setLoading(false))
        } catch (error) {
            console.error(error)
            alert(error.message)
            setLoading(false)
        }
    }, [search, page, onlyActive])

    const emailsSelected = Object.keys(selected).filter(email => selected[email])
    const noneSelected = emailsSelected.length === 0

    const doBulk = (actionFn, label) => {
        if (noneSelected) return  
        confirm(`Are you sure you want to ${label} ${emailsSelected.length} user?`)
            .then(ok => {
                if (!ok) return

                const run = (i = 0) => {
                    if (i >= emailsSelected.length) {
                        alert(`${label} completed`)
                        setUsers(prev => prev.map(user => {
                            if (emailsSelected.includes(user.email)) {
                                return { ...user, active: label === 'activate' ? true : false   }
                            }
                            return user
                        }))
                        setSelected({})
                        return
                    }
                    actionFn(emailsSelected[i])
                        .then(() => run(i + 1))
                        .catch(error => {
                            console.error(error)
                            alert(error.message)
                        })
                }
                run()
            })
    }

    const handleActivate = () => doBulk(logic.activeUserByEmail, 'activate')
    const handleDeactivate = () => doBulk(logic.deactivateUserByEmail, 'deactivate')

    return (
        <div className="max-w-4xl mx-auto rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
            <h1 className="text-xl font-semibold mb-3">Usuarios</h1>

            <div className="flex flex-wrap items-center gap-2 mb-4">
                <input
                    className="border border-black/10 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300 w-full max-w-xs"
                    placeholder="Buscar por nombre / email / username"
                    value={search}
                    onChange={e => { setSearch(e.target.value); setPage(1) }}
                />

                <select
                    className="border border-black/10 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300 w-full max-w-xs"
                    value={onlyActive === undefined ? '' : (onlyActive ? 'true' : 'false')}
                    onChange={e => {
                        const v = e.target.value
                        setOnlyActive(v === '' ? undefined : v === 'true')
                        setPage(1)
                    }}
                >
                    <option value="">Todos</option>
                    <option value="true">Solo activos</option>
                    <option value="false">Solo desactivados</option>
                </select>

                <div className="ml-auto flex gap-2">
                    <button
                        className="bg-green-600 text-white rounded-2xl px-4 py-2 hover:bg-green-800 disabled:opacity-70"
                        disabled={noneSelected}
                        onClick={handleActivate}
                    >
                        Activar
                    </button>
                    <button
                        className="bg-orange-400 text-white rounded-2xl px-4 py-2 hover:bg-orange-700 disabled:opacity-60"
                        disabled={noneSelected}
                        onClick={handleDeactivate}
                    >
                        Desactivar
                    </button>
                </div>
            </div>

            {loading && <div className="mb-2">Cargando…</div>}

            <div className="overflow-auto border rounded-xl">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-3 text-left">
                                <input
                                    type="checkbox"
                                    onChange={e => toggleAll(e.target.checked)}
                                    checked={users.length > 0 && users.every(u => selected[u.email])}
                                    aria-label="Seleccionar todos"
                                />
                            </th>
                            <th className="p-3 text-left">Nombre</th>
                            <th className="p-3 text-left">Email</th>
                            <th className="p-3 text-left">Rol</th>
                            <th className="p-3 text-left">Activo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.email} className="border-t hover:bg-gray-50">
                                <td className="p-2">
                                    <input
                                        type="checkbox"
                                        checked={!!selected[u.email]}
                                        onChange={() => toggleOne(u.email)}
                                        aria-label={`Seleccionar ${u.email}`}
                                    />
                                </td>
                                <td className="p-2">{u.name || '-'}</td>
                                <td className="p-2">{u.email}</td>
                                <td className="p-2">{u.role}</td>
                                <td className="p-2">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {u.active ? 'Sí' : 'No'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && !loading && (
                            <tr><td className="p-3 text-center opacity-70" colSpan={5}>Sin resultados</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {users.length > 0 && (
                <div className="mt-3 flex items-center gap-2">
                    <button className="border-none rounded-2xl px-2 py-1 bg-indigo-300 hover:bg-indigo-500 transition" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                        Anterior
                    </button>
                    <span>Página {page}</span>
                    <button className="border-none rounded-2xl px-2 py-1 bg-green-300 hover:bg-green-500 transition" onClick={() => setPage(p => p + 1)}>
                        Siguiente
                    </button>
                </div>
            )}
        </div>
    )
}