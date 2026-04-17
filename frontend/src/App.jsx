import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import OperationsDashboard from './pages/OperationsDashboard'
import ProtocolsDashboard from './pages/ProtocolsDashboard'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import Explorer from './pages/Explorer'
import Settings from './pages/Settings'
import AutomationOpportunities from './pages/AutomationOpportunities'
import AutomationArchitecture from './pages/AutomationArchitecture'
import Email from './pages/Email'
import './App.css'

function App() {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<OperationsDashboard />} />
          <Route path="/protocols" element={<ProtocolsDashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/explorer" element={<Explorer />} />
          <Route path="/automation" element={<AutomationOpportunities />} />
          <Route path="/architecture" element={<AutomationArchitecture />} />
          <Route path="/email" element={<Email />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
