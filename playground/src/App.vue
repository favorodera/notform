<script setup lang="ts">
import { Form, useForm } from '../../src'
import { z } from 'zod'

const schema = z.object({
  // String field
  name: z.string().min(1, 'Name is required'),
  
  // Number field
  age: z.number().min(18, 'Must be 18 or older'),
  
  // Boolean field
  subscribe: z.boolean(),
  
  // Enum field
  role: z.enum(['admin', 'user', 'guest']),
  
  // Union field
  contact: z.union([
    z.email(),
    z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
  ]),
  
  // Object field
  address: z.object({
    street: z.string(),
    city: z.string(),
    zipCode: z.string(),
  }),
  
  // Array field
  tags: z.array(z.string().min(5)).min(1, 'At least one tag required'),
})

const { state, id, validate, reset, isValidating, errors } = useForm({
  schema,
  initialState: {
    name: '',
    age: 18,
    subscribe: false,
    role: 'user',
    contact: '',
    address: {
      street: '',
      city: '',
      zipCode: '',
    },
    tags: [''],
  },
  initialErrors: [
    {
      message: 'Fill out all required fields',
      path: [],
    },
  ],
  // Custom validation callback - runs ONLY after schema validation passes
  onValidate: async (data) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const customErrors: { message: string, path: string[] }[] = []
    
    // Example 1: Cross-field validation (age + role)
    if (data.age < 21 && data.role === 'admin') {
      customErrors.push({
        message: 'Admins must be at least 21 years old',
        path: ['age'],
      })
    }
    
    // Example 2: Check for banned usernames
    const bannedNames = ['admin', 'root', 'test', 'administrator']
    if (bannedNames.includes(data.name.toLowerCase())) {
      customErrors.push({
        message: 'This username is not allowed',
        path: ['name'],
      })
    }
    
    // Example 3: Object field validation (city + zipCode)
    if (data.address.city && data.address.zipCode) {
      const cityZipMap: Record<string, string> = {
        'lagos': '100001',
        'abuja': '900001',
        'port harcourt': '500001',
      }
      
      const expectedZip = cityZipMap[data.address.city.toLowerCase()]
      if (expectedZip && data.address.zipCode !== expectedZip) {
        customErrors.push({
          message: `Zip code for ${data.address.city} should be ${expectedZip}`,
          path: ['address', 'zipCode'],
        })
      }
    }
    
    // Example 4: Array validation (unique tags)
    const uniqueTags = new Set(data.tags)
    if (uniqueTags.size !== data.tags.length) {
      customErrors.push({
        message: 'All tags must be unique (no duplicates)',
        path: ['tags'],
      })
    }
    
    // Example 5: Contact validation based on subscription
    if (data.subscribe && !data.contact) {
      customErrors.push({
        message: 'Contact is required when subscribing to newsletter',
        path: ['contact'],
      })
    }
    
    // Return errors if any, otherwise validation passes
    if (customErrors.length > 0) {
      return customErrors
    }
    
    // You can also return false for form-level errors (no specific field)
    // return false
    
    // Or return true/undefined to indicate success
    return true
  },
})

function addTag() {
  state.value.tags.push('')
}

function removeTag(index: number) {
  state.value.tags.splice(index, 1)
}
</script>

<template>
  <div class="min-h-screen bg-black text-green-500 font-mono p-4 selection:bg-green-500 selection:text-black">
    <Form
      :id
      action="#"
      class="max-w-3xl mx-auto space-y-8"
    >
      <header class="border-b-2 border-green-700 pb-4 mb-8">
        <h2 class="text-3xl font-bold uppercase tracking-widest text-green-400">
          > VALIDATION_PROTOCOL_V1.0
        </h2>
        <div class="text-xs text-green-700 mt-1">
          SYSTEM_STATUS: ONLINE | TERMINAL_ID: T-800
        </div>
      </header>
      
      <!-- Info Box as a System Message -->
      <div class="border border-green-800 p-4 bg-green-900/10 text-sm">
        <h3 class="font-bold mb-2 uppercase text-green-400">
          [SYSTEM_RULES]
        </h3>
        <ul class="space-y-1 text-xs opacity-80 list-none">
          <li>> ADMIN_REQ: AGE >= 21</li>
          <li>> BANNED_USERNAMES: [admin, root, test, administrator]</li>
          <li>> CITY_ZIP_MAP: {LAGOS:100001, ABUJA:900001, PH:500001}</li>
          <li>> UNIQUE_TAGS: REQUIRED</li>
          <li>> SUBSCRIPTION: REQUIRES CONTACT</li>
          <li>> LATENCY_SIM: 500ms</li>
        </ul>
      </div>

      <!-- String Field -->
      <div class="group">
        <label class="block text-xs uppercase opacity-70 mb-1" for="name">
          ENTER_IDENTITY_NAME (STRING) *
        </label>
        <div class="flex items-baseline border-b border-green-800 group-focus-within:border-green-400">
          <span class="mr-2 text-green-600">></span>
          <input
            v-model="state.name"
            class="bg-transparent w-full py-2 focus:outline-none placeholder-green-900 text-green-400"
            id="name"
            type="text"
            placeholder="INPUT_VALUE..."
          >
        </div>
        <p class="mt-1 text-xs text-green-800 uppercase">
          >> WARNING: CHECK BANNED LIST
        </p>
      </div>

      <!-- Number Field -->
      <div class="grid grid-cols-2 gap-8">
        <div class="group">
          <label class="block text-xs uppercase opacity-70 mb-1" for="age">
            UNIT_AGE (NUMBER) *
          </label>
           <div class="flex items-baseline border-b border-green-800 group-focus-within:border-green-400">
            <span class="mr-2 text-green-600">></span>
            <input
              v-model.number="state.age"
              class="bg-transparent w-full py-2 focus:outline-none placeholder-green-900 text-green-400"
              id="age"
              type="number"
              min="18"
            >
          </div>
          <p class="mt-1 text-xs text-green-800 uppercase">>> MIN: 18</p>
        </div>

        <!-- Enum Field -->
        <div class="group">
          <label class="block text-xs uppercase opacity-70 mb-1" for="role">
            ASSIGN_ROLE (ENUM) *
          </label>
          <div class="flex items-baseline border-b border-green-800 group-focus-within:border-green-400">
             <span class="mr-2 text-green-600">></span>
             <select
              v-model="state.role"
              class="bg-black w-full py-2 focus:outline-none cursor-pointer appearance-none text-green-400"
              id="role"
            >
              <option value="admin">ADMINISTRATOR</option>
              <option value="user">STANDARD_USER</option>
              <option value="guest">GUEST_ACCESS</option>
            </select>
          </div>
          <p class="mt-1 text-xs text-green-800 uppercase">>> ACCESS_LEVEL_CHECK</p>
        </div>
      </div>

      <!-- Boolean Field -->
      <div class="flex items-center gap-4 py-2 border border-green-900/50 p-4 border-dashed hover:border-green-700 transition-colors">
        <div class="relative flex items-center">
            <input
              v-model="state.subscribe"
              class="peer appearance-none h-5 w-5 border border-green-600 bg-transparent checked:bg-green-600 focus:outline-none cursor-pointer"
              id="subscribe"
              type="checkbox"
            >
            <svg class="absolute w-3 h-3 text-black pointer-events-none opacity-0 peer-checked:opacity-100 left-1 top-1" viewBox="0 0 14 14" fill="none">
               <path d="M3 8L6 11L11 3.5" stroke="currentColor" stroke-width="3" stroke-linecap="square" />
            </svg>
        </div>
        <div>
          <label class="text-sm font-bold uppercase cursor-pointer" for="subscribe">
            REQ_NEWSLETTER_FEED
          </label>
        </div>
      </div>

      <!-- Union Field -->
      <div class="group">
        <label class="block text-xs uppercase opacity-70 mb-1" for="contact">
          COMM_CHANNEL (EMAIL || PHONE)
        </label>
        <div class="flex items-baseline border-b border-green-800 group-focus-within:border-green-400">
          <span class="mr-2 text-green-600">></span>
          <input
            v-model="state.contact"
            class="bg-transparent w-full py-2 focus:outline-none placeholder-green-900 text-green-400"
            id="contact"
            type="text"
            placeholder="INPUT_CONTACT_DATA..."
          >
        </div>
        <p class="mt-1 text-xs text-green-800 uppercase">>> REQUIRED_IF_SUBSCRIBED</p>
      </div>

      <!-- Object Field -->
      <div class="border-l-2 border-green-800 pl-4 space-y-4">
        <h4 class="text-sm font-bold uppercase text-green-400 mb-4">
          :: LOCATOR_DATA (OBJECT)
        </h4>
        
        <div class="group">
          <label class="block text-xs uppercase opacity-70 mb-1" for="street">street_vector</label>
          <input
            v-model="state.address.street"
            class="bg-transparent w-full border-b border-green-800 focus:border-green-400 py-1 focus:outline-none text-green-400"
            id="street"
            type="text"
          >
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="group">
            <label class="block text-xs uppercase opacity-70 mb-1" for="city">city_node</label>
            <input
              v-model="state.address.city"
              class="bg-transparent w-full border-b border-green-800 focus:border-green-400 py-1 focus:outline-none text-green-400"
              id="city"
              type="text"
              placeholder="e.g. LAGOS"
            >
          </div>

          <div class="group">
            <label class="block text-xs uppercase opacity-70 mb-1" for="zipCode">zip_checksum</label>
            <input
              v-model="state.address.zipCode"
              class="bg-transparent w-full border-b border-green-800 focus:border-green-400 py-1 focus:outline-none text-green-400"
              id="zipCode"
              type="text"
            >
          </div>
        </div>
      </div>

      <!-- Array Field -->
      <div>
        <div class="flex items-center justify-between mb-2">
            <label class="block text-xs uppercase opacity-70">
              META_TAGS_ARRAY
            </label>
            <button
            type="button"
            @click="addTag"
            class="text-xs border border-green-600 px-2 py-1 uppercase hover:bg-green-600 hover:text-black transition-colors"
          >
            [+] INSERT_TAG
          </button>
        </div>

        <div class="space-y-2">
          <div
            v-for="(tag, index) in state.tags"
            :key="index"
            class="flex gap-2 items-center group"
          >
             <span class="text-green-700 text-xs text-nowrap">[{{index}}]</span>
            <input
              v-model="state.tags[index]"
               class="bg-transparent flex-1 border-b border-green-800 focus:border-green-400 py-1 focus:outline-none text-sm text-green-400"
              type="text"
              :placeholder="`DATA_SLOT_${index}`"
            >
            <button
              type="button"
              @click="removeTag(index)"
              class="text-red-500 hover:text-red-400 font-bold px-2"
              :disabled="state.tags.length === 1"
            >
              [X]
            </button>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-4 pt-4 border-t border-green-900 border-dashed">
        <button
          type="button"
          @click="validate"
          :disabled="isValidating"
          class="flex-1 bg-green-900/20 border border-green-500 py-3 font-bold uppercase tracking-wider hover:bg-green-500 hover:text-black transition-all disabled:opacity-50 disabled:cursor-wait"
        >
          <span v-if="isValidating" class="animate-pulse">>> PROCESSING...</span>
          <span v-else>EXECUTE_VALIDATION</span>
        </button>
        <button
          type="button"
          @click="reset"
          :disabled="isValidating"
          class="px-6 py-3 border border-green-800 text-green-700 uppercase font-medium hover:border-green-500 hover:text-green-500 transition-colors"
        >
          RESET_SYSTEM
        </button>
      </div>

      <!-- Errors Display -->
      <div v-if="errors.length" class="border xl-2 border-red-500 p-4 bg-red-900/10">
        <h3 class="text-red-500 font-bold uppercase mb-2 blink">
          !!! SYSTEM_ERRORS_DETECTED !!!
        </h3>
        <ul class="font-mono text-sm text-red-400 space-y-1">
          <li
            v-for="(error, idx) in errors"
            :key="idx"
            class="flex items-start gap-2"
          >
            <span>></span>
             <span
                v-if="error.path && error.path.length > 0"
                class="font-bold underline"
              >
                {{ error.path.join('.') }}:
              </span>
              <span>
                {{ error.message }}
              </span>
          </li>
        </ul>
      </div>

      <!-- Success Message -->
      <div v-else-if="!isValidating && state.name" class="border border-green-500 p-4 bg-green-900/20 text-center">
        <h3 class="font-bold text-green-400 uppercase tracking-widest">
         *** OPERATION_SUCCESSFUL ***
        </h3>
        <p class="text-xs text-green-600 mt-1">ALL_SYSTEMS_NOMINAL</p>
      </div>
    </Form>

    <!-- Debug Output -->
    <div class="mx-auto mt-12 max-w-3xl border-t border-green-900 pt-4">
      <details class="group">
        <summary class="cursor-pointer text-xs text-green-800 hover:text-green-500 uppercase list-none">
          [+] EXPAND_MEMORY_DUMP
        </summary>
        <div class="mt-2 text-sm opacity-70 font-mono p-4 border border-green-900/50 bg-black overflow-x-auto">
          <pre>{{ JSON.stringify({ state, isValidating, errors }, null, 2) }}</pre>
        </div>
      </details>
    </div>
  </div>
</template>
