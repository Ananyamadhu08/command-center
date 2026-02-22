"use client"

import { useState } from "react"
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core"
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useDroppable } from "@dnd-kit/core"
import { GlassCard } from "@/components/ui/GlassCard"
import { TASK_STATUSES, TASK_STATUS_CONFIG } from "@/lib/types"
import type { ProjectTask, TaskStatus } from "@/lib/types"

interface KanbanBoardProps {
  tasks: ProjectTask[]
  projectId: string
  onUpdateTask: (taskId: string, updates: Partial<Pick<ProjectTask, "title" | "description" | "status">>) => void
}

function groupByStatus(tasks: ProjectTask[]): Record<TaskStatus, ProjectTask[]> {
  const base: Record<TaskStatus, ProjectTask[]> = {
    backlog: [],
    todo: [],
    in_progress: [],
    in_review: [],
    done: [],
  }
  for (const t of tasks) {
    if (base[t.status]) {
      base[t.status] = [...base[t.status], t]
    }
  }
  return base
}

/* ---- Droppable Column ---- */

function KanbanColumn({
  status,
  tasks,
  children,
}: {
  status: TaskStatus
  tasks: ProjectTask[]
  children: React.ReactNode
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status })
  const config = TASK_STATUS_CONFIG[status]

  return (
    <div className="flex w-44 shrink-0 flex-col gap-1.5 lg:w-auto lg:flex-1">
      {/* Column header */}
      <div className="flex items-center gap-1.5 px-1 py-1">
        <span
          className="size-2 rounded-full"
          style={{ backgroundColor: config.color }}
        />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-white/40">
          {config.label}
        </span>
        <span className="ml-auto rounded-full bg-white/5 px-1.5 py-0.5 text-[9px] font-medium text-white/30">
          {tasks.length}
        </span>
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className={`flex min-h-[100px] flex-1 flex-col gap-1.5 rounded-xl border border-dashed p-1.5 transition-colors ${
          isOver
            ? "border-cosmic/40 bg-cosmic/5"
            : "border-white/10 bg-white/[0.02]"
        }`}
      >
        {children}
        {tasks.length === 0 && (
          <div className="flex flex-1 items-center justify-center">
            <span className="text-[10px] text-white/15 select-none">
              {isOver ? "Drop here" : "\u2014"}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

/* ---- Sortable Card ---- */

function SortableCard({ task }: { task: ProjectTask }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { status: task.status } })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group flex cursor-grab flex-col gap-0.5 rounded-lg border border-white/10 bg-white/5 p-2 text-left transition-all active:cursor-grabbing hover:border-cosmic/30 hover:bg-white/10 ${
        isDragging ? "opacity-30" : ""
      }`}
    >
      <span className="text-xs leading-snug text-white/70 line-clamp-2">
        {task.title}
      </span>
      {task.description && (
        <span className="text-[10px] text-white/30 line-clamp-1">
          {task.description}
        </span>
      )}
    </div>
  )
}

/* ---- Drag Overlay Card ---- */

function DragOverlayCard({ task }: { task: ProjectTask }) {
  return (
    <div className="flex flex-col gap-0.5 rounded-lg border border-cosmic/40 bg-space-800/95 p-2 shadow-lg shadow-cosmic/10 backdrop-blur-sm">
      <span className="text-xs leading-snug text-white/90 line-clamp-2">
        {task.title}
      </span>
      {task.description && (
        <span className="text-[10px] text-white/40 line-clamp-1">
          {task.description}
        </span>
      )}
    </div>
  )
}

/* ---- Main Board ---- */

export function KanbanBoard({ tasks, projectId, onUpdateTask }: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<ProjectTask | null>(null)

  const projectTasks = tasks.filter((t) => t.project_id === projectId)
  const groups = groupByStatus(projectTasks)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  )

  function handleDragStart(event: DragStartEvent) {
    const task = projectTasks.find((t) => t.id === event.active.id)
    if (task) setActiveTask(task)
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveTask(null)

    const { active, over } = event
    if (!over) return

    const taskId = active.id as string
    const task = projectTasks.find((t) => t.id === taskId)
    if (!task) return

    // Determine target status: could be a column id or another task's id
    let targetStatus: TaskStatus | undefined

    // Check if dropped on a column directly
    if (TASK_STATUSES.includes(over.id as TaskStatus)) {
      targetStatus = over.id as TaskStatus
    } else {
      // Dropped on another task — find that task's status
      const overTask = projectTasks.find((t) => t.id === over.id)
      if (overTask) {
        targetStatus = overTask.status
      }
    }

    if (targetStatus && targetStatus !== task.status) {
      onUpdateTask(taskId, { status: targetStatus })
    }
  }

  return (
    <GlassCard hover={false} className="space-y-4">
      <h3 className="text-base font-semibold text-white/70">Board</h3>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-2 overflow-x-auto pb-1">
          {TASK_STATUSES.map((status) => {
            const items = groups[status]
            return (
              <KanbanColumn key={status} status={status} tasks={items}>
                <SortableContext
                  items={items.map((t) => t.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {items.map((task) => (
                    <SortableCard key={task.id} task={task} />
                  ))}
                </SortableContext>
              </KanbanColumn>
            )
          })}
        </div>

        <DragOverlay>
          {activeTask ? <DragOverlayCard task={activeTask} /> : null}
        </DragOverlay>
      </DndContext>
    </GlassCard>
  )
}
