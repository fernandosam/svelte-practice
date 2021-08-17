<script>
  import Layout from "./common/Layout.svelte";
  import Title from "./common/Title.svelte";
  import Body from "./common/Body.svelte";
  import Alert from "./common/Alert.svelte";
  import Collection from "./Collection.svelte";
  import BookTable from "./book/BookTable.svelte";
  import Card from "./common/Card.svelte";
  //import Ts from "./Ts.svelte";
</script>

<Collection />

<Layout>
  <div>
    <Alert />
  </div>
  <Title title="Livros" />
  <Body>
    <div class="col-md-12">
      <Card title="Lista de Livros">
        <BookTable />
      </Card>
    </div>
  </Body>
</Layout>

<style>
  @import url("https://unpkg.com/@tabler/core@latest/dist/css/tabler.min.css");
</style>
