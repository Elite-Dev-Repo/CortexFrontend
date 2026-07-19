import { Blocks, LogOut } from "lucide-react"

const Sidebar = ({ sidebarOpen, setSidebarOpen, sections, onLogout }) => {
  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-foreground border-r border-white/10 transform transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } flex flex-col`}
      >
        <div className="flex items-center gap-2 px-6 h-16 border-b border-white/10">
          <Blocks size={22} />
          <span className="tracking-wider font-light">Cortex</span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {sections.map((section) => (
            <div key={section.tag}>
              {section.tag && (
                <div className="text-white uppercase tracking-wider px-4 mb-2 text-[11px]">
                  {section.tag}
                </div>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      item.onClick?.()
                      setSidebarOpen(false)
                    }}
                    disabled={item.disabled}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-white/75 hover:text-white hover:bg-white/5 transition-all ${
                      item.active ? "bg-white/10 font-medium text-white" : ""
                    } ${item.disabled ? "cursor-not-allowed opacity-50" : ""}`}
                  >
                    <item.icon size={item.active ? 18 : 14} />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-white/75 hover:text-white hover:bg-white/5 transition-all"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
