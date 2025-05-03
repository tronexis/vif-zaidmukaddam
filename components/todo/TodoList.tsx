import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, PencilSimple, Check, Smiley, Clock } from "@phosphor-icons/react";
import { CircleCheckbox } from "./CircleCheckbox";
import { TodoListProps } from "@/types";
import { useRef, useCallback, useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  EmojiPicker,
  EmojiPickerContent,
  EmojiPickerFooter,
  EmojiPickerSearch,
} from "@/components/ui/emoji-picker";
import { TimePicker, formatTimeDisplay } from "./TimePicker";
import { SubtaskItem } from "@/types"; // Import SubtaskItem

export function TodoList({
  todos,
  onToggle,
  onDelete,
  onEdit,
  editingTodoId,
  editText,
  editEmoji,
  setEditText,
  setEditEmoji,
  handleEditTodo,
  cancelEditing,
  onToggleSubtask,
  onDeleteSubtask,
  onEditSubtask,
}: TodoListProps) {
  // Create a reference for the edit input
  const editInputRef = useRef<HTMLInputElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [editTime, setEditTime] = useState<string>("");
  const [editingSubtaskId, setEditingSubtaskId] = useState<string | null>(null);
  const [editSubtaskText, setEditSubtaskText] = useState<string>("");
  const subtaskInputRef = useRef<HTMLInputElement>(null);

  // Effect to detect mobile screens
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile);

    // Clean up
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Create a memoized handler for input changes
  const handleEditInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target;
      const newValue = input.value;
      const newPosition = input.selectionStart;

      setEditText(newValue);
      // Schedule cursor position update after state change
      requestAnimationFrame(() => {
        if (input && newPosition !== null) {
          input.setSelectionRange(newPosition, newPosition);
        }
      });
    },
    [setEditText]
  );

  // Initialize edit time when starting to edit
  useEffect(() => {
    if (editingTodoId) {
      const todo = todos.find((t) => t.id === editingTodoId);
      setEditTime(todo?.time || "");
    }
  }, [editingTodoId, todos]);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);

  // Subtask Edit Handlers
  const startEditingSubtask = (subtaskId: string, text: string) => {
    setEditingSubtaskId(subtaskId);
    setEditSubtaskText(text);
  };

  const cancelEditingSubtask = () => {
    setEditingSubtaskId(null);
    setEditSubtaskText("");
  };

  const handleEditSubtaskSubmit = (todoId: string) => {
    if (editingSubtaskId && editSubtaskText.trim()) {
      onEditSubtask(todoId, editingSubtaskId, editSubtaskText);
    }
    cancelEditingSubtask();
  };
  // End Subtask Edit Handlers

  return (
    <>
      {todos.map((todo) => (
        <div
          key={todo.id}
          className={cn(
            "group flex flex-col px-4 py-2.5 gap-3",
            todo.completed ? "text-muted-foreground/50" : "hover:bg-muted/50",
            editingTodoId === todo.id && "bg-muted/80 rounded-lg",
            editingTodoId !== todo.id && "cursor-pointer",
            "transition-colors"
          )}
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            if (editingTodoId !== todo.id && e.target === e.currentTarget) {
              onToggle(todo.id);
            }
          }}
        >
          <div className="flex items-center gap-2.5">
            {editingTodoId === todo.id ? (
              <>
                <div className="flex-1 flex items-center gap-2 py-0.5">
                  <div className="flex items-center gap-2 rounded-lg bg-background p-1 flex-1 border shadow-sm">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 shrink-0 rounded-md hover:bg-muted"
                        >
                          {editEmoji ? (
                            <span className="text-base">{editEmoji}</span>
                          ) : (
                            <Smiley
                              className="w-4 h-4 text-muted-foreground"
                              weight="fill"
                            />
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-[280px] p-0 rounded-xl"
                        side="top"
                        align="start"
                        sideOffset={12}
                      >
                        <div className="flex h-[300px] w-full items-center justify-center p-0">
                          <EmojiPicker
                            onEmojiSelect={(emoji: any) => {
                              setEditEmoji(emoji.emoji);
                            }}
                            className="h-full"
                          >
                            <EmojiPickerSearch placeholder="Search emoji..." />
                            <EmojiPickerContent className="h-[220px]" />
                            <EmojiPickerFooter className="border-t-0 p-1.5" />
                          </EmojiPicker>
                        </div>
                      </PopoverContent>
                    </Popover>

                    <Input
                      ref={editInputRef}
                      value={editText}
                      onChange={handleEditInputChange}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleEditTodo({
                            ...todo,
                            text: editText,
                            emoji: editEmoji,
                            time: editTime,
                          });
                        } else if (e.key === "Escape") {
                          cancelEditing();
                        }
                      }}
                      autoFocus
                      className="flex-1 h-8 py-0 text-sm bg-transparent border-0 shadow-none focus-visible:ring-0 px-2 rounded-none"
                      placeholder="Edit todo..."
                    />

                    <TimePicker time={editTime} onChange={setEditTime} />
                  </div>

                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive rounded-md hover:bg-muted"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        cancelEditing();
                      }}
                    >
                      <X className="w-4 h-4" weight="bold" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8 shrink-0 rounded-md"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        const updatedTodo = {
                          ...todo,
                          text: editText,
                          emoji: editEmoji,
                          time: editTime,
                        };
                        handleEditTodo(updatedTodo);
                      }}
                    >
                      <Check className="w-4 h-4" weight="bold" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                  <CircleCheckbox
                    checked={todo.completed}
                    onCheckedChange={() => onToggle(todo.id)}
                    className={cn(
                      todo.completed
                        ? "border-muted-foreground/50 bg-muted-foreground/20"
                        : "hover:border-muted-foreground/70"
                    )}
                  />
                </div>
                <div
                  className="flex-1 flex items-center min-w-0 cursor-pointer"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    onToggle(todo.id);
                  }}
                >
                  {todo.emoji && (
                    <span className="mr-2 text-base flex-shrink-0">
                      {todo.emoji}
                    </span>
                  )}
                  <div className="flex flex-col min-w-0">
                    <span
                      className={cn(
                        "truncate text-[15px]",
                        todo.completed && "line-through"
                      )}
                    >
                      {todo.text}
                    </span>
                    {todo.time && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                        <Clock className="w-3 h-3" weight="fill" />
                        <span>{formatTimeDisplay(todo.time)}</span>
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-7 w-7 text-muted-foreground hover:text-foreground",
                    isMobile
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100 transition-opacity"
                  )}
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    onEdit(todo.id, todo.text, todo.emoji);
                  }}
                >
                  <PencilSimple className="w-4 h-4" weight="bold" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-7 w-7 text-muted-foreground hover:text-destructive",
                    isMobile
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100 transition-opacity"
                  )}
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    onDelete(todo.id);
                  }}
                >
                  <X className="w-4 h-4" weight="bold" />
                </Button>
              </>
            )}
          </div>

          {todo.subtasks && todo.subtasks.length > 0 && (
            <div className="pl-6 pr-4 pb-1 pt-1 space-y-1">
              {todo.subtasks.map((subtask) => (
                <div
                  key={subtask.id}
                  className={cn(
                    "flex items-center gap-2 group",
                    subtask.completed
                      ? "text-muted-foreground/50"
                      : "hover:bg-muted/30",
                    editingSubtaskId === subtask.id && "bg-muted/60 rounded-md",
                    editingSubtaskId !== subtask.id && "cursor-pointer",
                    "transition-colors py-1 px-2 rounded-md"
                  )}
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    if (
                      editingSubtaskId !== subtask.id &&
                      e.target === e.currentTarget
                    ) {
                      onToggleSubtask(todo.id, subtask.id);
                    }
                  }}
                >
                  {editingSubtaskId === subtask.id ? (
                    <>
                      <Input
                        ref={subtaskInputRef}
                        value={editSubtaskText}
                        onChange={(e) => setEditSubtaskText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleEditSubtaskSubmit(todo.id);
                          } else if (e.key === "Escape") {
                            cancelEditingSubtask();
                          }
                        }}
                        autoFocus
                        className="flex-1 h-7 py-0 text-sm bg-background border rounded-md shadow-sm focus-visible:ring-1 focus-visible:ring-ring px-2"
                        placeholder="Edit subtask..."
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 shrink-0 text-muted-foreground hover:text-destructive rounded-md hover:bg-muted"
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          cancelEditingSubtask();
                        }}
                      >
                        <X className="w-3.5 h-3.5" weight="bold" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-6 w-6 shrink-0 rounded-md"
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          handleEditSubtaskSubmit(todo.id);
                        }}
                      >
                        <Check className="w-3.5 h-3.5" weight="bold" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <div
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                      >
                        <CircleCheckbox
                          checked={subtask.completed}
                          onCheckedChange={() =>
                            onToggleSubtask(todo.id, subtask.id)
                          }
                          className={cn(
                            "w-4 h-4",
                            subtask.completed
                              ? "border-muted-foreground/50 bg-muted-foreground/20"
                              : "hover:border-muted-foreground/70"
                          )}
                        />
                      </div>
                      <span
                        className={cn(
                          "flex-1 text-sm truncate",
                          subtask.completed && "line-through"
                        )}
                      >
                        {subtask.text}
                      </span>
                      <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity gap-0.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 shrink-0 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted"
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            startEditingSubtask(subtask.id, subtask.text);
                          }}
                        >
                          <PencilSimple className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 shrink-0 text-muted-foreground hover:text-destructive rounded-md hover:bg-muted"
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            onDeleteSubtask(todo.id, subtask.id);
                          }}
                        >
                          <X className="w-3.5 h-3.5" weight="bold" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </>
  );
}
