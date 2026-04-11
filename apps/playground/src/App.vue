<script setup lang="ts">
import FormOne from './components/FormOne.vue'
import FormTwo from './components/FormTwo.vue'
import FormThree from './components/FormThree.vue'
</script>

<template>
  <main class="app-container">
    <h1>Shared Form State Playground</h1>
    
    <div class="forms-grid">
      <FormOne />
      <FormTwo />
      <FormThree />
    </div>
  </main>
</template>

<style>
.app-container {
  padding: 2rem;
  font-family: sans-serif;
  max-width: 1200px;
  margin: 0 auto;
}
.forms-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
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
.my-4 {
  margin-top: 1rem;
  margin-bottom: 1rem;
}
.mt-4 {
  margin-top: 1rem;
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
.state-monitor {
  background: #f3f4f6;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}
.state-monitor h4 {
  margin-top: 0;
  margin-bottom: 0.5rem;
}
pre {
  margin: 0.5rem 0;
  white-space: pre-wrap;
  font-family: monospace;
}
</style>
