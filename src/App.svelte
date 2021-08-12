<script>
  import Layout from "./common/Layout.svelte";
  import Title from "./common/Title.svelte";
  import Body from "./common/Body.svelte";
  import Form from "./common/Form.svelte";
  import Alert from "./common/Alert.svelte";
  import Collection from "./Collection.svelte";
  import BookForm from "./book/BookForm.svelte";
  import BookList from "./book/BookList.svelte";
</script>

<Collection/>

<Layout>
  <div>
    <br/>
    <Alert/>
  </div>
  <Title pretitle="Manutenção de Livros" title="Livros" />
  <Body>
    <div class="col-md-6 col-lg-4">
      <Form id="BookForm">
        <BookForm/>
      </Form>
    </div>
    <div class="col-md-12 col-lg-8">
      <BookList />
    </div>
  </Body>
</Layout>

<style>
  @import url("https://unpkg.com/@tabler/core@latest/dist/css/tabler.min.css");
</style>
