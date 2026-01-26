<script lang="ts" setup>
import { useForm, Form, Field as NotField } from 'notform'
import { h, ref } from 'vue'
import { z } from 'zod'
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from '@/components/card'
import { FieldGroup, Field, FieldLabel, FieldError, FieldDescription } from '@/components/field'
import { Input } from '@/components/input'
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea } from '@/components/input-group'
import { Button } from '@/components/button'
import { toast } from 'vue-sonner'

const schema = {
  zod: z.object({
    title: z
      .string()
      .min(5, 'Zod:Bug title must be at least 5 characters.')
      .max(32, 'Zod:Bug title must be at most 32 characters.'),
    description: z
      .string()
      .min(20, 'Zod:Description must be at least 20 characters.')
      .max(100, 'Zod:Description must be at most 100 characters.'),
  }),
}

const activeSchema = ref<typeof schema['zod']>(schema.zod)

const { id, state, submit, reset } = useForm({
  schema: activeSchema,
  initialState: {
    title: '',
    description: '',
  },
})

async function onSubmit(event:Event){
  submit(event,(data)=>{
    toast('You submitted the following values:', {
    description: h('pre', { class: 'bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4' }, h('code', JSON.stringify(data, null, 2))),
    position: 'bottom-right',
    class: 'flex flex-col gap-2',
    style: {
      '--border-radius': 'calc(var(--radius)  + 4px)',
    },
  })
  })
}
</script>

<template>
  
<Card class="w-full sm:max-w-md">

   <CardHeader>
      <CardTitle>Bug Report</CardTitle>

      <CardDescription>
        Help us improve by reporting bugs you encounter.
      </CardDescription>

    </CardHeader>

    <CardContent>

<Form :id="id" @submit.prevent="onSubmit" @reset="reset()">

  <FieldGroup>

    <NotField name="title" v-slot="{ methods, errors,name }">

      <Field :data-invalid="!!errors.length">

         <FieldLabel :for="name">
                Bug Title
              </FieldLabel>

              <Input
                :id="name"
                v-bind="methods"
                v-model="state.title"
                placeholder="Login button not working on mobile"
                autocomplete="off"
                :aria-invalid="!!errors.length"
              />
              <FieldError v-if="errors.length" :errors="errors" />

      </Field>

    </NotField>

    
    <NotField name="description" v-slot="{ methods, errors,name }">

      <Field :data-invalid="!!errors.length">

         <FieldLabel :for="name">
                Description
              </FieldLabel>

              <InputGroup>
                <InputGroupTextarea
                  :id="name"
                  v-bind="methods"
                  v-model="state.description"
                  placeholder="I'm having an issue with the login button on mobile."
                  :rows="6"
                  class="min-h-24 resize-none"
                  :aria-invalid="!!errors.length"
                />

                <InputGroupAddon align="block-end">
                  <InputGroupText :for="name" class="tabular-nums">
                    {{ state.description?.length || 0 }}/100 characters
                  </InputGroupText>
                </InputGroupAddon>

              </InputGroup>

              <FieldDescription>
                Include steps to reproduce, expected behavior, and what actually
                happened.
              </FieldDescription>

              <FieldError v-if="errors.length" :errors="errors" />

      </Field>

    </NotField>

  </FieldGroup>

</Form>

    </CardContent>

     <CardFooter>

      <Field orientation="horizontal">

        <Button type="reset" variant="outline" :form="id">
          Reset
        </Button>

        <Button type="submit" :form="id">
          Submit
        </Button>

      </Field>

    </CardFooter>
  
</Card>

</template>
