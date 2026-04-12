<script setup lang="ts">
import PiniaComponentA from './components/PiniaComponentA.vue'
import PiniaComponentB from './components/PiniaComponentB.vue'
import PiniaSingleton from './components/PiniaSingleton.vue'

import ComposableComponentA from './components/ComposableComponentA.vue'
import ComposableComponentB from './components/ComposableComponentB.vue'
import ComposableSingleton from './components/ComposableSingleton.vue'

import { useFormStore } from './stores/form'
import { useSharedForm } from './composables/use-form'

const piniaForm = useFormStore().form
const composableForm = useSharedForm()
</script>

<template>
  <main class="app-container">
    <h1>Shared Form State Playground (V2)</h1>
    
    <!-- Pinia Shared Instance -->
    <section class="mb-10">
      <div class="header-flex">
        <h2>Pinia Shared Instance</h2>
        <span class="badge badge-blue">Pinia Store</span>
      </div>
      <div class="forms-grid">
        <PiniaComponentA />
        <PiniaComponentB />
        <PiniaSingleton />
      </div>
      <div class="state-monitor mt-4">
        <h4>Pinia Internal State</h4>
        <div class="field-api-tags mb-3">
          <span :class="['api-tag', piniaForm.isDirty ? 'tag-active' : '']">isDirty: {{ piniaForm.isDirty }}</span>
          <span :class="['api-tag', piniaForm.isTouched ? 'tag-active' : '']">isTouched: {{ piniaForm.isTouched }}</span>
          <span :class="['api-tag', !piniaForm.isValid ? 'tag-error' : 'tag-active']">isValid: {{ piniaForm.isValid }}</span>
          <span :class="['api-tag', piniaForm.isSubmitting.value ? 'tag-loading' : '']">isSubmitting: {{ piniaForm.isSubmitting.value }}</span>
          <span :class="['api-tag', piniaForm.isValidating.value ? 'tag-loading' : '']">isValidating: {{ piniaForm.isValidating.value }}</span>
        </div>
        <div class="state-split">
          <pre>Values: {{ piniaForm.values }}</pre>
          <pre>Errors: {{ piniaForm.errorsMap }}</pre>
        </div>
      </div>
    </section>

    <!-- Composable Shared Instance -->
    <section>
      <div class="header-flex">
        <h2>Composable Shared Instance</h2>
        <span class="badge badge-emerald">Vue Composable</span>
      </div>
      <div class="forms-grid">
        <ComposableComponentA />
        <ComposableComponentB />
        <ComposableSingleton />
      </div>
      <div class="state-monitor mt-4">
        <h4>Composable Internal State</h4>
        <div class="field-api-tags mb-3">
          <span :class="['api-tag', composableForm.isDirty ? 'tag-active' : '']">isDirty: {{ composableForm.isDirty }}</span>
          <span :class="['api-tag', composableForm.isTouched ? 'tag-active' : '']">isTouched: {{ composableForm.isTouched }}</span>
          <span :class="['api-tag', !composableForm.isValid ? 'tag-error' : 'tag-active']">isValid: {{ composableForm.isValid }}</span>
          <span :class="['api-tag', composableForm.isSubmitting.value ? 'tag-loading' : '']">isSubmitting: {{ composableForm.isSubmitting.value }}</span>
          <span :class="['api-tag', composableForm.isValidating.value ? 'tag-loading' : '']">isValidating: {{ composableForm.isValidating.value }}</span>
        </div>
        <div class="state-split">
          <pre>Values: {{ composableForm.values }}</pre>
          <pre>Errors: {{ composableForm.errorsMap }}</pre>
        </div>
      </div>
    </section>
  </main>
</template>

<style>
.app-container {
  padding: 2rem;
  font-family: sans-serif;
  max-width: 1200px;
  margin: 0 auto;
}
.header-flex {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}
.header-flex h2 {
  margin: 0;
}
.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
}
.badge-blue { background-color: #3b82f6; }
.badge-emerald { background-color: #10b981; }

.forms-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;
  margin-bottom: 1rem;
}
@media (min-width: 1024px) {
  .forms-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
.component-box {
  padding: 1.5rem;
  border-width: 2px;
  border-style: solid;
  border-radius: 8px;
  background-color: white;
  min-height: 250px;
}
.border-emerald-500 { border-color: #10b981; }
.border-blue-500 { border-color: #3b82f6; }
.border-orange-500 { border-color: #f97316; }

label {
  display: block;
  margin-bottom: 0.25rem;
  font-weight: bold;
  margin-top: 1rem;
}
input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}
p {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  min-height: 1.25rem;
  margin-bottom: 0;
}
.text-sm {
  font-size: 0.875rem;
}
.text-gray-500 {
  color: #6b7280;
}
.mb-2 {
  margin-bottom: 0.5rem;
}
.mb-3 {
  margin-bottom: 0.75rem;
}
.mb-10 {
  margin-bottom: 3rem;
}
.my-4 {
  margin-top: 1rem;
  margin-bottom: 1rem;
}
.mt-4 {
  margin-top: 1rem;
}
.mt-2 {
  margin-top: 0.5rem;
}
button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 0.5rem;
  font-weight: 500;
}
button:hover {
  background-color: #2563eb;
}
button[type="reset"] {
  background-color: #6b7280;
}
button[type="reset"]:hover {
  background-color: #4b5563;
}

/* API Tags */
.field-api-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
}
.api-tag {
  font-size: 0.7rem;
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  background-color: #f3f4f6;
  color: #6b7280;
  border: 1px solid #d1d5db;
  font-family: monospace;
}
.tag-active {
  background-color: #dbeafe;
  color: #2563eb;
  border-color: #bfdbfe;
}
.tag-error {
  background-color: #fee2e2;
  color: #dc2626;
  border-color: #fecaca;
}
.tag-loading {
  background-color: #fef3c7;
  color: #d97706;
  border-color: #fde68a;
}

.state-monitor {
  background: #f3f4f6;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}
.state-monitor h4 {
  margin-top: 0;
  margin-bottom: 0.5rem;
}
.state-split {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
pre {
  margin: 0;
  white-space: pre-wrap;
  font-family: monospace;
}
</style>
