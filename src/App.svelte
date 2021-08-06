<script>
  import Layout from "./Layout/Horizontal.svelte";
  import PageWrapper from "./Pages/Wrapper.svelte";
  import PageBody from "./Pages/Body.svelte";
  import Form from "./Form.svelte";
  import BookFields from "./BookFields.svelte";
  import BookList from "./BookList.svelte";
  import Collection from "./Collection.svelte";
  import Alert from "./Alert.svelte";
</script>

<Collection/>

<Layout>
  <div>
    <br/>
    <Alert/>
  </div>
  <PageWrapper pretitle="Manutenção de Livros" title="Livros" />
  <PageBody>
    <div class="col-md-6 col-lg-4">
      <Form id="BookFields">
        <BookFields/>
      </Form>
    </div>
    <div class="col-md-12 col-lg-8">
      <BookList />
    </div>
  </PageBody>
</Layout>

<style>
  @import url("https://unpkg.com/@tabler/core@latest/dist/css/tabler.min.css");
</style>
