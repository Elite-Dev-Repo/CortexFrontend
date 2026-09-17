import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";

import {
  SidebarLeftIcon,
  LayoutDashboard,
  WorkflowCircle04Icon,
  Setting07Icon,
  Logout05Icon,
  ChartAnalysisIcon,
  HelpCircleIcon,
  WorkIcon,
  UserGroup03Icon,
  Folder02Icon,
} from "@hugeicons/core-free-icons";
import { getDashboardData } from "@/lib/dashboardApi";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const res = await getDashboardData();
      setData(res);
      console.log(res);
    };
    loadData();
  }, []);

  const navigate = useNavigate();
  const toWorkspace = (id) => {
    navigate(`/workspace/${id}/`);
  };
  return (
    <section className="w-screen min-h-screen p-5">
      <div className="w-full min-h-[calc(100vh-40px)] flex items-stretch justify-between gap-3 text-secondary">
        <div
          className={` ${showSidebar ? "w-60" : "w-fit"}  min-h-full bg-secondary text-background rounded-lg flex flex-col gap-3 items-between justify-start `}
        >
          <div className="w-full h-20 p-3 flex items-center justify-between border-b border-background/20">
            {showSidebar && (
              <Link to={"/"}>
                <div className="flex items-center justify-start gap-3">
                  <HugeiconsIcon icon={LayoutDashboard} />

                  <p className="text-sm font-bold tracking-wide">Cortex</p>
                </div>
              </Link>
            )}
            <div
              onClick={() => setShowSidebar(!showSidebar)}
              className="rounded-lg hover:bg-secondary/5 cursor-pointer p-2 flex items-center justify-center"
            >
              <HugeiconsIcon icon={SidebarLeftIcon} size={20} className=" " />
            </div>
          </div>

          <div className="flex flex-col w-full h-full items-start justify-start gap-5 overflow-scroll scrollbar-none">
            <div className="w-full flex flex-col items-start justify-center gap-4">
              {showSidebar ? (
                <div className="flex  w-full justify-between items-center">
                  <h4 className="font-semibold text-[13px] uppercase pl-6 text-background/60">
                    Workspaces
                  </h4>{" "}
                </div>
              ) : (
                <div className="pl-4">
                  <HugeiconsIcon icon={WorkIcon} size={20} className=" " />
                </div>
              )}
              {showSidebar && (
                <div className="w-full flex flex-col items-start justify-center gap-2">
                  {data.workspace &&
                    data.workspace.map((data, i) => {
                      return (
                        data.workspace_type == "PERSONAL" && (
                          <div
                            onClick={() => {
                              toWorkspace(data.id);
                            }}
                            className="w-full border-l-3 border-transparent hover:border-primary flex items-center justify-start gap-3 px-4 py-2 hover:bg-primary/10"
                            key={i}
                          >
                            <>
                              <HugeiconsIcon
                                icon={Folder02Icon}
                                size={16}
                                strokeWidth={1.6}
                              />

                              <p className="text-sm font-medium">{data.name}</p>
                            </>
                          </div>
                        )
                      );
                    })}
                </div>
              )}
            </div>

            <div className="w-full flex flex-col items-start justify-center gap-4">
              {showSidebar ? (
                <h4 className="font-semibold text-[13px] uppercase pl-6 text-background/60">
                  Teams
                </h4>
              ) : (
                <div className="pl-4">
                  <HugeiconsIcon icon={UserGroup03Icon} size={20} />
                </div>
              )}
              {showSidebar && (
                <div className="w-full flex flex-col items-start justify-center gap-2">
                  {data.workspace &&
                    data.workspace.map((data, i) => {
                      return (
                        data.workspace_type == "TEAM" && (
                          <div
                            onClick={() => {
                              toWorkspace(data.id);
                            }}
                            className="w-full border-l-3 border-transparent hover:border-primary flex items-center justify-start gap-3 px-4 py-2 hover:bg-primary/10"
                            key={i}
                          >
                            <HugeiconsIcon
                              icon={Folder02Icon}
                              size={16}
                              strokeWidth={1.6}
                            />

                            <p className="text-sm font-medium">{data.name}</p>
                          </div>
                        )
                      );
                    })}
                </div>
              )}
            </div>
            <div className="w-full flex flex-col items-start justify-center gap-4">
              {showSidebar ? (
                <h4 className="font-semibold text-[13px] uppercase pl-6 text-background/60">
                  General
                </h4>
              ) : (
                <div className="pl-4">
                  <HugeiconsIcon
                    icon={SidebarLeftIcon}
                    size={20}
                    className=" "
                  />
                </div>
              )}
              <div className="w-full border-l-3 border-transparent hover:border-primary flex items-center justify-start gap-3 px-4 py-2 hover:bg-primary/10">
                <HugeiconsIcon
                  icon={ChartAnalysisIcon}
                  size={18}
                  strokeWidth={2}
                />
                {showSidebar && <p className="text-sm font-medium">Analysis</p>}
              </div>
              <div className="w-full border-l-3 border-transparent hover:border-primary flex items-center justify-start gap-3 px-4 py-2 hover:bg-primary/10">
                <HugeiconsIcon
                  icon={HelpCircleIcon}
                  size={18}
                  strokeWidth={2}
                />
                {showSidebar && <p className="text-sm font-medium">Help</p>}
              </div>
            </div>
          </div>

          <div className="w-full px-5 py-3 flex items-center justify-between gap-3 border-t border-background/20">
            {showSidebar ? (
              <>
                <HugeiconsIcon icon={Setting07Icon} size={22} />
                <p className="truncate text-[14px]">{data && data.email}</p>
                <HugeiconsIcon icon={Logout05Icon} size={22} />
              </>
            ) : (
              <>
                <HugeiconsIcon icon={Setting07Icon} size={22} />
              </>
            )}{" "}
          </div>
        </div>

        {/* MAIN  */}
        <div className="flex-1 min-h-full flex flex-col gap-3 rounded-lg bg-foreground">
          <div className="min-h-full w-full flex-1 flex flex-col gap-3  rounded-lg p-5">
            <h2 className="text-2xl font-semibold">
              Your Workspaces{" "}
              {`(${data.workspace ? data.workspace.length : "0"})`}
            </h2>
            <div className="w-full h-full p-5 flex items-start justify-around gap-4">
              {data.workspace &&
                data.workspace.map((workspace, i) => {
                  return (
                    <div
                      onClick={() => {
                        toWorkspace(workspace.id);
                      }}
                      key={i}
                      className="group flex-1 relative h-50 flex flex-col items-start  min-w-0 rounded-sm border border-primary/20 bg-white p-5 transition-all duration-300 hover:border-primary/50 hover:bg-primary/6"
                    >
                      {/* Header */}
                      <div className="w-full flex items-start justify-between gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-primary/30 bg-secondary text-primary">
                          <HugeiconsIcon icon={Folder02Icon} size={21} />
                        </div>

                        <div className="w-fit px-3 py-1 rounded-full  bg-primary text-secondary">
                          <p className="text-[10px] uppercase tracking-wider font-semibold">
                            {workspace.workspace_type}
                          </p>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="w-full">
                        <p className="text-lg font-semibold tracking-tight truncate">
                          {workspace.name}
                        </p>

                        <p className=" text-sm leading-6 text-muted-foreground line-clamp-3">
                          Description: {workspace.description}
                        </p>
                      </div>

                      {/* Footer */}
                      <div className="w-full mt-auto  border-t border-primary/10 flex items-end justify-between">
                        <div>
                          <p className="text-[10px] flex items-center gap-2 uppercase tracking-widest font-medium text-muted-foreground">
                            Projects{" "}
                            <span className="text-lg font-semibold">
                              {workspace.projects.length}
                            </span>
                          </p>
                        </div>

                        <div className="h-8 w-8 flex items-center justify-center rounded-full border border-primary/20 transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-secondary">
                          →
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/*  */}
        </div>
      </div>
    </section>
  );
};

export default Dashboard;

{
  /* <div className="flex-1 rounded-lg">
  {" "}
  <div className="w-full flex-1 flex flex-col gap-3 rounded-lg p-5">
    <h2 className="text-2xl font-semibold">Analytics</h2>
    <div className="w-full h-full p-5 flex items-center justify-around gap-4">
      {data.workspace &&
        data.workspace.map((workspace, i) => {
          return (
            <div
              key={i}
              className="group relative flex-1 flex flex-col items-start h-full min-w-0 rounded-sm border border-primary/20 bg-primary/3 p-5 transition-all duration-300 hover:border-primary/50 hover:bg-primary/6"
            >
              
              <div className="w-full flex items-start justify-between gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-primary/30 bg-primary/3 text-secondary">
                  <HugeiconsIcon icon={Folder02Icon} size={21} />
                </div>

                <div className="w-fit px-3 py-1 rounded-full  bg-primary text-secondary">
                  <p className="text-[10px] uppercase tracking-wider font-semibold">
                    {workspace.workspace_type}
                  </p>
                </div>
              </div>

           
              <div className="w-full">
                <p className="text-lg font-semibold tracking-tight truncate">
                  {workspace.name}
                </p>

                <p className=" text-sm leading-6 text-muted-foreground line-clamp-3">
                  {workspace.description}
                </p>
              </div>

            
              <div className="w-full mt-auto  border-t border-primary/10 flex items-end justify-between">
                <div>
                  <p className="text-[10px] flex items-center gap-2 uppercase tracking-widest font-medium text-muted-foreground">
                    Projects{" "}
                    <span className="text-lg font-semibold">
                      {workspace.projects.length}
                    </span>
                  </p>
                </div>

                <div className="h-8 w-8 flex items-center justify-center rounded-full border border-primary/20 transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-secondary">
                  →
                </div>
              </div>
            </div>
          );
        })}
    </div>
  </div>
</div>; */
}
