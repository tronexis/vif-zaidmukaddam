export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  emoji?: string;
  date: Date;
  time?: string; // Optional time in HH:mm format
  subtasks?: SubtaskItem[]; // Add subtasks array
}

export type SortOption = "newest" | "oldest" | "alphabetical" | "completed";

export interface CircularProgressProps {
  progress: number;
  size?: number;
  showEmoji?: boolean;
  showValue?: boolean;
}

export interface TodoListProps {
  todos: TodoItem[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string, emoji?: string) => void;
  editingTodoId: string | null;
  editText: string;
  editEmoji: string;
  setEditText: (text: string) => void;
  setEditEmoji: (emoji: string) => void;
  handleEditTodo: (todo: TodoItem) => void;
  cancelEditing: () => void;
  // Add subtask handlers
  onToggleSubtask: (todoId: string, subtaskId: string) => void;
  onDeleteSubtask: (todoId: string, subtaskId: string) => void;
  onEditSubtask: (todoId: string, subtaskId: string, newText: string) => void;
}

export interface FaqContentProps {
  // Empty interface for now, can be extended if needed
}

export interface MicButtonProps {
  isRecording: boolean;
  isProcessingSpeech: boolean;
  micPermission: "checking" | "granted" | "denied" | "prompt";
  startRecording: () => void;
  stopRecording: () => void;
  hasText: boolean;
  onSend: () => void;
}

export interface CircleCheckboxProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
}

export type Model =
  | "vif-llama-4-scout"
  | "vif-llama-4-maverick"
  | "vif-llama"
  | "vif-claude"
  | "vif-qwq"
  | "vif-qwen"
  | "vif-r1"
  | "vif-grok-3"
  | "vif-optimus-alpha";

export interface SubtaskItem {
  id: string;
  text: string;
  completed: boolean;
}
