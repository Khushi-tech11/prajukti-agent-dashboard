<template>
  <div class="h-full flex flex-col bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
    <!-- Header -->
    <div class="flex items-center justify-between px-6 py-4 border-b border-[hsl(var(--border))] flex-shrink-0">
      <div class="flex items-center gap-4">
        <div>
          <h1 class="text-sm font-semibold text-[hsl(var(--foreground))] tracking-wide">Command Center</h1>
          <p class="text-xs text-[hsl(var(--muted-foreground))] mt-0.5 font-mono">Multi-agent pipeline orchestration</p>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 overflow-y-auto flex flex-col items-center px-4 py-6">
      <div class="w-full max-w-3xl space-y-6">

        <!-- New Task Section -->
        <div class="flex items-center gap-3">
          <div class="h-px flex-1 bg-[hsl(var(--border))]" />
          <span class="text-[10px] tracking-[0.2em] text-[hsl(var(--muted-foreground))] uppercase font-mono">new task</span>
          <div class="h-px flex-1 bg-[hsl(var(--border))]" />
        </div>

        <!-- Task Input Card -->
        <div
          class="rounded-xl border transition-all duration-300"
          :class="isFocused
            ? 'border-emerald-500/40 bg-[hsl(var(--card))] shadow-[0_0_0_4px_rgba(52,211,153,0.05),0_20px_60px_rgba(0,0,0,0.3)]'
            : 'border-[hsl(var(--border))] bg-[hsl(var(--card))]'"
        >
          <!-- Textarea -->
          <div class="relative px-4 pt-4 pb-2">
            <Terminal class="absolute left-4 top-[1.15rem] w-4 h-4 text-[hsl(var(--muted-foreground))]" />
            <textarea
              ref="inputRef"
              v-model="taskInput"
              @focus="isFocused = true"
              @blur="isFocused = false"
              @keydown="handleKeydown"
              placeholder="Describe your task in natural language..."
              rows="3"
              class="w-full pl-7 pr-2 bg-transparent text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] resize-none focus:outline-none focus:ring-0 leading-relaxed"
            />
          </div>

          <!-- Attached Files -->
          <div v-if="attachedFiles.length > 0" class="px-4 pb-3">
            <div class="flex flex-wrap gap-2 pt-2 border-t border-[hsl(var(--border))]">
              <div
                v-for="(file, index) in attachedFiles"
                :key="index"
                class="flex items-center gap-1.5 px-2.5 py-1 bg-[hsl(var(--secondary))] rounded-lg border border-[hsl(var(--border))]"
              >
                <FileText class="w-3 h-3 text-[hsl(var(--muted-foreground))]" />
                <span class="text-[hsl(var(--foreground))] truncate max-w-[9rem] text-xs font-mono">{{ file.name }}</span>
                <button @click="removeFile(index)" class="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors ml-1">
                  <X class="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          <!-- Assignment Section -->
          <div class="px-4 py-3 border-t border-[hsl(var(--border))]">
            <p class="text-[10px] tracking-[0.15em] text-[hsl(var(--muted-foreground))] uppercase font-mono mb-3">Assign to</p>

            <div class="flex flex-wrap gap-2">
              <!-- Individual Agents -->
              <div class="flex-1 min-w-[200px]">
                <p class="text-[10px] text-[hsl(var(--muted-foreground))] mb-2 flex items-center gap-1.5">
                  <Bot class="w-3 h-3" />
                  Agents
                </p>
                <div class="flex flex-wrap gap-1.5">
                  <button
                    v-for="agent in agents"
                    :key="agent.id"
                    @click="toggleAgent(agent)"
                    class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs transition-all duration-150 font-mono"
                    :class="isAgentSelected(agent)
                      ? 'border-emerald-400 bg-emerald-500 text-white shadow-[0_0_12px_rgba(52,211,153,0.35)] font-semibold'
                      : 'border-[hsl(var(--border))] bg-[hsl(var(--secondary))] text-[hsl(var(--muted-foreground))] hover:border-emerald-500/40 hover:text-[hsl(var(--foreground))] hover:bg-emerald-500/5'"
                  >
                    <!-- Status dot -->
                    <div
                      class="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      :class="isAgentSelected(agent)
                        ? 'bg-white/80'
                        : agent.status === 'active' ? 'bg-emerald-400' : agent.status === 'paused' ? 'bg-amber-400' : 'bg-zinc-600'"
                    />
                    {{ agent.name }}
                    <!-- Checkmark when selected -->
                    <Check v-if="isAgentSelected(agent)" class="w-3 h-3 ml-0.5 text-white/90" />
                  </button>
                </div>
              </div>

              <!-- Pipelines -->
              <div class="flex-1 min-w-[200px]">
                <p class="text-[10px] text-[hsl(var(--muted-foreground))] mb-2 flex items-center gap-1.5">
                  <GitBranch class="w-3 h-3" />
                  Pipelines
                </p>
                <div class="flex flex-wrap gap-1.5">
                  <button
                    v-for="pipeline in pipelines"
                    :key="pipeline.id"
                    @click="selectPipelineItem(pipeline)"
                    class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs transition-all duration-150 font-mono"
                    :class="selectedPipeline?.id === pipeline.id
                      ? 'border-violet-400 bg-violet-500 text-white shadow-[0_0_12px_rgba(139,92,246,0.35)] font-semibold'
                      : 'border-[hsl(var(--border))] bg-[hsl(var(--secondary))] text-[hsl(var(--muted-foreground))] hover:border-violet-500/40 hover:text-[hsl(var(--foreground))] hover:bg-violet-500/5'"
                  >
                    <div
                      class="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      :class="selectedPipeline?.id === pipeline.id
                        ? 'bg-white/80'
                        : pipeline.status === 'active' ? 'bg-violet-400' : 'bg-zinc-600'"
                    />
                    {{ pipeline.name }}
                    <Check v-if="selectedPipeline?.id === pipeline.id" class="w-3 h-3 ml-0.5 text-white/90" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Pipeline Preview -->
            <div v-if="selectedPipeline" class="mt-4 p-3 rounded-lg bg-violet-500/5 border border-violet-500/25">
              <div class="flex items-center justify-between mb-2">
                <p class="text-xs text-violet-300 font-medium flex items-center gap-1.5">
                  <GitBranch class="w-3 h-3" />
                  {{ selectedPipeline.name }}
                </p>
                <span class="text-[10px] text-[hsl(var(--muted-foreground))] font-mono">{{ selectedPipeline.executionCount }} runs</span>
              </div>
              <p class="text-[10px] text-[hsl(var(--muted-foreground))] mb-3">{{ selectedPipeline.description }}</p>

              <!-- Pipeline Flow Preview -->
              <div class="flex items-center gap-1 overflow-x-auto pb-1">
                <template v-for="(node, index) in selectedPipeline.nodes" :key="node.id">
                  <div class="flex items-center gap-1.5 px-2 py-1 rounded-md bg-violet-500/10 border border-violet-500/20 flex-shrink-0">
                    <component :is="getNodeIcon(node.type)" class="w-3 h-3 text-violet-400" />
                    <span class="text-[10px] text-violet-200 font-mono whitespace-nowrap">{{ node.data.label }}</span>
                  </div>
                  <ArrowRight v-if="index < selectedPipeline.nodes.length - 1" class="w-3 h-3 text-violet-500/50 flex-shrink-0" />
                </template>
              </div>
            </div>
          </div>

          <!-- Options Row -->
          <div class="px-4 py-3 border-t border-[hsl(var(--border))] flex items-center gap-2">
            <!-- Priority Selector — Teleport to body so it escapes overflow:hidden -->
            <div class="relative">
              <button
                ref="priorityBtnRef"
                @click="togglePriorityDropdown"
                class="flex items-center gap-2 px-3 py-2 rounded-lg border text-xs transition-all font-mono"
                :class="priorityClasses"
              >
                <Flag class="w-3.5 h-3.5 flex-shrink-0" />
                <span>{{ selectedPriority }}</span>
                <ChevronDown class="w-3 h-3 flex-shrink-0 transition-transform duration-200" :class="priorityDropdownOpen ? 'rotate-180' : ''" />
              </button>

              <Teleport to="body">
                <Transition name="drop">
                  <div
                    v-if="priorityDropdownOpen"
                    :style="dropdownStyle"
                    class="fixed z-[9999] bg-[hsl(var(--popover))] border border-[hsl(var(--border))] rounded-lg shadow-2xl overflow-hidden min-w-[120px]"
                  >
                    <button
                      v-for="priority in priorities"
                      :key="priority"
                      @click="selectPriority(priority)"
                      class="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-[hsl(var(--secondary))] transition-colors text-xs"
                      :class="selectedPriority === priority ? 'bg-[hsl(var(--secondary))]' : ''"
                    >
                      <div
                        class="w-1.5 h-1.5 rounded-full"
                        :class="priority === 'High' ? 'bg-red-400' : priority === 'Medium' ? 'bg-amber-400' : 'bg-emerald-400'"
                      />
                      <span class="text-[hsl(var(--foreground))]">{{ priority }}</span>
                    </button>
                  </div>
                </Transition>
              </Teleport>
            </div>

            <!-- Attach Button -->
            <button
              @click="triggerFileUpload"
              class="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--secondary))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:border-[hsl(var(--muted-foreground))] text-xs transition-all flex-shrink-0 font-mono"
            >
              <Paperclip class="w-3.5 h-3.5" />
              <span class="hidden sm:inline">Attach</span>
            </button>
            <input ref="fileInputRef" type="file" multiple @change="handleFileUpload" class="hidden" />

            <div class="flex-1" />

            <!-- Execute Button -->
            <button
              @click="executeTask"
              :disabled="!taskInput.trim()"
              class="flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-medium tracking-wide transition-all duration-200 flex-shrink-0 font-mono"
              :class="taskInput.trim()
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_4px_16px_rgba(52,211,153,0.2)]'
                : 'bg-[hsl(var(--secondary))] text-[hsl(var(--muted-foreground))] cursor-not-allowed'"
            >
              <Play class="w-3.5 h-3.5" />
              Run Task
              <kbd v-if="taskInput.trim()" class="px-1.5 py-0.5 bg-white/15 rounded text-[9px]">Enter</kbd>
            </button>
          </div>

          <!-- Selected Summary bar -->
          <div
            v-if="selectedAgents.length > 0 || selectedPipeline"
            class="px-4 py-2.5 border-t border-[hsl(var(--border))] flex items-center gap-2 flex-wrap bg-[hsl(var(--secondary))]/30"
          >
            <span class="text-[10px] text-[hsl(var(--muted-foreground))] font-mono">Running on:</span>

            <!-- Selected agents in summary -->
            <div
              v-for="agent in selectedAgents"
              :key="agent.id"
              class="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500 border border-emerald-400"
            >
              <Bot class="w-2.5 h-2.5 text-white" />
              <span class="text-[10px] text-white font-mono font-semibold">{{ agent.name }}</span>
            </div>

            <!-- Selected pipeline in summary -->
            <div
              v-if="selectedPipeline"
              class="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-violet-500 border border-violet-400"
            >
              <GitBranch class="w-2.5 h-2.5 text-white" />
              <span class="text-[10px] text-white font-mono font-semibold">{{ selectedPipeline.name }}</span>
            </div>

            <!-- Count badge -->
            <span v-if="selectedAgents.length > 1" class="text-[10px] text-[hsl(var(--muted-foreground))] font-mono ml-1">
              {{ selectedAgents.length }} agents
            </span>
          </div>
        </div>

        <!-- Running Tasks Section -->
        <div v-if="runningTasks.length > 0" class="space-y-3">
          <div class="flex items-center gap-3">
            <div class="h-px flex-1 bg-[hsl(var(--border))]" />
            <span class="text-[10px] tracking-[0.2em] text-amber-400 uppercase font-mono flex items-center gap-2">
              <Loader2 class="w-3 h-3 animate-spin" />
              Running ({{ runningTasks.length }})
            </span>
            <div class="h-px flex-1 bg-[hsl(var(--border))]" />
          </div>

          <div
            v-for="task in runningTasks"
            :key="task.id"
            class="rounded-xl border border-amber-500/30 bg-[hsl(var(--card))] overflow-hidden"
          >
            <div class="px-4 py-3 flex items-start gap-3">
              <div class="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                <Loader2 class="w-4 h-4 text-amber-400 animate-spin" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm text-[hsl(var(--foreground))] font-medium truncate">{{ task.input }}</p>
                <div class="flex items-center gap-2 mt-1">
                  <span class="text-xs text-[hsl(var(--muted-foreground))] font-mono">{{ task.pipeline || task.agent }}</span>
                  <span class="text-xs text-[hsl(var(--muted-foreground))]">-</span>
                  <span class="text-xs text-amber-400 font-mono">{{ task.elapsed }}</span>
                </div>
              </div>
              <button
                @click="cancelTask(task.id)"
                class="p-1.5 rounded-md text-[hsl(var(--muted-foreground))] hover:text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <X class="w-4 h-4" />
              </button>
            </div>

            <div class="px-4 pb-4">
              <div class="flex items-center gap-2 overflow-x-auto pb-2">
                <template v-for="(step, index) in task.steps" :key="index">
                  <div
                    class="flex items-center gap-2 px-3 py-2 rounded-lg border transition-all flex-shrink-0"
                    :class="getLinearStepClass(task, index)"
                  >
                    <div
                      class="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      :class="getStepIconClass(task, index)"
                    >
                      <Check v-if="index < task.currentStep" class="w-3 h-3" />
                      <Loader2 v-else-if="index === task.currentStep" class="w-3 h-3 animate-spin" />
                      <span v-else class="text-[9px] font-mono">{{ index + 1 }}</span>
                    </div>
                    <div class="min-w-0">
                      <p class="text-xs font-medium whitespace-nowrap">{{ step.name }}</p>
                      <p v-if="step.agent" class="text-[10px] text-[hsl(var(--muted-foreground))] font-mono whitespace-nowrap">{{ step.agent }}</p>
                    </div>
                    <span v-if="index < task.currentStep && step.duration" class="text-[10px] font-mono opacity-60 ml-1">{{ step.duration }}</span>
                  </div>
                  <ArrowRight v-if="index < task.steps.length - 1" class="w-4 h-4 text-[hsl(var(--muted-foreground))] flex-shrink-0" />
                </template>
              </div>
            </div>

            <div class="px-4 pb-3">
              <div class="h-1.5 w-full rounded-full bg-[hsl(var(--secondary))] overflow-hidden">
                <div
                  class="h-full rounded-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-500"
                  :style="{ width: `${(task.currentStep / task.steps.length) * 100}%` }"
                />
              </div>
              <div class="flex items-center justify-between mt-1.5">
                <span class="text-[10px] text-[hsl(var(--muted-foreground))] font-mono">Step {{ task.currentStep + 1 }} of {{ task.steps.length }}</span>
                <span class="text-[10px] text-[hsl(var(--muted-foreground))] font-mono">{{ Math.round((task.currentStep / task.steps.length) * 100) }}% complete</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Tasks Section -->
        <div class="flex items-center gap-3">
          <div class="h-px flex-1 bg-[hsl(var(--border))]" />
          <span class="text-[10px] tracking-[0.2em] text-[hsl(var(--muted-foreground))] uppercase font-mono">Recent</span>
          <div class="h-px flex-1 bg-[hsl(var(--border))]" />
        </div>

        <div class="space-y-2 pb-4">
          <div
            v-for="task in completedTasks"
            :key="task.id"
            class="group flex items-center gap-3 px-4 py-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:border-[hsl(var(--muted-foreground))] transition-all duration-200"
          >
            <div
              class="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
              :class="task.status === 'completed' ? 'bg-emerald-500/10' : 'bg-red-500/10'"
            >
              <Check v-if="task.status === 'completed'" class="w-3.5 h-3.5 text-emerald-400" />
              <AlertCircle v-else class="w-3.5 h-3.5 text-red-400" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-[hsl(var(--foreground))] truncate">{{ task.input }}</p>
              <div class="flex items-center gap-2 mt-0.5">
                <span class="text-[10px] text-[hsl(var(--muted-foreground))] font-mono">{{ task.pipeline || task.agent }}</span>
                <span class="text-[10px] text-[hsl(var(--muted-foreground))]">-</span>
                <span class="text-[10px] text-[hsl(var(--muted-foreground))] font-mono">{{ task.time }}</span>
                <span v-if="task.duration" class="text-[10px] text-[hsl(var(--muted-foreground))] font-mono">- {{ task.duration }}</span>
              </div>
            </div>
            <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                @click.stop="rerunTask(task)"
                class="p-1.5 rounded-md text-[hsl(var(--muted-foreground))] hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                title="Rerun task"
              >
                <RotateCcw class="w-3.5 h-3.5" />
              </button>
              <button
                @click.stop="openTrace(task)"
                class="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] text-[hsl(var(--muted-foreground))] hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors font-mono"
              >
                <Activity class="w-3 h-3" />
                Trace
              </button>
            </div>
          </div>

          <div v-if="completedTasks.length === 0" class="text-center py-8">
            <div class="w-12 h-12 rounded-xl bg-[hsl(var(--secondary))] flex items-center justify-center mx-auto mb-3">
              <Inbox class="w-6 h-6 text-[hsl(var(--muted-foreground))]" />
            </div>
            <p class="text-sm text-[hsl(var(--muted-foreground))]">No tasks yet</p>
            <p class="text-xs text-[hsl(var(--muted-foreground))] mt-1">Submit a task to get started</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Trace Modal -->
    <Transition name="modal">
      <div v-if="traceTask" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeTrace" />
        <div class="relative w-full max-w-2xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl shadow-2xl overflow-hidden">
          <div class="flex items-center justify-between px-6 py-4 border-b border-[hsl(var(--border))]">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                <Activity class="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <h3 class="text-sm font-semibold text-[hsl(var(--foreground))]">Execution Trace</h3>
                <p class="text-xs text-[hsl(var(--muted-foreground))] font-mono">{{ traceTask.id }}</p>
              </div>
            </div>
            <button @click="closeTrace" class="p-2 rounded-lg hover:bg-[hsl(var(--secondary))] transition-colors">
              <X class="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
            </button>
          </div>

          <div class="p-6 max-h-[60vh] overflow-y-auto">
            <div class="mb-4">
              <p class="text-sm text-[hsl(var(--foreground))] font-medium">{{ traceTask.input }}</p>
              <div class="flex items-center gap-3 mt-2">
                <span
                  class="px-2 py-0.5 rounded text-[10px] font-mono"
                  :class="traceTask.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'"
                >
                  {{ traceTask.status }}
                </span>
                <span class="text-xs text-[hsl(var(--muted-foreground))] font-mono">{{ traceTask.duration }}</span>
              </div>
            </div>

            <div class="relative">
              <div class="absolute left-4 top-0 bottom-0 w-px bg-[hsl(var(--border))]" />
              <div class="space-y-4">
                <div
                  v-for="(step, index) in traceTask.trace"
                  :key="index"
                  class="relative flex gap-4 pl-1"
                >
                  <div
                    class="relative z-10 w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                    :class="step.status === 'completed' ? 'bg-emerald-500 text-white' : step.status === 'failed' ? 'bg-red-500 text-white' : 'bg-[hsl(var(--secondary))] text-[hsl(var(--muted-foreground))]'"
                  >
                    <Check v-if="step.status === 'completed'" class="w-3.5 h-3.5" />
                    <AlertCircle v-else-if="step.status === 'failed'" class="w-3.5 h-3.5" />
                    <span v-else class="text-xs font-mono">{{ index + 1 }}</span>
                  </div>

                  <div class="flex-1 pb-4">
                    <div class="flex items-start justify-between">
                      <div>
                        <p class="text-sm font-medium text-[hsl(var(--foreground))]">{{ step.name }}</p>
                        <p v-if="step.agent" class="text-xs text-[hsl(var(--muted-foreground))] font-mono mt-0.5">Agent: {{ step.agent }}</p>
                      </div>
                      <span class="text-[10px] text-[hsl(var(--muted-foreground))] font-mono">{{ step.duration }}</span>
                    </div>

                    <div v-if="step.input" class="mt-2 p-3 rounded-lg bg-[hsl(var(--secondary))] border border-[hsl(var(--border))]">
                      <p class="text-[10px] text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-1">Input</p>
                      <p class="text-xs text-[hsl(var(--foreground))] font-mono">{{ step.input }}</p>
                    </div>

                    <div v-if="step.output" class="mt-2 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                      <p class="text-[10px] text-emerald-400 uppercase tracking-wider mb-1">Output</p>
                      <p class="text-xs text-[hsl(var(--foreground))] font-mono">{{ step.output }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-end gap-2 px-6 py-4 border-t border-[hsl(var(--border))] bg-[hsl(var(--secondary))]/30">
            <button
              @click="rerunFromTrace"
              class="flex items-center gap-2 px-4 py-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-sm text-[hsl(var(--foreground))] hover:bg-[hsl(var(--secondary))] transition-colors"
            >
              <RotateCcw class="w-4 h-4" />
              Rerun
            </button>
            <button
              @click="closeTrace"
              class="flex items-center gap-2 px-4 py-2 rounded-lg bg-[hsl(var(--primary))] text-sm text-[hsl(var(--primary-foreground))] hover:opacity-90 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Drag Overlay -->
    <div
      v-if="isDragging"
      class="fixed inset-0 bg-[hsl(var(--background))]/90 backdrop-blur-sm flex items-center justify-center z-40"
      @dragover.prevent
      @dragleave="isDragging = false"
      @drop="handleDrop"
    >
      <div class="flex flex-col items-center gap-4 p-10 border-2 border-dashed border-[hsl(var(--border))] rounded-2xl">
        <Upload class="w-10 h-10 text-emerald-500" />
        <p class="text-base font-medium text-[hsl(var(--foreground))]">Drop files here</p>
        <p class="text-xs text-[hsl(var(--muted-foreground))] font-mono">images - documents - data</p>
      </div>
    </div>

    <!-- Dropdown Overlay -->
    <div v-if="priorityDropdownOpen" class="fixed inset-0 z-[9998]" @click="priorityDropdownOpen = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAgentsStore } from '@/stores/agents'
import { usePipelineStore } from '@/stores/pipeline'
import { useToastStore } from '@/stores/toast'
import { useGlobalContextStore } from '@/stores/globalContext'
import GlobalContextIndicator from '@/components/ui/GlobalContextIndicator.vue'
import type { Agent } from '@/stores/agents'
import type { Pipeline } from '@/stores/pipeline'
import {
  Terminal, Paperclip, X, FileText, Bot, GitBranch,
  ArrowRight, Upload, ChevronDown, Flag, Loader2, Check,
  AlertCircle, RotateCcw, Inbox, Play, Activity, Cpu, Wrench, CircleDot
} from 'lucide-vue-next'

interface TaskStep {
  name: string
  agent?: string
  duration?: string
}

interface TraceStep {
  name: string
  agent?: string
  duration: string
  status: 'completed' | 'failed' | 'pending'
  input?: string
  output?: string
}

interface RunningTask {
  id: string
  input: string
  agent?: string
  pipeline?: string
  elapsed: string
  currentStep: number
  steps: TaskStep[]
}

interface CompletedTask {
  id: string
  input: string
  agent?: string
  pipeline?: string
  status: 'completed' | 'failed'
  time: string
  duration?: string
  trace?: TraceStep[]
}

const agentsStore = useAgentsStore()
const pipelineStore = usePipelineStore()
const toastStore = useToastStore()
const globalStore = useGlobalContextStore()

const { agents } = storeToRefs(agentsStore)
const { pipelines } = storeToRefs(pipelineStore)

const inputRef = ref<HTMLTextAreaElement | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)

const taskInput = ref('')
const isFocused = ref(false)
const isDragging = ref(false)
const attachedFiles = ref<File[]>([])

const selectedAgents = ref<Agent[]>([])
const selectedPipeline = ref<Pipeline | null>(null)
const selectedPriority = ref<'Low' | 'Medium' | 'High'>('Medium')
const priorityDropdownOpen = ref(false)
const priorityBtnRef = ref<HTMLButtonElement | null>(null)
const dropdownStyle = ref<Record<string, string>>({})

const priorities = ['Low', 'Medium', 'High'] as const

function togglePriorityDropdown() {
  if (!priorityDropdownOpen.value && priorityBtnRef.value) {
    const rect = priorityBtnRef.value.getBoundingClientRect()
    dropdownStyle.value = {
      top: `${rect.bottom + 6}px`,
      left: `${rect.left}px`,
    }
  }
  priorityDropdownOpen.value = !priorityDropdownOpen.value
}

const traceTask = ref<CompletedTask | null>(null)

const runningTasks = ref<RunningTask[]>([])
const completedTasks = ref<CompletedTask[]>([
  {
    id: 'task_1',
    input: 'Research competitor pricing strategies and create a summary report',
    pipeline: 'Content Research Pipeline',
    status: 'completed',
    time: '2 min ago',
    duration: '45s',
    trace: [
      { name: 'Input Processing', duration: '0.5s', status: 'completed', input: 'Research competitor pricing strategies and create a summary report' },
      { name: 'Research Agent', agent: 'Research Assistant', duration: '15s', status: 'completed', input: 'Find competitor pricing data', output: 'Found 5 competitor pricing structures' },
      { name: 'Data Analysis', agent: 'Data Analyzer', duration: '12s', status: 'completed', input: 'Analyze pricing patterns', output: 'Identified 3 pricing tiers across competitors' },
      { name: 'Content Writing', agent: 'Content Writer', duration: '15s', status: 'completed', input: 'Create summary report', output: 'Generated 500-word summary report' },
      { name: 'Output Formatting', duration: '2.5s', status: 'completed', output: 'Report formatted and ready' }
    ]
  },
  {
    id: 'task_2',
    input: 'Generate social media content for product launch',
    agent: 'Content Writer',
    status: 'completed',
    time: '15 min ago',
    duration: '1m 23s',
    trace: [
      { name: 'Input Processing', duration: '0.3s', status: 'completed' },
      { name: 'Content Generation', agent: 'Content Writer', duration: '1m 20s', status: 'completed', output: '10 social media posts created' },
      { name: 'Output Formatting', duration: '2.7s', status: 'completed' }
    ]
  },
  {
    id: 'task_3',
    input: 'Analyze Q4 sales data and identify trends',
    agent: 'Data Analyzer',
    status: 'failed',
    time: '1 hour ago',
    trace: [
      { name: 'Input Processing', duration: '0.2s', status: 'completed' },
      { name: 'Data Loading', agent: 'Data Analyzer', duration: '5s', status: 'failed', output: 'Error: Unable to access sales database' }
    ]
  },
])

const priorityClasses = computed(() => {
  switch (selectedPriority.value) {
    case 'High':   return 'border-red-500/40 bg-red-500/10 text-red-400'
    case 'Medium': return 'border-amber-500/40 bg-amber-500/10 text-amber-400'
    default:       return 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
  }
})

function getNodeIcon(type: string) {
  switch (type) {
    case 'input':     return CircleDot
    case 'llm-agent': return Cpu
    case 'tool-api':  return Wrench
    case 'condition': return GitBranch
    case 'output':    return Check
    default:          return CircleDot
  }
}

function isAgentSelected(agent: Agent): boolean {
  return selectedAgents.value.some(a => a.id === agent.id)
}

function toggleAgent(agent: Agent) {
  if (selectedPipeline.value) selectedPipeline.value = null
  const index = selectedAgents.value.findIndex(a => a.id === agent.id)
  if (index > -1) selectedAgents.value.splice(index, 1)
  else selectedAgents.value.push(agent)
}

function selectPipelineItem(pipeline: Pipeline) {
  if (selectedPipeline.value?.id === pipeline.id) {
    selectedPipeline.value = null
  } else {
    selectedPipeline.value = pipeline
    selectedAgents.value = []
  }
}

function selectPriority(priority: 'Low' | 'Medium' | 'High') {
  selectedPriority.value = priority
  priorityDropdownOpen.value = false
}

function getLinearStepClass(task: RunningTask, index: number) {
  if (index < task.currentStep)    return 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400'
  if (index === task.currentStep)  return 'border-amber-500/40 bg-amber-500/10 text-amber-400'
  return 'border-[hsl(var(--border))] bg-[hsl(var(--secondary))] text-[hsl(var(--muted-foreground))]'
}

function getStepIconClass(task: RunningTask, index: number) {
  if (index < task.currentStep)   return 'bg-emerald-500 text-white'
  if (index === task.currentStep) return 'bg-amber-500 text-white'
  return 'bg-[hsl(var(--secondary))] text-[hsl(var(--muted-foreground))] border border-[hsl(var(--border))]'
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
    event.preventDefault()
    executeTask()
  }
}

function triggerFileUpload() { fileInputRef.value?.click() }

function handleFileUpload(event: Event) {
  const files = (event.target as HTMLInputElement).files
  if (files) attachedFiles.value.push(...Array.from(files))
}

function removeFile(index: number) { attachedFiles.value.splice(index, 1) }

function handleDrop(event: DragEvent) {
  event.preventDefault()
  isDragging.value = false
  const files = event.dataTransfer?.files
  if (files) {
    attachedFiles.value.push(...Array.from(files))
    toastStore.success('Files attached', `${files.length} file(s) added`)
  }
}

function executeTask() {
  if (!taskInput.value.trim()) return

  const taskId = `task_${Date.now()}`
  let steps: TaskStep[] = []
  let pipelineName = ''
  let agentName = ''

  if (selectedPipeline.value) {
    pipelineName = selectedPipeline.value.name
    steps = selectedPipeline.value.nodes.map(node => ({
      name: node.data.label,
      agent: node.type === 'llm-agent' ? node.data.description : undefined
    }))
  } else if (selectedAgents.value.length > 0) {
    agentName = selectedAgents.value.map(a => a.name).join(' -> ')
    steps = [
      { name: 'Initializing' },
      ...selectedAgents.value.map(agent => ({ name: agent.name, agent: agent.role })),
      { name: 'Finalizing' }
    ]
  } else {
    agentName = 'Auto-select'
    steps = [
      { name: 'Initializing' },
      { name: 'Processing', agent: 'Auto-assigned' },
      { name: 'Generating output' },
      { name: 'Finalizing' }
    ]
  }

  const newRunningTask: RunningTask = {
    id: taskId,
    input: taskInput.value,
    agent: agentName || undefined,
    pipeline: pipelineName || undefined,
    elapsed: '0s',
    currentStep: 0,
    steps
  }

  runningTasks.value.unshift(newRunningTask)
  toastStore.info('Task submitted', 'Your task is being processed...')
  globalStore.addActivity({
    type: 'task_completed',
    entityName: taskInput.value.slice(0, 50) + (taskInput.value.length > 50 ? '...' : '')
  })

  simulateTaskProgress(taskId)

  taskInput.value = ''
  attachedFiles.value = []
  selectedAgents.value = []
  selectedPipeline.value = null
}

function simulateTaskProgress(taskId: string) {
  const task = runningTasks.value.find(t => t.id === taskId)
  if (!task) return

  let elapsed = 0
  const stepDuration = 2000

  const interval = setInterval(() => {
    elapsed++
    const taskIndex = runningTasks.value.findIndex(t => t.id === taskId)
    if (taskIndex === -1) { clearInterval(interval); return }

    runningTasks.value[taskIndex].elapsed = `${elapsed}s`

    const currentStep = Math.floor((elapsed * 1000) / stepDuration)
    if (currentStep < task.steps.length) {
      runningTasks.value[taskIndex].currentStep = currentStep
      if (currentStep > 0 && runningTasks.value[taskIndex].steps[currentStep - 1]) {
        runningTasks.value[taskIndex].steps[currentStep - 1].duration = `${Math.round(stepDuration / 1000)}s`
      }
    }

    const totalDuration = (task.steps.length * stepDuration) / 1000
    if (elapsed >= totalDuration) {
      clearInterval(interval)
      const completedTask = runningTasks.value.splice(taskIndex, 1)[0]
      completedTasks.value.unshift({
        id: completedTask.id,
        input: completedTask.input,
        agent: completedTask.agent,
        pipeline: completedTask.pipeline,
        status: 'completed',
        time: 'Just now',
        duration: `${elapsed}s`,
        trace: completedTask.steps.map((step, idx) => ({
          name: step.name,
          agent: step.agent,
          duration: step.duration || '2s',
          status: 'completed' as const,
          input: idx === 0 ? completedTask.input : undefined,
          output: idx === completedTask.steps.length - 1 ? 'Task completed successfully' : undefined
        }))
      })
      toastStore.success('Task completed', 'Your task has finished successfully')
    }
  }, 1000)
}

function cancelTask(taskId: string) {
  const index = runningTasks.value.findIndex(t => t.id === taskId)
  if (index !== -1) {
    runningTasks.value.splice(index, 1)
    toastStore.info('Task cancelled', 'The task has been stopped')
  }
}

function openTrace(task: CompletedTask)  { traceTask.value = task }
function closeTrace()                    { traceTask.value = null }
function rerunFromTrace() {
  if (traceTask.value) { rerunTask(traceTask.value); closeTrace() }
}

function rerunTask(task: CompletedTask) {
  taskInput.value = task.input
  if (task.agent) {
    const matched = agents.value.find(a => a.name === task.agent)
    if (matched) selectedAgents.value = [matched]
  }
  if (task.pipeline) {
    const matched = pipelines.value.find(p => p.name === task.pipeline)
    if (matched) selectedPipeline.value = matched
  }
  inputRef.value?.focus()
}

function handleDragEnter(event: DragEvent) { event.preventDefault(); isDragging.value = true }
onMounted(() => document.addEventListener('dragenter', handleDragEnter))
onUnmounted(() => document.removeEventListener('dragenter', handleDragEnter))
</script>

<style scoped>
.drop-enter-active, .drop-leave-active { transition: all 0.15s ease; }
.drop-enter-from, .drop-leave-to { opacity: 0; transform: translateY(-6px); }

.modal-enter-active, .modal-leave-active { transition: all 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .relative, .modal-leave-to .relative { transform: scale(0.95); }
</style>
