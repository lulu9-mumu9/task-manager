import { useState, useEffect } from 'react'
import { supabase } from './supabase'

function App() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('中')
  const [filter, setFilter] = useState('全部')

  const fetchTasks = async () => {
    let query = supabase.from('tasks').select('*').order('created_at', { ascending: false })
    if (filter !== '全部') {
      query = query.eq('priority', filter)
    }
    const { data } = await query
    setTasks(data || [])
  }

  useEffect(() => {
    fetchTasks()
  }, [filter])

  const addTask = async () => {
    if (!title.trim()) return
    await supabase.from('tasks').insert([{ title: title.trim(), priority }])
    setTitle('')
    setPriority('中')
    fetchTasks()
  }

  const toggleComplete = async (id, completed) => {
    await supabase.from('tasks').update({ completed: !completed }).eq('id', id)
    fetchTasks()
  }

  const deleteTask = async (id) => {
    await supabase.from('tasks').delete().eq('id', id)
    fetchTasks()
  }

  return (
    <div style={{ maxWidth: 650, margin: '40px auto', padding: '0 20px', fontFamily: 'system-ui' }}>
      <h1 style={{textAlign:'center'}}>智能任务管理系统</h1>

      <div style={{display:'flex',gap:'8px',marginBottom:16}}>
        <input
          style={{flex:1,padding:'8px 10px',fontSize:14}}
          placeholder="输入任务标题"
          value={title}
          onChange={e=>setTitle(e.target.value)}
        />
        <select value={priority} onChange={e=>setPriority(e.target.value)} style={{padding:'8px'}}>
          <option value="高">高</option>
          <option value="中">中</option>
          <option value="低">低</option>
        </select>
        <button onClick={addTask} style={{padding:'8px 16px',cursor:'pointer'}}>添加</button>
      </div>

      <div style={{marginBottom:20}}>
        <span>筛选优先级：</span>
        {['全部','高','中','低'].map(item=>(
          <button
            key={item}
            onClick={()=>setFilter(item)}
            style={{margin:'0 4px',padding:'4px 10px',background: filter===item?'#2563eb':'#eee',color:filter===item?'#fff':'#000',border:'none',borderRadius:4,cursor:'pointer'}}
          >
            {item}
          </button>
        ))}
      </div>

      <div>
        {tasks.length ===0 ? <div style={{color:'#777'}}>暂无任务</div> : null}
        {tasks.map(task=>(
          <div
            key={task.id}
            style={{
              padding:12,
              marginBottom:10,
              border:'1px solid #ddd',
              borderRadius:6,
              opacity: task.completed ? 0.55 : 1
            }}
          >
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <span style={{
                  textDecoration: task.completed ? 'line-through':'none',
                  fontSize:15
                }}>{task.title}</span>
                <span style={{
                  marginLeft:10,
                  padding:'2px 6px',
                  borderRadius:4,
                  fontSize:12,
                  backgroundColor:
                    task.priority==='高'?'#ef4444':
                    task.priority==='中'?'#f59e0b':'#10b981',
                  color:'white'
                }}>{task.priority}</span>
              </div>
              <div>
                <button
                  onClick={()=>toggleComplete(task.id, task.completed)}
                  style={{marginRight:6,padding:'4px 8px',cursor:'pointer'}}
                >
                  {task.completed ? '未完成':'完成'}
                </button>
                <button
                  onClick={()=>deleteTask(task.id)}
                  style={{padding:'4px 8px',cursor:'pointer',color:'#dc2626'}}
                >删除</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App