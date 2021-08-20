import { uuid } from "./Commom";

export type Message = {
  ok?: boolean;
  id?: string;
  from: string;
  to: string;
  action: string;
  content?: any;
  error?: any;
};

export function createMessage(message: Message): Message {
  return {
    ok: message.ok ?? true,
    id: uuid(),
    from: message.from,
    to: message.to,
    action: message.action,
    content: message.content ?? {},
    error: message.error ?? {},
  };
}
