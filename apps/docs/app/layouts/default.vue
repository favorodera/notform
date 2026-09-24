<template>
  <div >
    <AppHeader />

    <Container>
      <Page>
        <Main>
          <slot />
        </Main>
      </Page>
    </Container>

    <AppFooter />
  </div>
</template>
