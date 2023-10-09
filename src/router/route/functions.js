import Dashboard from "@/components/pages/dashboard/DashboardIndex";
import Task from "@/components/pages/task/TaskIndex";
import File from "@/components/pages/file/FileIndex";
import ProjectIndex from "@/components/pages/projects/ProjectIndex";

export default [
  {
    path: "/",
    component: Dashboard,
    name: "dashboard",
    meta: { title: "ダッシュボード", desc: "ダッシュボードの説明文が入ります" },
  },
  {
    path: "/projects",
    name: "projects",
    component: ProjectIndex,
    meta: {
      title: "プロジェクト管理",
      desc: "プロジェクト管理の説明文が入ります",
    },
  },
  {
    path: "/task/",
    name: "task",
    component: Task,
    meta: { title: "タスク管理", desc: "タスク管理の説明文が入ります" },
  },
  {
    path: "/file",
    name: "file",
    component: File,
    meta: { title: "ファイル管理", desc: "ファイル管理の説明文が入ります" },
  },
];
