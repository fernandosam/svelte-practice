<script>
  import Layout from "./common/Layout.svelte";
  import PageHeader from "./common/PageHeader.svelte";
  import Body from "./common/Body.svelte";
  import Alert from "./common/Alert.svelte";
  import Collection from "./Collection.svelte";
  import BookTable from "./book/BookTable.svelte";
  import BookModal from "./book/BookModal.svelte";
  import Card from "./common/Card.svelte";
</script>

<Collection />

<Layout>
  <div>
    <Alert />
  </div>
  <PageHeader title="Livros" label="Livro" formTarget="BookForm" />
  <Body>
    <div class="col-md-12">
      <Card title="Lista de Livros">
        <BookTable />
      </Card>
    </div>
  </Body>
  <BookModal id="BookForm" title="Manutenção de Livro" />
</Layout>

<style>
  @import url("https://unpkg.com/@tabler/core@latest/dist/css/tabler.min.css");
</style>

