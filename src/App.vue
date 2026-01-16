<script lang="ts" setup>
import { reactive, useTemplateRef } from 'vue'
import ValidForm from './components/valid-form.vue'
import { z } from 'zod'

const schema = z.object({
  // String testing
  username: z.string().min(3, 'Username must be at least 3 chars'),

  // Number testing
  age: z.number().min(18, 'Must be at least 18'),

  // Object testing
  profile: z.object({
    bio: z.string().min(10, 'Bio too short'),
    rank: z.number().max(10),
  }),

  // Array of strings testing
  hobbies: z.array(z.string().min(2, 'Hobby too short')).min(1, 'Add at least one hobby'),

  // Array of objects testing
  friends: z.array(z.object({
    name: z.string().min(2, 'Name required'),
    closeness: z.number().min(1).max(5),
  })).min(1),
})

const state = reactive<z.infer<typeof schema>>({
  username: '',
  age: 0,
  profile: {
    bio: '',
    rank: 0,
  },
  hobbies: [''],
  friends: [{ name: '', closeness: 1 }],
})

const formRef = useTemplateRef('form')

function handleSubmit() {
  console.log('Form State:', state)
}
</script>

<template>
  <div id="test-app">
    <h1>ValidForm Comprehensive Test</h1>

    <ValidForm ref="form" :schema :state :validate-on="['input', 'blur']">

      <!-- Basic Fields -->
      <section>
        <h3>Basic Fields</h3>
        <div>
          <label>Username (String):</label>
          <input v-model="state.username" type="text" name="username">
          <p style="color: red;">{{ formRef?.getError('username') }}</p>
        </div>

        <div>
          <label>Age (Number):</label>
          <input v-model.number="state.age" type="number" name="age">
          <p style="color: red;">{{ formRef?.getError('age') }}</p>
        </div>
      </section>

      <!-- Object Fields -->
      <section>
        <h3>Object Fields (profile.*)</h3>
        <div>
          <label>Bio:</label>
          <input v-model="state.profile.bio" type="text" name="profile.bio">
          <p style="color: red;">{{ formRef?.getError('profile.bio') }}</p>
        </div>
        <div>
          <label>Rank (1-10):</label>
          <input v-model.number="state.profile.rank" type="number" name="profile.rank">
          <p style="color: red;">{{ formRef?.getError('profile.rank') }}</p>
        </div>
      </section>

      <!-- Array of Strings -->
      <section>
        <h3>Array of Strings (hobbies.*)</h3>
        <div v-for="(_, index) in state.hobbies" :key="index">
          <input v-model="state.hobbies[index]" type="text" :name="`hobbies.${index}`">
          <button type="button" @click="state.hobbies.splice(index, 1)">Remove</button>
          <p style="color: red;">{{ formRef?.getError(`hobbies[${index}]`) }}</p>
        </div>
        <button type="button" @click="state.hobbies.push('')">Add Hobby</button>
        <p style="color: red;">{{ formRef?.getError('hobbies') }}</p>
      </section>

      <!-- Array of Objects -->
      <section>
        <h3>Array of Objects (friends.*)</h3>
        <div v-for="(_, index) in state.friends" :key="index" style="border: 1px solid #ccc; padding: 10px; margin-bottom: 10px;">
          <div>
            <label>Friend Name:</label>
            <input v-model="state.friends[index]!.name" type="text" :name="`friends.${index}.name`">
            <p style="color: red;">{{ formRef?.getError(`friends[${index}].name`) }}</p>
          </div>
          <div>
            <label>Closeness (1-5):</label>
            <input v-model.number="state.friends[index]!.closeness" type="number" :name="`friends.${index}.closeness`">
            <p style="color: red;">{{ formRef?.getError(`friends[${index}].closeness`) }}</p>
          </div>
          <button type="button" @click="state.friends.splice(index, 1)">Remove Friend</button>
        </div>
        <button type="button" @click="state.friends.push({ name: '', closeness: 1 })">Add Friend</button>
        <p style="color: red;">{{ formRef?.getError('friends') }}</p>
      </section>

      <button type="submit" @click.prevent="handleSubmit">Submit Form</button>
    </ValidForm>

    <hr>
    <h3>Live State:</h3>
    <pre>{{ JSON.stringify(state, null, 2) }}</pre>
  </div>
</template>

