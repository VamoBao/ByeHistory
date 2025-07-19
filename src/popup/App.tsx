
import './App.css'
import { useEffect, useMemo, useState } from 'react'

export default function App() {
  const [tab,setTab] = useState<chrome.tabs.Tab>()
  const [value, setValue] = useState('');

  async function getCurrentTab(){
    const [t] = await chrome.tabs.query({
      active:true,lastFocusedWindow:true
    })
    setTab(t)
  }

  useEffect(()=>{
    getCurrentTab()
  },[])

  const urlDomain = useMemo(()=>{
    if(!tab?.url) return ''  
    return tab.url.match(/^https?:\/\/(\w|\.)+\.\w+/)?.[0]?.replace(/https?:\/\//,'')
  },[tab])
 
  return (
    <div>
      <p>匹配{urlDomain}</p>
      <button onClick={()=>setValue(urlDomain||'')}>匹配当前Domain</button>
      <button onClick={()=>setValue(`*${(urlDomain||'').split('.').slice(-2).join('.')}`)}>匹配当前Domain-suffix</button>
      <input type="text" placeholder='请输入匹配的规则' value={value} onChange={e=>setValue(e.target.value)}/>
      <button onClick={()=>{
        chrome.storage.local.set({'domain':[value]})
      }}>保存</button>
    </div>
  )
}
