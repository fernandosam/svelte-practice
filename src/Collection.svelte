<script lang="ts">
  // TODO: Criar mecanismo para tornar books genérico

  import { event, books } from "./stores.js";
  import type { Message } from "./services/Message";
  import {createDocument, updateDocument, removeDocument} from "./services/Document";
  
  const actions = {
    // Book
    createBook: (message: Message) => {
      $books = createDocument(message.content, $books);
      //event.dispatch("Alert", "showSuccess", "Livro cadastrado com sucesso.");
    },
    updateBook: (message: Message) => {
      console.log(message);
      const { key, value } = updateDocument(message.content, $books);
      $books[key] = value;
      //event.dispatch("Alert", "showSuccess", "Livro alterado com sucesso.");
    },
    deleteBook: (message: Message) => {
      $books = removeDocument(message.content, $books);
    },
  };

  event.listener("Collection", actions);
</script>