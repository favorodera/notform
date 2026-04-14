<script setup lang="ts">
import { z } from 'zod'

const tagSchema = z.string().min(1, 'Tag cannot be empty')

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  tags: z.array(tagSchema).min(1, 'At least one tag is required'),
})

const submissionResult = ref<unknown>(null)

const form = useNotForm({
  schema,
  onSubmit: (values) => {
    submissionResult.value = values
  },
})

const handleReset = async () => {
  form.reset()
  await nextTick()
  submissionResult.value = null
}
</script>

<template>
  <div class="playground">
    <div class="card">
      <header class="card-header">
        <h1>Contact Form (v2)</h1>
        <p>A simple demonstration of NotForm v2.</p>
      </header>

      <NotForm
        :form="form"
        class="form-layout"
        @submit="form.submit"
        @reset="handleReset"
      >
        <!-- Name Field -->
        <div class="form-group">
          <label for="name">Full Name</label>
          <NotField
            v-slot="{ events }"
            path="name"
          >
            <input
              v-bind="events"
              id="name"
              v-model="form.values.name"
              type="text"
              placeholder="e.g. John Doe"
              class="form-input"
            >
            <NotMessage
              path="name"
              class="error-message"
            />
          </NotField>
        </div>

        <!-- Email Field -->
        <div class="form-group">
          <label for="email">Email Address</label>
          <NotField
            v-slot="{ events }"
            path="email"
          >
            <input
              v-bind="events"
              id="email"
              v-model="form.values.email"
              type="email"
              placeholder="e.g. john@example.com"
              class="form-input"
            >
            <NotMessage
              path="email"
              class="error-message"
            />
          </NotField>
        </div>

        <!-- Tags Array Field -->
        <div class="form-group">
          <label>Interest Tags</label>
          <NotArrayField
            v-slot="{ items, append, remove }"
            path="tags"
            :item-schema="tagSchema"
          >
            <div class="tags-list">
              <div
                v-for="(item, index) in items"
                :key="item.key"
                class="tag-item"
              >
                <NotField
                  v-slot="{ events }"
                  :path="item.path"
                >
                  <div class="input-with-action">
                    <input
                      v-bind="events"
                      v-model="form.values.tags[index]"
                      type="text"
                      placeholder="Tag name"
                      class="form-input"
                    >
                    <button
                      type="button"
                      class="btn-icon"
                      title="Remove Tag"
                      @click="remove(index)"
                    >
                      &times;
                    </button>
                  </div>
                  <NotMessage
                    :path="item.path"
                    class="error-message"
                  />
                </NotField>
              </div>
            </div>

            <button
              type="button"
              class="btn-text"
              @click="append('')"
            >
              + Add New Tag
            </button>
            <NotMessage
              path="tags"
              class="error-message"
            />
          </NotArrayField>
        </div>

        <!-- Form Actions -->
        <footer class="form-actions">
          <button
            type="submit"
            class="btn-primary"
            :disabled="!form.isDirty"
          >
            Submit Form
          </button>
          <button
            type="reset"
            class="btn-secondary"
          >
            Clear All
          </button>
        </footer>
      </NotForm>
    </div>

    <!-- API Result Display -->
    <div
      v-if="submissionResult"
      class="result-card"
    >
      <h3>Submission Received</h3>
      <pre class="code-block">{{ JSON.stringify(submissionResult, null, 2) }}</pre>
    </div>
  </div>
</template>

<style>
:root {
  --primary: #6366f1;
  --primary-hover: #4f46e5;
  --bg-gradient: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  --card-bg: #ffffff;
  --text-main: #1e293b;
  --text-muted: #64748b;
  --error: #ef4444;
  --border: #e2e8f0;
  --radius: 12px;
  --shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

body {
  margin: 0;
  font-family: 'Inter', -apple-system, sans-serif;
  background: var(--bg-gradient);
  color: var(--text-main);
  -webkit-font-smoothing: antialiased;
}

.playground {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  gap: 2rem;
}

.card {
  background: var(--card-bg);
  padding: 2.5rem;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  width: 100%;
  max-width: 500px;
}

.card-header {
  margin-bottom: 2rem;
  text-align: center;
}

.card-header h1 {
  margin: 0;
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--text-main);
}

.card-header p {
  margin: 0.5rem 0 0;
  color: var(--text-muted);
  font-size: 0.875rem;
}

.form-layout {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-main);
}

.form-input {
  padding: 0.75rem 1rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;
  outline: none;
}

.form-input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.error-message {
  color: var(--error);
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.tags-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.input-with-action {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.input-with-action .form-input {
  flex: 1;
}

.btn-icon {
  background: #fee2e2;
  color: #ef4444;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  transition: background 0.2s;
}

.btn-icon:hover {
  background: #fecaca;
}

.btn-text {
  background: transparent;
  border: none;
  color: var(--primary);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  text-align: left;
  width: fit-content;
}

.btn-text:hover {
  text-decoration: underline;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-primary {
  flex: 2;
  background: var(--primary);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary:hover:not(:disabled) {
  background: var(--primary-hover);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  flex: 1;
  background: white;
  border: 1px solid var(--border);
  color: var(--text-muted);
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: #f8fafc;
  border-color: var(--text-muted);
}

.result-card {
  background: #1e293b;
  color: #f8fafc;
  padding: 1.5rem;
  border-radius: var(--radius);
  width: 100%;
  max-width: 500px;
  animation: slideUp 0.3s ease-out;
}

.result-card h3 {
  margin: 0 0 1rem;
  font-size: 1.125rem;
  color: #cbd5e1;
}

.code-block {
  margin: 0;
  font-family: 'Fira Code', monospace;
  font-size: 0.875rem;
  white-space: pre-wrap;
  word-break: break-all;
}


@keyframes slideUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>

