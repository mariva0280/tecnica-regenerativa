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
        if (nonSelected) return  
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
        <div className="p-5">
            <h1 className="text-xl font-bold mb-4">Usuarios</h1>

            <div className="flex flex-wrap items-center gap-2 mb-3">
                <input
                    className="border px-2 py-1"
                    placeholder="Buscar por nombre / email / username"
                    value={search}
                    onChange={e => { setSearch(e.target.value); setPage(1) }}
                />

                <select
                    className="border px-2 py-1"
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
                        className="border px-3 py-1 disabled:opacity-50"
                        disabled={noneSelected}
                        onClick={handleActivate}
                    >
                        Activar
                    </button>
                    <button
                        className="border px-3 py-1 disabled:opacity-50"
                        disabled={noneSelected}
                        onClick={handleDeactivate}
                    >
                        Desactivar
                    </button>
                </div>
            </div>

            {loading && <div className="mb-2">Cargando…</div>}

            <div className="overflow-auto border rounded">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-2">
                                <input
                                    type="checkbox"
                                    onChange={e => toggleAll(e.target.checked)}
                                    checked={users.length > 0 && users.every(u => selected[u.email])}
                                    aria-label="Seleccionar todos"
                                />
                            </th>
                            <th className="p-2 text-left">Nombre</th>
                            <th className="p-2 text-left">Email</th>
                            <th className="p-2 text-left">Rol</th>
                            <th className="p-2 text-left">Activo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.email} className="border-t">
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
                                    <span className={`px-2 py-0.5 rounded text-xs ${u.active ? 'bg-green-100' : 'bg-red-100'}`}>
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
                    <button className="border px-2 py-1" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                        Anterior
                    </button>
                    <span>Página {page}</span>
                    <button className="border px-2 py-1" onClick={() => setPage(p => p + 1)}>
                        Siguiente
                    </button>
                </div>
            )}
        </div>
    )
}