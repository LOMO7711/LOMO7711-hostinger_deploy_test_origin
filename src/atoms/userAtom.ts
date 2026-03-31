import { atom, useAtomValue, useSetAtom } from "jotai";
import { type } from "arktype";

const User = type({
  name: "string",
  email: "string",
  _id: "string",
  "age?": "number",
  "nickName?": "string",
  "money?": "number",
});

type User = typeof User.infer;

const userAtom = atom<Partial<User>>({});

function useUser() {
  return useAtomValue(userAtom);
}
function useSetUser() {
  return useSetAtom(userAtom);
}
export type { User };
export { userAtom, useUser, useSetUser };
