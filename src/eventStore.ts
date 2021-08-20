// TODO: Criar mecanismo para expirar mensagens antigas
import { writable } from "svelte/store";
import { Message, createMessage } from "./services/Message";

export const eventStore = () => {
  let messages: Array<Message> = [];

  // Writable store
  const { subscribe, set } = writable({});

  return {
    dispatch: (from: string, to: string, action: string, content: any = null) => {
      const message = createMessage({ from, to, action, content });
      messages[message.id] = message;
      return set(message);
    },
    listener: (from: string, actions: any) => {
      let fn = (value: Message) => {
        //console.log(array);
        const id = value.id;
        const to = value.to;

        // Send message to target
        if (to == from) {
          let message: Message = messages[id];
          //console.log(from);
          //console.log(message);
          actions[message.action](message);
          delete messages[id];
        }
      };
      subscribe(fn);
    },
  };
};
