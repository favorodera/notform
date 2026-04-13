<script setup lang="ts">
import { z } from 'zod'
import { NotForm, NotField, useNotForm, NotMessage } from 'notform'

const form = useNotForm({
  schema: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    rememberMe: z.boolean().optional(),
  }),
  initialValues: {
    email: '',
    password: '',
    rememberMe: false,
  },
  onSubmit: async (values) => {
    // Simulate API call
    form.isSubmitting.value = true
    await new Promise(resolve => setTimeout(resolve, 1500))
    console.log('Form Submitted:', values)
    alert('Submission Successful: ' + JSON.stringify(values, null, 2))
    form.isSubmitting.value = false
  },
})
</script>

<template>
  <div class="playground-root">
    <div class="form-container shadow-xl">
      <header class="form-header">
        <h1>NotForm <span class="v2-badge">V2</span></h1>
        <p>Simple Local Instance Test</p>
      </header>

      <NotForm
        :form="form"
        class="form-body"
        @submit="form.submit"
      >
        <NotField
          v-slot="{ events, errors, isDirty,path }"
          path="email"
        >
          <div :class="['field-group', { 'has-error': errors.length }]">
            <label :for="path">Email Address</label>
            <input
              :id="path"
              v-model="form.values.email"
              v-bind="events"
              type="email"
              placeholder="you@example.com"
            >
            <div class="field-footer">
              
              <NotMessage
                :id="path + '-error'"
                :path="path"
                class="error-msg"
              />
              <div class="field-status">
                <span
                  v-if="isDirty"
                  class="status-tag"
                >
                  Dirty
                </span>
                <span
                  v-if="form.isValidating.value"
                  class="status-tag pulse"
                >
                  Validating...
                </span>
              </div>
            </div>
          </div>
        </NotField>

        <NotField
          v-slot="{ events, errors, isDirty,path }"
          path="password"
        >
          <div :class="['field-group', { 'has-error': errors.length }]">
            <label :for="path">Password</label>
            <input
              :id="path"
              v-model="form.values.password"
              v-bind="events"
              type="password"
              placeholder="••••••••"
            >
            <div class="field-footer">
              <NotMessage
                :id="path + '-error'"
                :path="path"
                class="error-msg"
              />
              <span
                v-if="isDirty"
                class="status-tag"
              >
                Modified
              </span>
            </div>
          </div>
        </NotField>

        <NotField
          v-slot="{ events }"
          path="rememberMe"
        >
          <div class="checkbox-group">
            <input
              id="remember"
              v-model="form.values.rememberMe"
              v-bind="events"
              type="checkbox"
            >
            <label for="remember">Remember this machine</label>
          </div>
        </NotField>

        <div class="form-actions">
          <button
            type="submit"
            class="btn-submit"
            :disabled="form.isSubmitting.value || !form.isValid"
          >
            <span v-if="form.isSubmitting.value">Processing...</span>
            <span v-else>Sign In</span>
          </button>
          
          <button
            v-if="form.isDirty"
            type="button"
            class="btn-reset"
            @click="form.reset()"
          >
            Reset Changes
          </button>
        </div>
      </NotForm>

      <footer class="form-state-footer">
        <div class="state-indicator">
          <span>Form Dirty: <strong>{{ form.isDirty }}</strong></span>
          <span>Form Valid: <strong>{{ form.isValid }}</strong></span>
        </div>
      </footer>
    </div>
  </div>
</template>

<style>
/* Reset and Globals */
body {
  margin: 0;
  padding: 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #2d3436;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.playground-root {
  min-width: 100%;
  display: flex;
  justify-content: center;
  padding: 20px;
}

.form-container {
  background: white;
  width: 100%;
  max-width: 450px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 15px 35px rgba(0,0,0,0.1);
}

.form-header {
  padding: 30px;
  text-align: center;
  background: #f8f9fa;
  border-bottom: 1px solid #edf2f7;
}

.form-header h1 {
  margin: 0;
  font-size: 24px;
  color: #2d3748;
}

.v2-badge {
  background: #3182ce;
  color: white;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 99px;
  vertical-align: middle;
}

.form-header p {
  margin: 8px 0 0;
  color: #718096;
  font-size: 14px;
}

.form-body {
  padding: 30px;
}

.field-group {
  margin-bottom: 20px;
}

.field-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 14px;
  color: #4a5568;
}

.field-group input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.2s;
  box-sizing: border-box;
}

.field-group input:focus {
  outline: none;
  border-color: #3182ce;
  box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
}

.field-group.has-error input {
  border-color: #e53e3e;
}

.field-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 6px;
  min-height: 20px;
}

.error-msg {
  color: #e53e3e;
  font-size: 12px;
  font-weight: 500;
}

.field-status {
  display: flex;
  gap: 8px;
}

.status-tag {
  font-size: 10px;
  background: #ebf8ff;
  color: #2b6cb0;
  padding: 1px 6px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.pulse {
  animation: pulse-animation 1s infinite alternate;
}

@keyframes pulse-animation {
  from { opacity: 0.5; }
  to { opacity: 1; }
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 25px;
}

.checkbox-group input {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.checkbox-group label {
  font-size: 14px;
  color: #4a5568;
  cursor: pointer;
}

.form-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.btn-submit {
  width: 100%;
  padding: 14px;
  background: #3182ce;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-submit:hover:not(:disabled) {
  background: #2b6cb0;
}

.btn-submit:disabled {
  background: #cbd5e0;
  cursor: not-allowed;
}

.btn-reset {
  background: transparent;
  color: #718096;
  border: none;
  font-size: 14px;
  cursor: pointer;
  text-decoration: underline;
}

.form-state-footer {
  padding: 15px 30px;
  background: #fdfdfd;
  border-top: 1px solid #edf2f7;
}

.state-indicator {
  display: flex;
  justify-content: space-around;
  font-size: 11px;
  color: #a0aec0;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.state-indicator strong {
  color: #4a5568;
}
</style>
