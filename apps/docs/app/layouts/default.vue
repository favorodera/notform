<template>
  <div >
    <AppHeader />

    <Container>
      <Page>
        <Main class="grid grid-cols-1">
          <slot />
        </Main>
      </Page>
    </Container>

    <AppFooter />
  </div>
</template>
